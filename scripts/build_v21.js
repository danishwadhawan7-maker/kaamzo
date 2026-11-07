const fs = require('fs');
const path = require('path');

const srcBundle = path.join(__dirname, '..', 'www', 'assets', 'index-v20.js');
const dstBundle = path.join(__dirname, '..', 'www', 'assets', 'index-v21.js');

let code = fs.readFileSync(srcBundle, 'utf8');

function replaceExact(label, target, replacement) {
  if (!code.includes(target)) {
    throw new Error(`Target not found for [${label}]: ${target.slice(0, 120)}`);
  }
  code = code.replace(target, replacement);
  console.log(`✓ Replaced: ${label}`);
}

// 1. Customer / Employer Registration initial states (empty instead of pre-filled default names/numbers/addresses/emails/UPI)
replaceExact(
  'Customer registration pre-filled state',
  '[an,yr]=L.useState("+91 99100 88221"),[Dr,Bi]=L.useState("bhavnoorsinghkochar@gmail.com"),[ua,Vr]=L.useState(()=>(t==null?void 0:t.defaultArea)||"Model Town"),[vr,ur]=L.useState(()=>`House 142, ${(t==null?void 0:t.defaultArea)||"Model Town"}, ${(t==null?void 0:t.name)||"Ludhiana"}, ${(t==null?void 0:t.state)||"Punjab"}`),[Qs,kr]=L.useState("bhavnoor.verma@okhdfcbank")',
  '[an,yr]=L.useState(""),[Dr,Bi]=L.useState(""),[ua,Vr]=L.useState(""),[vr,ur]=L.useState(""),[Qs,kr]=L.useState("")'
);

// 2. Prevent Customer useEffect from overwriting Area & Full Address with "Model Town" / "House 142, ..."
replaceExact(
  'Customer city useEffect prefill',
  'L.useEffect(()=>{t&&(Vr(t.defaultArea),ur(`House 142, ${t.defaultArea}, ${t.name}, ${t.state}`),ps||hn(t.name))},[t]);',
  'L.useEffect(()=>{t&&(ps||hn(t.name))},[t]);'
);

// 3. Customer Registration Form inputs & placeholders (remove Bhavnoor Singh, bhavnoor, etc.)
replaceExact(
  'Customer Full Name placeholder',
  'placeholder:"e.g. Bhavnoor Singh",value:la',
  'placeholder:"Enter full name",value:la'
);

replaceExact(
  'Customer Username placeholder',
  'placeholder:"e.g. bhavnoor",value:ga',
  'placeholder:"Enter username",value:ga'
);

replaceExact(
  'Customer Password placeholder',
  'placeholder:"e.g. mypass123",value:ca',
  'placeholder:"Enter password",value:ca'
);

replaceExact(
  'Customer Phone Number placeholder',
  'r.jsx("input",{type:"text",value:an,onChange:ee=>yr(ee.target.value),className:"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-amber-600",required:!0})',
  'r.jsx("input",{type:"text",placeholder:"Enter phone number",value:an,onChange:ee=>yr(ee.target.value),className:"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-amber-600",required:!0})'
);

replaceExact(
  'Customer Email placeholder',
  'value:Dr,onChange:ee=>Bi(ee.target.value),placeholder:"name@gmail.com"',
  'value:Dr,onChange:ee=>Bi(ee.target.value),placeholder:"Enter email address"'
);

replaceExact(
  'Customer Area / Suburb placeholder',
  'r.jsx("input",{type:"text",value:ua,onChange:ee=>Vr(ee.target.value),className:"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-amber-600",required:!0})',
  'r.jsx("input",{type:"text",placeholder:"Enter area or suburb",value:ua,onChange:ee=>Vr(ee.target.value),className:"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-amber-600",required:!0})'
);

replaceExact(
  'Customer UPI placeholder',
  'value:Qs,onChange:ee=>kr(ee.target.value),placeholder:"e.g. name@okhdfcbank"',
  'value:Qs,onChange:ee=>kr(ee.target.value),placeholder:"Enter UPI ID"'
);

replaceExact(
  'Customer Full Address placeholder',
  'r.jsx("input",{type:"text",value:vr,onChange:ee=>ur(ee.target.value),className:"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-amber-600",required:!0})',
  'r.jsx("input",{type:"text",placeholder:"Enter full address",value:vr,onChange:ee=>ur(ee.target.value),className:"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-amber-600",required:!0})'
);

