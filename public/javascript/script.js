const backendAddress = 'http://127.0.0.1:8000/api/tasks/';
function loadTasks() {
    fetch(backendAddress)
        .then(response => response.json())
        .then(tasks => {
        const list = document.getElementById('task-list');
        list.innerHTML = '';
        tasks.forEach((task) => {
            renderTask(task);
        });
    })
        .catch(error => {
        console.error('Erro ao carregar tarefas:', error);
    });
}
function renderTask(task) {
    const li = document.createElement('li');
    const checkmark = document.createElement('div');
    checkmark.className = 'checkmark';
    if (task.completed) {
        checkmark.classList.add('checked');
    }
    checkmark.addEventListener('click', () => toggleComplete(task.id, !task.completed));
    li.appendChild(checkmark);
    const title = document.createElement('span');
    title.textContent = task.title;
    title.className = task.completed ? 'completed' : '';
    li.appendChild(title);
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '🗑️';
    deleteButton.className = 'delete';
    deleteButton.addEventListener('click', () => deleteTask(task.id));
    li.appendChild(deleteButton);
    const list = document.getElementById('task-list');
    list.appendChild(li);
}
function saveTask() {
    const input = document.getElementById('new-task');
    const task = { title: input.value, completed: false };
    if (!task.title.trim()) {
        alert('A tarefa não pode estar vazia!');
        return;
    }
    fetch(backendAddress, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    })
        .then(() => {
        input.value = '';
        loadTasks();
    })
        .catch(error => {
        console.error('Erro ao salvar tarefa:', error);
    });
}
function toggleComplete(id, completed) {
    fetch(`${backendAddress}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
    })
        .then(() => loadTasks())
        .catch(error => {
        console.error('Erro ao atualizar tarefa:', error);
    });
}
function deleteTask(id) {
    if (!confirm('Tem certeza de que deseja apagar esta tarefa?')) {
        return;
    }
    fetch(`${backendAddress}${id}/`, {
        method: 'DELETE',
    })
        .then(() => loadTasks())
        .catch(error => {
        console.error('Erro ao apagar tarefa:', error);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task');
    addTaskButton.addEventListener('click', saveTask);
    loadTasks();
});
