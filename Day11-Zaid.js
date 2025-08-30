const express = require("express");
const server = express();
const serverPort = 3000;

server.use(express.json());

let roster = [
  { uid: 1, fullName: "Alice", years: 21, field: "Computer Science" },
  { uid: 2, fullName: "Bob", years: 22, field: "Physics" },
  { uid: 3, fullName: "Charlie", years: 20, field: "Mathematics" },
];
let nextUid = 4;

server.post("/students", (req, res) => {
  const { fullName, years, field } = req.body;
  if (!fullName || !years || !field)
    return res.status(400).send("Missing fullName, years, or field");
  const entry = { uid: nextUid++, fullName, years, field };
  roster.push(entry);
  res.status(201).send(entry);
});

server.get("/students", (req, res) => {
  res.status(200).send(roster);
});

server.get("/students/:uid", (req, res) => {
  const idNum = parseInt(req.params.uid, 10);
  const match = roster.find((r) => r.uid === idNum);
  match
    ? res.status(200).send(match)
    : res.status(404).send("Student not found");
});

server.put("/students/:uid", (req, res) => {
  const idNum = parseInt(req.params.uid, 10);
  const idx = roster.findIndex((r) => r.uid === idNum);
  if (idx === -1) return res.status(404).send("Student not found");
  const { fullName, years, field } = req.body;
  if (!fullName || !years || !field)
    return res.status(400).send("Missing fullName, years, or field");
  roster[idx] = { uid: idNum, fullName, years, field };
  res.status(200).send(roster[idx]);
});

server.delete("/students/:uid", (req, res) => {
  const idNum = parseInt(req.params.uid, 10);
  const idx = roster.findIndex((r) => r.uid === idNum);
  if (idx === -1) return res.status(404).send("Student not found");
  roster.splice(idx, 1);
  res.status(204).send();
});

server.listen(serverPort, () => {
  console.log(`Server running at http://localhost:${serverPort}`);
});
