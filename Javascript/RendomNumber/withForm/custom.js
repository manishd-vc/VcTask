"use strict";


const getMinInput = document.querySelector("#minimumNumber");
const getMaxInput = document.querySelector("#maximumNumber");
let passedNumber = [];
const renderHtml = document.querySelector("#result");
console.log("renderHtml", renderHtml)

function ResetValue() {
  passedNumber = [];
  renderHtml.innerHTML = ""
}

function GenerateNumber(event) {
  event.preventDefault();
  const min = Math.ceil(getMinInput.value);
  const max = Math.ceil(getMaxInput.value);
  const finalValue = Math.floor(Math.random() * (max - min)) + min;
  if (finalValue !== min && !passedNumber.includes(finalValue)) {
    console.log("finalValue", finalValue)
    renderHtml.innerHTML = finalValue;
    passedNumber.push(finalValue);
  }
}

