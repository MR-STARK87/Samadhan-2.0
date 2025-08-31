const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const CartItem = require("../models/CartItem");

// Create an order
router.post("/", async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate("product");
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = new Order({
      items: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      total,
    });

    await order.save();
    await CartItem.deleteMany({});
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
