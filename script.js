document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const list = document.getElementById('todo-list');

    if (!input || !addBtn || !list) {
        return;
    }

    let todos = [];

    try {
        todos = JSON.parse(localStorage.getItem('todos')) || [];
    } catch {
        todos = [];
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function createTodoNode(todo, index) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex align-items-center gap-2';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input mt-0';
        checkbox.checked = !!todo.completed;

        const textSpan = document.createElement('span');
        textSpan.className = 'flex-grow-1';
        textSpan.textContent = todo.text;
        textSpan.style.textDecoration = todo.completed ? 'line-through' : 'none';

        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            textSpan.style.textDecoration = todo.completed ? 'line-through' : 'none';
            saveTodos();
        });

        textSpan.addEventListener('dblclick', () => {
            const newText = prompt('Edit todo', todo.text);
            if (newText === null) {
                return;
            }

            const trimmedText = newText.trim();
            if (!trimmedText) {
                return;
            }

            todo.text = trimmedText;
            textSpan.textContent = todo.text;
            saveTodos();
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-outline-danger btn-sm';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => {
            todos.splice(index, 1);
            render();
            saveTodos();
        });

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(delBtn);

        return li;
    }

    function render() {
        list.innerHTML = '';

        todos.forEach((todo, index) => {
            const node = createTodoNode(todo, index);
            list.appendChild(node);
        });
    }

    function addTodo() {
        const text = input.value.trim();
        if (!text) {
            return;
        }

        todos.push({ text, completed: false });
        input.value = '';
        render();
        saveTodos();
    }

    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    render();
});


