const backendAddress = 'http://127.0.0.1:8000/api/';

function addTaskButtonListener() {
    const addTaskButton = document.getElementById('add-task');
    addTaskButton.addEventListener('click', saveTask);
}

function handleLogin() {
    const username: String = (document.getElementById('username') as HTMLInputElement).value;
	const password: String = (document.getElementById('password') as HTMLInputElement).value;
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
	.then((response: Response) => {
		if(response.ok) {
			return response.json();
		} else {
			if(response.status == 401) {
                alert('Usuário ou senha inválidos.');
			}
			throw new Error('Falha na autenticação');
		}
	})
	.then((data: { token: string }) => {
		const token: string = data.token;
		localStorage.setItem('token', token);
		window.location.replace('index.html');
	})
	.catch(erro => { 
        console.log(erro)
    })
}

function handleLogout() {
    const token = localStorage.getItem('token');
    fetch(backendAddress + 'auth/token', {
        method: 'DELETE',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(response.ok) window.location.replace('index.html');
        else alert('Erro ' + response.status);
    })
    .catch(erro => { console.log(erro); })
}

function makeLoginLogoutButtonListener() {
    console.log("listen to login");
    document.body.addEventListener('click', evento => {
		evento.preventDefault();
        const target = evento.target as HTMLElement;
        if (target && target.id === 'make-login') {
            handleLogin(); // Call the logout handler
        }
        if (target && target.id === 'make-logout') {
            handleLogout(); // Call the logout handler
        }
	});
}

function checkLogin() {
    window.addEventListener('load', () => {
        const token = localStorage.getItem('token');
        // const token = 'fece423ca932c966c7935ad9c0f2b96684ca4b7f';
        fetch(backendAddress + 'auth/token', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            response.json().then(data => {
                const usuario = data;
                if(response.ok) {
                    let objDiv = (document.getElementById('logged') as HTMLDivElement);
                    objDiv.classList.remove('hide');
                    objDiv.classList.add('show');
                    objDiv = (document.getElementById('unlogged') as HTMLDivElement);
                    objDiv.classList.remove('show');
                    objDiv.classList.add('hide');
                } else {
                    let objDiv = (document.getElementById('unlogged') as HTMLDivElement);
                    objDiv.classList.remove('hide');
                    objDiv.classList.add('show');
                    objDiv = (document.getElementById('logged') as HTMLDivElement);
                    objDiv.classList.remove('show');
                    objDiv.classList.add('hide');
                }
                const spanElement = document.getElementById('nome_user') as HTMLSpanElement;
                spanElement.innerHTML = 'Olá, ' + usuario.username  + '!';
            })
        })
        .catch(erro => {
            console.log('[setLoggedUser] deu erro: ' + erro);
        });
    });
}

function loadTasks() {
    fetch(backendAddress + 'tasks/')
        .then(response => response.json())
        .then(tasks => {
            const list = document.getElementById('task-list') as HTMLUListElement;
            list.innerHTML = ''; 

            tasks.forEach((task: { id: number; title: string; completed: boolean }) => {
                renderTask(task);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar tarefas:', error);
        });
}

function renderTask(task: { id: number; title: string; completed: boolean }) {
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

    const list = document.getElementById('task-list') as HTMLUListElement;
    list.appendChild(li);
}

function saveTask() {
    const input = document.getElementById('new-task') as HTMLInputElement;
    const task = { title: input.value, completed: false };

    if (!task.title.trim()) {
        alert('A tarefa não pode estar vazia!');
        return;
    }

    fetch(backendAddress + 'tasks/', {
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

function toggleComplete(id: number, completed: boolean) {
    fetch(`${backendAddress + 'tasks/'}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
    })
        .then(() => loadTasks())
        .catch(error => {
            console.error('Erro ao atualizar tarefa:', error);
        });
}

function deleteTask(id: number) {
    if (!confirm('Tem certeza de que deseja apagar esta tarefa?')) {
        return;
    }

    fetch(`${backendAddress + 'tasks/'}${id}/`, {
        method: 'DELETE',
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
