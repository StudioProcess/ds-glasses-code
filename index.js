import './node_modules/seedrandom/seedrandom.js'; // adds Math.seedrandom

const SALT = 'ds-glasses-app-2019';
const ALPHABET = 'ABCDEFGHIJKLMNPQRSTUVWXYZ1234567890'; // no big O
const INPUT_BASE = 100;

let alphabet = ALPHABET; // shuffled alphabet (according to salt)


function shuffleArray(array, random = Math.random) {
  let m = array.length;
  let t;
  let i;
  while (m) {
    i = Math.floor(random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function seed(salt) {
  const rng = new Math.seedrandom(salt);
  alphabet = shuffleArray(alphabet.split(''), rng).join('');
}

(function init() {
  seed(SALT);
})();

// convert number system
function cns(fromBase, toBase, inputArray) {

  // var hash = "",
  //   alphabet = "0123456789abcdef",
  //   alphabetLength = alphabet.length;
  // 
  // do {
  //   hash = alphabet[input % alphabetLength] + hash;
  //   input = parseInt(input / alphabetLength, 10);
  // } while (input);
  // 
  // convert input to a proper js integer (ie. decimal)
  let input = BigInt(0);
  // let exp = 1;
  // console.log(inputArray);
  for (let [i, el] of inputArray.entries()) {
    input += ( BigInt(fromBase) ** BigInt(inputArray.length - i - 1) ) * BigInt(el);
  }
  // console.log(input);
  
  let outputArray = [];
  toBase = BigInt(toBase);
  
  do {
    outputArray.unshift( Number(input % toBase) ); // push from the left
    
    // console.log(input % toBase, input / toBase)
    // console.log(input / toBase)
    // input = parseInt(input / toBase, 10);
    input = input / toBase
  } while (input);
  // console.log(outputArray);
  return outputArray;
}

// cns(100, 36, [1, 2, 3, 4, 5,]);




// make groups of 4 or 3, whichever makes longer last section
function add_dashes(str) {
  let mod4 = str.length % 4;
  let mod3 = str.length % 3;
  if (mod4 == 0 || (mod3 > 0 && mod4 > mod3)) {
    return str.match(/.{1,4}/g).join('-');
  }
  return str.match(/.{1,3}/g).join('-');
}

// checksum = (sum of digits) mod (INPUT_BASE-1) + 1
// range of checksum: [1..INPUT_BASE-1]
// cheksum is added at first position and can't be zero
function checksum(arr) {
  return arr.reduce((acc, x) => acc + x, 0) % (INPUT_BASE-1) + 1;
}

function encode2(arr) {
  // check digits
  for (let d of arr) {
    if (d < 0 || d > INPUT_BASE-1) {
      console.warn(`Digit out of range [0-${INPUT_BASE-1}]:`, d);
      return false;
    }
  }
  // console.log( checksum(arr) );
  arr = arr.slice(); // copy input
  arr.unshift(checksum(arr)); // add checksum

  let enc = cns(INPUT_BASE, alphabet.length, arr);
  let str = enc.map(x => alphabet[x]).join('');
  str = add_dashes(str);
  return str;
}

function hasLowerCase(str) {
  return (/[a-z]/.test(str));
}

function decode2(str) {
  str = str.replace(/-/g, ''); // remove dashes
  if (!hasLowerCase(alphabet)) {  // uppercase (only if alphabet is fully upper case)
    str = str.toUpperCase();
  }
  str = str.replace(/O/, '0'); // replace accidental o's with zeros
  let arr = str.split('').map(x => alphabet.indexOf(x));
  arr = cns(alphabet.length, INPUT_BASE, arr);
  let checkdigit = arr.shift();
  if (checkdigit !== checksum(arr)) {
    console.warn('Checksum mismatch');
    return false;
  }
  return arr;
}

// let c2;
// c2 = encode2([0, 1, 2, 3, 4]);
// console.log( c2 );
// console.log( decode2(c2) );

export {
  encode2 as encode,
  decode2 as decode,
  seed
};
