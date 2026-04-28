const TASKS_KEY = "joshua_task_manager_tasks";

/**
 * Read tasks safely from localStorage.
 */
function getTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Could not load tasks:", error);
    return [];
  }
}

/**
 * Save tasks array to localStorage.
 */
function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

const taskForm = document.getElementById("task-form");
const taskTextInput = document.getElementById("task-text");
const taskMoneyInput = document.getElementById("task-money");
const taskDateInput = document.getElementById("task-date");

/**
 * Add a task from form values.
 */
function handleAddTask(event) {
  event.preventDefault();

  const text = taskTextInput.value.trim();
  const money = Number(taskMoneyInput.value);
  const date = taskDateInput.value;

  if (!text || Number.isNaN(money) || money < 0 || !date) {
    alert("Please fill all fields correctly.");
    return;
  }

  const tasks = getTasks();
  tasks.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    money,
    date,
    done: false,
  });

  saveTasks(tasks);
  taskForm.reset();
  taskTextInput.focus();
  alert("Task added successfully.");
}

/**
 * Register service worker for PWA support.
 */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}

taskForm.addEventListener("submit", handleAddTask);
