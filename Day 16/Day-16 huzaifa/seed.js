const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Pro Laptop",
    price: 170000,
    description: "A powerful laptop for all your needs.",
    imageUrl: "fas fa-laptop",
  },
  {
    name: "Ergo Mouse",
    price: 5000,
    description: "A comfortable and responsive mouse.",
    imageUrl: "fas fa-mouse",
  },
  {
    name: "Mechanical Keyboard",
    price: 12000,
    description: "A mechanical keyboard with RGB lighting.",
    imageUrl: "fas fa-keyboard",
  },
  {
    name: "4K Monitor",
    price: 50000,
    description: "A 27-inch 4K monitor.",
    imageUrl: "fas fa-desktop",
  },
  {
    name: "Noise-Cancelling Headphones",
    price: 15000,
    description: "Immersive sound experience.",
    imageUrl: "fas fa-headphones",
  },
  {
    name: "HD Webcam",
    price: 6000,
    description: "A high-definition webcam for clear video calls.",
    imageUrl: "fas fa-video",
  },
  {
    name: "Studio Microphone",
    price: 10000,
    description: "A studio-quality microphone for crisp audio.",
    imageUrl: "fas fa-microphone",
  },
  {
    name: "All-in-One Printer",
    price: 18000,
    description: "A multi-function printer for home and office.",
    imageUrl: "fas fa-print",
  },
];

mongoose
  .connect("mongodb://localhost:27017/online-store", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    return Product.insertMany(products);
  })
  .then(() => {
    console.log("Database seeded");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Database seeding error:", err);
    mongoose.connection.close();
  });
