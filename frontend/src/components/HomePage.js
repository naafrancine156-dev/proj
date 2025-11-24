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

  const [showReturnPopup, setShowReturnPopup] = useState(false);
  
    // NEW FUNCTION TO TOGGLE POPUP
    const toggleReturnPopup = () => {
      setShowReturnPopup((prev) => !prev);
    };

  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
      if (!email || !email.includes('@')) {
          alert("Please enter a valid email address.");
          return;
      }
      // Replace this alert with an API call
      alert(`Subscribing with email: ${email}`);
      setEmail('');
  };

  const colors = {
      primaryGreen: 'hsl(164, 31%, 17%)', 
      secondaryBg: 'hsl(47, 47%, 93%)', 
      white: '#ffffff',
      darkText: '#222222',
      lightText: '#666666',
      lightText2: '#b0afafff',
      accentRed: 'red',
  };

  const styles = {
      listItems: {
        listStyle: 'none',
      },
      listSupport: {
        color: colors.lightText2,
      },
      subscribeInput: {
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          fontSize: '1rem',
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
      },
      subscribeInputCont: {
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '15px',
      },
      subscribeButton: {
          backgroundColor: colors.white,
          color: colors.primaryGreen,
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
          fontFamily: 'inherit',
      },
      subscribeButtonhover: {
          backgroundColor: colors.primaryGreen,
          color: colors.white,
      }
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

      {addedMessage && <div className="addedMsg">{addedMessage}</div>}

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
                <li style={styles.listItems}>Indoor Plants</li>
                <li style={styles.listItems}>Outdoor Plants</li>
                <li style={styles.listItems}>Succulents Plants</li>
              </ul>
            </div>

            <div className="infoCont3">
              <h3 className="footerHeader">Support</h3>
              <ul style={styles.listItems}>
                <li><a href="AboutUs" style={styles.listSupport}>About Us</a></li>
                <li><a href="Track" style={styles.listSupport}>Shipping Info</a></li>
                <li>
                  <a
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleReturnPopup(); 
                    }}
                    style={styles.listSupport}
                  >
                    Return
                  </a>
                </li>
                <li><a href="FAQS" style={styles.listSupport}>FAQs</a></li>
              </ul>
            </div>

            <div className="infoCont4">
              <h3 className="footerHeader">Stay Connected</h3>
              <p className="infoDetails">
                Subscribe for plant care tips and exclusive offers
              </p>
              <div style={styles.subscribeInputCont}>
                  <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.subscribeInput}
                  />
                  <button
                      onClick={handleSubscribe}
                      style={styles.subscribeButton}
                  >
                      Subscribe
                  </button>
              </div>
            </div>
          </div>

          <div className="compyRight">
            <p>© 2025 Plantasy. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {showReturnPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '30px',
            width: '90%',
            maxWidth: '800px', // Adjusted for wider content
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
          }}>
            <button 
              onClick={toggleReturnPopup} 
              style={{
                position: 'sticky', // Make close button sticky at top
                top: '0',
                right: '0',
                marginLeft: 'auto',
                display: 'block',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.8em', // Slightly larger for visibility
                cursor: 'pointer',
                color: '#333',
                padding: '5px 10px'
              }}
            >
              &times;
            </button>

            <h3 style={{
              color: '#333',
              marginBottom: '20px',
              fontSize: '2em',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              Return & Refund
            </h3>
            
            <div style={{
              color: '#555',
              fontSize: '1em',
              lineHeight: '1.8'
            }}>
              <p style={{ marginBottom: '20px' }}>
                At our webshop, we strive to ensure your complete satisfaction with every purchase. Considering that plants are living entities, our return and exchange policy is designed to address specific situations. Please review the following guidelines regarding returns and exchanges:
              </p>

              <h4 style={{ marginBottom: '10px', fontSize: '1.2em', color: '#333' }}>
                1. Dead Upon Arrival or Within 2 Weeks
              </h4>
              <ul style={{ listStyleType: 'disc', marginLeft: '25px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '10px' }}>
                  Exchange is permitted if a plant is found dead upon arrival or within a span of 2 weeks from the date of purchase.
                </li>
                <li>
                  To facilitate approval, clients must submit the plant's location upon its arrival in their home.
                </li>
              </ul>
              
              <h4 style={{ marginBottom: '10px', fontSize: '1.2em', color: '#333' }}>
                2. Minor Damages and Natural Variations
              </h4>
              <ul style={{ listStyleType: 'disc', marginLeft: '25px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '10px' }}>
                  Minor damages that are typical to plants, especially considering their growth in nurseries, are considered normal.
                </li>
                <li>
                  Factors such as weather conditions can impact a plant's leaves, and these natural variations are not eligible for return or exchange.
                </li>
              </ul>

              <h4 style={{ marginBottom: '10px', fontSize: '1.2em', color: '#333' }}>
                3. Restrictions on Client-Repotted Plants
              </h4>
              <ul style={{ listStyleType: 'disc', marginLeft: '25px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '10px' }}>
                  We only accept returns or exchanges for plants that have been repotted by our team.
                </li>
                <li>
                  Plants repotted by clients are not eligible for exchange under our policy.
                </li>
              </ul>

              <h4 style={{ marginBottom: '10px', fontSize: '1.2em', color: '#333' }}>
                4. Handmade Pottery
              </h4>
              <p style={{ marginBottom: '20px' }}>
                Please note that some of our pots are handmade, and minor flaws may occur due to the artisanal crafting process. These minor imperfections do not qualify for returns or exchanges. We ensure that only high-quality items leave our facility, and any significant damage will be handled in accordance with our shipping policy.
              </p>

              <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.85em', color: '#888' }}>
                  Last Updated: November 23, 2025
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePageUi;