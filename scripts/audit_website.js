const fs = require('fs');
const path = require('path');
const vm = require('vm');

const wwwDir = path.join(__dirname, '..', 'www');
const indexHtml = fs.readFileSync(path.join(wwwDir, 'index.html'), 'utf8');

console.log('=== 1. HTML AUDIT ===');
console.log('index.html size:', indexHtml.length, 'bytes');

const scriptTags = indexHtml.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log('Total script tags:', scriptTags.length);

scriptTags.forEach((tag, idx) => {
  const isExternal = /src=["'][^"']+["']/.test(tag);
  if (isExternal) {
    const srcMatch = tag.match(/src=["']([^"']+)["']/);
    const src = srcMatch ? srcMatch[1] : 'unknown';
    console.log(`[Script ${idx + 1}] External: ${src}`);
    if (src.startsWith('/assets/')) {
      const localFile = path.join(wwwDir, src.replace(/^\//, ''));
      const exists = fs.existsSync(localFile);
      console.log(`   -> File exists on disk: ${exists} (${exists ? fs.statSync(localFile).size + ' bytes' : 'MISSING'})`);
    }
  } else {
    // Check if JSON-LD
    if (/type=["']application\/ld\+json["']/.test(tag)) {
      const content = tag.replace(/<script[^>]*>|<\/script>/gi, '').trim();
      try {
        JSON.parse(content);
        console.log(`[Script ${idx + 1}] JSON-LD Schema: VALID JSON`);
      } catch (e) {
        console.error(`[Script ${idx + 1}] JSON-LD Schema: ERROR`, e.message);
      }
    } else {
      const content = tag.replace(/<script[^>]*>|<\/script>/gi, '');
      try {
        new vm.Script(content);
        console.log(`[Script ${idx + 1}] Inline JS: 100% VALID`);
      } catch (e) {
        console.error(`[Script ${idx + 1}] Inline JS ERROR:`, e.message);
      }
    }
  }
});

console.log('\n=== 2. ASSETS & LINKS AUDIT ===');
const linkTags = indexHtml.match(/<link[^>]+>/gi) || [];
linkTags.forEach(link => {
  const hrefMatch = link.match(/href=["']([^"']+)["']/);
  if (hrefMatch) {
    const href = hrefMatch[1];
    if (href.startsWith('/') && !href.startsWith('//')) {
      const localFile = path.join(wwwDir, href.replace(/^\//, ''));
      const exists = fs.existsSync(localFile);
      console.log(`[Link] ${href}: ${exists ? 'EXISTS (' + fs.statSync(localFile).size + 'B)' : 'MISSING'}`);
    }
  }
});

console.log('\n=== 3. ROUTE SHIMS AUDIT ===');
const routes = ['admin', 'worker', 'customer', 'pitch'];
routes.forEach(r => {
  const file = path.join(wwwDir, `${r}.html`);
  const dirFile = path.join(wwwDir, r, 'index.html');
  const fileExists = fs.existsSync(file);
  const dirExists = fs.existsSync(dirFile);
  console.log(`Route /${r}: ${r}.html (${fileExists ? 'OK' : 'MISSING'}), /${r}/index.html (${dirExists ? 'OK' : 'MISSING'})`);
  if (fileExists) {
    const content = fs.readFileSync(file, 'utf8');
    const hasV19 = content.includes('index-v19.js');
    console.log(`   -> Points to index-v19.js: ${hasV19}`);
  }
});

console.log('\n=== 4. BUNDLE AUDIT (index-v19.js) ===');
const bundlePath = path.join(wwwDir, 'assets', 'index-v19.js');
if (fs.existsSync(bundlePath)) {
  const code = fs.readFileSync(bundlePath, 'utf8');
  console.log('Bundle size:', code.length, 'bytes');
  console.log('Has audio button in header?:', code.includes('kaamzo-header-audio-btn'));
  console.log('Has "Snap Real Location" card in hero?:', code.includes('Snap Real Location'));
  console.log('Has "Find Work." hero headline?:', code.includes('Find Work.'));
  console.log('Has "Hire Help." hero headline?:', code.includes('Hire Help.'));
  console.log('Has "Kaamzo." hero headline?:', code.includes('Kaamzo.'));
  console.log('Has Treasury 0 reset?:', code.includes('kaamzo_admin_treasury_v8'));
  console.log('Has Admin Customer Ledger?:', code.includes('Customer Accounts & Transaction Ledger'));
  console.log('Has Admin Worker Ledger?:', code.includes('Worker Directory, Earnings & Commissions'));
} else {
  console.error('index-v19.js is MISSING!');
}
