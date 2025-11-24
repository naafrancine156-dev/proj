import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import "./products.css";

export default function ProductsPage() {
  const [activeItem, setActiveItem] = useState("Products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [editCurrentImage, setEditCurrentImage] = useState(0);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "Indoor Plants" },
    { id: 2, name: "Outdoor Plants" },
  ];
  const subCategories = [
    { id: 1, categoryId: 1, name: "Foliage" },
    { id: 2, categoryId: 1, name: "Succulents" },
    { id: 3, categoryId: 2, name: "Flowering" },
    { id: 4, categoryId: 2, name: "Herbs" },
  ];
  const potSizes = ["Small", "Medium", "Large"];

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/products");

      if (res.data.products && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]);
    } else {
      const matches = products
        .filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);

      setSuggestions(matches);
    }
  };

  // Handle checkbox for individual product
  const handleProductCheckbox = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(filteredProducts.map((p) => p._id));
      setSelectedProducts(allIds);
    } else {
      setSelectedProducts(new Set());
    }
  };

  // Handle delete selected products
  const handleDelete = async () => {
    if (selectedProducts.size === 0) {
      toast.error("Please select at least one product to delete!");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${selectedProducts.size} product(s)? This action cannot be undone.`
    );

    if (!isConfirmed) return;

    try {
      const deleteToast = toast.loading("Deleting products...");

      // Delete each selected product
      for (const productId of selectedProducts) {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
      }

      toast.dismiss(deleteToast);
      toast.success(`${selectedProducts.size} product(s) deleted successfully!`);

      // Refresh products list
      await fetchProducts();
      setSelectedProducts(new Set());
    } catch (err) {
      toast.error("Error deleting products: " + err.message);
    }
  };

  // Handle edit product
  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditFormData({
      name: product.name,
      scientificName: product.scientificName || "",
      category: product.category || [],
      subCategory: product.subCategory || [],
      description: product.description || "",
      plantCare: product.plantCare || "",
      potSizes: product.potSizes || [],
      price: product.price || "",
      quantity: product.quantity || "",
    });
    setEditImagePreviews(
      product.imageURLs?.map((url) => `http://localhost:5000${url}`) || []
    );
    setEditImageFiles([]);
    setEditCurrentImage(0);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({});
    setEditImageFiles([]);
    setEditImagePreviews([]);
    setEditCurrentImage(0);
  };

  // Handle edit form input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle edit form select change
  const handleEditSelectChange = (selected, field) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: selected ? selected.map((s) => s.value) : [],
    }));
  };

  // Handle edit image change
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    setEditImageFiles(files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setEditImagePreviews(newPreviews);
    setEditCurrentImage(0);
  };

  const handleEditNextImage = () => {
    setEditCurrentImage((prev) => (prev + 1) % editImagePreviews.length);
  };

  const handleEditPrevImage = () => {
    setEditCurrentImage((prev) =>
      prev === 0 ? editImagePreviews.length - 1 : prev - 1
    );
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editFormData.name || editFormData.name.trim() === "") {
      toast.error("Product name is required!");
      return;
    }

    let saveToastId;
    try {
      saveToastId = toast.loading("Updating product...");
      console.log("🚀 Starting product update for ID:", editingProduct);

      // Create FormData for multipart request
      const formPayload = new FormData();
      formPayload.append("name", editFormData.name.trim());
      formPayload.append("scientificName", editFormData.scientificName.trim());
      formPayload.append("description", editFormData.description.trim());
      formPayload.append("plantCare", editFormData.plantCare.trim());
      formPayload.append("price", parseFloat(editFormData.price) || 0);
      formPayload.append("quantity", parseInt(editFormData.quantity) || 0);
      formPayload.append("category", JSON.stringify(editFormData.category));
      formPayload.append("subCategory", JSON.stringify(editFormData.subCategory));
      formPayload.append("potSizes", JSON.stringify(editFormData.potSizes));

      // Only append new images if files were selected
      if (editImageFiles.length > 0) {
        editImageFiles.forEach((file, index) => {
          formPayload.append("images", file);
          console.log(`📎 Appending image ${index + 1}:`, file.name);
        });
      }

      console.log("📦 FormData entries:");
      for (let pair of formPayload.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], `[File: ${pair[1].name}]`);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      console.log("🔗 Sending PUT request to:", `http://localhost:5000/api/products/${editingProduct}`);
      
      const response = await axios.put(
        `http://localhost:5000/api/products/${editingProduct}`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      console.log("✅ Backend response:", response.data);
      toast.dismiss(saveToastId);
      toast.success("Product updated successfully!");

      await fetchProducts();
      setEditingProduct(null);
      setEditFormData({});
      setEditImageFiles([]);
      setEditImagePreviews([]);
    } catch (err) {
      console.error("❌ Error updating product:", err);
      
      // Always dismiss the loading toast
      if (saveToastId) {
        toast.dismiss(saveToastId);
      } else {
        toast.dismiss();
      }
      
      // Detailed error logging
      if (err.response) {
        // Server responded with error
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response URL:", err.response.config?.url);
        toast.error(`Error ${err.response.status}: ${err.response.data.message || "Failed to update product!"}`);
      } else if (err.request) {
        // Request made but no response
        console.error("No response received:", err.request);
        toast.error("❌ Server not responding. Check if backend is running on port 5000.");
      } else {
        // Error in request setup
        console.error("Request error:", err.message);
        toast.error("❌ Error: " + err.message);
      }
    }
  };

  // Filter products for the table
  let filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply category filter
  if (filterCategory !== "all") {
    filteredProducts = filteredProducts.filter((product) =>
      product.category?.includes(filterCategory)
    );
  }

  // Apply stock filter
  if (filterStock === "in-stock") {
    filteredProducts = filteredProducts.filter((product) => product.quantity > 0);
  } else if (filterStock === "out-of-stock") {
    filteredProducts = filteredProducts.filter((product) => product.quantity === 0);
  }

  const handleAdminLogout = () => {
    localStorage.removeItem("token");  // delete token
    navigate("/login");          // redirect to admin login page
  };


  return (
    <div className="container">
      <Toaster />
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h1>Plantasy</h1>
          <p>Smart Plant Care & Shopping System</p>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${activeItem === "Dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveItem("Dashboard");
              navigate("/dashboard");
            }}
          >
            <span className="nav-icon">⊞</span> Dashboard
          </button>

          <button
            className={`nav-item ${activeItem === "Products" ? "active" : ""}`}
            onClick={() => {
              setActiveItem("Products");
              navigate("/product");
            }}
          >
            <span className="nav-icon">⊞</span> Products
          </button>

          <button
            className={`nav-item ${activeItem === "Order" ? "active" : ""}`}
            onClick={() => {
              setActiveItem("Order");
              navigate("/orders");
            }}
          >
            <span className="nav-icon">⊞</span> Order Management
          </button>

          <button
            className={`nav-item ${activeItem === "Customers" ? "active" : ""}`}
            onClick={() => {
              setActiveItem("Customers");
              navigate("/customers");
            }}
          >
            <span className="nav-icon">⊞</span> User Management
          </button>
        </nav>

        <button className="nav-item logout" onClick={handleAdminLogout}>
          <span className="nav-icon">⊙</span> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <div className="products-section">
          <div className="products-header">
            <h1 className="products-title">Products</h1>

            {/* Search Bar with Autocomplete */}
            <div className="search-wrapper" style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search products..."
                className="search-bar"
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul
                  className="suggestions-list"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #ccc",
                    zIndex: 10,
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {suggestions.map((item) => (
                    <li
                      key={item._id}
                      style={{ padding: "0.5rem", cursor: "pointer" }}
                      onClick={() => {
                        setSearchQuery(item.name);
                        setSuggestions([]);
                      }}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="actions">
              <select
                className="btn btn-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                className="btn btn-filter"
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>

              <button
                className="btn btn-delete"
                onClick={handleDelete}
                disabled={selectedProducts.size === 0}
              >
                Delete
              </button>
              <button
                className="btn btn-add"
                onClick={() => navigate("/inventory")}
              >
                + Add New Product
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                Loading products...
              </div>
            ) : error ? (
              <div
                style={{ padding: "2rem", textAlign: "center", color: "red" }}
              >
                Error: {error}
              </div>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Sold</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product._id)}
                            onChange={() => handleProductCheckbox(product._id)}
                          />
                        </td>
                        <td className="product-name-cell">
                          {product.imageURLs && product.imageURLs.length > 0 ? (
                            <img
                              src={`http://localhost:5000${product.imageURLs[0]}`}
                              alt={product.name}
                              className="product-image"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/30?text=No+Image";
                              }}
                            />
                          ) : (
                            <img
                              src="https://via.placeholder.com/30?text=No+Image"
                              alt="No image"
                              className="product-image"
                            />
                          )}

                          <div className="product-name-info">
                            <div className="product-name">{product.name}</div>
                            <div className="product-sku">{product.scientificName || ""}</div>
                          </div>
                        </td>
                        <td>₱{product.price?.toFixed(2) || "0.00"}</td>
                        <td>{product.quantity || 0}</td>
                        <td>{product.sold || 0}</td>
                        <td>
                          <span className={`status ${product.quantity > 0 ? "in-stock" : "out-of-stock"}`}>
                            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => handleEditClick(product)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Edit Product Form */}
          {editingProduct && (
            <div className="edit-form-overlay">
              <div className="edit-form-container">
                <h1 className="page-title">Edit Product</h1>

                <div className="inventory-page">
                  {/* Image Upload Section */}
                  <div className="upload-section">
                    <div className="upload-box">
                      {editImagePreviews.length > 0 ? (
                        <>
                          <img
                            src={editImagePreviews[editCurrentImage]}
                            alt="preview"
                            className="upload-image"
                          />
                          {editImagePreviews.length > 1 && (
                            <>
                              <button className="carousel-btn left" onClick={handleEditPrevImage}>
                                ‹
                              </button>
                              <button className="carousel-btn right" onClick={handleEditNextImage}>
                                ›
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <p className="upload-label">Product Images</p>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditImageChange}
                    />
                    <p className="upload-note">Max File Size: 5MB | Aspect ratio 1:1</p>
                  </div>

                  {/* Form Fields */}
                  <div className="form-fields">
                    <input
                      placeholder="Product Name"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                    />
                    <input
                      placeholder="Scientific Name"
                      name="scientificName"
                      value={editFormData.scientificName}
                      onChange={handleEditInputChange}
                    />
                    <Select
                      isMulti
                      placeholder="Category"
                      options={categories.map((c) => ({ value: c.name, label: c.name }))}
                      value={editFormData.category.map((c) => ({ value: c, label: c }))}
                      onChange={(selected) => handleEditSelectChange(selected, "category")}
                    />
                    <Select
                      isMulti
                      placeholder="SubCategory"
                      options={subCategories.map((s) => ({ value: s.name, label: s.name }))}
                      value={editFormData.subCategory.map((s) => ({ value: s, label: s }))}
                      onChange={(selected) => handleEditSelectChange(selected, "subCategory")}
                    />
                    <Select
                      isMulti
                      placeholder="Pot Sizes"
                      options={potSizes.map((s) => ({ value: s, label: s }))}
                      value={editFormData.potSizes.map((s) => ({ value: s, label: s }))}
                      onChange={(selected) => handleEditSelectChange(selected, "potSizes")}
                    />
                    <input
                      placeholder="Price"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditInputChange}
                    />
                    <input
                      placeholder="Quantity"
                      name="quantity"
                      value={editFormData.quantity}
                      onChange={handleEditInputChange}
                    />
                    <textarea
                      placeholder="Description"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                    />
                    <textarea
                      placeholder="Plant Care Details"
                      name="plantCare"
                      value={editFormData.plantCare}
                      onChange={handleEditInputChange}
                    />
                    <div className="edit-form-buttons">
                      <button className="submit-btn" onClick={handleSaveEdit}>
                        Save Product
                      </button>
                      <button className="btn btn-cancel" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}