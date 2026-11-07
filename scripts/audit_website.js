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
    const hasV24 = content.includes('index-v24.js');
    console.log(`   -> Points to index-v24.js: ${hasV24}`);
  }
});

console.log('\n=== 4. BUNDLE AUDIT (index-v24.js) ===');
const bundlePath = path.join(wwwDir, 'assets', 'index-v24.js');
if (fs.existsSync(bundlePath)) {
  const code = fs.readFileSync(bundlePath, 'utf8');
  console.log('Bundle size:', code.length, 'bytes');
  console.log('Has audio button in header?:', code.includes('kaamzo-header-audio-btn'));
  console.log('Has "Snap Real Location" card in hero?:', code.includes('Snap Real Location'));
  console.log('Has "Find Work." hero headline?:', code.includes('Find Work.'));
  console.log('Has "Hire Help." hero headline?:', code.includes('Hire Help.'));
  console.log('Has "Kaamzo." hero headline?:', code.includes('Kaamzo.'));
  console.log('Has real Firebase OAuth project (nifty-backup-mc9s2)?:', code.includes('nifty-backup-mc9s2.firebaseapp.com'));
  console.log('Has Google Account Chooser prompt:"select_account"?:', code.includes('prompt:"select_account"'));
  console.log('Has default names removed from forms?:', !code.includes('e.g. Bhavnoor Singh') && !code.includes('e.g. Harpreet Singh') && !code.includes('e.g. bhavnoor') && !code.includes('bhavnoor.verma@okhdfcbank'));
  console.log('Has Customer & Worker Fe opening OTP modal (Hs(!0) / oa(!0))?:', code.includes('Please enter your Gmail address or phone number for OTP verification");return}Hs(!0)}') && code.includes('Please enter your Gmail address or mobile number for OTP verification.");return}oa(!0)}'));
  console.log('Has Admin complete worker dossier & Face ID modal?:', code.includes('Worker KYC, Full Identity Dossier & Face ID Verification Queue') && code.includes('Inspect Full Face ID'));
  console.log('Has instant Worker Portal unlock on Admin verification?:', code.includes('kaamzo_kyc_approved_signal_v8') && code.includes('prevVerifiedRef.current=e==null?void 0:e.isVerified'));
  console.log('Zero GSI initTokenClient (origin_mismatch) calls?:', !code.includes('initTokenClient') && !code.includes('google.accounts.oauth2'));
} else {
  console.error('index-v24.js is MISSING!');
}
