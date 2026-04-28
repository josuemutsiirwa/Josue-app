const TASKS_KEY = "joshua_task_manager_tasks";

let activeFilter = "all"; // all | done | not-done

/**
 * Read tasks safely from localStorage.
 */
function getTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to read tasks:", error);
    return [];
  }
}

/**
 * Save tasks in localStorage.
 */
function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

const tasksList = document.getElementById("tasks-list");
const emptyState = document.getElementById("empty-state");
const totalRow = document.getElementById("total-row");
const filterButtons = document.querySelectorAll(".btn-filter");

function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

function getFilteredTasks(tasks) {
  if (activeFilter === "done") return tasks.filter((task) => task.done);
  if (activeFilter === "not-done") return tasks.filter((task) => !task.done);
  return tasks;
}

/**
 * Correct totals by filter:
 * - all: all tasks
 * - done: only done tasks
 * - not-done: only not-done tasks
 */
function calculateTotalByFilter(allTasks) {
  const source = getFilteredTasks(allTasks);
  return source.reduce((sum, task) => sum + Number(task.money || 0), 0);
}

function getTotalTitle() {
  if (activeFilter === "done") return "Total (Completed Tasks):";
  if (activeFilter === "not-done") return "Total (Not Completed Tasks):";
  return "Total (All Tasks):";
}

function updateTaskDone(taskId, doneValue) {
  const tasks = getTasks();
  const index = tasks.findIndex((task) => task.id === taskId);
  if (index === -1) return;

  tasks[index].done = doneValue;
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(taskId) {
  const tasks = getTasks();
  const updated = tasks.filter((task) => task.id !== taskId);
  saveTasks(updated);
  renderTasks();
}

function editTask(taskId) {
  const tasks = getTasks();
  const index = tasks.findIndex((task) => task.id === taskId);
  if (index === -1) return;

  const currentTask = tasks[index];
  const newText = prompt("Edit task text:", currentTask.text);
  if (newText === null) return;

  const text = newText.trim();
  if (!text) {
    alert("Task text cannot be empty.");
    return;
  }

  const newMoney = prompt("Edit money amount:", String(currentTask.money));
  if (newMoney === null) return;

  const money = Number(newMoney);
  if (Number.isNaN(money) || money < 0) {
    alert("Money must be a valid number (0 or more).");
    return;
  }

  const newDate = prompt("Edit date (YYYY-MM-DD):", currentTask.date);
  if (newDate === null) return;

  if (!newDate.trim()) {
    alert("Date is required.");
    return;
  }

  tasks[index] = { ...tasks[index], text, money, date: newDate };
  saveTasks(tasks);
  renderTasks();
}

/**
 * Updated display logic: always show text + money + date.
 */
function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = "task-card";

  const text = document.createElement("p");
  text.className = "task-text";
  text.textContent = task.text;

  const money = document.createElement("p");
  money.className = "task-meta";
  money.textContent = `Money: ${formatMoney(task.money)}`;

  const date = document.createElement("p");
  date.className = "task-meta";
  date.textContent = `Date: ${task.date}`;

  card.append(text, money, date);

  const statusRow = document.createElement("div");
  statusRow.className = "status-row";

  const doneLabel = document.createElement("label");
  doneLabel.className = "done-label";
  const doneRadio = document.createElement("input");
  doneRadio.type = "radio";
  doneRadio.name = `status-${task.id}`;
  doneRadio.checked = task.done;
  doneRadio.addEventListener("change", () => updateTaskDone(task.id, true));
  doneLabel.append(doneRadio, " Done");

  const notDoneLabel = document.createElement("label");
  notDoneLabel.className = "not-done-label";
  const notDoneRadio = document.createElement("input");
  notDoneRadio.type = "radio";
  notDoneRadio.name = `status-${task.id}`;
  notDoneRadio.checked = !task.done;
  notDoneRadio.addEventListener("change", () => updateTaskDone(task.id, false));
  notDoneLabel.append(notDoneRadio, " Not Done");

  statusRow.append(doneLabel, notDoneLabel);

  const actionRow = document.createElement("div");
  actionRow.className = "action-row";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn btn-edit";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editTask(task.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-delete";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    if (confirm("Delete this task?")) deleteTask(task.id);
  });

  actionRow.append(editBtn, deleteBtn);
  card.append(statusRow, actionRow);

  return card;
}

function renderTotal(allTasks) {
  const total = calculateTotalByFilter(allTasks);
  totalRow.innerHTML = `${getTotalTitle()} <strong>${formatMoney(total)}</strong>`;
}

function renderTasks() {
  const allTasks = getTasks();
  const filtered = getFilteredTasks(allTasks);

  tasksList.innerHTML = "";
  filtered.forEach((task) => tasksList.appendChild(createTaskCard(task)));

  emptyState.style.display = filtered.length ? "none" : "block";
  renderTotal(allTasks);
}

function updateActiveFilterButton() {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === activeFilter);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    updateActiveFilterButton();
    renderTasks();
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}

updateActiveFilterButton();
renderTasks();
