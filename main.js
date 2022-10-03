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
    return bits.map(elem => (elem + 1) % 2); // map(elem => elem ^ 1) // xor
  }
  return bits;
}

function convertDecimalToBinaryPowers(number, bitCount) {
  let counter = 0;
  let powersOf2 = [];

  while (1 << counter <= Math.abs(number) || (counter + 1) <= bitCount) {
    powersOf2.push(number & (1 << counter));
    counter++;
  }

  return powersOf2.reverse();
}

const numberBoxComponent = (number) => {
    // let div = document.createElement("div");
    return `<div style='min-width: 3rem; height: 3rem; border: 1px solid black; border-radius: 0.25rem; margin: 2px 2px;'>${number}</div>`;
};

const numbersOf2Component = (numbers) => {
    let divBody = '';
    numbers.map((elem, index) => {
        divBody += numberBoxComponent(elem);
    });
    return `<div style='display: flex;'>${divBody}</div>`;
};

const bitBoxComponent = (number) => {
  return `<div><input type='number' placeholder='0' style='width: 30px; height: 30px;' value='${number}' /></div>`;
};

const allBitBoxesComponent = (numbers) => {
  let divBody = '';
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
    const resultInPowersOf2 = document.getElementById("resultInPowersOf2");

    firstNumber.addEventListener('input', (event) => {
        // firstNumber.value
        if (event.target.value) {
            let bitCount = document.getElementById("numberOfBoxes").value; // 8-bit
            resultInPowersOf2.innerText = `= ${[...convertDecimalToBinaryPowers(event.target.value, bitCount)].join(" + ")}`;

            let data = convertDecimalToBinaryPowers(event.target.value, bitCount); // 16 0 4 0 0
            let renderResult = numbersOf2Component(data);                

            let indices = Array.from(data.keys()).reverse();                       // 0 1 2 3 4  =>  4 3 2 1 0
            indices = indices.map(elem => `2<sup>${elem}</sup>`);        // 2^0  2^1  2^2  2^3 ....
            let renderIndices = numbersOf2Component(indices);

            document.getElementById("result").innerHTML = renderResult + renderIndices;
        } else {
            resultInPowersOf2.innerText = "";
            document.getElementById("result").innerHTML = "";
        }
    });

    firstNumber.addEventListener('input', (event) => {
      // firstNumber.value
      if (event.target.value) {
        let bitCount = document.getElementById("numberOfBoxes").value; // 8-bit  =>  0 0 0 1 0 1 0 0
        let data = convertDecimalToBinary(event.target.value, bitCount); //  1 0 1 0 0

        if (data.length <= bitCount) {
          let initialLength = data.length;
          for (let index = 0; index < bitCount - initialLength; index++) {
            data.unshift(0); // insert at the beginning 
          }
        } else {
          data.splice(0, data.length - bitCount); // remove from beginning
        }
        let renderBitBoxes = allBitBoxesComponent(data);

        document.getElementById("bitBoxes").innerHTML = renderBitBoxes;
      } else {
          document.getElementById("bitBoxes").innerHTML = "";
      }
  });
    
})();
