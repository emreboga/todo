
var Utility = (function() {
    var utils = {};

    utils.makeXHttpRequest = function(url, method, body) {
        var promise = new Promise(function(resolve) {
            var request = new XMLHttpRequest();
            if (typeof request !== 'undefined' && request !== null) {
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            resolve(request.response);
                        }
                    }
                };
                request.open(method, url);
                request.setRequestHeader('Content-type', 'application/json');
                if (method === 'POST' && body) {
                    request.send(body);
                } else {
                    request.send();
                }
            }
        });

        return promise;
    };

    // log errors to console
    utils.logError = function(message) {
        console.log(message);
    };

    return utils;
}());

var Todos = (function() {
    var todos = {};

    todos.allTasks = {};

    todos.setup = function() {
        // listen to add button click
        var addButton = document.getElementById('button-add');
        if (typeof addButton !== 'undefined' || addButton !== null) {
            addButton.addEventListener('click', this.addItemHandler);
        }
        // listen to enter key in input box
        var inputBox = document.getElementById('input-data');
        if (typeof inputBox !== 'undefined' || inputBox !== null) {
            inputBox.addEventListener('keyup', this.addItemKeyupHandler);
        }
        // listen to completed event
        var todoList = document.getElementById('todo-items');
        if (typeof todoList !== 'undefined' || todoList !== null) {
            todoList.addEventListener('change', this.itemCheckedHandler);
        }
    };

    todos.addItemKeyupHandler = function(e) {
        var key = e.keyCode;
        if (key === 13) {
            todos.addItemHandler();
        }
    };

    todos.addItemHandler = function() {
        var inputData = '',
            body = {};
        // get item data
        var itemInput = document.getElementById('input-data');
        if (typeof itemInput !== 'undefined' || itemInput !== null) {
            inputData = itemInput.value;
            body.todo = inputData;
            Utility.makeXHttpRequest('http://127.0.0.1:9898/todo/tasks/create', 'POST', JSON.stringify(body)).then(
                function(response) {
                    var todoResponse = JSON.parse(response);
                    var todoItem = document.createElement('li');
                    var id_attr = document.createAttribute('data-id');
                    id_attr.value = todoResponse.id;
                    todoItem.setAttributeNode(id_attr);
                    todoItem.innerHTML = '<input type="checkbox"> ' + todoResponse.todo;
                    var todoList = document.getElementById('todo-items');
                    todoList.appendChild(todoItem);
                    itemInput.value = '';
                }, function(error) {
                    Utility.logError(error);
                }
            );
        }

    };

    todos.itemCheckedHandler = function(e) {
        e.stopPropagation();
        e.preventDefault();

        var parentLi = e.target.parentNode;
        var id = parentLi.getAttribute('data-id');
        var body = {};
        body.id = id;
        if (e.target.checked) {
            body.isComplete = 'true';
        } else {
            body.isComplete = 'false';
        }
        Utility.makeXHttpRequest('http://127.0.0.1:9898/todo/tasks/' + id + '/edit', 'POST', JSON.stringify(body)).then(
            function(response) {
                if (e.target.checked) {
                    parentLi.className = 'completed';
                } else {
                    parentLi.className = '';
                }
            }, function(error) {
                Utility.logError(error);
            }
        );
    };

    return todos;
}());
