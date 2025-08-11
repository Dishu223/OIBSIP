document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const titleInput = document.getElementById('task-title-input');
    const descInput = document.getElementById('task-desc-input');
    const dueDateInput = document.getElementById('task-due-date-input');
    const priorityInput = document.getElementById('task-priority-input');
    const searchInput = document.getElementById('search-input');
    const pendingList = document.getElementById('pending-tasks-list');
    const completedList = document.getElementById('completed-tasks-list');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let draggedTaskId = null;

    const renderTasks = (filterText = '') => {
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        const filteredTasks = tasks.filter(task => 
            task.title.toLowerCase().includes(filterText.toLowerCase()) ||
            task.description.toLowerCase().includes(filterText.toLowerCase())
        );

        filteredTasks.forEach(task => {
            const list = task.isComplete ? completedList : pendingList;
            createTaskElement(task, list);
        });
        
        updateProgress();
        addDragAndDropListeners();
    };

    const createTaskElement = (task, list) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.dataset.id = task.id;
        if (task.isComplete) taskItem.classList.add('completed');
        if (!task.isComplete) taskItem.setAttribute('draggable', true);
        
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isComplete;
        if (isOverdue) taskItem.classList.add('overdue');

        taskItem.innerHTML = `
            <label class="checkbox-container">
                <input type="checkbox" class="task-checkbox" ${task.isComplete ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <div class="task-content">
                <p class="task-title">${task.title}</p>
                <p class="task-desc">${task.description}</p>
                <div class="task-details">
                    <span class="priority-tag ${task.priority}">${task.priority}</span>
                    ${task.dueDate ? `<span>Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                </div>
                <p class="task-timestamp">Added: ${new Date(task.createdAt).toLocaleString()}</p>
            </div>
            <div class="task-actions">
                <button class="action-btn edit-btn"><i class='bx bx-pencil'></i></button>
                <button class="action-btn delete-btn"><i class='bx bx-trash'></i></button>
            </div>
        `;
        list.appendChild(taskItem);
        taskItem.querySelector('.task-checkbox').addEventListener('change', () => toggleComplete(task.id));
        taskItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        taskItem.querySelector('.edit-btn').addEventListener('click', () => handleEdit(taskItem));
    };
    
    const updateProgress = () => {
        const completedTasks = tasks.filter(task => task.isComplete).length;
        const totalTasks = tasks.length;
        
        if (totalTasks === 0) {
            progressText.innerText = "No tasks yet!";
            progressBar.style.width = '0%';
            return;
        }
        
        const progressPercent = (completedTasks / totalTasks) * 100;
        progressText.innerText = `${completedTasks} of ${totalTasks} tasks completed`;
        progressBar.style.width = `${progressPercent}%`;
    };

    const addTask = (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        if (!title) return;

        const newTask = {
            id: `task-${Date.now()}`,
            title: title,
            description: descInput.value.trim(),
            isComplete: false,
            createdAt: new Date().toISOString(),
            dueDate: dueDateInput.value,
            priority: priorityInput.value
        };
        tasks.unshift(newTask);
        saveAndRender();
        taskForm.reset();
        priorityInput.value = 'medium';
        titleInput.focus();
    };
    
    const toggleComplete = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) task.isComplete = !task.isComplete;
        saveAndRender();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    };
    
    const handleEdit = (taskItem) => {
        const titleEl = taskItem.querySelector('.task-title');
        const descEl = taskItem.querySelector('.task-desc');
        const editBtn = taskItem.querySelector('.edit-btn');
        const isEditing = editBtn.innerHTML.includes('bx-save');

        if (isEditing) {
            const id = taskItem.dataset.id;
            const task = tasks.find(t => t.id === id);
            if(task) {
                task.title = titleEl.textContent;
                task.description = descEl.textContent;
            }
            titleEl.contentEditable = false;
            descEl.contentEditable = false;
            editBtn.innerHTML = `<i class='bx bx-pencil'></i>`;
            saveAndRender();
        } else {
            titleEl.contentEditable = true;
            descEl.contentEditable = true;
            editBtn.innerHTML = `<i class='bx bx-save'></i>`;
            titleEl.focus();
        }
    };

const addDragAndDropListeners = () => {
    const draggables = pendingList.querySelectorAll('.task-item[draggable="true"]');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
            draggedTaskId = draggable.dataset.id;
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    pendingList.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(pendingList, e.clientY);
        
        // Remove any existing gaps first
        pendingList.querySelectorAll('.drag-over-gap').forEach(el => {
            el.classList.remove('drag-over-gap');
        });

        // Add the gap to the element we are hovering before
        if (afterElement) {
            afterElement.classList.add('drag-over-gap');
        }
    });

    pendingList.addEventListener('drop', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(pendingList, e.clientY);
        const draggedElement = document.querySelector('.dragging');
        
        // Remove any lingering gaps
        pendingList.querySelectorAll('.drag-over-gap').forEach(el => {
            el.classList.remove('drag-over-gap');
        });
        
        // Visually move the element into its final place
        if (afterElement == null) {
            pendingList.appendChild(draggedElement);
        } else {
            pendingList.insertBefore(draggedElement, afterElement);
        }

        // Update the underlying tasks array to match the new visual order
        const newOrderIds = Array.from(pendingList.querySelectorAll('.task-item')).map(item => item.dataset.id);
        const reorderedPendingTasks = newOrderIds.map(id => tasks.find(t => t.id === id && !t.isComplete)).filter(Boolean);
        const completedTasks = tasks.filter(t => t.isComplete);
        tasks = [...reorderedPendingTasks, ...completedTasks];
        
        // Save the new order
        saveAndRender(); // Re-render
    });
};
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
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

    const saveAndRender = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(searchInput.value);
    };

    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    taskForm.addEventListener('submit', addTask);
    searchInput.addEventListener('input', () => renderTasks(searchInput.value));
    
    renderTasks();
});