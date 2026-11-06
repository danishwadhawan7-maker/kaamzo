const fs = require('fs');
const path = require('path');

const srcBundle = path.join(__dirname, '..', 'www', 'assets', 'index-v18.js');
const dstBundle = path.join(__dirname, '..', 'www', 'assets', 'index-v19.js');

let code = fs.readFileSync(srcBundle, 'utf8');

// 1. Remove audio button from app navbar
const appAudioBtn = 'r.jsxs("button",{id:"kaamzo-header-audio-btn",type:"button",onClick:()=>{window.kaamzoToggleAudioReader?window.kaamzoToggleAudioReader():null},className:"kaamzo-header-audio-btn p-1.5 sm:p-2 bg-slate-100 hover:bg-amber-50 dark:bg-[#282828] dark:hover:bg-[#333333] text-slate-700 dark:text-slate-200 rounded-xl transition border border-slate-200 dark:border-[#383838] hover:border-amber-400 min-w-[34px] sm:min-w-[36px] min-h-[32px] sm:min-h-[36px] flex items-center justify-center shadow-2xs shrink-0 cursor-pointer gap-1",title:"Audio Reader: Listen to page text / ਸੁਣੋ / सुनें","aria-label":"Audio Reader",children:[r.jsx("span",{className:"text-sm",children:"🔊"}),r.jsx("span",{className:"hidden lg:inline text-xs font-bold text-amber-700 dark:text-amber-400",children:"Audio"})]}),';

if (code.includes(appAudioBtn)) {
  code = code.replace(appAudioBtn, '');
  console.log('Successfully removed app navbar audio button');
} else {
  console.warn('Warning: appAudioBtn not found directly');
}

// 2. Remove audio button from landing page navbar
const landingAudioBtn = 'r.jsxs("button",{id:"kaamzo-header-audio-btn",type:"button",onClick:()=>{window.kaamzoToggleAudioReader?window.kaamzoToggleAudioReader():null},className:"kaamzo-header-audio-btn p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-white dark:bg-[#242424] hover:bg-amber-50 dark:hover:bg-[#2E2E2E] border border-[#E5E0D8] dark:border-[#383838] hover:border-[#F59E0B] text-xs font-bold text-[#111827] dark:text-white shadow-2xs transition flex items-center justify-center min-h-[32px] sm:min-h-[36px] min-w-[34px] sm:min-w-[36px] cursor-pointer shrink-0 gap-1",title:"Audio Reader: Listen to page text / ਸੁਣੋ / सुनें","aria-label":"Audio Reader",children:[r.jsx("span",{className:"text-sm",children:"🔊"}),r.jsx("span",{className:"hidden xl:inline ml-0.5 text-xs font-bold text-amber-700 dark:text-amber-400",children:"Audio"})]}),';

if (code.includes(landingAudioBtn)) {
  code = code.replace(landingAudioBtn, '');
  console.log('Successfully removed landing navbar audio button');
} else {
  console.warn('Warning: landingAudioBtn not found directly');
}

// 3. Restore landing page Dark Mode button to clean icon-only button (exact match with reference image)
const bloatedDarkBtn = 'children:d?r.jsxs(r.Fragment,{children:[r.jsx(j2,{className:"w-4 h-4 text-amber-400 shrink-0"}),r.jsx("span",{className:"hidden xl:inline ml-1 text-xs",children:"Light"})]}):r.jsxs(r.Fragment,{children:[r.jsx(N2,{className:"w-4 h-4 text-slate-600 shrink-0"}),r.jsx("span",{className:"hidden xl:inline ml-1 text-xs",children:"Dark"})]})})';
const cleanDarkBtn = 'children:d?r.jsx(j2,{className:"w-4 h-4 text-amber-400 shrink-0"}):r.jsx(N2,{className:"w-4 h-4 text-slate-600 shrink-0"})})';

if (code.includes(bloatedDarkBtn)) {
  code = code.replace(bloatedDarkBtn, cleanDarkBtn);
  console.log('Successfully restored clean Dark Mode button (icon only)');
} else {
  console.warn('Warning: bloatedDarkBtn not found');
}

// 4. Restore landing page Settings button to clean icon-only button (exact match with reference image)
const bloatedSettingsBtn = 'title:"Preferences, Portals & Settings","aria-label":"Settings",children:[r.jsx(NT,{className:"w-4 h-4 text-[#4B5563] dark:text-slate-300 shrink-0"}),r.jsx("span",{className:"hidden xl:inline ml-1 text-xs",children:"Settings"})]})';
const cleanSettingsBtn = 'title:"Preferences, Portals & Settings","aria-label":"Settings",children:r.jsx(NT,{className:"w-4 h-4 text-[#4B5563] dark:text-slate-300 shrink-0"})})';

if (code.includes(bloatedSettingsBtn)) {
  code = code.replace(bloatedSettingsBtn, cleanSettingsBtn);
  console.log('Successfully restored clean Settings button (icon only)');
} else {
  console.warn('Warning: bloatedSettingsBtn not found');
}

fs.writeFileSync(dstBundle, code, 'utf8');
console.log('Successfully written index-v19.js (' + code.length + ' bytes)');
