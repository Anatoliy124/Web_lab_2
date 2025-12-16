// Массив для хранения задач
let tasks = [];

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    createPageStructure();
    initializeEventListeners();
    loadTasksFromStorage();
    renderTasks();
});

// Создание структуры страницы
function createPageStructure() {
    const body = document.body;
    
    // Создание основного контейнера
    const container = document.createElement('div');
    container.className = 'container';
    
    // Создание заголовка
    const header = document.createElement('header');
    const title = document.createElement('h1');
    title.textContent = 'To-Do List';
    title.className = 'title';
    header.appendChild(title);
    
    // Создание формы для добавления задач
    const form = document.createElement('form');
    form.className = 'task-form';
    form.id = 'taskForm';
    
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.id = 'taskInput';
    taskInput.className = 'task-input';
    taskInput.placeholder = 'Введите название задачи';
    taskInput.required = true;
    
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'dateInput';
    dateInput.className = 'date-input';
    
    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.className = 'add-button';
    addButton.textContent = 'Добавить';
    
    inputGroup.appendChild(taskInput);
    inputGroup.appendChild(dateInput);
    inputGroup.appendChild(addButton);
    form.appendChild(inputGroup);
    
    // Создание панели управления
    const controls = document.createElement('div');
    controls.className = 'controls';
    
    const searchGroup = document.createElement('div');
    searchGroup.className = 'search-group';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchInput';
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Поиск по названию...';
    
    searchGroup.appendChild(searchInput);
    
    const filterGroup = document.createElement('div');
    filterGroup.className = 'filter-group';
    
    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Фильтр:';
    filterLabel.className = 'filter-label';
    
    const filterSelect = document.createElement('select');
    filterSelect.id = 'filterSelect';
    filterSelect.className = 'filter-select';
    
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'Все';
    
    const activeOption = document.createElement('option');
    activeOption.value = 'active';
    activeOption.textContent = 'Активные';
    
    const completedOption = document.createElement('option');
    completedOption.value = 'completed';
    completedOption.textContent = 'Выполненные';
    
    filterSelect.appendChild(allOption);
    filterSelect.appendChild(activeOption);
    filterSelect.appendChild(completedOption);
    
    filterGroup.appendChild(filterLabel);
    filterGroup.appendChild(filterSelect);
    
    const sortGroup = document.createElement('div');
    sortGroup.className = 'sort-group';
    
    const sortLabel = document.createElement('label');
    sortLabel.textContent = 'Сортировка:';
    sortLabel.className = 'sort-label';
    
    const sortSelect = document.createElement('select');
    sortSelect.id = 'sortSelect';
    sortSelect.className = 'sort-select';
    
    const dateAscOption = document.createElement('option');
    dateAscOption.value = 'date-asc';
    dateAscOption.textContent = 'По дате (возрастание)';
    
    const dateDescOption = document.createElement('option');
    dateDescOption.value = 'date-desc';
    dateDescOption.textContent = 'По дате (убывание)';
    
    sortSelect.appendChild(dateAscOption);
    sortSelect.appendChild(dateDescOption);
    
    sortGroup.appendChild(sortLabel);
    sortGroup.appendChild(sortSelect);
    
    controls.appendChild(searchGroup);
    controls.appendChild(filterGroup);
    controls.appendChild(sortGroup);
    
    // Создание списка задач
    const taskList = document.createElement('ul');
    taskList.id = 'taskList';
    taskList.className = 'task-list';
    
    // Сборка структуры
    container.appendChild(header);
    container.appendChild(form);
    container.appendChild(controls);
    container.appendChild(taskList);
    body.appendChild(container);
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    const form = document.getElementById('taskForm');
    form.addEventListener('submit', handleAddTask);
}

// Обработчик добавления задачи
function handleAddTask(e) {
    e.preventDefault();
    
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    
    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;
    
    if (!taskText) {
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        date: taskDate || null,
        completed: false,
        order: tasks.length
    };
    
    tasks.push(newTask);
    taskInput.value = '';
    dateInput.value = '';
    
    renderTasks();
    saveTasksToStorage();
}

// Рендеринг списка задач
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'task-item empty-state';
        emptyItem.textContent = 'Список задач пуст';
        taskList.appendChild(emptyItem);
        return;
    }
    
    tasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

// Создание элемента задачи
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;
    if (task.completed) {
        li.classList.add('completed');
    }
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));
    
    const content = document.createElement('div');
    content.className = 'task-content';
    
    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;
    
    const date = document.createElement('span');
    date.className = 'task-date';
    if (task.date) {
        const dateObj = new Date(task.date + 'T00:00:00');
        date.textContent = `Дата: ${dateObj.toLocaleDateString('ru-RU')}`;
    } else {
        date.textContent = 'Без даты';
    }
    
    content.appendChild(text);
    content.appendChild(date);
    
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    
    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Редактировать';
    editButton.addEventListener('click', () => editTask(task.id));
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', () => deleteTask(task.id));
    
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    
    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);
    
    return li;
}

// Переключение статуса выполнения задачи
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        saveTasksToStorage();
    }
}

// Удаление задачи
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
    saveTasksToStorage();
}

// Редактирование задачи
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newText = prompt('Введите новое название задачи:', task.text);
    if (newText === null) return;
    
    const newTextTrimmed = newText.trim();
    if (!newTextTrimmed) return;
    
    const newDate = prompt('Введите новую дату (YYYY-MM-DD) или оставьте пустым:', task.date || '');
    
    task.text = newTextTrimmed;
    task.date = newDate ? newDate : null;
    
    renderTasks();
    saveTasksToStorage();
}

// Сохранение задач в localStorage
function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Загрузка задач из localStorage
function loadTasksFromStorage() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    }
}

