const main = document.getElementById('main');
const addMenu = document.getElementById('add-task-menu');
const taskDisplay = document.getElementById('my-tasks');
const addBtn = document.getElementById('add-task-btn');
const allBtn = document.getElementById('all');
const pendingBtn = document.getElementById('pending');
const completedBtn = document.getElementById('completed');
const nameInput = document.getElementById('name-input');
const dateInput = document.getElementById('date-input');
const timeInput = document.getElementById('time-input');
const alert = document.getElementById('alert');
const submitBtn = document.getElementById('submit');
const closeAddMenu = document.getElementById('close-add-menu');
const btnContainer = document.getElementById('add-menu-btn-container');

let taskArr = [];

// to check whether an existing task is being edited
let isEditing = false;

getTasks();
displayTasks();

function submitHandler() {
    if (nameInput.value) {
        addTaskFunc();
    } else {
        alert.style.display = 'block';
    }
}

submitBtn.addEventListener('click', submitHandler);

addMenu.addEventListener('keydown', e => {
    if (e.key === "Enter"  && !isEditing) {
    e.preventDefault();
    if (nameInput.value) {
        addTaskFunc();
    } else {
        alert.style.display = 'block';
    }
}
})

const closeMenu = () => {
    nameInput.value = '';
    dateInput.value = '';
    timeInput.value = '';

    addMenu.style.display = 'none';
    main.style.display = 'block';
    isEditing = false;
};

closeAddMenu.addEventListener('click', closeMenu);

addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    main.style.display = 'none';
    addMenu.style.display = 'block';
});

allBtn.addEventListener('click', (e) => {
    e.preventDefault();
    allBtn.classList.add('opened-tab');
    pendingBtn.classList.remove('opened-tab');
    completedBtn.classList.remove('opened-tab');
    displayTasks();
});

pendingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    pendingBtn.classList.add('opened-tab');
    allBtn.classList.remove('opened-tab');
    completedBtn.classList.remove('opened-tab');
    displayPendingTasks();
});

completedBtn.addEventListener('click', (e) => {
    e.preventDefault();
    completedBtn.classList.add('opened-tab');
    allBtn.classList.remove('opened-tab');
    pendingBtn.classList.remove('opened-tab');
    displayCompletedTasks();
});

const addTaskFunc = () => {
    const taskName = nameInput.value.trim();
    const taskDate = dateInput.value ? dateInput.value : false;
    const taskTime = timeInput.value ? timeInput.value : false;
    
    createTask(taskName, taskDate, taskTime);

    window.location.reload();
}

const createTask = (taskName, taskDate, taskTime) => {
    taskArr.push({
        name: taskName,
        date: taskDate,
        time: taskTime,
        completed: false
    });

    localStorage.setItem('tasks', JSON.stringify(taskArr));
    displayTasks();
}

function displayTasks() {
    taskDisplay.innerHTML = taskArr.map(task => {
        const {name, completed} = task;
        return`<li>
            <span ${completed ? `class="checked"` : ``}><input class="check-btn" type="checkbox" onclick="handleTaskCompletion(event, ${taskArr.indexOf(task)})" ${completed ? 'checked' : ''}>
            ${name}</span>
            <button class="view-btn" onclick="viewTask(${taskArr.indexOf(task)})">View</button>
        </li>`
    }).join('');
}

function displayPendingTasks() {
    const pendingArr = taskArr.filter(task => !task.completed);
    taskDisplay.innerHTML = pendingArr.map(task => {
        const {name} = task;
        return`<li>
        <span><input class="pend-check-btn check-btn" type="checkbox" onclick="handleTaskCompletion(event, ${taskArr.indexOf(task)})">
            ${name}</span>
            <button class="view-btn" onclick="viewTask(${taskArr.indexOf(task)})">View</button>
        </li>`
    }).join('');
}

