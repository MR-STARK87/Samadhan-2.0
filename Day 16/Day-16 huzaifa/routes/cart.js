const express = require("express");
const router = express.Router();
const CartItem = require("../models/CartItem");

// Get cart items
router.get("/", async (req, res) => {
  try {
    const items = await CartItem.find().populate("product");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to cart
router.post("/", async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cartItem = await CartItem.findOne({ product: productId });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new CartItem({ product: productId, quantity });
    }
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove from cart
router.delete("/:id", async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
