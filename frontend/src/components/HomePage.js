import { useEffect, useState } from "react";
import "./HomePage.css";
import PlantLogo from "./assets/plantlogo.png";
import "./assets/loginFinalBg.jpg";
import { useNavigate } from "react-router-dom";
import SearchSidebar from "./SearchSidebar";

function HomePageUi() {
  const navigate = useNavigate();

  // States
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addedMessage, setAddedMessage] = useState("");
  const [searchOpen, setSearchOpen] = useState(false); // 🔍 New state for search

  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();

      if (data.success) {
        const categoryMap = new Map();
        data.products.forEach((product) => {
          product.category.forEach((cat) => {
            if (!categoryMap.has(cat)) {
              categoryMap.set(cat, {
                name: cat,
                image: product.imageURLs[0] || "",
                productCount: 1,
              });
            } else {
              const existing = categoryMap.get(cat);
              existing.productCount++;
            }
          });
        });

        const categoriesArray = Array.from(categoryMap.values())
          .sort((a, b) => b.productCount - a.productCount)
          .slice(0, 3);

        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch featured products
  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products/featured");
      const data = await response.json();

      if (data.success) {
        setFeaturedProducts(data.products.slice(0, 6));
      } else {
        const fallbackResponse = await fetch("http://localhost:5000/api/products");
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.success) {
          setFeaturedProducts(fallbackData.products.slice(0, 6));
        }
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        if (data.success) {
          setFeaturedProducts(data.products.slice(0, 6));
        }
      } catch (fallbackError) {
        console.error("Fallback fetch failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = (productId) => {
    setCartCount((prev) => prev + 1);
    setAddedMessage("✅ Item added to cart!");
    setTimeout(() => setAddedMessage(""), 2500);
    console.log("Add to cart:", productId);
  };

  // Handle card click
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      {/* 🔍 Search Sidebar Component */}
      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

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
              <button className="bttn1">Home</button>
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
            <h1 className="pageHeader">Bring Nature into Your Sanctuary</h1>
            <p className="pageSubHeader">
              Curated Collection of Rare and Beautiful Plants to Mindful Living.
            </p>
            <button
              className="exploreCollectionBttn"
              onClick={() => navigate("/shop")}
            >
              SHOP ALL
            </button>
          </div>
        </div>
      </header>

      <section>
        {/* Categories */}
        <div className="cont2">
          <div className="subHeaderCont">
            <h3 className="subHeaderText">Discover by Category</h3>
          </div>

          <div className="imgCardCont">
            {loading ? (
              <p>Loading categories...</p>
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={index}
                  className={`card${index + 1}`}
                  onClick={() => handleCategoryClick(category.name)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    alt={category.name}
                    className={`card${index + 1}Img`}
                    src={`http://localhost:5000${category.image}`}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <h3 className="cardTitle">{category.name}</h3>
                  <p className={`card${index + 1}Detail`}>
                    {category.productCount}{" "}
                    {category.productCount === 1 ? "product" : "products"}
                  </p>
                </div>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>
        </div>

        {/* Featured Products */}
        <div className="cont3">
          <div className="subHeader2Cont">
            <h3 className="subHeader2text">Featured Collection</h3>
          </div>

          {loading ? (
            <p>Loading featured products...</p>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="imgCardCont2">
                {featuredProducts.slice(0, 3).map((product, index) => (
                  <div
                    key={product._id}
                    className="card"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCardClick(product._id)}
                  >
                    <img
                      alt={product.name}
                      className={`card${index + 1}Img`}
                      src={`http://localhost:5000${product.imageURLs[0]}`}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <div className="cardDetail">
                      <div className="prodDetailCont">
                        <h3 className="cardTitle">{product.name}</h3>
                        <p className="card1Detail">
                          {product.description || "Premium quality plant"}
                        </p>
                      </div>
                      <div className="prodStatusCont">
                        <label>POPULAR</label>
                      </div>
                    </div>
                    <div className="priceAndBttnCont">
                      <label
                        className="priceLabel"
                        style={{ color: "#222", fontWeight: "bold" }}
                      >
                        ₱{" "}
                        {product.price.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {featuredProducts.length > 3 && (
                <div className="imgCardCont3">
                  {featuredProducts.slice(3, 6).map((product, index) => (
                    <div
                      key={product._id}
                      className="card"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCardClick(product._id)}
                    >
                      <img
                        alt={product.name}
                        className={`card${index + 1}Img`}
                        src={`http://localhost:5000${product.imageURLs[0]}`}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <div className="cardDetail">
                        <div className="prodDetailCont">
                          <h3 className="cardTitle">{product.name}</h3>
                          <p className="card1Detail">
                            {product.description || "Premium quality plant"}
                          </p>
                        </div>
                        <div className="prodStatusCont">
                          <label>POPULAR</label>
                        </div>
                      </div>
                      <div className="priceAndBttnCont">
                        <label
                          className="priceLabel"
                          style={{ color: "#222", fontWeight: "bold" }}
                        >
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
            </>
          ) : (
            <p>No featured products available</p>
          )}
        </div>
      </section>

      {/* Popup Message */}
      {addedMessage && <div className="addedMsg">{addedMessage}</div>}

      <footer>
        <div className="footerCont">
          <div className="otherInfoCont">
            <div className="infoCont1">
              <h3 className="footerHeader">Eric's Garden</h3>
              <p className="infoDetails">
                Bringing the Beauty of Nature into Homes and Hearts.
              </p>
            </div>
            <div className="infoCont2">
              <h3 className="footerHeader">Shop</h3>
              <ul>
                <li>Indoor Plants</li>
                <li>Outdoor Plants</li>
                <li>Succulents Plants</li>
                <li>Rare Finds</li>
              </ul>
            </div>
            <div className="infoCont3">
              <h3 className="footerHeader">Support</h3>
              <ul>
                <li><a href="plantsCare">Plant Care</a></li>
                <li><a href="shippingInfo">Shipping Info</a></li>
                <li><a href="returns">Returns</a></li>
                <li><a href="faqs">FAQs</a></li>
              </ul>
            </div>
            <div className="infoCont4">
              <h3 className="footerHeader">Stay Connected</h3>
              <p className="infoDetails">
                Subscribe for plant care tips and exclusive offers
              </p>
            </div>
          </div>
          <div className="compyRight">
            <p>© 2025 Eric's Garden. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePageUi;