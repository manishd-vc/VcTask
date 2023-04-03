"use strict";

window.onload = LoadTasks;

function getLocalStorageTask() {
  return [...JSON.parse(localStorage.getItem("taskList"))]
}

function renderHtml(value) {
  return `
<div class="taskText">${value}</div>
<div class="editTask" onclick="EditTask(this)">edit</div>
<div class="deleteTask" onclick="DeleteTask(this)">delete</div>
`
}

function LoadTasks() {
  if (localStorage.getItem("taskList") === null) return;

  let tasks = getLocalStorageTask();
  tasks.forEach(task => {
    const listOfTask = document.querySelector("main ul");
    const singleList = document.createElement("li");

    singleList.innerHTML = renderHtml(task.name);
    listOfTask.insertBefore(singleList, listOfTask.children[0]);
  })
}


const input = document.querySelector("#inputField");
let editState = false;
let currentTask = null;

function handleSubmit(event) {
  event.preventDefault();
  addTask(currentTask);
}

function addTask(currentTask) {
  let isAvailable = false;
  if (input.value === "") {
    alert("Please enter task");
    return false;
  }

  let tasks = getLocalStorageTask();
  tasks.forEach(task => {
    if (input.value === task.name) {
      alert("Task is already mentions");
      isAvailable = true;
    }
  });
  if (isAvailable) return;

  if (editState) {
    let tasks = getLocalStorageTask();
    tasks.forEach(task => {
      if (task.name === currentTask) {
        task.name = input.value;
      }
    });
    localStorage.setItem("taskList", JSON.stringify(tasks));
    const listOfTask = document.querySelector("main ul");
    listOfTask.innerHTML = "";
    tasks.forEach(task => {

      const singleList = document.createElement("li");
      singleList.innerHTML = renderHtml(task.name);
      listOfTask.insertBefore(singleList, listOfTask.children[0]);
      input.value = "";
      editState = false;
    })
  } else {
    localStorage.setItem("taskList", JSON.stringify([...JSON.parse(localStorage.getItem("taskList") || "[]"), { name: input.value, completed: false }]));

    const listOfTask = document.querySelector("main ul");
    const singleList = document.createElement("li");
    singleList.innerHTML = renderHtml(input.value);
    listOfTask.insertBefore(singleList, listOfTask.children[0]);
    input.value = "";
  }

}
function DeleteTask(target) {
  let tasks = getLocalStorageTask();
  tasks.forEach(task => {
    if (task.name === target.parentNode.children[0].innerHTML) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("taskList", JSON.stringify(tasks));
  target.parentElement.remove();
}
function EditTask(target) {
  editState = true;
  currentTask = target.parentNode.children[0].innerHTML;
  input.value = `${currentTask}`;
  input.focus();
}