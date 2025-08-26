const express = require("express");
const app = express();
const PORT = 3000;

const students = [
  { id: 1, name: "Aarav Mehta", age: 20 },
  { id: 2, name: "Ishita Verma", age: 22 },
  { id: 3, name: "Kabir Shah", age: 19 },
];

app.get("/api/students", (req, res) => {
  res.json(students);
});

app.listen(PORT, () => {
  console.log(`Student API running at http://localhost:${PORT}/api/students`);
});
