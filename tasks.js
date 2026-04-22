document.addEventListener("DOMContentLoaded", () => {

    const list = document.getElementById("task-list");
    const totalDisplay = document.getElementById("total-money");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";

    function displayTasks() {
        list.innerHTML = "";

        let filtered = tasks;

        if (currentFilter === "done") {
            filtered = tasks.filter(t => t.done);
        } else if (currentFilter === "not") {
            filtered = tasks.filter(t => !t.done);
        }

        filtered.forEach((task, index) => {

            const li = document.createElement("li");

            const info = document.createElement("div");
            info.textContent = `${task.text} | $${task.money} | ${task.date}`;

            if (task.done) {
                info.classList.add("done-task");
            }

            // RADIO
            const doneRadio = document.createElement("input");
            doneRadio.type = "radio";
            doneRadio.name = "task" + index;
            doneRadio.checked = task.done;

            doneRadio.onclick = () => {
                task.done = true;
                save();
                displayTasks();
            };

            const notDoneRadio = document.createElement("input");
            notDoneRadio.type = "radio";
            notDoneRadio.name = "task" + index;
            notDoneRadio.checked = !task.done;

            notDoneRadio.onclick = () => {
                task.done = false;
                save();
                displayTasks();
            };

            // BUTTONS
            const btnBox = document.createElement("div");
            btnBox.classList.add("task-buttons");

            // DELETE
            const delBtn = document.createElement("button");
            delBtn.textContent = "🗑️";
            delBtn.onclick = () => {
                tasks.splice(index, 1);
                save();
                displayTasks();
            };

            // EDIT
            const editBtn = document.createElement("button");
            editBtn.textContent = "✏️";
            editBtn.onclick = () => {
                const newText = prompt("Edit task:", task.text);
                if (newText !== null) task.text = newText;

                const newMoney = prompt("Edit money:", task.money);
                if (newMoney !== null) task.money = newMoney;

                save();
                displayTasks();
            };

            btnBox.appendChild(editBtn);
            btnBox.appendChild(delBtn);

            li.appendChild(info);
            li.appendChild(document.createElement("br"));
            li.appendChild(doneRadio);
            li.appendChild(document.createTextNode(" Done "));
            li.appendChild(notDoneRadio);
            li.appendChild(document.createTextNode(" Not Done"));
            li.appendChild(btnBox);

            list.appendChild(li);
        });

        calculateTotal();
    }

    function calculateTotal() {
        let total = 0;

        tasks.forEach(task => {
            if (task.done) {
                total += Number(task.money);
            }
        });

        totalDisplay.textContent = "Total: $" + total;
    }

    function save() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // FILTER FUNCTION (GLOBAL)
    window.filterTasks = function(type) {
        currentFilter = type;
        displayTasks();
    };

    displayTasks();
});