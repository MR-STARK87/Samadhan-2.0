const express = require("express");
const application = express();
const portNumber = 5000;

const students = [
  { id: 201, fullName: "Aditya Rao", age: 22 },
  { id: 202, fullName: "Meera Joshi", age: 24 },
  { id: 203, fullName: "Tanishq Singh", age: 20 },
];

application.get("/api/participants", (req, res) => {
  res.json(students);
});

application.listen(portNumber, () => {
  console.log(
    `student API live at http://localhost:${portNumber}/api/participants`
  );
});
