const taskInput = document.getElementById("task-input");
const moneyInput = document.getElementById("money-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

addBtn.onclick = () => {

    const text = taskInput.value;
    const money = moneyInput.value;
    const date = dateInput.value;

    if (text === "") return;

    const task = {
        text,
        money,
        date,
        done: false
    };

    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    moneyInput.value = "";
    dateInput.value = "";
};