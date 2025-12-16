// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    createPageStructure();
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

