const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().populate("senderId", "username");
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
