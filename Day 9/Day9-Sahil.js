const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5050;

app.use(cors());

const studentRecords = [
  {
    sid: 201,
    name: "Ishaan Khanna",
    age: 20,
    grade: "A+",
    email: "ishaan.khanna@example.com",
  },
  {
    sid: 202,
    name: "Anika Rao",
    age: 21,
    grade: "B",
    email: "anika.rao@example.com",
  },
  {
    sid: 203,
    name: "Dev Malhotra",
    age: 19,
    grade: "A",
    email: "dev.malhotra@example.com",
  },
  {
    sid: 204,
    name: "Rhea Pillai",
    age: 22,
    grade: "B+",
    email: "rhea.pillai@example.com",
  },
  {
    sid: 205,
    name: "Kabir Mehra",
    age: 20,
    grade: "A-",
    email: "kabir.mehra@example.com",
  },
];

app.get("/api/students", (req, res) => {
  res.json(studentRecords);
});

app.listen(PORT, () =>
  console.log(`Student API running at http://localhost:${PORT}`)
);
