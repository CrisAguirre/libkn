const fs = require('fs');
const code = fs.readFileSync('c:/Users/USUARIO/Desktop/6. La Inmaculada/libkn/src/utils/seedInventario.js', 'utf8');

// We will extract the PRODUCTOS array and run validations
const match = code.match(/const PRODUCTOS = \[\s*([\s\S]*?)\];/);
if (!match) {
  console.log('No se pudo encontrar PRODUCTOS');
  process.exit(1);
}

const arrStr = '[' + match[1] + ']';
const safeArrStr = arrStr.replace(/,\s*,/g, ', null,').replace(/\[\s*,/g, '[null,').replace(/,\s*\]/g, ', null]');
let productos = [];
try {
  productos = eval(safeArrStr);
} catch (e) {
  console.log('Error parsing array:', e.message);
}

let errors = [];
let categories = new Set();
let suppliers = new Set();

productos.forEach((p, i) => {
  if (!Array.isArray(p)) return;
  const [name, cat, sup, buy, sell, stock, minStock] = p;
  categories.add(cat);
  suppliers.add(sup);
  
  if (name === '' || name === null || name === undefined) {
     errors.push(`Fila ${i+1}: Nombre vacío (categoría ${cat}, proveedor ${sup})`);
  }
  if (!cat) errors.push(`Fila ${i+1} (${name}): Falta categoría`);
  if (!sup) errors.push(`Fila ${i+1} (${name}): Falta proveedor`);
  
});

console.log('Total productos:', productos.filter(p=>Array.isArray(p)).length);
console.log('Categorías usadas:', Array.from(categories));
console.log('Proveedores usados:', Array.from(suppliers));
if (errors.length > 0) {
  console.log('\nPosibles errores encontrados:');
  errors.forEach(e => console.log(e));
} else {
  console.log('\nNo se encontraron errores graves en los datos.');
}
