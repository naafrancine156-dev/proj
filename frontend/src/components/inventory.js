"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import Select from "react-select"
import "./inventory.css"

export default function InventoryPage() {
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState("Inventory")
  const [formData, setFormData] = useState({
    productName: "",
    scientificName: "",
    category: [],
    subCategory: [],
    description: "",
    plantCare: "",
    potSizes: [],
    price: "",
    quantity: "",
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [currentImage, setCurrentImage] = useState(0)

  const categories = [
    { id: 1, name: "Indoor Plants" },
    { id: 2, name: "Outdoor Plants" },
    { id: 3, name: "Air Purifying Plants" },

  ]
  const subCategories = [
    { id: 1, categoryId: 1, name: "Foliage" },
    { id: 2, categoryId: 1, name: "Succulents" },
    { id: 3, categoryId: 2, name: "Flowering" },
    { id: 4, categoryId: 2, name: "Herbs" },
  ]
  const potSizes = ["Small", "Medium", "Large"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (selected, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selected ? selected.map((s) => s.value) : [],
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)
    setImagePreviews(files.map((file) => URL.createObjectURL(file)))
    setCurrentImage(0)
  }

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imagePreviews.length)
  }
  const handlePrevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? imagePreviews.length - 1 : prev - 1
    )
  }

  // Replace your handleAddProduct function with this:

const handleAddProduct = async () => {
  // Validation
  if (!formData.productName || formData.productName.trim() === "") {
    toast.error("Please fill the product name!");
    return;
  }

  // Optional: Validate other fields
  if (imageFiles.length === 0) {
    toast.error("Please upload at least one image!");
    return;
  }

  if (!formData.price || parseFloat(formData.price) <= 0) {
    toast.error("Please enter a valid price!");
    return;
  }

  try {
    console.log("🚀 Starting product submission...");
    
    // Prepare FormData
    const formPayload = new FormData();
    formPayload.append("name", formData.productName.trim());
    formPayload.append("scientificName", formData.scientificName.trim());
    formPayload.append("description", formData.description.trim());
    formPayload.append("plantCare", formData.plantCare.trim());
    formPayload.append("price", parseFloat(formData.price) || 0);
    formPayload.append("quantity", parseInt(formData.quantity) || 0);

    // Convert arrays to JSON strings
    formPayload.append("category", JSON.stringify(formData.category));
    formPayload.append("subCategory", JSON.stringify(formData.subCategory));
    formPayload.append("potSizes", JSON.stringify(formData.potSizes));

    // Append images
    imageFiles.forEach((file, index) => {
      formPayload.append("images", file);
      console.log(`📎 Appending image ${index + 1}:`, file.name);
    });

    // Log FormData for debugging
    console.log("📦 FormData entries:");
    for (let pair of formPayload.entries()) {
      if (pair[1] instanceof File) {
        console.log(pair[0], `[File: ${pair[1].name}]`);
      } else {
        console.log(pair[0], pair[1]);
      }
    }

    // Show loading toast
    const loadingToast = toast.loading("Saving product...");

    // Send to backend
    const response = await axios.post(
      "http://localhost:5000/api/products",
      formPayload,
      { 
        headers: { 
          "Content-Type": "multipart/form-data" 
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log("✅ Backend response:", response.data);
    
    // Dismiss loading toast
    toast.dismiss(loadingToast);
    
    // Show success message
    if (response.data.success) {
      toast.success("Product saved successfully!");
    } else {
      toast.success("Product saved to database!");
    }

    // Reset form
    setFormData({
      productName: "",
      scientificName: "",
      category: [],
      subCategory: [],
      description: "",
      plantCare: "",
      potSizes: [],
      price: "",
      quantity: "",
    });
    setImageFiles([]);
    setImagePreviews([]);
    setCurrentImage(0);

    // Optional: Navigate to products page or refresh
    // navigate("/product");

  } catch (err) {
    console.error("❌ Error sending product:", err);
    
    // Detailed error logging
    if (err.response) {
      // Server responded with error
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      toast.error(err.response.data.message || "Failed to save product!");
    } else if (err.request) {
      // Request made but no response
      console.error("No response received:", err.request);
      toast.error("Server not responding. Check if backend is running on port 5000.");
    } else {
      // Error in request setup
      console.error("Request error:", err.message);
      toast.error("Error: " + err.message);
    }
  }
}

  return (
    <div className="container">
      <Toaster />
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h1>Eric's Garden</h1>
          <p>Smart Plant Care & Shopping System</p>
        </div>
        <nav className="nav-menu">
          {["Dashboard", "Products", "Order", "Inventory"].map((item) => (
            <button
              key={item}
              className={`nav-item ${activeItem === item ? "active" : ""}`}
              onClick={() => {
                setActiveItem(item)
                if (item === "Dashboard") navigate("/")
                if (item === "Products") navigate("/product")
                if (item === "Inventory") navigate("/inventory")
                if (item === "Order") navigate("/orders")
              }}
            >
              ⊞ {item}
            </button>
          ))}
        </nav>
        <button className="nav-item logout">⊙ Logout</button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <h1 className="page-title">Add Inventory Product</h1>
        <div className="inventory-page">
          {/* Image Upload Section */}
          <div className="upload-section">
            <div className="upload-box">
              {imagePreviews.length > 0 ? (
                <>
                  <img
                    src={imagePreviews[currentImage]}
                    alt="preview"
                    className="upload-image"
                  />
                  {imagePreviews.length > 1 && (
                    <>
                      <button className="carousel-btn left" onClick={handlePrevImage}>‹</button>
                      <button className="carousel-btn right" onClick={handleNextImage}>›</button>
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
              onChange={handleImageChange}
            />
            <p className="upload-note">Max File Size: 5MB | Aspect ratio 1:1</p>
          </div>

          {/* Form Fields */}
          <div className="form-fields">
            <input
              placeholder="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
            />
            <input
              placeholder="Scientific Name"
              name="scientificName"
              value={formData.scientificName}
              onChange={handleInputChange}
            />
            <Select
              isMulti
              placeholder="Category"
              options={categories.map((c) => ({ value: c.name, label: c.name }))}
              value={formData.category.map((c) => ({ value: c, label: c }))}
              onChange={(selected) => handleSelectChange(selected, "category")}
            />
            <Select
              isMulti
              placeholder="SubCategory"
              options={subCategories.map((s) => ({ value: s.name, label: s.name }))}
              value={formData.subCategory.map((s) => ({ value: s, label: s }))}
              onChange={(selected) => handleSelectChange(selected, "subCategory")}
            />
            <Select
              isMulti
              placeholder="Pot Sizes"
              options={potSizes.map((s) => ({ value: s, label: s }))}
              value={formData.potSizes.map((s) => ({ value: s, label: s }))}
              onChange={(selected) => handleSelectChange(selected, "potSizes")}
            />
            <input
              placeholder="Price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
            <input
              placeholder="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
            />
            <textarea
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <textarea
              placeholder="Plant Care Details"
              name="plantCare"
              value={formData.plantCare}
              onChange={handleInputChange}
            />
            <button className="submit-btn" onClick={handleAddProduct}>Save Product</button>
          </div>
        </div>
      </main>
    </div>
  )
}
