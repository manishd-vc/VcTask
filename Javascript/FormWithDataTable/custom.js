"use strict";


let userList = [
  { id: 1680591835426, firstName: 'manish23', lastName: 'detroja', role: 'developer' },
  { id: 1680591834363, firstName: 'manish2', lastName: 'detroja', role: 'developer' },
  { id: 1680591832699, firstName: 'manish', lastName: 'detroja', role: 'developer' }
]

window.onload = loadData;

function GenerateCell(userData) {
  return `
  <td>${userData.id}</td>
  <td>${userData.firstName}</td>
  <td>${userData.lastName}</td>
  <td>${userData.role}</td>
  <td>
    <div class="actionButtons">
      <button class="Edit" onclick="EditUser(this)">Edit</button>
      <button class="delete" onclick="DeleteUser(this)">Delete</button>
    </div>
  </td>
  `
}



function AddDataInRow(user) {
  const tableBody = document.querySelector("#dataTable tbody");
  const createRow = document.createElement("tr");
  createRow.innerHTML = GenerateCell(user);
  tableBody.insertBefore(createRow, tableBody.children[0]);
}


function loadData() {
  if (userList) {
    userList.forEach(list => AddDataInRow(list))
  }
}


function AddNewUser() {
  const fNameInput = document.querySelector("#firstNameInput");
  const lNameInput = document.querySelector("#lastNameInput");
  const roleInput = document.querySelector("#roleInput");
  let isExist = false;
  userList.forEach(list => {
    if (fNameInput.value === list.firstName && lNameInput.value === list.lastName && roleInput.value === list.role) {
      alert("User is already exist");
      isExist = true;
    }
  })
  if (isExist) return;
  const newUser = { id: new Date().valueOf(), firstName: fNameInput.value, lastName: lNameInput.value, role: roleInput.value };
  AddDataInRow(newUser);
  userList = [newUser, ...userList];
}

function DeleteUser(target) {
  let targetId = +target.parentNode.parentNode.parentNode.children[0].innerHTML;
  target.parentNode.parentNode.parentNode.classList.add("needToRemove");
  const targetElement = document.getElementsByClassName("needToRemove")
  console.log("targetElement", targetElement);
  userList.filter(list => list.id !== targetId);
  targetElement.remove();
  loadData();
}
function EditUser() {
  alert("User is editable exist");
}

function HandleSubmit(event) {
  if (event) {
    event.preventDefault();
  }
  AddNewUser();
}