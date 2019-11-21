import * as glasses_id from './main.js';

function info(str) {
 document.getElementById('info').innerText = str;
}

let inputs = Array.from(document.querySelectorAll('#layers input'));
let codeinput = document.querySelector('#code input');
let ignoreHashChange = false;

function encode() {
 let inputs = Array.from( document.querySelectorAll('#layers input') );
 let incomplete = inputs.some(i => isNaN(parseInt(i.value)) );
 if (incomplete) {
   info('layers incomplete');
   return;
 }
 let arr = inputs.map( i => parseInt(i.value) );
 let id = glasses_id.encode(arr);
 if (id === false) {
   info("Encode Error");
 } else {
   codeinput.value = id;
   ignoreHashChange = true; // next line triggers onhashchange, set a flag so we can ignore it
   location.hash = id;
   info("Encode OK");
 }
}

function decode() {
 let layers = glasses_id.decode(codeinput.value);
 if (layers === false) {
   info("Decode Error");
 } else {
   for (let [i, input] of inputs.entries()) {
     input.value = layers[i];
   }
   info('Decode OK');
 }
}

for (let i of inputs) {
 i.addEventListener('change', encode);
}
code.addEventListener('change', decode);



// Check for #fragment in url

function loadFromHash(e) {
 if (ignoreHashChange) {
   ignoreHashChange = false;
   return;
 }
 let code = location.hash.slice(1);
 if (code) {
   let layers = glasses_id.decode(code);
   if (layers === false) {
     info("Decode (from URL) Error");
   } else {
     for (let [i, input] of inputs.entries()) {
       input.value = layers[i];
     }
     codeinput.value = code;
     info('Decode (from URL) OK');
   }
 }
}
document.addEventListener('DOMContentLoaded', loadFromHash);
window.addEventListener('hashchange', loadFromHash);
