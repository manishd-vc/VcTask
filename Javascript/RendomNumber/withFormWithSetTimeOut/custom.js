"use strict";

const getMinInput = document.querySelector("#minimumNumber");
const getMaxInput = document.querySelector("#maximumNumber");
let min = "";
let max = "";
let passedNumber = [];
const renderHtml = document.querySelector("#result");
let generateStepByStep;

function ResetValue() {
  passedNumber = [];
  renderHtml.innerHTML = ""
}

function GenerateNumber() {
  min = Math.ceil(getMinInput.value);
  max = Math.ceil(getMaxInput.value);
  const finalValue = Math.floor(Math.random() * (max - min)) + min;
  if (finalValue !== min && !passedNumber.includes(finalValue)) {
    passedNumber.push(finalValue);
    renderHtml.innerHTML = passedNumber;
  }
  const index = (max - min) - 1;
  if (passedNumber.length === index) {
    clearInterval(generateStepByStep);
    alert("all Done");
  }
}



function GenerateArray(event) {
  event.preventDefault();
  generateStepByStep = setInterval(function () {
    GenerateNumber();
  }, 100);
}