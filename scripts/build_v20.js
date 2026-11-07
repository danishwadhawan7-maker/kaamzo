const fs = require('fs');
const path = require('path');

const srcBundle = path.join(__dirname, '..', 'www', 'assets', 'index-v19.js');
const dstBundle = path.join(__dirname, '..', 'www', 'assets', 'index-v20.js');

let code = fs.readFileSync(srcBundle, 'utf8');

// 1. Restore the real Firebase Auth & Firestore configuration (nifty-backup-mc9s2)
// where Google Sign-In OAuth Provider (clientId 1096552962708-s9puc022gcs8348kbosp8cf62fi6g4o3.apps.googleusercontent.com)
// and Firestore database (ai-studio-remixdihadi2-48a2ad23-40fd-4483-b22e-afff081bb36d) are active.
const brokenFirebaseConfig = 'const nJ="kaamzo-631f4",rJ="1:1064360807887:web:6fe11ff62b1dd04f6dd6ba",aJ="AIzaSyAYpZaK5SvMav_aI-ICTIcU5TOblGBGgWw",iJ="kaamzo-631f4.firebaseapp.com",oJ="ai-studio-remixkaamzo2-48a2ad23-40fd-4483-b22e-afff081bb36d",lJ="kaamzo-631f4.firebasestorage.app",cJ="1064360807887",uJ="",dJ="1064360807887-s9puc022gcs8348kbosp8cf62fi6g4o3.apps.googleusercontent.com"';

const workingFirebaseConfig = 'const nJ="nifty-backup-mc9s2",rJ="1:1096552962708:web:0b6211b74d4e11cbf57281",aJ="AIzaSyCPYyiiwrsMKaIauOGUMuKeVE5Yzv74Rfo",iJ="nifty-backup-mc9s2.firebaseapp.com",oJ="ai-studio-remixdihadi2-48a2ad23-40fd-4483-b22e-afff081bb36d",lJ="nifty-backup-mc9s2.firebasestorage.app",cJ="1096552962708",uJ="",dJ="1096552962708-s9puc022gcs8348kbosp8cf62fi6g4o3.apps.googleusercontent.com"';

if (code.includes(brokenFirebaseConfig)) {
  code = code.replace(brokenFirebaseConfig, workingFirebaseConfig);
  console.log('Successfully restored real Firebase Auth & OAuth client configuration (nifty-backup-mc9s2)');
} else {
  throw new Error('brokenFirebaseConfig not found in index-v19.js');
}

// 2. Replace K8 (signInWithPopup) so it ALWAYS sets prompt: "select_account" (showing the official Google "Choose an account" screen)
// and NEVER falls back to the fake #kaamzo-google-modal ("Google User" / user@kaamzo.in).
const oldK8 = 'async function K8(s,e,t){if(typeof window<"u"&&window.kaamzoGoogleSignIn){try{const gUser=await window.kaamzoGoogleSignIn(s,e,Vc,H$);if(gUser)return gUser}catch(err){if(err&&err.code==="auth/popup-closed-by-user")throw err;console.warn("Bridge Google Sign-In fallback:",err)}}try{if(Mc(s.app))return Promise.reject(Hc(s,"operation-not-supported-in-this-environment"));const n=N5(s);o$(s,e,$8);const a=cT(n,t);return await new zh(n,"signInViaPopup",e,a).executeNotNull()}catch(popupErr){if(typeof window<"u"&&window.kaamzoGoogleSignInFallback){return await window.kaamzoGoogleSignInFallback(s,e,Vc,H$,popupErr)}throw popupErr}}';

const newK8 = 'async function K8(s,e,t){try{e&&typeof e.setCustomParameters==="function"&&e.setCustomParameters({prompt:"select_account"})}catch(_){}if(typeof window<"u"&&window.kaamzoGoogleSignIn){try{const gUser=await window.kaamzoGoogleSignIn(s,e,Vc,H$);if(gUser)return gUser}catch(err){if(err&&err.code==="auth/popup-closed-by-user")throw err;console.warn("Bridge Google Sign-In fallback:",err)}}if(Mc(s.app))return Promise.reject(Hc(s,"operation-not-supported-in-this-environment"));const n=N5(s);o$(s,e,$8);const a=cT(n,t);return await new zh(n,"signInViaPopup",e,a).executeNotNull()}';

if (code.includes(oldK8)) {
  code = code.replace(oldK8, newK8);
  console.log('Successfully updated K8 to use native Google Account Chooser (prompt: select_account) without fake modal fallback');
} else {
  throw new Error('oldK8 not found in index-v19.js');
}

fs.writeFileSync(dstBundle, code, 'utf8');
console.log('Successfully written index-v20.js (' + code.length + ' bytes)');
