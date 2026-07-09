const fs = require('fs');
let c = fs.readFileSync('./src/data/mockProducts.js', 'utf8');
c = c.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('./src/data/mockProducts.js', c);
