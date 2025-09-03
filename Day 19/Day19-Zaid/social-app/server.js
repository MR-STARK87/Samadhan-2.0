const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/social_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("✅ MongoDB connected");

// Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const commentSchema = new mongoose.Schema({
  author: String,
  text: String,
});

const postSchema = new mongoose.Schema({
  author: String,
  content: String,
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "secret123", resave: false, saveUninitialized: true })
);

// Authentication middleware
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login.html");
  next();
}

// Routes
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.send("User already exists!");
  const user = new User({ username, password });
  await user.save();
  res.redirect("/login.html");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.send("Invalid credentials");
  req.session.user = user;
  res.redirect("/");
});

app.post("/post", requireLogin, async (req, res) => {
  const post = new Post({
    author: req.session.user.username,
    content: req.body.content,
  });
  await post.save();
  res.redirect("/");
});

app.post("/like/:id", requireLogin, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    post.likes++;
    await post.save();
  }
  res.redirect("/");
});

app.post("/comment/:id", requireLogin, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    post.comments.push({
      author: req.session.user.username,
      text: req.body.text,
    });
    await post.save();
  }
  res.redirect("/");
});

app.get("/", async (req, res) => {
  const posts = await Post.find().sort({ _id: -1 });

  let postCards = posts
    .map(
      (post) => `
    <div class="post-card">
      <h3>${post.author}</h3>
      <p>${post.content}</p>
      <div class="post-actions">
        <span>👍 ${post.likes}</span>
        ${
          req.session.user
            ? `
          <form action="/like/${post._id}" method="POST" style="display:inline;">
            <button type="submit">Like</button>
          </form>
        `
            : ""
        }
      </div>

      <div class="comments">
        <h4>Comments</h4>
        ${
          post.comments.length > 0
            ? post.comments
                .map((c) => `<p><b>${c.author}:</b> ${c.text}</p>`)
                .join("")
            : "<p>No comments yet</p>"
        }
      </div>

      ${
        req.session.user
          ? `
        <form action="/comment/${post._id}" method="POST" class="comment-form">
          <input type="text" name="text" placeholder="Write a comment..." required>
          <button type="submit">Comment</button>
        </form>
      `
          : ""
      }
    </div>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Social App</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <header>
        <a href="/">Home</a>
        ${
          req.session.user
            ? `<a href="/post.html">New Post</a> <a href="/logout">Logout</a>`
            : `<a href="/login.html">Login</a> <a href="/register.html">Register</a>`
        }
      </header>

      <div class="container">
        <h2>Welcome ${
          req.session.user ? req.session.user.username : "Guest"
        }</h2>
        ${postCards}
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
