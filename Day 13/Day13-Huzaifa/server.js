const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000; // Use a different port than the React app

// --- Middleware ---
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses incoming JSON bodies

// --- In-memory "database" ---
let todos = [
  { id: 1, text: 'Learn about React + API' },
  { id: 2, text: 'Build a To-Do App' },
];
let nextId = 3;

// --- API Routes ---

// GET all todos
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// POST a new todo
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const newTodo = { id: nextId++, text };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// DELETE a todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    res.status(204).send(); // No Content
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});


// --- Start the server ---
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});