// 4. Worker Registration initial states & placeholders (remove Harpreet Singh, bhavnoor, Model Town, etc.)
replaceExact(
  'Worker registration Area/City pre-filled state',
  '[as,Rs]=L.useState(()=>`${(t==null?void 0:t.defaultArea)||"Model Town"}, ${(t==null?void 0:t.name)||"Ludhiana"}`)',
  '[as,Rs]=L.useState("")'
);

replaceExact(
  'Worker Full Name placeholder',
  'placeholder:"e.g. Harpreet Singh",value:bs',
  'placeholder:"Enter full name",value:bs'
);

replaceExact(
  'Worker Username placeholder',
  'placeholder:"e.g. bhavnoor",value:Oe',
  'placeholder:"Enter username",value:Oe'
);

replaceExact(
  'Worker Password placeholder',
  'placeholder:"e.g. mypass123",value:kt',
  'placeholder:"Enter password",value:kt'
);

replaceExact(
  'Worker Mobile Phone placeholder',
  'r.jsx("input",{type:"text",value:Fs,onChange:Q=>Cs(Q.target.value),required:!0,className:"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-amber-500"})',
  'r.jsx("input",{type:"text",placeholder:"Enter mobile number",value:Fs,onChange:Q=>Cs(Q.target.value),required:!0,className:"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-amber-500"})'
);

replaceExact(
  'Worker Email placeholder',
  'value:Rt,onChange:Q=>Bs(Q.target.value),placeholder:"name@gmail.com"',
  'value:Rt,onChange:Q=>Bs(Q.target.value),placeholder:"Enter email address"'
);

replaceExact(
  'Worker UPI placeholder',
  'value:hn,onChange:Q=>is(Q.target.value),placeholder:"e.g. 9810155678@paytm"',
  'value:hn,onChange:Q=>is(Q.target.value),placeholder:"Enter UPI ID"'
);

replaceExact(
  'Worker Area/City placeholder',
  'r.jsx("input",{type:"text",value:as,onChange:Q=>Rs(Q.target.value),className:"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-amber-500"})',
  'r.jsx("input",{type:"text",placeholder:"Enter area or city",value:as,onChange:Q=>Rs(Q.target.value),className:"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-amber-500"})'
);

// 5. OTP & Gmail Verification Modal default emails/phones
replaceExact(
  'ST modal default email',
  'const ST=({isOpen:s,onClose:e,initialEmail:t="bhavnoorsinghkochar@gmail.com"',
  'const ST=({isOpen:s,onClose:e,initialEmail:t=""'
);

replaceExact(
  'FE component default email',
  'FE=({initialEmail:s="bhavnoorsinghkochar@gmail.com"',
  'FE=({initialEmail:s=""'
);

replaceExact(
  'OTP verification modal default phone',
  '[B,g]=L.useState(a||"+91 98100 12345")',
  '[B,g]=L.useState(a||"")'
);

code = code.replace(/initialEmail:\(e==null\?void 0:e\.email\)\|\|"bhavnoorsinghkochar@gmail\.com"/g, 'initialEmail:(e==null?void 0:e.email)||""');
code = code.replace(/initialEmail:"bhavnoorsinghkochar@gmail\.com"/g, 'initialEmail:(e==null?void 0:e.email)||""');
code = code.replace(/initialEmail:Rt\|\|"bhavnoorsinghkochar@gmail\.com"/g, 'initialEmail:Rt||""');

// 6. Remove hardcoded defaultKnownCustomers (Amit Sharma, Priya Verma, Harpreet Singh, Sunita Kapoor) in Admin Directory
const oldAdminCustomers = `  const defaultKnownCustomers = [
    { id: "cust-1", name: "Amit Sharma", phone: "+91 99100 88221", email: "amit.sharma.employer@gmail.com", area: "Model Town, Ludhiana", signedInAt: "Today, 04:30 PM" },
    { id: "cust-2", name: "Priya Verma", phone: "+91 98765 43210", email: "priya.verma@gmail.com", area: "Civil Lines, Ludhiana", signedInAt: "Yesterday, 11:15 AM" },
    { id: "cust-3", name: "Harpreet Singh", phone: "+91 98141 22334", email: "harpreet.singh@gmail.com", area: "Sarabha Nagar, Ludhiana", signedInAt: "2 days ago" },
    { id: "cust-4", name: "Sunita Kapoor", phone: "+91 98888 11223", email: "sunita.kapoor@gmail.com", area: "BRS Nagar, Ludhiana", signedInAt: "3 days ago" }
  ];`;

replaceExact('Admin defaultKnownCustomers removal', oldAdminCustomers, '  const defaultKnownCustomers = [];');

fs.writeFileSync(dstBundle, code, 'utf8');
console.log('Successfully written index-v21.js (' + code.length + ' bytes)');
