const API_URL = "http://localhost:5000/tasks";

// Fetch tasks and display
async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <span onclick="toggleComplete('${task.id}')">${task.title}</span>
      <div>
        <button class="edit-btn" onclick="editTask('${task.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Add task
async function addTask() {
  const taskInput = document.getElementById("taskInput");
  const title = taskInput.value.trim();
  if (!title) return alert("Enter a task!");

  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title, completed: false })
  });

  taskInput.value = "";
  fetchTasks();
}

// Toggle complete
async function toggleComplete(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const task = await res.json();

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ ...task, completed: !task.completed })
  });

  fetchTasks();
}

// Edit task
async function editTask(id) {
  const newTitle = prompt("Edit task:");
  if (!newTitle) return;
  const res = await fetch(`${API_URL}/${id}`);
  const task = await res.json();

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ ...task, title: newTitle })
  });

  fetchTasks();
}

// Delete task
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

// Initial load
fetchTasks();
