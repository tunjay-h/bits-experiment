import {
  convertDecimalToBinary,
} from "../common.js";

const bitBoxComponent = (number, divStyle) => {
  return `<div ${divStyle}><input type='number' placeholder='0' style='width: 30px; height: 30px;' value='${number}' disabled /></div>`;
};

const operationStringComponent = (str) => {
  return `<div>${str}</div>`;
};

const resultInBitsComponent = (bits) => {
  let divBody = "";
  bits.map((elem, index) => {
    if (index % 8 === 0) {
        divBody += `<div style='width: 30px; height: 30px;'></div>`;
      }
    divBody += `${bitBoxComponent(elem)}`;
  });

  return `<div style="display: flex;">${divBody}</div>`;
};

(() => {
  const number = document.getElementById("number");
  const places = document.getElementById("places");
  const numberOfBoxes = document.getElementById("numberOfBoxes");

  const operationStringsDiv = document.getElementById("operationStrings");
  const resultBitsDiv = document.getElementById("resultBits");

  const renderResults = (num, shiftBy, bitCount) => {
    operationStringsDiv.innerHTML = "";
    resultBitsDiv.innerHTML = "";
    
    if (num) {
      let numBits = convertDecimalToBinary(num, bitCount);
      let leftShiftResultBits = convertDecimalToBinary(
        num << shiftBy,
        bitCount
      );
      let signedRightShiftResultBits = convertDecimalToBinary(
        num >> shiftBy,
        bitCount
      );
      let unsignedRightShiftResultBits = convertDecimalToBinary(
        num >>> shiftBy,
        bitCount
      );

      operationStringsDiv.innerHTML += operationStringComponent(num);
      resultBitsDiv.innerHTML += resultInBitsComponent(numBits);

      operationStringsDiv.innerHTML += operationStringComponent(
        `${num} << ${shiftBy} = ${num << shiftBy}`
      );
      resultBitsDiv.innerHTML += resultInBitsComponent(leftShiftResultBits);

      operationStringsDiv.innerHTML += operationStringComponent(
        `${num} >> ${shiftBy} = ${num >> shiftBy}`
      );
      resultBitsDiv.innerHTML += resultInBitsComponent(
        signedRightShiftResultBits
      );

      operationStringsDiv.innerHTML += operationStringComponent(
        `${num} >>> ${shiftBy} = ${num >>> shiftBy}`
      );
      resultBitsDiv.innerHTML += resultInBitsComponent(
        unsignedRightShiftResultBits
      );
    }
  };

  number.addEventListener('input', (event) => {
    renderResults(event.target.value, places.value, numberOfBoxes.value);
  });

  places.addEventListener('input', (event) => {
    renderResults(number.value, event.target.value, numberOfBoxes.value);
  });

})();
