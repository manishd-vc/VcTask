"use strict";


const getMinInput = document.querySelector("#minimumNumber");
const getMaxInput = document.querySelector("#maximumNumber");
const getAllInput = document.querySelector("input");
let passedNumber = [];
const renderHtml = document.querySelector("#result");

function ResetValue() {
  passedNumber = [];
  getMinInput.value = "",
    getMaxInput.value = "",
    renderHtml.innerHTML = ""
}

getAllInput.addEventListener('input', function () {
  passedNumber = [];
});

const minimumValue = function () {
  if (getMinInput.value === "") {
    alert("Please enter minimum number");
    return false;
  } else {
    return getMinInput.value;
  }
};

const maximumValue = function () {
  if (getMaxInput.value === "") {
    alert("Please enter maximum number");
    return false;
  } else {
    return getMaxInput.value;
  }
}


function GenerateNumber() {
  if (minimumValue() === false || maximumValue() === false) {
    return false;
  } else {
    const min = Math.ceil(minimumValue());
    const max = Math.ceil(maximumValue());
    const finalValue = Math.floor(Math.random() * (max - min)) + min;
    console.log("finalValue", finalValue);
    if (finalValue !== min && finalValue !== max && !passedNumber.includes(finalValue)) {
      console.log("passedNumber", passedNumber);
      renderHtml.innerHTML = finalValue;
      passedNumber.push(finalValue);
    }
  }
}









// function getMinimumValue() {
//   let getInput = document.querySelector("#minimumNumber");
//   if (getInput.value === "") {
//     alert("Please enter minimum number");
//     return false;
//   } else {
//     minimumValue = getInput.value;
//   }
// }

// function getMaximumValue() {
//   let getInput = document.querySelector("#maximumNumber");
//   if (getInput.value === "") {
//     alert("Please enter maximum number");
//     return false;
//   } else {
//     maximumValue = getInput.value;
//   }
// }
