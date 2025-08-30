const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;
const DATA_FILE = "./db.json";

app.use(cors());
app.use(express.json());

// Get all tasks
app.get("/tasks", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// Get single task
app.get("/tasks/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const task = data.find(t => t.id === req.params.id);
  res.json(task);
});

// Create task
app.post("/tasks", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const newTask = { id: uuidv4(), ...req.body };
  data.push(newTask);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json(newTask);
});

// Update task
app.put("/tasks/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  data = data.map(t => (t.id === req.params.id ? { ...t, ...req.body } : t));
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Task updated" });
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  data = data.filter(t => t.id !== req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
