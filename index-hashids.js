import Hashids from './node_modules/hashids/esm/index.js';

// console.log(Hashids);
const SALT = 'ds-glasses-app-2019';
const LENGTH = 0;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const hashids = new Hashids(SALT, LENGTH, ALPHABET);


console.log( hashids.encode([99,99,99,99,99]) );
console.log( hashids.encode(99002003004005) );
console.log( hashids.encodeHex('1122334455') );


function encode(arr) {
  // TODO: check 5 items in array, range 0-255
  let hex = arr.reduce((acc, val) => {
    return acc += val.toString(16).padStart(2, '0');
  }, '');
  // console.log(hex)
  let enc = hashids.encodeHex(hex); // 10 
  // console.log(enc);
  enc = enc.match(/.{1,4}/g).join('-');
  // return [enc.slice(0, 4), enc.slice(4,8), enc.slice(8)].join('-');
  return enc;
  
}

function decode(str) {
  str = str.replace(/-/g, '');
  let dec = hashids.decodeHex(str);
  dec = dec.match(/.{1,2}/g); // split into 2 character sequences
  dec = dec.map(val => parseInt(val,16));
  return dec;
}


let c;

c = encode([255,255,255,255,255]);
console.log( c );
console.log( decode(c) );

c = encode([0,0,0,0,0]);
console.log( c );
console.log( decode(c) );

c = encode([1,2,3,4,5]);
console.log( c );
console.log( decode(c) );

c = encode([1,2,3,4,5,6,7]);
console.log( c );
console.log( decode(c) );

c = encode([1,2]);
console.log( c );
console.log( decode(c) );

console.log( '------' );


function toHex(input) {

  var hash = "",
    alphabet = "0123456789abcdef",
    alphabetLength = alphabet.length;

  do {
    hash = alphabet[input % alphabetLength] + hash;
    input = parseInt(input / alphabetLength, 10);
  } while (input);

  return hash;

}

console.log( toHex(123443) );
