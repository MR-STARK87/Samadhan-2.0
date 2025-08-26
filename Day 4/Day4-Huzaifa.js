const http = require("http");

const PORT = 3300;

const app = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World !");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
