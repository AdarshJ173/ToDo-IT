// Add event listener for the "Add Task" button
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
document.getElementById('clearCompleted').addEventListener('click', clearCompleted);

// Load tasks from LocalStorage on page load
window.onload = loadTasks;

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        const taskList = document.getElementById('taskList');
        const li = createTaskElement(taskText, false);
        taskList.appendChild(li);
        
        saveTask(taskText, false);
        taskInput.value = '';
        updateTaskCount();
    }
}

function createTaskElement(text, completed) {
    const li = document.createElement('li');
    
    const checkbox = document.createElement('div');
    checkbox.className = `checkbox ${completed ? 'checked' : ''}`;
    checkbox.onclick = () => toggleTask(li);
    
    const taskText = document.createElement('span');
    taskText.className = `task-text ${completed ? 'completed' : ''}`;
    taskText.textContent = text;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.onclick = () => deleteTask(li);
    
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    
    return li;
}

function toggleTask(li) {
    const checkbox = li.querySelector('.checkbox');
    const taskText = li.querySelector('.task-text');
    const completed = !checkbox.classList.contains('checked');
    
    checkbox.classList.toggle('checked');
    taskText.classList.toggle('completed');
    
    updateLocalStorage();
    updateTaskCount();
}

function deleteTask(li) {
    li.remove();
    updateLocalStorage();
    updateTaskCount();
}

function clearCompleted() {
    const completedTasks = document.querySelectorAll('.task-text.completed');
    completedTasks.forEach(task => task.parentElement.remove());
    updateLocalStorage();
    updateTaskCount();
}

function updateTaskCount() {
    const totalTasks = document.querySelectorAll('#taskList li').length;
    document.getElementById('taskCount').textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
}

function saveTask(task, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: task, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: li.querySelector('.checkbox').classList.contains('checked')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    
    tasks.forEach(task => {
        const li = createTaskElement(task.text, task.completed);
        taskList.appendChild(li);
    });
    
    updateTaskCount();
}
