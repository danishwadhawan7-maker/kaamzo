const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'www', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update bundle script to index-v19.js
html = html.replace('src="/assets/index-v18.js"', 'src="/assets/index-v19.js"');

// 2. Update cache version
html = html.replace(/var FINAL_VERSION = '[^']+';/, "var FINAL_VERSION = 'v23_restored_clean_ui_system';");

// 3. Remove Google Translate styles
const gStyleStart = '/* Hide the Google Translate toolbar and UI elements */';
const otpToastStart = '/* Mobile OTP Notification Toast & Google Account Chooser Overlay */';
if (html.includes(gStyleStart) && html.includes(otpToastStart)) {
  const p1 = html.indexOf(gStyleStart);
  const p2 = html.indexOf(otpToastStart);
  html = html.substring(0, p1) + html.substring(p2);
  console.log('Removed translate style block 1');
}

// 4. Remove second Google Translate style block
const gStyle2Start = '/* Block Google Translate Banner from appearing */';
const styleEnd = '</style>';
if (html.includes(gStyle2Start)) {
  const p1 = html.indexOf(gStyle2Start);
  const p2 = html.indexOf(styleEnd, p1);
  html = html.substring(0, p1) + html.substring(p2);
  console.log('Removed translate style block 2');
}

// 5. Remove Google translate DOM and script
const gDomStart = '<div id="google_translate_element" style="display:none!important;"></div>';
const otpToastDom = '<!-- Real-time OTP Delivery Banner & Auto-Fill Helper -->';
if (html.includes(gDomStart) && html.includes(otpToastDom)) {
  const p1 = html.indexOf(gDomStart);
  const p2 = html.indexOf(otpToastDom);
  html = html.substring(0, p1) + '<div id="root"></div>\n\n    ' + html.substring(p2);
  console.log('Removed translate DOM and scripts');
}

// 6. Remove audio reader styles and script at the bottom
const audioStart = '<!-- Kaamzo Multilingual Audio Reader & Accessibility Engine -->';
const bodyClose = '</body>';
if (html.includes(audioStart) && html.includes(bodyClose)) {
  const p1 = html.indexOf(audioStart);
  const p2 = html.lastIndexOf(bodyClose);
  html = html.substring(0, p1) + html.substring(p2);
  console.log('Removed audio reader styles and scripts');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully cleaned www/index.html (' + html.length + ' bytes)');
