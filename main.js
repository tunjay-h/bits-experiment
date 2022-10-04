// Pure function - no dom query, no dom manipulation
// same result if same inputs are passed 
function convertDecimalToBinary(number, bitCount) {
  let bits = [];
  let isNegative = number < 0;
  if (isNegative) {
    number = -1 - number;
  }

  while (number !== 0) {
    bits.push(number % 2);
    number = Math.floor(number / 2);
    // in fact, it could be below, in case of C++ family
    // number = number / 2;
  }

  bits.reverse();

  if (isNegative) {
    let initialLength = bits.length;
    for (let index = 0; index < bitCount - initialLength; index++) {
      bits.unshift(0); // insert at the beginning
    }
    return bits.map((elem) => (elem + 1) % 2); // map(elem => elem ^ 1) // xor
  }
  return bits;
}

// Pure
function convertDecimalToBinaryPowers(number, bitCount) {
  let counter = 0;
  let powersOf2 = [];

  while (1 << counter <= Math.abs(number) || counter + 1 <= bitCount) {
    powersOf2.push(number & (1 << counter));
    counter++;
  }

  return powersOf2.reverse();
}

// pure
const numberBoxComponent = (number) => {
  // let div = document.createElement("div");
  return `<div style='min-width: 3rem; height: 3rem; border: 1px solid black; border-radius: 0.25rem; margin: 2px 2px;'>${number}</div>`;
};

// pure
const numbersOf2Component = (numbers) => {
  let divBody = "";
  numbers.map((elem, index) => {
    divBody += numberBoxComponent(elem);
  });
  return `<div style='display: flex;'>${divBody}</div>`;
};

// pure
const bitBoxComponent = (number) => {
  return `<div><input type='number' placeholder='0' style='width: 30px; height: 30px;' value='${number}' /></div>`;
};

// pure
const allBitBoxesComponent = (numbers) => {
  let divBody = "";
  numbers.map((elem, index) => {
    if (index % 8 === 0) {
      divBody += `<div style='width: 30px; height: 30px;'></div>`;
    }
    divBody += bitBoxComponent(elem);
  });
  return `<div style='display: flex;'>${divBody}</div>`;
};

// after document onload
(() => {
  const firstNumber = document.getElementById("firstNumber");
  const sumAsPowersOf2_first = document.getElementById("sumAsPowersOf2_first");
  const secondNumber = document.getElementById("secondNumber");
  const sumAsPowersOf2_second = document.getElementById("sumAsPowersOf2_second");

  const numberOfBoxes = document.getElementById("numberOfBoxes");

  const renderNumbersOf2 = (number, boxCount) => {
    let data = convertDecimalToBinaryPowers(number, boxCount); // 16 0 4 0 0
    let renderResult = numbersOf2Component(data);

    let indices = Array.from(data.keys()).reverse(); // 0 1 2 3 4  =>  4 3 2 1 0
    indices = indices.map((elem) => `2<sup>${elem}</sup>`); // 2^0  2^1  2^2  2^3 ....
    let renderIndices = numbersOf2Component(indices);

    return [renderResult, renderIndices];
  };

  // update powers of 2 and numbers of 2
  firstNumber.addEventListener("input", (event) => {
    // firstNumber.value
    if (event.target.value) {
      let bitCount = numberOfBoxes.value; // 8-bit
      sumAsPowersOf2_first.innerText = `= ${[
        ...convertDecimalToBinaryPowers(event.target.value, bitCount),
      ].join(" + ")}`;

      let [renderResult, renderIndices] = renderNumbersOf2(
        event.target.value,
        bitCount
      );

      document.getElementById("result_first").innerHTML =
        renderResult + renderIndices;
    } else {
      sumAsPowersOf2_first.innerText = "";
      document.getElementById("result_first").innerHTML = "";
    }
  });

  secondNumber.addEventListener("input", (event) => {
    // firstNumber.value
    if (event.target.value) {
      let bitCount = numberOfBoxes.value; // 8-bit
      sumAsPowersOf2_second.innerText = `= ${[
        ...convertDecimalToBinaryPowers(event.target.value, bitCount),
      ].join(" + ")}`;

      let [renderResult, renderIndices] = renderNumbersOf2(
        event.target.value,
        bitCount
      );

      document.getElementById("result_second").innerHTML =
        renderResult + renderIndices;
    } else {
      sumAsPowersOf2_second.innerText = "";
      document.getElementById("result_second").innerHTML = "";
    }
  });
  

  const renderAllBitBoxes = (number, boxCount) => {
    let data = convertDecimalToBinary(number, boxCount); //  1 0 1 0 0

    if (data.length <= boxCount) {
      let initialLength = data.length;
      for (let index = 0; index < boxCount - initialLength; index++) {
        data.unshift(0); // insert at the beginning
      }
    } else {
      data.splice(0, data.length - boxCount); // remove from beginning
    }
    let renderBitBoxes = allBitBoxesComponent(data);

    return renderBitBoxes;
  };

  // update bit boxes
  firstNumber.addEventListener("input", (event) => {
    // firstNumber.value
    if (event.target.value) {
      let bitCount = numberOfBoxes.value; // 8-bit  =>  0 0 0 1 0 1 0 0

      let renderBitBoxes = renderAllBitBoxes(event.target.value, bitCount);

      document.getElementById("bitBoxes").innerHTML = renderBitBoxes;
    } else {
      document.getElementById("bitBoxes").innerHTML = "";
    }
  });

  // update all results
  numberOfBoxes.addEventListener("change", (event) => {
    let bitCount = event.target.value;
    
    sumAsPowersOf2_first.innerText = `= ${[
      ...convertDecimalToBinaryPowers(firstNumber.value, bitCount),
    ].join(" + ")}`;

    // second one todo

    let [renderResult, renderIndices] = renderNumbersOf2(
      firstNumber.value,
      bitCount
    );
    document.getElementById("result").innerHTML = renderResult + renderIndices;

    let renderBitBoxes = renderAllBitBoxes(firstNumber.value, bitCount);
    document.getElementById("bitBoxes").innerHTML = renderBitBoxes;
  });
})();
