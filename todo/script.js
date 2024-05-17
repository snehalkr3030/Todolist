let tasks = [];

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            time: new Date().toLocaleTimeString()
        };
        tasks.push(task);
        renderTasks();
        saveTasks();
        taskInput.value = "";
    }
}

function toggleTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        renderTasks();
        saveTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    saveTasks();
}

function updateTaskText(id, newText) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText.trim();
        renderTasks();
        saveTasks();
    }
}

function renderTasks(filteredTasks = tasks) {
    const taskList = document.getElementById("taskList");
    const completedTasksList = document.getElementById("completedTasks");
    taskList.innerHTML = "";
    completedTasksList.innerHTML = "";
    filteredTasks.forEach(task => {
        const listItem = document.createElement("li");
        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.contentEditable = true;
        taskText.addEventListener("blur", () => {
            updateTaskText(task.id, taskText.textContent);
        });
        listItem.appendChild(taskText);
        listItem.appendChild(document.createTextNode(` - ${task.time}`));
        listItem.classList.toggle("completed", task.completed);
        const toggleButton = document.createElement("button");
        toggleButton.textContent = task.completed ? "Undo" : "Done";
        toggleButton.onclick = () => toggleTask(task.id);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteTask(task.id);
        listItem.appendChild(toggleButton);
        listItem.appendChild(deleteButton);
        if (task.completed) {
            completedTasksList.appendChild(listItem);
        } else {
            taskList.appendChild(listItem);
        }
    });
}

function searchTasks(section) {
    const searchInput = document.getElementById(section === 'open' ? 'searchOpen' : 'searchCompleted');
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm) && (section === 'open' ? !task.completed : task.completed));
    renderTasks(filteredTasks);
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

document.getElementById("addTaskBtn").addEventListener("click", addTask);
loadTasks();
