const taskInput = document.querySelector('.task-input input'),
filters = document.querySelectorAll('.filters span'),
clearAll = document.querySelector('.clear-btn'),
taskBox = document.querySelector('.task-box');

let editId;
let isEditedTask = false;
// getting localstorage todo list
let todos = JSON.parse(localStorage.getItem('todo-list'));

filters.forEach( button => {
    button.addEventListener('click', () => {
        console.log(button);
        document.querySelector('span.active').classList.remove('active');
        button.classList.add('active');
        showTodo(button.id);
    });
});

function showTodo(filter) {
    let li = '';
    if (todos) {
        todos.forEach( (todo, id) => {
            // if todo status is completed, set the isCompleted value to checked
            let isCompleted = todo.status == 'completed' ? 'checked' : '';
            if (filter == todo.status || filter == 'all') {
                
                console.log(id, todo);
                li += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                                <p class="${isCompleted}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick="editTask(${id}, '${todo.name}')">
                                        <i class="uil uil-pen"></i> Edit
                                    </li>
                                    <li onclick="deleteTask(${id}, ${filter})">
                                        <i class="uil uil-trash"></i> Delete
                                    </li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
        // if li isn't empty, insert this value inside taskbox else insert span
        taskBox.innerHTML = li || `<span>You don't have any tasks here</span>`;
    }
}
showTodo('all');

function showMenu(selectedTask) {
    // getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add('show');
    document.addEventListener('click', event => {
        // removing show class from the task menu on the document click
        if (event.target.tagName != 'I' || event.target != selectedTask) {
            taskMenu.classList.remove('show');
        }
    });
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId, filter) {
    isEditedTask = false;
    // removing selected task from array/todos
    todos.splice(deleteId, 1);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener('click', () => {
    // removing all items of array/todos
    todos.splice(0, todos.length);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo('all');

});

function updateStatus(selectedTask) {
    // getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add('checked');
        // updating the status of selected task to completed
        todos[selectedTask.id].status = 'completed';
    } else {
        taskName.classList.remove('checked');
        // updating the status of selected task to pending
        todos[selectedTask.id].status = 'pending';
    }
    localStorage.setItem('todo-list', JSON.stringify(todos));
}

taskInput.addEventListener('keyup', event => {
    let userTask = taskInput.value.trim();
    if (event.key == 'Enter' && userTask) {

        if (!isEditedTask) { // if edited task isn`t true 
            if (!todos) { // if todos doesn`t exist, pass an empty array
                todos = [];
            }
            let taskInfo = {name: userTask, status: 'pending'};
            todos.push(taskInfo); // adding a new task to todos
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }

        taskInput.value = '';
        localStorage.setItem('todo-list', JSON.stringify(todos));
        showTodo('all');
    }
    console.log(userTask);
});