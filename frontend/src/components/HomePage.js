import { useEffect, useState } from "react";
import "./HomePage.css";
import PlantLogo from "./assets/plantlogo.png";
import "./assets/loginFinalBg.jpg";
import { useNavigate } from "react-router-dom";
import SearchSidebar from "./SearchSidebar";

function HomePageUi() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addedMessage, setAddedMessage] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
  }, []);

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

        setCategories(
          Array.from(categoryMap.values())
            .sort((a, b) => b.productCount - a.productCount)
            .slice(0, 4)
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products/featured");
      const data = await response.json();

      if (data.success) {
        setFeaturedProducts(data.products.slice(0, 6));
      } else {
        const fallback = await fetch("http://localhost:5000/api/products");
        const fallbackData = await fallback.json();
        if (fallbackData.success) {
          setFeaturedProducts(fallbackData.products.slice(0, 6));
        }
      }
    } catch (error) {
      const fallback = await fetch("http://localhost:5000/api/products");
      const fallbackData = await fallback.json();
      if (fallbackData.success) {
        setFeaturedProducts(fallbackData.products.slice(0, 6));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (productId) => {
    setCartCount((prev) => prev + 1);
    setAddedMessage("✅ Item added to cart!");
    setTimeout(() => setAddedMessage(""), 2500);
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header>
        <div className="headerCont">
          <div className="navHeaderCont">
            <div className="logoCont">
              <p className="navLogo">
                <img src={PlantLogo} alt="Logo" />
              </p>
              <p className="navLogoText">Plantasy</p>
            </div>

            <div className="navHeaderBttnCont">
              <button className="bttn1">Home</button>
              <button className="bttn2" onClick={() => navigate("/shop")}>Shop</button>
              <button className="bttn3" onClick={() => navigate("/track")}>Track Order</button>
              <button className="bttn4" onClick={() => navigate("/contactus")}>Contact Us</button>
            </div>

            <div className="navHeaderLogoBttonCont">
              <button className="iconBttn1" onClick={() => setSearchOpen(true)}>
                <i className="navSearch"></i>
              </button>

              <div className="navCartWrapper">
                <button className="iconBttn2" onClick={() => navigate("/cart")}>
                  <i className="navCard"></i>
                </button>
                {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
              </div>

              <button className="iconBttn3" onClick={() => navigate("/myprofile")}>
                <i className="navAcc"></i>
              </button>
            </div>
          </div>

          <p className="textQuoteHeader">
            Claim Your 20% Discount Using The Code: "JKLASWER12345"
          </p>

          <div className="pageHeaderCont">
            <h1 className="pageHeader">Bring Nature into Your Sanctuary</h1>
            <p className="pageSubHeader">Curated Collection of Rare and Beautiful Plants to Mindful Living.</p>

            <button className="exploreCollectionBttn" onClick={() => navigate("/shop")}>
              SHOP ALL
            </button>
          </div>
        </div>
      </header>

      {/* ---------- CATEGORIES (4 cards layout from second code) ---------- */}
      <section>
        <div className="cont2">
          <div className="subHeaderCont">
            <h3 className="subHeaderText">Discover by Category</h3>
          </div>

          <div className="imgCardCont categoryGrid">
            {loading ? (
              <p>Loading categories...</p>
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={index}
                  className="categoryCard"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div className="categoryImgWrap">
                    <img
                      alt={category.name}
                      src={`http://localhost:5000${category.image}`}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>

                  <h3 className="cardTitle">{category.name}</h3>
                  <p>
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

        {/* ---------- FEATURED PRODUCTS (Grid layout) ---------- */}
        
        <div className="cont3">
          <div className="subHeader2Cont">
            <h3 className="subHeader2text">Featured Collection</h3>
          </div>

          {loading ? (
            <p>Loading featured products...</p>
          ) : featuredProducts.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px",
              padding: "20px"
            }}>
              {featuredProducts.map((product) => (
                <div
                  key={product._id}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  onClick={() => handleCardClick(product._id)}
                >
                  <div style={{
                    width: "100%",
                    height: "280px",
                    overflow: "hidden",
                    marginBottom: "15px",
                    background: "#f5f5f5",
                    borderRadius: "8px"
                  }}>
                    <img
                      alt={product.name}
                      src={`http://localhost:5000${product.imageURLs[0]}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div style={{ padding: "0 10px" }}>
                    <h3 style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: "0 0 8px 0",
                      color: "#333",
                      lineHeight: "1.3"
                    }}>
                      {product.name}
                    </h3>
                    
                    <p style={{
                      fontSize: "13px",
                      color: "#666",
                      margin: "0 0 12px 0",
                      lineHeight: "1.4",
                      minHeight: "40px"
                    }}>
                      {product.description || "Premium quality plant"}
                    </p>

                    <p style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#333",
                      margin: "0"
                    }}>
                      ₱ {product.price.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No featured products available</p>
          )}
        </div>
      </section>

      {/* POPUP */}
      {addedMessage && <div className="addedMsg">{addedMessage}</div>}

      {/* ---------- FOOTER FROM SECOND CODE ---------- */}
      <footer>
        <div className="footerCont">
          <div className="otherInfoCont">
            
            <div className="infoCont1">
              <h3 className="footerHeader">Plantasy Garden</h3>
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
              </ul>
            </div>

            <div className="infoCont3">
              <h3 className="footerHeader">Support</h3>
              <ul>
                <li><a href="AboutUs">About Us</a></li>
                <li><a href="Track">Shipping Info</a></li>
                <li><a href="Returns">Return</a></li>
                <li><a href="FAQS">FAQs</a></li>
              </ul>
            </div>

            <div className="infoCont4">
              <h3 className="footerHeader">Stay Connected</h3>
              <p className="infoDetails">
                Subscribe for plant care tips and exclusive offers
              </p>

              <input type="email" className="footerInput" placeholder="Enter your email" />
              <button className="footerSubscribe">Subscribe</button>
            </div>

          </div>

          <div className="compyRight">
            <p>© 2025 Plantasy. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePageUi;
