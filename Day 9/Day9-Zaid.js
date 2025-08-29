const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());

const students = [
  { id: 1, name: "Aarav Sharma", course: "Computer Science" },
  { id: 2, name: "Priya Verma", course: "Information Technology" },
  { id: 3, name: "Rohan Das", course: "Electronics" },
];

app.get("/api/students", (req, res) => {
  console.log("Received a requests");
  res.json(students);
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
