import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchSideBar.css";

const SearchSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Fetch all products on first open
  const loadProducts = async () => {
    if (productsLoaded) return;
    
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      if (data.success) {
        setAllProducts(data.products);
        setProductsLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Load products when sidebar opens
  const handleOpen = () => {
    loadProducts();
  };

  // Handle search input and generate suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setSelectedIndex(-1);

    if (value.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    // Filter products based on search input
    const filtered = allProducts.filter((product) => {
      const searchLower = value.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.some((cat) =>
          cat.toLowerCase().includes(searchLower)
        ))
      );
    });

    // Limit suggestions to 8
    setSuggestions(filtered.slice(0, 8));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelectProduct(suggestions[selectedIndex]);
      } else if (searchInput.trim()) {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Handle product selection from suggestions
  const handleSelectProduct = (product) => {
    navigate(`/product/${product._id}`);
    setSearchInput("");
    setSuggestions([]);
    onClose();
  };

  // Handle search button or Enter key
  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput)}`);
      setSearchInput("");
      setSuggestions([]);
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="searchOverlay" onClick={onClose}></div>
      )}

      {/* Search Sidebar */}
      <div className={`searchSidebar ${isOpen ? "open" : ""}`} onMouseEnter={handleOpen}>
        <div className="searchHeader">
          <input
            type="text"
            className="searchInput"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            autoFocus={isOpen}
          />
          <button className="closeSearchBtn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Suggestions List */}
        <div className="suggestionsCont">
          {suggestions.length > 0 ? (
            <ul className="suggestionsList">
              {suggestions.map((product, index) => (
                <li
                  key={product._id}
                  className={`suggestionItem ${
                    selectedIndex === index ? "selected" : ""
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  <img
                    src={`http://localhost:5000${product.imageURLs[0]}`}
                    alt={product.name}
                    className="suggestionImg"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <div className="suggestionContent">
                    <h4>{product.name}</h4>
                    <p className="suggestionCategory">
                      {product.category && product.category.join(" • ")}
                    </p>
                    <p className="suggestionPrice">
                      ₱ {product.price.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchInput.trim().length > 0 ? (
            <div className="noResults">
              <p>No products found for "{searchInput}"</p>
              <button className="viewAllBtn" onClick={handleSearch}>
                View all results
              </button>
            </div>
          ) : (
            <div className="emptyState">
              <p>Start typing to search products...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchSidebar;