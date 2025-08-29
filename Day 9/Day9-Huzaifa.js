const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5001;

app.use(cors());

const studentList = [
  {
    uid: 101,
    fullName: "Meera Nair",
    age: 20,
    grade: "A",
    email: "meera.nair@example.com",
  },
  {
    uid: 102,
    fullName: "Karan Mehta",
    age: 21,
    grade: "B+",
    email: "karan.mehta@example.com",
  },
  {
    uid: 103,
    fullName: "Sana Kapoor",
    age: 19,
    grade: "A-",
    email: "sana.kapoor@example.com",
  },
  {
    uid: 104,
    fullName: "Aditya Singh",
    age: 22,
    grade: "B",
    email: "aditya.singh@example.com",
  },
];

app.get("/api/students", (req, res) => {
  res.json(studentList);
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
