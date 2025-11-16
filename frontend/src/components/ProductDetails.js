import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";
import { useCart } from "./CartContext";
import SearchSidebar from "./SearchSidebar";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState("Nursery");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    care: false,
    shipping: false,
    disclaimer: false,
  });
  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCartHandler = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageURLs[0],
      quantity: quantity,
      potStyle: selectedPot,
    });
    setQuantity(1);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontSize: "1.2rem" }}>
      Loading product...
    </div>
  );
  
  if (!product) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontSize: "1.2rem" }}>
      Product not found.
    </div>
  );

  return (
    <>
      <style>{`
        :root {
          --primarybgcolor: hsl(164, 31%, 17%);
          --secondarybgcolor: hsl(47, 47%, 93%);
          --optionalbgcolor: hsl(0, 0%, 100%);
          --primarytxtcolor: hsl(0, 0%, 100%);
          --secondarytxtcolor: hsl(0, 1%, 25%);
          --primarybttncolor: hsl(164, 31%, 17%);
          --secondarybttncolor: hsl(0, 0%, 6%);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Times New Roman', Times, serif;
        }

        body {
          background: hsl(0, 0%, 100%);
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          opacity: 0;
          animation: fadeAnimation 1.5s ease-in 1 forwards;
        }

        @keyframes fadeAnimation {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .pdnavHeaderCont {
          background-color: hsl(164, 31%, 17%);
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          border-bottom: 1px solid #eee;
          justify-content: space-between;
          gap: 20px;
          width: 100%;
          padding: 10px 15px;
        }

        .pdlogoCont {
          color: hsl(0, 0%, 100%);
          display: flex;
          align-items: center;
        }

        .pdlogoCont img {
          background-color: #ffff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          margin-right: 10px;
        }

        .pdnavLogoText {
          color: hsl(0, 0%, 100%);
          font-size: 1.5rem;
          font-weight: bold;
        }

        .pdnavHeaderBttnCont {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
        }

        .pdnavHeaderBttnCont button {
          background: none;
          color: hsl(0, 0%, 100%);
          border: none;
          font-size: 1rem;
          padding: 8px 12px;
          cursor: pointer;
        }

        .pdnavHeaderBttnCont button:hover {
          transform: scale(1.05);
          transition: all 0.2s ease-in-out;
          border-bottom: 1px solid hsl(0, 1%, 44%);
          box-shadow: 0 5px 5px hsl(0, 0%, 52%);
        }

        .pdnavHeaderLogoBttonCont {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .pdnavHeaderLogoBttonCont button {
          width: 33px;
          height: 33px;
          background: transparent;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          position: relative;
        }

        .pdnavSearch {
          background-image: url(${SearchIcon});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          width: 28px;
          height: 28px;
          display: inline-block;
        }

        .pdnavCard {
          background-image: url(${CartIcon});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          width: 28px;
          height: 28px;
          display: inline-block;
        }

        .pdnavAcc {
          background-image: url(${AccIcon});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          width: 28px;
          height: 28px;
          display: inline-block;
        }

        .pdnavHeaderLogoBttonCont button:hover {
          transform: scale(1.06);
          transition: all 0.2s ease-in;
          box-shadow: 0 0 20px hsl(165, 33%, 2%);
        }

        .cartBadge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #ff6b6b;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .textQuoteHeader {
          background-color: hwb(0 100% 0%);
          text-align: center;
          font-size: 0.9rem;
          letter-spacing: 1px;
          white-space: nowrap;
          overflow: hidden;
          animation: scrolling 20s linear infinite;
        }

        @keyframes scrolling {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        section {
          background-color: hsl(47, 47%, 93%);
          padding: 40px 80px;
          flex: 1;
        }

        .pdpageHeaderCont {
          display: flex;
          justify-content: start;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid hsl(164, 31%, 17%);
        }

        .pdpageHeaderCont h1 {
          font-size: 2.5rem;
        }

        .pdpageHeaderCont p {
          font-size: 1rem;
          color: hsl(0, 0%, 30%);
        }

        .pdproductDetailsCont {
          display: flex;
          align-items: start;
          justify-content: center;
          gap: 40px;
          padding-top: 20px;
          width: 100%;
          background: #ffffff;
          border: 1px solid black;
          border-radius: 10px;
          padding: 40px;
        }

        .pdproductDetailsLeft {
          flex: 1;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .pdmainImageContainer {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border: 1px solid hsl(0, 0%, 80%);
          border-radius: 8px;
          overflow: hidden;
          background: hsl(0, 0%, 95%);
        }

        .pdproductDetailsImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pdthumbnailContainer {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 5px 0;
        }

        .pdthumbnail {
          width: 80px;
          height: 80px;
          border: 2px solid hsl(0, 0%, 80%);
          border-radius: 5px;
          cursor: pointer;
          object-fit: cover;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .pdthumbnail:hover {
          border-color: hsl(164, 31%, 17%);
          transform: scale(1.05);
        }

        .pdthumbnail.active {
          border-color: hsl(164, 31%, 17%);
          box-shadow: 0 0 8px hsl(164, 31%, 17%);
        }

        .pdproductDetailsRight {
          flex: 1;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .pdproductDetailsRight h2 {
          font-size: 2rem;
          color: hsl(0, 1%, 25%);
        }

        .pdproductDetailsPrice {
          font-size: 1.8rem;
          font-weight: bold;
          color: hsl(164, 31%, 17%);
        }

        .pdproductDetailsDesc {
          font-size: 1rem;
          color: hsl(0, 1%, 25%);
          line-height: 1.6;
        }

        .pdpotStyleSection {
          border-top: 1px solid hsl(0, 0%, 80%);
          border-bottom: 1px solid hsl(0, 0%, 80%);
          padding: 15px 0;
        }

        .pdpotStyleLabel {
          font-size: 0.9rem;
          font-weight: bold;
          color: hsl(0, 1%, 25%);
          margin-bottom: 10px;
        }

        .pdpotOptionsContainer {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .pdpotOption {
          border: 2px solid hsl(0, 0%, 80%);
          border-radius: 8px;
          padding: 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          background: hsl(0, 0%, 100%);
          font-size: 0.9rem;
        }

        .pdpotOption:hover {
          border-color: hsl(164, 31%, 17%);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .pdpotOption.active {
          border-color: hsl(164, 31%, 17%);
          background-color: hsl(164, 31%, 17%);
          color: hsl(0, 0%, 100%);
        }

        .pdquantitySection {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .pdquantityControl {
          display: flex;
          align-items: center;
          border: 1px solid hsl(0, 0%, 80%);
          border-radius: 5px;
          padding: 5px 10px;
          gap: 10px;
        }

        .pdquantityControl button {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: hsl(164, 31%, 17%);
          padding: 0;
          width: 20px;
        }

        .pdquantityControl input {
          width: 40px;
          text-align: center;
          border: none;
          font-size: 1rem;
        }

        .pdaddToCartBtn {
          background: hsl(164, 31%, 17%);
          color: hsl(0, 0%, 100%);
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .pdaddToCartBtn:hover {
          transform: scale(1.02);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .pdexpandableSection {
          border-bottom: 1px solid hsl(0, 0%, 80%);
          padding: 15px 0;
        }

        .pdexpandableHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-weight: bold;
          color: hsl(0, 1%, 25%);
          font-size: 1rem;
        }

        .pdexpandableHeader:hover {
          color: hsl(164, 31%, 17%);
        }

        .pdexpandableIcon {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .pdexpandableIcon.open {
          transform: rotate(45deg);
        }

        .pdexpandableContent {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          padding-top: 0;
        }

        .pdexpandableContent.open {
          max-height: 500px;
          padding-top: 15px;
        }

        .pdexpandableText {
          font-size: 0.95rem;
          color: hsl(0, 1%, 25%);
          line-height: 1.6;
        }

        .pdbackBtn {
          background: hsl(0, 0%, 100%);
          color: hsl(164, 31%, 17%);
          border: 1px solid black;
          border-radius: 5px;
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          margin-top: 10px;
        }

        .pdbackBtn:hover {
          background-color: hsl(164, 31%, 17%);
          color: hsl(0, 0%, 100%);
        }

        footer {
          background-color: hsl(164, 31%, 17%);
          color: hsl(0, 0%, 100%);
          font-weight: bold;
          text-align: center;
          padding: 15px 0;
        }

        @media (max-width: 1024px) {
          section {
            padding: 30px 60px;
          }

          .pdproductDetailsCont {
            gap: 30px;
          }
        }

        @media (max-width: 768px) {
          .pdnavHeaderCont {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .pdnavHeaderBttnCont {
            font-size: 0.9rem;
          }

          .pdnavHeaderBttnCont button {
            font-size: 0.85rem;
            padding: 5px 8px;
          }

          .pdnavHeaderLogoBttonCont {
            margin-top: 10px;
          }

          section {
            padding: 20px 15px;
          }

          .pdpageHeaderCont h1 {
            font-size: 1.8rem;
          }

          .pdproductDetailsCont {
            flex-direction: column;
            gap: 20px;
            padding: 20px;
          }

          .pdproductDetailsLeft,
          .pdproductDetailsRight {
            max-width: 100%;
          }

          .pdproductDetailsRight h2 {
            font-size: 1.5rem;
          }

          .pdproductDetailsPrice {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .pdnavHeaderCont {
            flex-direction: column;
            align-items: center;
          }

          .pdnavLogoText {
            font-size: 1.2rem;
          }

          .pdnavHeaderBttnCont button {
            font-size: 0.7rem;
            padding: 5px 5px;
          }

          .pdpageHeaderCont h1 {
            font-size: 1.5rem;
          }

          .pdproductDetailsCont {
            padding: 15px;
          }

          .pdproductDetailsRight h2 {
            font-size: 1.3rem;
          }

          .pdproductDetailsPrice {
            font-size: 1.3rem;
          }

          footer p {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header>
        <div className="pdheaderCont">
          <div className="pdnavHeaderCont">
            <div className="pdlogoCont">
              <p className="pdnavLogo"><img src={PlantLogo} alt="Logo" /></p>
              <p className="pdnavLogoText">Plantasy Garden</p>
            </div>

            <div className="pdnavHeaderBttnCont">
              <button onClick={() => navigate("/homepage")}>Home</button>
              <button onClick={() => navigate("/shop")}>Shop</button>
              <button onClick={() => navigate("/track")}>Track Order</button>
              <button onClick={() => navigate("/contactus")}>Contact Us</button>
            </div>

            <div className="pdnavHeaderLogoBttonCont">
              <button onClick={() => setSearchOpen(true)}>
                <i className="pdnavSearch"></i>
              </button>
              <button onClick={() => navigate("/cart")}>
                <i className="pdnavCard"></i>
                {cart.length > 0 && <span className="cartBadge">{cart.length}</span>}
              </button>
              <button onClick={() => navigate("/myprofile")}>
                <i className="pdnavAcc"></i>
              </button>
            </div>
          </div>
        </div>

        <p className="textQuoteHeader">Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>
      </header>

      <section>
        <div className="pdpageHeaderCont">
          <div className="pdheaderCont">
            <h1 className="pdpageHeader">Product Details</h1>
            <p className="pdpageSubHeader">Explore full product details below.</p>
          </div>
        </div>

        <div className="pdproductDetailsCont">
          <div className="pdproductDetailsLeft">
            <div className="pdmainImageContainer">
              <img
                src={`http://localhost:5000${product.imageURLs[currentImageIndex]}`}
                alt={product.name}
                className="pdproductDetailsImg"
              />
            </div>
            
            {product.imageURLs && product.imageURLs.length > 1 && (
              <div className="pdthumbnailContainer">
                {product.imageURLs.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${img}`}
                    alt={`thumbnail-${index}`}
                    className={`pdthumbnail ${currentImageIndex === index ? "active" : ""}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="pdproductDetailsRight">
            <h2>{product.name}</h2>

            <p className="pdproductDetailsPrice">
              ₱ {product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </p>

            <p className="pdproductDetailsDesc">{product.description}</p>

            <div className="pdpotStyleSection">
              <div className="pdpotStyleLabel">Pot Style: {selectedPot}</div>
              <div className="pdpotOptionsContainer">
                {product.potSizes && product.potSizes.length > 0
                  ? product.potSizes.map((pot) => (
                      <button
                        key={pot}
                        className={`pdpotOption ${selectedPot === pot ? "active" : ""}`}
                        onClick={() => setSelectedPot(pot)}
                      >
                        {pot}
                      </button>
                    ))
                  : ["Nursery", "Sahara", "Nook", "Sienna", "Lily"].map((pot) => (
                      <button
                        key={pot}
                        className={`pdpotOption ${selectedPot === pot ? "active" : ""}`}
                        onClick={() => setSelectedPot(pot)}
                      >
                        {pot}
                      </button>
                    ))}
              </div>
            </div>

            <div className="pdquantitySection">
              <div className="pdquantityControl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className="pdaddToCartBtn" onClick={addToCartHandler}>
                Add to cart
              </button>
            </div>

            <div className="pdexpandableSection">
              <div
                className="pdexpandableHeader"
                onClick={() => toggleSection("care")}
              >
                <span>Plant Care and Details</span>
                <span className={`pdexpandableIcon ${expandedSections.care ? "open" : ""}`}>+</span>
              </div>
              <div className={`pdexpandableContent ${expandedSections.care ? "open" : ""}`}>
                <div className="pdexpandableText">
                  {product.plantCare || "Care instructions not available."}
                </div>
              </div>
            </div>

            <div className="pdexpandableSection">
              <div
                className="pdexpandableHeader"
                onClick={() => toggleSection("shipping")}
              >
                <span>Shipping Policy</span>
                <span className={`pdexpandableIcon ${expandedSections.shipping ? "open" : ""}`}>+</span>
              </div>
              <div className={`pdexpandableContent ${expandedSections.shipping ? "open" : ""}`}>
                <div className="pdexpandableText">
                  We offer free shipping on orders over ₱1,000. Standard delivery takes 3-5 business days within Metro Manila, and 5-7 business days for provincial areas. All plants are carefully packed to ensure they arrive in perfect condition. Please note that delivery times may vary during peak seasons.
                </div>
              </div>
            </div>

            <div className="pdexpandableSection">
              <div
                className="pdexpandableHeader"
                onClick={() => toggleSection("disclaimer")}
              >
                <span>Disclaimer</span>
                <span className={`pdexpandableIcon ${expandedSections.disclaimer ? "open" : ""}`}>+</span>
              </div>
              <div className={`pdexpandableContent ${expandedSections.disclaimer ? "open" : ""}`}>
                <div className="pdexpandableText">
                  Plant sizes and colors may vary slightly from images due to natural variations and photography lighting. We strive to match descriptions accurately, but slight differences in appearance are normal. Plants are living organisms and require proper care as outlined. Plantasy Garden is not responsible for plant health after purchase unless otherwise stated in our warranty policy.
                </div>
              </div>
            </div>

            <button className="pdbackBtn" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </section>

      <footer>
        <div className="compyRight">
          <p>@ 2025 Plantasy Garden. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default ProductDetails;