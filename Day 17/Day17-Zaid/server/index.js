const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));

// Socket.IO
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", async (userId) => {
    socket.userId = userId;
    connectedUsers.set(userId, socket.id);

    const user = await User.findById(userId);
    if (user) {
      user.status = "online";
      await user.save();
      io.emit("userStatus", {
        userId,
        status: "online",
        username: user.username,
      });
    }

    // Send list of online users to the new user
    const onlineUsers = [];
    for (const [id] of connectedUsers.entries()) {
      const u = await User.findById(id);
      if (u)
        onlineUsers.push({
          userId: id,
          username: u.username,
          status: "online",
        });
    }
    socket.emit("onlineUsers", onlineUsers);
    socket.broadcast.emit("userStatus", {
      userId,
      status: "online",
      username: user.username,
    });
  });

  socket.on("sendMessage", async (msg) => {
    // Save message to DB
    const message = new Message({
      senderId: msg.senderId,
      receiverId: msg.receiverId, // for private messages
      content: msg.content,
    });
    await message.save();

    const sender = await User.findById(msg.senderId);

    // Broadcast to all clients
    io.emit("receiveMessage", { ...msg, username: sender.username });
  });

  socket.on("disconnect", async () => {
    if (socket.userId) {
      const user = await User.findById(socket.userId);
      if (user) {
        user.status = "offline";
        user.lastSeen = new Date();
        await user.save();
        io.emit("userStatus", {
          userId: socket.userId,
          status: "offline",
          username: user.username,
        });
      }
      connectedUsers.delete(socket.userId);
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
