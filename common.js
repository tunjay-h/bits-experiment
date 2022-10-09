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

  let initialLength = bits.length;
  for (let index = 0; index < bitCount - initialLength; index++) {
    bits.unshift(0); // insert at the beginning
  }

  if (isNegative) {
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

export { convertDecimalToBinary, convertDecimalToBinaryPowers };
