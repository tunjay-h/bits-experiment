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
  return `<div style='min-width: 3rem; height: 3rem; border: 1px solid #008eff; border-radius: 10px; margin: 2px 2px;'>${number}</div>`;
};

// pure
const numbersOf2Component = (numbers) => {
  let divBody = "";
  numbers.map((elem, index) => {
    divBody += numberBoxComponent(elem);
  });
  return `<div style='display: flex; padding: 10px;'>${divBody}</div>`;
};

// pure
const bitBoxComponent = (number, divStyle) => {
  return `<div ${divStyle}><input type='number' placeholder='0' style='width: 30px; height: 30px;' value='${number}' disabled /></div>`;
};

// pure
const pairBitBoxComponent = (first, second, bitOperator) => {
  let bitResult = 0;
  switch (bitOperator) {
    case "&":
      bitResult = first & second;
      break;
    case "|":
      bitResult = first | second;
      break;
    case "^":
      bitResult = first ^ second;
      break;
    default:
      break;
  }
  return `<div>
              ${bitBoxComponent(first)} 
              <div style=" display: flex; justify-content: center; align-items: center; height: 30px; font-weight: bold;">${bitOperator}</div> 
              ${bitBoxComponent(second)}
              <div style=" display: flex; justify-content: center; align-items: center; height: 30px; ">=</div> 
              ${bitBoxComponent(bitResult, `style="background-color: #98ff98;"`)}
            </div>`;
};

// pure
const allBitBoxesComponent = (firstNumBits, secondNumBits, bitOperator) => {
  let divBody = "";
  firstNumBits.map((elem, index) => {
    if (index % 8 === 0) {
      divBody += `<div style='width: 30px; height: 30px;'></div>`;
    }
    divBody += pairBitBoxComponent(elem, secondNumBits[index], bitOperator);
  });
  return `<div style='display: flex;'>${divBody}</div>`;
};

// after document onload
(() => {
  const firstNumber = document.getElementById("firstNumber");
  const sumAsPowersOf2_first = document.getElementById("sumAsPowersOf2_first");
  const secondNumber = document.getElementById("secondNumber");
  const sumAsPowersOf2_second = document.getElementById(
    "sumAsPowersOf2_second"
  );

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

  const renderAllBitBoxes = (firstNum, secondNum, boxCount, bitOperator) => {
    let firstNumBits = convertDecimalToBinary(firstNum, boxCount); //  1 0 1 0 0
    let secondNumBits = convertDecimalToBinary(secondNum, boxCount); //   1 0 0

    // padding first number bits
    if (firstNumBits.length <= boxCount) {
      let initialLength = firstNumBits.length;
      for (let index = 0; index < boxCount - initialLength; index++) {
        firstNumBits.unshift(0); // insert at the beginning
      }
    } else {
      firstNumBits.splice(0, firstNumBits.length - boxCount); // remove from beginning
    }

    // padding second number bits
    if (secondNumBits.length <= boxCount) {
      let initialLength = secondNumBits.length;
      for (let index = 0; index < boxCount - initialLength; index++) {
        secondNumBits.unshift(0); // insert at the beginning
      }
    } else {
      secondNumBits.splice(0, secondNumBits.length - boxCount); // remove from beginning
    }

    let renderBitBoxes = allBitBoxesComponent(firstNumBits, secondNumBits, bitOperator);

    return renderBitBoxes;
  };

  // update bit boxes
  firstNumber.addEventListener("input", (event) => {
    // firstNumber.value
    if (event.target.value) {
      let bitCount = numberOfBoxes.value; // 8-bit  =>  0 0 0 1 0 1 0 0

      let renderBitBoxes = renderAllBitBoxes(
        event.target.value,
        secondNumber.value,
        bitCount,
        document.querySelector('input[name="operator"]:checked').value
      );

      document.getElementById("bitBoxes").innerHTML = renderBitBoxes;
    } else {
      document.getElementById("bitBoxes").innerHTML = "";
    }
  });

  // update bit boxes
  secondNumber.addEventListener("input", (event) => {
    // secondNumber.value
    if (event.target.value) {
      let bitCount = numberOfBoxes.value; // 8-bit  =>  0 0 0 1 0 1 0 0

      let renderBitBoxes = renderAllBitBoxes(
        firstNumber.value,
        event.target.value,
        bitCount,
        document.querySelector('input[name="operator"]:checked').value
      );

      document.getElementById("bitBoxes").innerHTML = renderBitBoxes;
    } else {
      document.getElementById("bitBoxes").innerHTML = "";
    }
  });

  // update all results based on bit count
  numberOfBoxes.addEventListener("change", (event) => {
    let bitCount = event.target.value;

    sumAsPowersOf2_first.innerText = `= ${[
      ...convertDecimalToBinaryPowers(firstNumber.value, bitCount),
    ].join(" + ")}`;

    sumAsPowersOf2_second.innerText = `= ${[
      ...convertDecimalToBinaryPowers(secondNumber.value, bitCount),
    ].join(" + ")}`;

    let [renderResult, renderIndices] = renderNumbersOf2(
      firstNumber.value,
      bitCount
    );
    document.getElementById("result_first").innerHTML =
      renderResult + renderIndices;

    [renderResult, renderIndices] = renderNumbersOf2(
      secondNumber.value,
      bitCount
    );
    document.getElementById("result_second").innerHTML =
      renderResult + renderIndices;

    let renderBitBoxes = renderAllBitBoxes(
      firstNumber.value,
      secondNumber.value,
      bitCount,
      document.querySelector('input[name="operator"]:checked').value
    );
    document.getElementById("bitBoxes").innerHTML = renderBitBoxes;
  });

  // update results based on operator
  document.querySelectorAll('input[name="operator"]').forEach((radioButton) => {
    radioButton.addEventListener("change", function(event) {
      let bitOperator = event.target.value;

      let renderBitBoxes = renderAllBitBoxes(
        firstNumber.value,
        secondNumber.value,
        numberOfBoxes.value,
        bitOperator
      );
      document.getElementById("bitBoxes").innerHTML = renderBitBoxes;
    });
  });

})();