function displayCompletedTasks() {
    const completedArr = taskArr.filter(task => task.completed);
    taskDisplay.innerHTML = completedArr.map(task => {
        const {name} = task;
        return`<li>
        <span class="checked"><input class="comp-check-btn check-btn" type="checkbox" onclick="handleTaskCompletion(event, ${taskArr.indexOf(task)})" checked>
            ${name}</span>
            <button class="view-btn" onclick="viewTask(${taskArr.indexOf(task)})">View</button>
        </li>`
    }).join('');
}

function getTasks() {
    taskArr = JSON.parse(localStorage.getItem('tasks')) || [];

    // sort based on date and time
    taskArr.sort((a, b) => {
        
        // check if object has only time or only date
        const isOnlyTime = obj => obj.time && !obj.date;
        const isOnlyDate = obj => obj.date && !obj.time;

        if (isOnlyTime(a) && isOnlyTime(b)) return new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`);
        if (isOnlyTime(a) && !isOnlyTime(b)) return -1;
        if (isOnlyTime(b) && !isOnlyTime(a)) return 1;

        if (isOnlyDate(a) && isOnlyDate(b)) return new Date(a.date) - new Date(b.date);

        if (a.time && a.date && b.time && b.date) {
            const dateTimeA = new Date(`${a.date} ${a.time}`);
            const dateTimeB = new Date(`${b.date} ${b.time}`);
            return dateTimeA - dateTimeB;
        }

        const dateOrTimeA = a.date || (a.time ? '1970-01-01' : '');
        const dateOrTimeB = b.date || (b.time ? '1970-01-01' : '');
        if (isOnlyDate(a) && b.time && b.date) {
            if (a.date === b.date) return 1;
            return new Date(dateOrTimeA) - new Date(dateOrTimeB);
        };
        if (isOnlyDate(b) && a.time && a.date) {
            if (a.date === b.date) return -1;
            return new Date(dateOrTimeA) - new Date(dateOrTimeB);
        }
        if ((isOnlyDate(a) && !isOnlyDate(b)) || (isOnlyDate(b) && !isOnlyDate(a))) {
        return new Date(dateOrTimeA) - new Date(dateOrTimeB);
        }
        }
    );
}

function deleteTask(taskIndex) {
  
    taskArr.splice(taskIndex, 1);
    
    localStorage.setItem('tasks', JSON.stringify(taskArr));
    
    window.location.reload();
}

function editTask(taskIndex) {
    const taskName = nameInput.value.trim();
    const taskDate = dateInput.value ? dateInput.value : false;
    const taskTime = timeInput.value ? timeInput.value : false;
    const isCompleted = taskArr[taskIndex].completed;

    taskArr[taskIndex] = {
        name: taskName,
        date: taskDate,
        time: taskTime,
        completed: isCompleted
    }

    localStorage.setItem('tasks', JSON.stringify(taskArr));

    window.location.reload();
}

function viewTask(taskIndex) {
    const nameH2 = document.getElementById('name-h2');
    const dateH2 = document.getElementById('date-h2');
    const timeH2 = document.getElementById('time-h2');

    const task =  taskArr[taskIndex];
    const {name, date, time, completed} = task;

    nameInput.value = name;
    dateInput.value = date;
    timeInput.value = time;

    nameH2.textContent = completed ? "Completed Task" : "Pending Task";
    dateH2.textContent = "Date";
    timeH2.textContent = "Time";
    
    submitBtn.style.display = "none";

    btnContainer.innerHTML = `<button class="add-menu-btn" id="close">Close</button> <button class="add-menu-btn" onclick="deleteTask(${taskIndex})">Delete</button>
                              <button class="add-menu-btn" onclick="editTask(${taskIndex})">Save</button>`;

    const close = document.getElementById('close');
    close.addEventListener('click', closeMenu);

    isEditing = true;
    main.style.display = 'none';
    addMenu.style.display = 'block';
}

function handleTaskCompletion(e, taskIndex) {
    const box = e.target;

    if (box.checked) {
        taskArr[taskIndex].completed = true;
        box.parentElement.classList.add('checked');
    } else {
        taskArr[taskIndex].completed = false;
        box.parentElement.classList.remove('checked');
    }

    localStorage.setItem('tasks', JSON.stringify(taskArr));
}
