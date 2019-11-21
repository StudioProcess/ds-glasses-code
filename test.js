import {encode, decode} from './main.js';

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
const BASE = 25;

let c = 0;
let errors = 0;
// exhaustive test of 5 digits
for (let i = 0; i<BASE; i++) {
  for (let j = 0; j<BASE; j++) {
    for (let k = 0; k<BASE; k++) {
      for (let l = 0; l<BASE; l++) {
        for (let m = 0; m<BASE; m++) {
          c++;
          let input = [i, j, k, l, m];
          let enc = encode(input);
          let output = decode(enc);
          if (c % 100000 === 0) console.log(`(${c}) Checking`, JSON.stringify(input));
          let test = input.equals(output);
          if (!test) errors++;
          console.assert(test, 'input', JSON.stringify(input), 'output', JSON.stringify(output));
        }
      }
    }
  }
}
console.log('DONE');
console.log('ERRORS', errors);
