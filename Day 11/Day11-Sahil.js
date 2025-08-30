const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());


let students = [
  { id: 1, name: 'Alice', age: 21, major: 'Computer Science' },
  { id: 2, name: 'Bob', age: 22, major: 'Physics' },
  { id: 3, name: 'Charlie', age: 20, major: 'Mathematics' },
];
let nextId = 4;


app.post('/students', (req, res) => {
  const { name, age, major } = req.body;
  if (!name || !age || !major) {
    return res.status(400).send('Missing name, age, or major');
  }

  const newStudent = {
    id: nextId++,
    name: name,
    age: age,
    major: major,
  };

  students.push(newStudent);
  res.status(201).send(newStudent); // 201 Created
});

app.get('/students', (req, res) => {
  res.status(200).send(students); // 200 OK
});

app.get('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find(s => s.id === studentId);

  if (student) {
    res.status(200).send(student);
  } else {
    res.status(404).send('Student not found'); // 404 Not Found
  }
});

app.put('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex(s => s.id === studentId);

  if (studentIndex !== -1) {
    const { name, age, major } = req.body;
    if (!name || !age || !major) {
      return res.status(400).send('Missing name, age, or major');
    }

    const updatedStudent = { id: studentId, name, age, major };
    students[studentIndex] = updatedStudent;
    res.status(200).send(updatedStudent);
  } else {
    res.status(404).send('Student not found');
  }
});

app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex(s => s.id === studentId);

  if (studentIndex !== -1) {
    students.splice(studentIndex, 1);
    res.status(204).send(); 
  } else {
    res.status(404).send('Student not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});