const backendAddress = 'http://127.0.0.1:8000/api/';

function addTaskButtonListener() {
    const addTaskButton = document.getElementById('add-task');
    addTaskButton.addEventListener('click', saveTask);
}

function handleLogin() {
    const username = (document.getElementById('username')).value;
    const password = (document.getElementById('password')).value;
    fetch(backendAddress + 'auth/token', {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'password': password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            if (response.status == 401) {
                alert('Usuário ou senha inválidos.');
            }
            throw new Error('Falha na autenticação');
        }
    })
    .then((data) => {
        const token = data.token;
        localStorage.setItem('token', token);
        window.location.replace('index.html');
    })
    .catch(erro => { 
        console.log(erro);
    });
}

function handleLogout() {
    const token = localStorage.getItem('token');
    fetch(backendAddress + 'auth/token', {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) window.location.replace('index.html');
        else alert('Erro ' + response.status);
    })
    .catch(erro => { console.log(erro); });
}

function makeLoginLogoutButtonListener() {
    document.body.addEventListener('click', evento => {
        evento.preventDefault();
        if (evento.target.id == 'make-login') {
            handleLogin();
        }
        if (evento.target.id == 'make-logout') {
            handleLogout();
        }
    });
}

function checkLogin() {
    window.addEventListener('load', () => {
        const token = localStorage.getItem('token');
        fetch(backendAddress + 'auth/token', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            response.json().then(data => {
                const usuario = data;
                if (response.ok) {
                    let objDiv = (document.getElementById('logged'));
                    objDiv.classList.remove('hide');
                    objDiv.classList.add('show');
                    objDiv = (document.getElementById('unlogged'));
                    objDiv.classList.remove('show');
                    objDiv.classList.add('hide');
                } else {
                    usuario.username = 'visitante';
                    let objDiv = (document.getElementById('unlogged'));
                    objDiv.classList.remove('hide');
                    objDiv.classList.add('show');
                    objDiv = (document.getElementById('logged'));
                    objDiv.classList.remove('show');
                    objDiv.classList.add('hide');
                }
                const spanElement = document.getElementById('nome_user');
                spanElement.innerHTML = 'Olá, ' + usuario.username + '!';
            });
        })
        .catch(erro => {
            console.log('[setLoggedUser] deu erro: ' + erro);
        });
    });
}

function loadTasks() {
    const token = localStorage.getItem('token');
    fetch(backendAddress + 'tasks/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }
    })
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
    const token = localStorage.getItem('token');
    fetch(backendAddress + 'tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
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
    const token = localStorage.getItem('token');
    fetch(`${backendAddress + 'tasks/'}${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ completed }),
    })
    .then(() => loadTasks())
    .catch(error => {
        console.error('Erro ao atualizar tarefa:', error);
    });
}

function deleteTask(id) {
    const token = localStorage.getItem('token');
    if (!confirm('Tem certeza de que deseja apagar esta tarefa?')) {
        return;
    }
    fetch(`${backendAddress + 'tasks/'}${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(() => loadTasks())
    .catch(error => {
        console.error('Erro ao apagar tarefa:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    addTaskButtonListener();
    makeLoginLogoutButtonListener();
    checkLogin();
    loadTasks();
});
