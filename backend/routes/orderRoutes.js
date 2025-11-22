const express = require("express");
const Order = require("../models/Order_temp");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const router = express.Router();

// POST - Create an order
router.post("/", auth, async (req, res) => {
  try {
    const {
      userId,
      items,
      contactDetails,
      billingAddress,
      deliveryOption,
      paymentMethod,
      shippingCost,
      paymentFee,
      tax,
      total
    } = req.body;

    // Validate required fields
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "User ID and items are required" });
    }

    // Verify user is creating their own order
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🔥 VALIDATE STOCK AVAILABILITY
    console.log("📦 Validating stock for", items.length, "items...");
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ 
          message: `Product not found: ${item.productId}` 
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`
        });
      }

      console.log(`✅ Stock OK: ${product.name} (${product.quantity} available)`);
    }

    // Create new order
    const order = new Order({
      userId,
      items,
      contactDetails,
      billingAddress,
      deliveryOption,
      paymentMethod,
      shippingCost,
      paymentFee,
      tax,
      total,
      status: "pending"
    });

    await order.save();
    console.log("✅ Order created:", order._id);

    // 🔥 UPDATE PRODUCT SOLD COUNT AND QUANTITY
    console.log("📊 Updating product inventory...");
    console.log("Items to update:", JSON.stringify(items, null, 2));
    
    for (const item of items) {
      console.log(`🔍 Processing item: productId=${item.productId}, quantity=${item.quantity}`);
      
      let product;
      try {
        product = await Product.findById(item.productId);
      } catch (findErr) {
        console.error(`❌ Error finding product ${item.productId}:`, findErr.message);
        continue;
      }

      if (!product) {
        console.error(`❌ Product not found: ${item.productId}`);
        continue;
      }

      console.log(`📦 Found product: ${product.name}`);
      console.log(`   Before: Qty=${product.quantity}, Sold=${product.sold || 0}`);

      // Decrease quantity
      product.quantity = Math.max(0, product.quantity - item.quantity);

      // Increase sold count
      product.sold = (product.sold || 0) + item.quantity;

      console.log(`   After: Qty=${product.quantity}, Sold=${product.sold}`);

      try {
        const updatedProduct = await product.save();
        console.log(`✅ Saved product: ${product.name} (ID: ${updatedProduct._id})`);
      } catch (saveErr) {
        console.error(`❌ Error saving product ${product.name}:`, saveErr.message);
      }
    }

    // Clear cart after order is placed
    await Cart.findOneAndUpdate(
      { userId },
      { items: [], updatedAt: new Date() }
    );

    console.log("✅ Order created successfully:", order._id);
    res.status(201).json({
      message: "Order created successfully",
      orderId: order._id,
      order
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message
    });
  }
});

// GET - Fetch orders (admin gets all, regular users get their own)
router.get("/", auth, async (req, res) => {
  try {
    console.log("📝 Fetching orders - User role:", req.user.role);

    let orders;

    // If admin, fetch all orders
    if (req.user.role === "admin") {
      console.log("👨‍💼 Admin request - fetching all orders");
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      // Regular user - fetch only their orders
      console.log("📝 User request - fetching orders for user:", req.user.id);
      orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }

    console.log("✅ Fetched", orders.length, "orders");
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message
    });
  }
});

// GET - Fetch order by ID
router.get("/:orderId", auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify user owns this order
    if (req.user.id !== order.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({
      message: "Error fetching order",
      error: error.message
    });
  }
});

// PUT - Update order status (admin only or order owner)
// PUT - Update order status (admin only or order owner)
router.put("/:orderId/status", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ ALLOW ADMIN OR ORDER OWNER
    if (req.user.id !== order.userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (
      ![
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled"
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    console.log("✅ Order status updated:", status);
    res.json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({
      message: "Error updating order status",
      error: error.message
    });
  }
});

// PUT - Mark order as received (user only)
router.put("/:orderId/mark-received", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    console.log("🔍 DEBUG: Mark received request");
    console.log("   orderId:", orderId);
    console.log("   userId:", req.user.id);
    console.log("   userRole:", req.user.role);

    // Validate orderId format
    if (!orderId || orderId === "undefined") {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Find the order
    const order = await Order.findById(orderId);
    console.log("   Order found:", !!order);

    if (!order) {
      console.error("❌ Order not found:", orderId);
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("   Order userId:", order.userId);
    console.log("   Order status:", order.status);
    console.log("   User ID type:", typeof req.user.id);
    console.log("   Order userId type:", typeof order.userId);

    // Verify user owns this order (comparing as strings)
    const orderUserId = order.userId.toString();
    const currentUserId = req.user.id.toString();
    
    console.log("   Comparing:", currentUserId, "===", orderUserId);

    if (currentUserId !== orderUserId) {
      console.error("❌ Unauthorized - User mismatch");
      return res.status(403).json({ 
        message: "Unauthorized - This is not your order",
        userIdMismatch: {
          currentUser: currentUserId,
          orderUser: orderUserId
        }
      });
    }

    // Check if order is in delivered status
    if (order.status !== "delivered") {
      console.error("❌ Invalid status - Current status:", order.status);
      return res.status(400).json({ 
        message: `Cannot mark as received. Current status: ${order.status}. Order must be 'delivered' first.`
      });
    }

    // Update status to received
    order.status = "received";
    order.receivedAt = new Date();
    order.updatedAt = new Date();
    
    const updatedOrder = await order.save();
    console.log("✅ Order marked as received:", orderId);
    console.log("   Received at:", updatedOrder.receivedAt);
    console.log("   New status:", updatedOrder.status);

    res.json({
      message: "Order marked as received successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("❌ Error marking order as received:", error.message);
    console.error("   Error stack:", error.stack);
    res.status(500).json({
      message: "Error marking order as received",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});
module.exports = router;