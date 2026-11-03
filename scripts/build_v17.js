const fs = require('fs');
const path = require('path');

const srcBundle = path.join(__dirname, '..', 'www', 'assets', 'index-v16.js');
const dstBundle = path.join(__dirname, '..', 'www', 'assets', 'index-v17.js');

let code = fs.readFileSync(srcBundle, 'utf8');

// 1. Reset Treasury to 0
// Replace default treasury 65,000 -> 0
code = code.replace(
  'kaamzo_admin_treasury_v8");return K?Number(K):65e3',
  'kaamzo_admin_treasury_v8");return K!==null?Number(K):0'
);

// Replace default subscription revenue 45,000 -> 0
code = code.replace(
  'kaamzo_admin_sub_rev_v8");return K?Number(K):45e3',
  'kaamzo_admin_sub_rev_v8");return K!==null?Number(K):0'
);

// Replace default disbursements 18,500 -> 0
code = code.replace(
  'kaamzo_admin_disbursed_v8");return K?Number(K):18500',
  'kaamzo_admin_disbursed_v8");return K!==null?Number(K):0'
);

fs.writeFileSync(dstBundle, code, 'utf8');
console.log('Successfully written index-v17.js (' + code.length + ' bytes)');
