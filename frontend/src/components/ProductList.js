import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PlantLogo from "./assets/plantlogo.png";
import "./HomePage.css";
import SearchSidebar from "./SearchSidebar";

function ProductList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false); // 🔍 New state for search
  const [cartCount, setCartCount] = useState(0);


  // Get category from URL query (?category=xxx)
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();

      if (data.success) {
        let filtered = data.products;

        // Filter by category if selected
        if (selectedCategory) {
          filtered = filtered.filter((product) =>
            product.category.includes(selectedCategory)
          );
        }

        setProducts(filtered);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const openProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
          <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {/* -------------- HEADER ADDED -------------- */}
      <header>
        <div className="headerCont">
          <div className="navHeaderCont">
            <div className="logoCont">
              <p className="navLogo">
                <img src={PlantLogo} alt="Logo" />
              </p>
              <p className="navLogoText">Eric's Garden</p>
            </div>

            <div className="navHeaderBttnCont">
              <button className="bttn1" onClick={() => navigate("/homepage")}>Home</button>
              <button className="bttn2" onClick={() => navigate("/shop")}>Shop</button>
              <button className="bttn3" onClick={() => navigate("/track")}>Track Order</button>
              <button className="bttn4" onClick={() => navigate("/contactus")}>Contact Us</button>
            </div>

            <div className="navHeaderLogoBttonCont">
              {/* 🔍 Search Button - Opens Sidebar */}
              <button
                className="iconBttn1"
                onClick={() => setSearchOpen(true)}
              >
                <i className="navSearch"></i>
              </button>

              {/* Cart Icon with Badge */}
              <div className="navCartWrapper">
                <button className="iconBttn2" onClick={() => navigate("/cart")}>
                  <i className="navCard"></i>
                </button>
                {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
              </div>

              <button
                className="iconBttn3"
                onClick={() => navigate("/myprofile")}
              >
                <i className="navAcc"></i>
              </button>
            </div>
          </div>

          <p className="textQuoteHeader">
            Claim Your 20% Discount Using The Code: "JKLASWER12345"
          </p>

          <div className="pageHeaderCont">
            <h1 className="pageHeader">
              {selectedCategory ? selectedCategory : "Shop All Products"}
            </h1>
            <p className="pageSubHeader">Browse our full plant collection.</p>
          </div>
        </div>
      </header>
      {/* -------------- END OF HEADER -------------- */}

      <div style={{ padding: "20px" }}>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="imgCardCont2">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="card"
                style={{ cursor: "pointer", margin: "20px" }}
                onClick={() => openProduct(product._id)}
              >
                <img
                  alt={product.name}
                  src={`http://localhost:5000${product.imageURLs[0]}`}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                  }}
                />

                <div className="cardDetail">
                  <h3 className="cardTitle">{product.name}</h3>
                  <p>{product.description?.slice(0, 70)}...</p>
                  <label className="priceLabel">
                    ₱{" "}
                    {product.price.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ProductList;
