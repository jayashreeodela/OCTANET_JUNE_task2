document.addEventListener('DOMContentLoaded', () => {
    const textbox = document.getElementById('textbox');
    const datebox = document.getElementById('datebox');
    const addtask = document.getElementById('buttonaddtask');
    const searchDatebox = document.getElementById('searchDatebox');
    const searchbtn = document.getElementById('searchbtn');
    const currentDatetime = document.getElementById('currentDatetime');
    const taskslist = document.getElementById('taskslist');

    // Function to add a task to the list
    function addTaskToList(task) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        const clear = document.createElement('button');
        const textSpan = document.createElement('span');

        clear.textContent = 'x';
        clear.className = 'clearbtn';

        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;

        // Update task.completed when checkbox changes
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            updateTask(task);
            updateTaskTextDecoration(textSpan, task.completed);
        });

        // Remove task when 'x' button is clicked
        clear.addEventListener('click', () => {
            deleteTask(task);
        });

        // Display task text
        textSpan.textContent = `${task.date} => ${task.text}`;
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(clear);

        // Check task.completed to add 'checked' class and update text decoration
        if (task.completed) {
            li.classList.add('checked');
            updateTaskTextDecoration(textSpan, true); // Update text decoration for completed tasks
        }

        taskslist.appendChild(li);
                
        // // Apply 'checked' class based on task completion...............

        // li.classList.toggle('checked', task.completed);        
        // taskslist.appendChild(li);
    }


    // Function to update text decoration based on task completion status
    function updateTaskTextDecoration(element, completed) {
        if (completed) {
            element.style.textDecoration = 'line-through';
            element.style.textDecorationThickness = '0.8px';
            element.style.textDecorationColor = 'black';
        } else {
            element.style.textDecoration = 'none'; // Remove text decoration if not completed
        }
    }


    // Add new task
    addtask.addEventListener('click', () => {
        const text = textbox.value.trim();
        const date = datebox.value;
        if (text && date >= getCurrentDate()) {
            const newTask = { text, date, completed: false };
            saveTask(newTask);
            addTaskToList(newTask);
            textbox.value = '';
            datebox.value = getCurrentDate();
        }
        else{
            alert("Cannot Enter tasks for the previous dates");
        }
    });

// Save task to localStorage
function saveTask(task) {
    const tasks = getAllTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task in localStorage
function updateTask(task) {
    const tasks = getAllTasks();
    const index = tasks.findIndex(t => t.text === task.text && t.date === task.date);
    if (index !== -1) {
        tasks[index] = task;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Delete task from localStorage
function deleteTask(task) {
    const tasks = getAllTasks();
    const index = tasks.findIndex(t => t.text === task.text && t.date === task.date);
    if (index !== -1) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    refreshTaskList(); // Refresh task list after deletion
}

// Get all tasks from localStorage
function getAllTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Load tasks based on search date or all tasks
function loadTasks(searchDate = null) {
    const tasks = getAllTasks();

    // Sort tasks in descending order based on date
    tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const filteredTasks = searchDate ? tasks.filter(task => task.date === searchDate) : tasks;
    // filteredTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    taskslist.innerHTML = '';
    filteredTasks.forEach(task => addTaskToList(task));
}

// Search tasks based on date
searchbtn.addEventListener('click', () => {
    const searchDate = searchDatebox.value;
    loadTasks(searchDate);
});

// Update current date and time display
function updateDateTime() {
    const date = new Date();
    currentDatetime.textContent = date.toLocaleString();
}

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

// Set default date when page loads
function setDefaultDate() {
    datebox.value = getCurrentDate();
}

// Refresh task list
function refreshTaskList() {
    const searchDate = searchDatebox.value;
    loadTasks(searchDate);
}

// Update date and time every second
setInterval(updateDateTime, 1000);
setDefaultDate(); // Set default date on page load
loadTasks(); // Load all tasks on page load
});