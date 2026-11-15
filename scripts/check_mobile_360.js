const fs = require('fs');
const js = fs.readFileSync('www/assets/index-v29.js', 'utf8');

const target = js.lastIndexOf('function', 2572920);
console.log(js.slice(target - 50, target + 1500));
