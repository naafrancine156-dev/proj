const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// ===== ENSURE UPLOADS FOLDER EXISTS =====
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadDir);
}

// ===== MULTER CONFIGURATION =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// ===== IMPORTANT: SPECIFIC ROUTES BEFORE DYNAMIC ROUTES =====

// ===== GET ROUTE - FETCH ALL PRODUCTS =====
router.get("/", async (req, res) => {
  try {
    console.log("📝 Received GET request to /api/products");
    
    const products = await Product.find();
    
    console.log(`✅ Found ${products.length} products`);
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch products",
      error: err.message 
    });
  }
});

// ===== GET ROUTE - FETCH FEATURED PRODUCTS (SPECIFIC - MUST BE BEFORE /:id) =====
router.get("/featured", async (req, res) => {
  try {
    console.log("📝 Received GET request to /api/products/featured");
    
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(6);
    
    console.log(`✅ Found ${products.length} featured products`);
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    console.error("❌ Error fetching featured products:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch featured products",
      error: err.message 
    });
  }
});

// ===== GET ROUTE - FETCH PRODUCT BY ID (DYNAMIC - AFTER SPECIFIC ROUTES) =====
router.get("/:id", async (req, res) => {
  try {
    console.log("📝 Received GET request to /api/products/:id");
    console.log("Product ID:", req.params.id);
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.log("❌ Product not found:", req.params.id);
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    
    console.log(`✅ Found product: ${product.name}`);
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch product",
      error: err.message 
    });
  }
});

// ===== POST ROUTE - CREATE PRODUCT =====
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    console.log("📝 Received POST request to /api/products");
    console.log("📦 req.body:", req.body);
    console.log("🖼️ req.files:", req.files?.length || 0, "files");

    const {
      name,
      scientificName,
      category,
      subCategory,
      potSizes,
      price,
      quantity,
      description,
      plantCare,
    } = req.body;

    if (!name || name.trim() === "") {
      console.log("❌ Validation failed: Missing product name");
      return res.status(400).json({ 
        success: false,
        message: "Product name is required" 
      });
    }

    let parsedCategory = [];
    let parsedSubCategory = [];
    let parsedPotSizes = [];

    try {
      parsedCategory = category ? JSON.parse(category) : [];
      parsedSubCategory = subCategory ? JSON.parse(subCategory) : [];
      parsedPotSizes = potSizes ? JSON.parse(potSizes) : [];
    } catch (parseErr) {
      console.log("⚠️ JSON parse error:", parseErr.message);
      return res.status(400).json({ 
        success: false,
        message: "Invalid JSON format in category/subCategory/potSizes" 
      });
    }

    const imageURLs = req.files 
      ? req.files.map(file => `/uploads/${file.filename}`) 
      : [];

    console.log("🖼️ Image URLs:", imageURLs);

    const product = new Product({
      name: name.trim(),
      scientificName: scientificName?.trim() || "",
      category: parsedCategory,
      subCategory: parsedSubCategory,
      potSizes: parsedPotSizes,
      price: parseFloat(price) || 0,
      quantity: parseInt(quantity) || 0,
      description: description?.trim() || "",
      plantCare: plantCare?.trim() || "",
      imageURLs,
    });

    console.log("💾 Attempting to save product...");
    const savedProduct = await product.save();
    console.log("✅ Product saved successfully:", savedProduct._id);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct
    });

  } catch (err) {
    console.error("❌ Error in POST /api/products:", err);
    
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Failed to save product",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
});

// ===== PUT ROUTE - UPDATE PRODUCT =====
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    console.log("📝 Received PUT request to /api/products/:id");
    console.log("Product ID:", req.params.id);
    console.log("📦 req.body:", req.body);
    console.log("🖼️ New files:", req.files?.length || 0, "files");

    const { id } = req.params;
    const {
      name,
      scientificName,
      category,
      subCategory,
      potSizes,
      price,
      quantity,
      description,
      plantCare,
    } = req.body;

    if (!name || name.trim() === "") {
      console.log("❌ Validation failed: Missing product name");
      return res.status(400).json({ 
        success: false,
        message: "Product name is required" 
      });
    }

    let parsedCategory = [];
    let parsedSubCategory = [];
    let parsedPotSizes = [];

    try {
      parsedCategory = category ? JSON.parse(category) : [];
      parsedSubCategory = subCategory ? JSON.parse(subCategory) : [];
      parsedPotSizes = potSizes ? JSON.parse(potSizes) : [];
    } catch (parseErr) {
      console.log("⚠️ JSON parse error:", parseErr.message);
      return res.status(400).json({ 
        success: false,
        message: "Invalid JSON format in category/subCategory/potSizes" 
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      console.log("❌ Product not found with ID:", id);
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    // Handle new images
    let imageURLs = product.imageURLs || [];
    if (req.files && req.files.length > 0) {
      console.log("🖼️ New images uploaded, replacing old ones");
      
      // Delete old images from filesystem
      imageURLs.forEach(oldUrl => {
        const oldFilePath = path.join(__dirname, "../uploads", path.basename(oldUrl));
        fs.unlink(oldFilePath, (err) => {
          if (err) console.log("Note: Could not delete old file:", oldFilePath);
        });
      });

      // Add new image URLs
      imageURLs = req.files.map(file => `/uploads/${file.filename}`);
      console.log("✅ Image URLs updated:", imageURLs);
    }

    // Update product fields
    product.name = name.trim();
    product.scientificName = scientificName?.trim() || "";
    product.category = parsedCategory;
    product.subCategory = parsedSubCategory;
    product.potSizes = parsedPotSizes;
    product.price = parseFloat(price) || 0;
    product.quantity = parseInt(quantity) || 0;
    product.description = description?.trim() || "";
    product.plantCare = plantCare?.trim() || "";
    product.imageURLs = imageURLs;

    console.log("💾 Attempting to save updated product...");
    const updatedProduct = await product.save();
    console.log("✅ Product updated successfully:", updatedProduct._id);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (err) {
    console.error("❌ Error in PUT /api/products/:id:", err);

    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Failed to update product",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
});

// ===== DELETE ROUTE - DELETE PRODUCT =====
router.delete("/:id", async (req, res) => {
  try {
    console.log("📝 Received DELETE request to /api/products/:id");
    console.log("Product ID:", req.params.id);

    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      console.log("❌ Product not found with ID:", id);
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    // Delete images from filesystem
    if (product.imageURLs && product.imageURLs.length > 0) {
      console.log("🖼️ Deleting product images...");
      product.imageURLs.forEach(imageUrl => {
        const filePath = path.join(__dirname, "../uploads", path.basename(imageUrl));
        fs.unlink(filePath, (err) => {
          if (err) console.log("Note: Could not delete file:", filePath);
          else console.log("✅ Deleted image:", filePath);
        });
      });
    }

    // Delete product from database
    console.log("💾 Attempting to delete product from database...");
    await Product.findByIdAndDelete(id);
    console.log("✅ Product deleted successfully");

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (err) {
    console.error("❌ Error in DELETE /api/products/:id:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete product",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
});

module.exports = router;