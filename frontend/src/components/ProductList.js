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
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [sortBy, setSortBy] = useState("alphabetical");

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

        if (selectedCategory) {
          filtered = filtered.filter((product) =>
            product.category.includes(selectedCategory)
          );
        }

        applySort(filtered);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const applySort = (productsToSort) => {
    let sorted = [...productsToSort];
    
    if (sortBy === "alphabetical") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setProducts(sorted);
  };

  useEffect(() => {
    if (products.length > 0) {
      applySort(products);
    }
  }, [sortBy]);

  const openProduct = (id) => {
    navigate(`/product/${id}`);
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
              <button className="bttn1" onClick={() => navigate("/homepage")}>Home</button>
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

          <div className="productPageHeaderCont">
            <h1 className="productPageHeader" style={{ textAlign: "center", fontSize: "48px", letterSpacing: "2px" }}>
              PRODUCTS
            </h1>
          </div>
        </div>
      </header>

      <div style={{ padding: "40px 60px", maxWidth: "1600px", margin: "0 auto" }}>
        {/* Filter and Sort Section */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "20px",
          marginBottom: "40px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "20px"
        }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 15px",
              border: "none",
              background: "transparent",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              borderBottom: "1px solid #999"
            }}
          >
            <option value="alphabetical">ALPHABETICAL</option>
            <option value="price-low">PRICE: LOW TO HIGH</option>
            <option value="price-high">PRICE: HIGH TO LOW</option>
            <option value="newest">NEWEST</option>
          </select>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>
            {products.length} PRODUCTS
          </span>
        </div>

        {/* Products Grid */}
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", fontSize: "16px" }}>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", fontSize: "16px" }}>No products found.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "40px",
            gridAutoRows: "auto"
          }}>
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                onClick={() => openProduct(product._id)}
              >
                <div style={{
                  width: "100%",
                  height: "300px",
                  overflow: "hidden",
                  marginBottom: "15px",
                  background: "#f5f5f5"
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
                    lineHeight: "1.4"
                  }}>
                    {product.description?.slice(0, 50)}...
                  </p>

                  <p style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#333",
                    margin: "0"
                  }}>
                    FROM ₱{" "}
                    {product.price.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
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