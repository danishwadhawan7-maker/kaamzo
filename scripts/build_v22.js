const fs = require('fs');
const path = require('path');

const srcBundle = path.join(__dirname, '..', 'www', 'assets', 'index-v21.js');
const dstBundle = path.join(__dirname, '..', 'www', 'assets', 'index-v22.js');

let code = fs.readFileSync(srcBundle, 'utf8');

function replaceExact(label, target, replacement) {
  if (!code.includes(target)) {
    throw new Error(`Target not found for [${label}]: ${target.slice(0, 140)}`);
  }
  code = code.replace(target, replacement);
  console.log(`✓ Replaced: ${label}`);
}

// 1. Customer Registration Fe: Open the Account Verification (FT) OTP Modal (Hs(!0)) instead of bypassing OTP verification
replaceExact(
  'Customer Fe open OTP verification modal',
  ',Fe=ee=>{if(ee.preventDefault(),mn(null),!la.trim()){mn("Please enter your full name");return}if(!ca.trim()){mn("Please enter a password");return}const mt=ga.trim()||an.replace(/[^0-9]/g,"")||la.trim().toLowerCase().replace(/\\s+/g,"_");f({userId:mt,password:ca.trim(),name:la.trim(),phone:an.trim()||"+91 99100 88221",email:Dr.trim()||void 0,isPhoneVerified:!0,isEmailVerified:!!Dr.trim(),area:ua||(t==null?void 0:t.defaultArea)||"Model Town",address:vr||`House 142, ${(t==null?void 0:t.defaultArea)||"Model Town"}, ${(t==null?void 0:t.name)||"Ludhiana"}`,upiId:Qs||`${mt}@upi`})}',
  ',Fe=ee=>{if(ee.preventDefault(),mn(null),!la.trim()){mn("Please enter your full name");return}if(!ca.trim()){mn("Please enter a password");return}if(!Dr.trim()&&!an.trim()){mn("Please enter your Gmail address or phone number for OTP verification");return}Hs(!0)}'
);

// 2. Worker Registration Fe: Open the Account Verification (FT) OTP Modal (oa(!0)) instead of bypassing OTP verification
replaceExact(
  'Worker Fe open OTP verification modal',
  ',Fe=Q=>{if(Q.preventDefault(),at(null),!bs.trim()){at("Please enter your full name");return}if(!kt.trim()){at("Please enter a password");return}if(!Zt){at("Worker face photo is mandatory for Age Verification & Child Labour Prevention.");return}if(Number(or)<18){at("Registration blocked: Workers must be 18 years of age or older to prevent child labour under the Child Labour (Prohibition and Regulation) Act.");return}if(!Qt){at("Please check the mandatory 18+ age declaration to comply with child labour laws.");return}const Ne=Oe.trim()||Fs.replace(/[^0-9]/g,"")||bs.trim().toLowerCase().replace(/\\s+/g,"_");f({userId:Ne,password:kt.trim(),name:bs.trim(),phone:Fs.trim()||"+91 98101 55678",email:Rt.trim()||void 0,isPhoneVerified:!0,isEmailVerified:!!Rt.trim(),primaryTrade:Kt,dailyRate:Number(Ts)||850,experienceYears:Number(Is)||3,area:as||`${(t==null?void 0:t.defaultArea)||"Model Town"}, ${(t==null?void 0:t.name)||"Ludhiana"}`,aadhaarNumber:Yt||"7829-4412-9901",upiId:hn||`${Ne}@upi`,photoUrl:Zt,age:Number(or)||24,dateOfBirth:Na,childLabourConsent:Qt})}',
  ',Fe=Q=>{if(Q.preventDefault(),at(null),!bs.trim()){at("Please enter your full name");return}if(!kt.trim()){at("Please enter a password");return}if(!Zt){at("Worker face photo is mandatory for Age Verification & Child Labour Prevention.");return}if(Number(or)<18){at("Registration blocked: Workers must be 18 years of age or older to prevent child labour under the Child Labour (Prohibition and Regulation) Act.");return}if(!Qt){at("Please check the mandatory 18+ age declaration to comply with child labour laws.");return}if(!Rt.trim()&&!Fs.trim()){at("Please enter your Gmail address or mobile number for OTP verification.");return}oa(!0)}'
);

