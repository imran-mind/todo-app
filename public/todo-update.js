// 2 aug 2019
// open to in-progress
// in-progress to completed
// server deployemnt on heroku

let openList = document.getElementById('open-items');
let inprogressList = document.getElementById('inprogress-items');
let completedList = document.getElementById('completed-items');

let openToInBtn = document.getElementById('open-to-in');
let inProgToCompBtn = document.getElementById('in-to-complete');

openToInBtn.addEventListener('click', convertOpenToInProgress);
inProgToCompBtn.addEventListener('click', convertInProgressToComp);

document.addEventListener('keyup', handleTodoInput);
let todoList = [];
let openListChecked = new Set();
let inProgressListChecked = new Set();
let id = 0;

function handleTodoInput(e) {
    if (e.key === 'Enter') {
        let todoObj = {
            id: id,
            taskName: e.target.value.trim(),
            status: 'OPEN',
            checked: false
        }
        createTodoList(todoObj, openList);
        // id++;
        console.log(e.target.value);
        e.target.value = '';
    }
}

function createTodoList(element, sectionType) {
    console.log(element, sectionType);
    let todoDiv = `
        <li id=${element.id}>
            <input type='checkbox' id=${element.id}>
            <p class = "text terms-checkbox"> ${element.taskName} </p>
        </li>`;

    if (element.taskName) {
        sectionType.insertAdjacentHTML('afterbegin', todoDiv);
        todoList.push(element);
        console.log('--> using local store ', todoList)
        setLocalStorag(todoList);
        id= id +1;
    }
}

function convertOpenToInProgress(e) {
    let openTaskIds = Array.from(openListChecked);
    convertTask(openTaskIds, 'IN_PROGRESS', inprogressList);
}

function convertTask(list, status, listType){
    if (list) {
        list.forEach((item) => {
            console.log('-. getLocalStorage()', getLocalStorage(), item)
            let foundObj = _.find(getLocalStorage(), {
                id: Number(item)
            });
            console.log('foundObj ', foundObj);
            console.log(' incremental ',getLocalStorage().length + 1)
            // id = id + 1;
            if (foundObj) {
                foundObj.id = id;
                foundObj.status = status;
                deleteItem(item, foundObj, listType);
            }
        });
    }
}

function convertInProgressToComp(e) {
    let inProgTaskIds = Array.from(inProgressListChecked);
    convertTask(inProgTaskIds, 'COMPLETED', completedList);
}

let filterList = todoList;

function deleteItem(id, obj, listType) {
    let element = document.getElementById(id);
    console.log(element.parentNode.removeChild(element))
    console.log(filterList);
    let newArr = todoList.filter((n) =>{
        return n.id != id;
    })
    console.log('newArr ', newArr);
    setLocalStorag(newArr);
    todoList = getLocalStorage();
    openListChecked.delete(id);
    createTodoList(obj, listType);
}

function checkedOpenItems(element) {
    if (element.checked) {
        openListChecked.add(element.id);
    } else {
        openListChecked.delete(element.id);
    }
    console.log('openListChecked => ',openListChecked);
}

function checkedInProgressItems(element) {
    if (element.checked) {
        inProgressListChecked.add(element.id);
    } else {
        inProgressListChecked.delete(element.id);
    }
    console.log('checkedInProgressItems => ',inProgressListChecked);
}


openList.addEventListener('click', function (event) {
    let element = event;
    checkedOpenItems(element.target);
});

inprogressList.addEventListener('click',function(event){
    let elem = event;
    checkedInProgressItems(elem.target);
})


function reloadData() {
    let todoList = getLocalStorage();
    console.log('todoList => ', todoList)
    if (todoList && todoList.length) {
        for (let i = 0, len = todoList.length; i < len; i++) {
            if (todoList[i].status === 'OPEN') {
                createTodoList(todoList[i], openList);
            } else if (todoList[i].status === 'IN_PROGRESS') {
                createTodoList(todoList[i], inprogressList);
            } else {
                createTodoList(todoList[i],completedList);
            }
        }
        id = todoList.length + 1;
    } else {
        id = 0;
    }
}


function setLocalStorag(todoTasks) {
    localStorage.setItem('todoList', JSON.stringify(todoTasks));
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem('todoList'));
}

console.log(' Latest id ', id);
window.onload = reloadData();