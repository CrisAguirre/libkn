const fs = require('fs');
let code = fs.readFileSync('c:/Users/USUARIO/Desktop/6. La Inmaculada/libkn/src/utils/seedInventario.js', 'utf8');

// Replace '5' -> '05' and '9' -> '09' in the PRODUCTOS array
// The format is like ['Name', 'CAT', '5', ...]
code = code.replace(/, '5', /g, ", '05', ");
code = code.replace(/, '9', /g, ", '09', ");

fs.writeFileSync('c:/Users/USUARIO/Desktop/6. La Inmaculada/libkn/src/utils/seedInventario.js', code);
console.log('Supplier codes updated in seedInventario.js');