// 3. Upgrade k5 so if server SMTP is not configured and hT() is not yet set, it automatically prompts Google OAuth (xT()) and sends the real HTML email to Gmail via gmail.googleapis.com
replaceExact(
  'k5 automatic Gmail API & Server SMTP dispatch',
  'async function k5(s){const{recipient:e,code:t,role:n="worker"}=s;Q8({identifier:e,type:"email",code:t,role:n});const a=hT();if(a)try{const{subject:o,html:c}=CJ(s),u=bJ(e,"me",o,c),d=await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send",{method:"POST",headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"},body:JSON.stringify({raw:u})});if(d.ok)return{success:!0,method:"gmail_api_oauth",messageId:(await d.json()).id,recipient:e,message:`Official Gmail verification message sent via Google Workspace to ${e}`};{const x=await d.json().catch(()=>({}));console.warn("Gmail API request responded with error:",x),d.status===401&&BJ()}}catch(o){console.warn("Direct Gmail OAuth dispatch failed, trying server API:",o)}try{const c=await(await fetch("/api/send-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({recipient:e,type:"email",code:t,role:s.role,purpose:s.purpose,jobTitle:s.jobTitle,trade:s.trade,workerName:s.workerName,customerName:s.customerName,location:s.location,wage:s.wage})})).json();return{success:!0,method:c.method==="nodemailer_gmail_smtp"||c.method==="email"?"server_smtp":"simulated_fallback",messageId:c.messageId,recipient:e,message:c.message||`Verification passcode dispatched to ${e}`}}catch(o){return console.warn("Server OTP endpoint error, simulated fallback:",o),{success:!0,method:"simulated_fallback",recipient:e,message:`OTP ${t} registered in Firestore and dispatched to ${e}`}}}',
  'async function k5(s){const{recipient:e,code:t,role:n="worker"}=s;Q8({identifier:e,type:"email",code:t,role:n});try{const c=await(await fetch("/api/send-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({recipient:e,type:"email",code:t,role:s.role,purpose:s.purpose,jobTitle:s.jobTitle,trade:s.trade,workerName:s.workerName,customerName:s.customerName,location:s.location,wage:s.wage})})).json();if(c&&(c.method==="nodemailer_gmail_smtp"||c.method==="email"))return{success:!0,method:"server_smtp",messageId:c.messageId,recipient:e,message:c.message||`Verification passcode dispatched to ${e}`}}catch(o){console.warn("Server OTP endpoint note:",o)}let a=hT();if(!a)try{a=await xT()}catch(o){console.warn("Gmail OAuth authorization note:",o)}if(a)try{const{subject:o,html:c}=CJ(s),u=bJ(e,"me",o,c),d=await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send",{method:"POST",headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"},body:JSON.stringify({raw:u})});if(d.ok)return{success:!0,method:"gmail_api_oauth",messageId:(await d.json()).id,recipient:e,message:`Official Gmail verification message sent via Google Workspace to ${e}`};{const x=await d.json().catch(()=>({}));console.warn("Gmail API request responded with error:",x),d.status===401&&BJ()}}catch(o){console.warn("Direct Gmail OAuth dispatch failed:",o)}return{success:!0,method:"simulated_fallback",recipient:e,message:`OTP ${t} registered in Firestore and dispatched to ${e}`}}'
);

// 4. Auto-trigger OTP send when FT modal opens with a valid email address
replaceExact(
  'FT modal auto-send OTP on open',
  'L.useEffect(()=>{n&&p(n),a&&g(a),s&&(N("input"),_(""),be(null),je(null))},[n,a,s])',
  'L.useEffect(()=>{if(n&&p(n),a&&g(a),s){N("input"),_(""),be(null),je(null);if(n&&U(n)){setTimeout(()=>{ne(!1)},80)}}},[n,a,s])'
);

fs.writeFileSync(dstBundle, code, 'utf8');
console.log('Successfully written index-v22.js (' + code.length + ' bytes)');
