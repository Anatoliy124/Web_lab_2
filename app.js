// Массив для хранения задач
let tasks = [];

// Переменные для фильтрации и поиска
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'date-asc';

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
    
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    const filterSelect = document.getElementById('filterSelect');
    filterSelect.addEventListener('change', handleFilter);
    
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', handleSort);
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
    
    // Фильтрация и поиск
    let filteredTasks = filterTasks(tasks);
    filteredTasks = searchTasks(filteredTasks);
    
    // Сортировка
    filteredTasks = sortTasks(filteredTasks);
    
    if (filteredTasks.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'task-item empty-state';
        emptyItem.textContent = tasks.length === 0 ? 'Список задач пуст' : 'Задачи не найдены';
        taskList.appendChild(emptyItem);
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
    
    // Инициализация drag-and-drop после рендеринга
    initializeDragAndDrop();
}

// Фильтрация задач по статусу
function filterTasks(taskList) {
    if (currentFilter === 'all') {
        return taskList;
    } else if (currentFilter === 'active') {
        return taskList.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        return taskList.filter(task => task.completed);
    }
    return taskList;
}

// Поиск задач по названию
function searchTasks(taskList) {
    if (!currentSearch.trim()) {
        return taskList;
    }
    const searchLower = currentSearch.toLowerCase();
    return taskList.filter(task => 
        task.text.toLowerCase().includes(searchLower)
    );
}

// Сортировка задач по дате
function sortTasks(taskList) {
    const sorted = [...taskList];
    
    sorted.sort((a, b) => {
        const dateA = a.date ? new Date(a.date + 'T00:00:00').getTime() : 0;
        const dateB = b.date ? new Date(b.date + 'T00:00:00').getTime() : 0;
        
        if (currentSort === 'date-asc') {
            // Задачи без даты в конец
            if (!a.date && !b.date) return a.order - b.order;
            if (!a.date) return 1;
            if (!b.date) return -1;
            return dateA - dateB;
        } else if (currentSort === 'date-desc') {
            // Задачи без даты в конец
            if (!a.date && !b.date) return a.order - b.order;
            if (!a.date) return 1;
            if (!b.date) return -1;
            return dateB - dateA;
        }
        return a.order - b.order;
    });
    
    return sorted;
}

// Обработчик поиска
function handleSearch(e) {
    currentSearch = e.target.value;
    renderTasks();
}

// Обработчик фильтрации
function handleFilter(e) {
    currentFilter = e.target.value;
    renderTasks();
}

// Обработчик сортировки
function handleSort(e) {
    currentSort = e.target.value;
    renderTasks();
}

// Создание элемента задачи
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;
    li.draggable = true;
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
        // Восстановление порядка задач
        tasks.forEach((task, index) => {
            if (task.order === undefined) {
                task.order = index;
            }
        });
    }
}

// Инициализация drag-and-drop
function initializeDragAndDrop() {
    const taskList = document.getElementById('taskList');
    const taskItems = taskList.querySelectorAll('.task-item:not(.empty-state)');
    
    taskItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(e.clientY);
    const taskList = document.getElementById('taskList');
    
    if (afterElement == null) {
        taskList.appendChild(draggedElement);
    } else {
        taskList.insertBefore(draggedElement, afterElement);
    }
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        updateTaskOrder();
    }
    
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    updateTaskOrder();
}

function getDragAfterElement(y) {
    const draggableElements = [...document.querySelectorAll('.task-item:not(.dragging):not(.empty-state)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateTaskOrder() {
    const taskList = document.getElementById('taskList');
    const taskItems = taskList.querySelectorAll('.task-item:not(.empty-state)');
    
    taskItems.forEach((item, index) => {
        const taskId = parseInt(item.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.order = index;
        }
    });
    
    saveTasksToStorage();
}

