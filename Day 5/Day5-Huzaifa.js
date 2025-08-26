const express = require("express");
const server = express();
const PORT = 3000;

const learners = [
  { id: 101, fullName: "Neha Kulkarni", age: 21 },
  { id: 102, fullName: "Rohan Desai", age: 23 },
  { id: 103, fullName: "Simran Patel", age: 20 },
];

server.get("/api/learners", (req, res) => {
  res.json(learners);
});

server.listen(PORT, () => {
  console.log(`📚Learner API active at http://localhost:${PORT}/api/learners`);
});
