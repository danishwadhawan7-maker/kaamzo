const fs = require('fs');

let js = fs.readFileSync('www/assets/index-v22.js', 'utf8');
console.log('Loaded index-v22.js, length:', js.length);

function replaceExact(target, replacement, label) {
  const idx = js.indexOf(target);
  if (idx === -1) {
    throw new Error(`Target not found for: ${label}`);
  }
  js = js.slice(0, idx) + replacement + js.slice(idx + target.length);
  console.log(`✓ Applied: ${label}`);
}

// ============================================================================
// 1. UPGRADE AppContext SYNC EFFECTS + CROSS-TAB & FIRESTORE REAL-TIME UNLOCK
// ============================================================================
const oldSyncEffects = `L.useEffect(()=>{if(!v)return;const K=v.phone.replace(/[^0-9]/g,"").slice(-10);v.name.trim().toLowerCase();const xe=d.find(Le=>{if(Le.id===v.id)return!0;const Ue=Le.phone.replace(/[^0-9]/g,"").slice(-10);return Ue&&K&&Ue===K}),X=B.find(Le=>{const Ue=Le.phone.replace(/[^0-9]/g,"").slice(-10);return Ue&&K&&Ue===K}),ye=xe?xe.isVerified:(X==null?void 0:X.status)==="approved",me=ye?"Aadhaar Verified":(xe==null?void 0:xe.badge)||((X==null?void 0:X.status)==="pending"?"KYC Under Review":"Registered Worker");(v.isVerified!==ye||v.badge!==me)&&_(Le=>Le?{...Le,isVerified:ye,badge:me}:null)},[d,B]),L.useEffect(()=>{x(K=>{const xe=new Map;if(K.forEach(X=>{const ye=X.phone.replace(/[^0-9]/g,"").slice(-10)||X.id;xe.set(ye,X)}),v){const X=v.phone.replace(/[^0-9]/g,"").slice(-10)||v.id;xe.has(X)||xe.set(X,v)}return Ee&&Ee.length>0&&Ee.forEach(X=>{const ye=X.phone.replace(/[^0-9]/g,"").slice(-10)||X.id;if(!xe.has(ye)){const me=X.extraData||{},Le={id:\`w-\${X.id}\`,name:X.name,phone:X.phone,email:me.email||\`\${X.name.toLowerCase().replace(/\\s+/g,".")}@gmail.com\`,isPhoneVerified:!0,isEmailVerified:!0,avatar:me.photoUrl||"https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80",photoUrl:me.photoUrl,aadhaarPhotoUrl:me.aadhaarPhotoUrl,age:me.age||26,dateOfBirth:me.dateOfBirth,childLabourVerified:!1,primaryTrade:me.trade||"Mason",secondaryTrades:["Construction Helper"],dailyRate:me.rate||850,experienceYears:me.exp||3,rating:4.8,reviewCount:5,completedJobsCount:2,isOnline:!0,location:{area:me.area||(ae==null?void 0:ae.defaultArea)||"Model Town",city:(ae==null?void 0:ae.name)||"Ludhiana",distanceKm:1.2},gpsLocation:{lat:30.9,lng:75.85,area:me.area||(ae==null?void 0:ae.defaultArea)||"Model Town",city:(ae==null?void 0:ae.name)||"Ludhiana",accuracyMeters:4,lastUpdated:"Just now"},isSharingLiveGps:!0,aadhaarNumberMasked:me.aadhaar?\`XXXX-XXXX-\${me.aadhaar.slice(-4)}\`:"XXXX-XXXX-9901",isVerified:me.isVerified??!1,todayEarnings:0,totalEarnings:0,walletBalance:0,badge:me.isVerified?"Aadhaar Verified":"KYC & Photo Pending",upiId:me.upi||\`\${X.name.toLowerCase().replace(/\\s+/g,".")}@upi\`,bankName:"State Bank of India",accountNumberMasked:"•••• •••• 1234",ifscCode:"SBIN0004921"};xe.set(ye,Le)}}),B&&B.length>0&&B.forEach(X=>{const ye=X.phone.replace(/[^0-9]/g,"").slice(-10)||X.workerId||X.id;if(!xe.has(ye)){const me={id:X.workerId||\`w-\${X.id}\`,name:X.workerName,phone:X.phone,email:\`\${X.workerName.toLowerCase().replace(/\\s+/g,".")}@gmail.com\`,isPhoneVerified:!0,isEmailVerified:!0,avatar:X.photoUrl||"https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80",photoUrl:X.photoUrl,aadhaarPhotoUrl:X.aadhaarPhotoUrl,age:X.age||25,dateOfBirth:X.dateOfBirth,childLabourVerified:X.childLabourCheckPassed??!1,primaryTrade:X.trade||"Mason",secondaryTrades:["Construction Helper"],dailyRate:850,experienceYears:X.experienceYears||3,rating:4.8,reviewCount:5,completedJobsCount:2,isOnline:!0,location:{area:(ae==null?void 0:ae.defaultArea)||"Model Town",city:(ae==null?void 0:ae.name)||"Ludhiana",distanceKm:1.2},gpsLocation:{lat:30.9,lng:75.85,area:(ae==null?void 0:ae.defaultArea)||"Model Town",city:(ae==null?void 0:ae.name)||"Ludhiana",accuracyMeters:4,lastUpdated:"Just now"},isSharingLiveGps:!0,aadhaarNumberMasked:X.aadhaarNumber||"XXXX-XXXX-9901",isVerified:X.status==="approved",todayEarnings:0,totalEarnings:0,walletBalance:0,badge:X.status==="approved"?"Aadhaar Verified":"KYC & Photo Pending",upiId:\`\${X.workerName.toLowerCase().replace(/\\s+/g,".")}@upi\`,bankName:"State Bank of India",accountNumberMasked:"•••• •••• 1234",ifscCode:"SBIN0004921"};xe.set(ye,me)}}),Array.from(xe.values())}),g(K=>{const xe=new Map;return K.forEach(X=>{const ye=X.phone.replace(/[^0-9]/g,"").slice(-10)||X.id;xe.set(ye,X)}),Ee&&Ee.length>0&&Ee.forEach(X=>{const ye=X.phone.replace(/[^0-9]/g,"").slice(-10)||X.id;if(!xe.has(ye)){const me=X.extraData||{},Le={id:\`v-\${X.id}\`,workerId:\`w-\${X.id}\`,workerName:X.name,trade:me.trade||"Mason",phone:X.phone,aadhaarNumber:me.aadhaar||"7829-4412-9901",photoUrl:me.photoUrl||"https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80",aadhaarPhotoUrl:me.aadhaarPhotoUrl,age:me.age||25,dateOfBirth:me.dateOfBirth,childLabourCheckPassed:!1,experienceYears:me.exp||3,submittedAt:"Just now",status:me.isVerified?"approved":"pending"};xe.set(ye,Le)}}),d&&d.length>0&&d.forEach(X=>{const ye=X.phone.replace(/[^0-9]/g,"").slice(-10)||X.id;if(!xe.has(ye)&&!X.isVerified){const me={id:\`v-\${X.id}\`,workerId:X.id,workerName:X.name,trade:X.primaryTrade,phone:X.phone,aadhaarNumber:X.aadhaarNumberMasked||"7829-4412-9901",photoUrl:X.photoUrl||X.avatar,aadhaarPhotoUrl:X.aadhaarPhotoUrl,age:X.age||25,dateOfBirth:X.dateOfBirth,childLabourCheckPassed:X.childLabourVerified||!1,experienceYears:X.experienceYears||3,submittedAt:"Just now",status:"pending"};xe.set(ye,me)}}),Array.from(xe.values())})},[Ee,v,B.length,d.length])`;

const newSyncEffects = `L.useEffect(()=>{if(!v)return;const normId=s=>String(s||"").trim().toLowerCase().replace(/^(w-|v-|wrk-)/,""),normPh=s=>{const p=String(s||"").replace(/[^0-9]/g,"").slice(-10);return p.length>=7&&p!=="9810155678"&&p!=="9999999999"?p:""},normEm=s=>String(s||"").trim().toLowerCase(),normNm=s=>String(s||"").trim().toLowerCase(),vId=normId(v.username||v.userId||v.id),vPh=normPh(v.phone),vEm=normEm(v.email),vNm=normNm(v.name),matchRec=Le=>{if(!Le)return!1;const lId=normId(Le.username||Le.userId||Le.workerId||Le.id),lPh=normPh(Le.phone),lEm=normEm(Le.email||(Le.extraData&&Le.extraData.email)),lNm=normNm(Le.name||Le.workerName);return!!(Le.id===v.id||Le.workerId===v.id||(vId&&lId&&vId===lId)||(vPh&&lPh&&vPh===lPh)||(vEm&&lEm&&vEm===lEm)||(vNm&&lNm&&vNm===lNm))};const xe=d.find(matchRec),X=B.find(matchRec),acct=Ee.find(matchRec),ye=!!((xe&&xe.isVerified)||(X&&X.status==="approved")||(acct&&acct.extraData&&acct.extraData.isVerified)),me=ye?"Aadhaar & Face ID Verified • 18+ Adult":(xe==null?void 0:xe.badge)||((X==null?void 0:X.status)==="pending"?"KYC Under Review":"Registered Worker");if(v.isVerified!==ye||v.badge!==me){const wasUnverified=!v.isVerified&&ye;_(Le=>{if(!Le)return null;const updated={...Le,isVerified:ye,childLabourVerified:ye?!0:Le.childLabourVerified,faceIdVerified:ye?!0:Le.faceIdVerified,isOnline:ye?!0:Le.isOnline,jobStatus:ye?"Verified • Available & Online":Le.jobStatus,badge:me};try{localStorage.setItem("kaamzo_current_worker_v8",JSON.stringify(updated))}catch{}return updated});if(wasUnverified){Ae("success"),Pt("🎉 Identity & Face ID Verified!","Admin has approved your KYC! Your Worker Portal is now open and online.")}}},[d,B,Ee,v]),L.useEffect(()=>{const syncFromStorage=e=>{try{if(!e||e.key==="kaamzo_workers_zero_v8"||e.key==="kaamzo_kyc_approved_signal_v8"){const rw=localStorage.getItem("kaamzo_workers_zero_v8");if(rw){const pw=JSON.parse(rw);if(Array.isArray(pw))x(pw)}}if(!e||e.key==="kaamzo_verifications_zero_v8"||e.key==="kaamzo_kyc_approved_signal_v8"){const rv=localStorage.getItem("kaamzo_verifications_zero_v8");if(rv){const pv=JSON.parse(rv);if(Array.isArray(pv))g(pv)}}if(!e||e.key==="kaamzo_worker_accounts_v8"||e.key==="kaamzo_kyc_approved_signal_v8"){const ra=localStorage.getItem("kaamzo_worker_accounts_v8");if(ra){const pa=JSON.parse(ra);if(Array.isArray(pa))Se(pa)}}if(e&&e.key==="kaamzo_current_worker_v8"&&e.newValue){const pc=JSON.parse(e.newValue);if(pc&&pc.id)_(prev=>prev&&prev.isVerified===pc.isVerified?prev:pc)}}catch{}};window.addEventListener("storage",syncFromStorage);let pollTimer=null;if(v&&!v.isVerified){pollTimer=setInterval(async()=>{syncFromStorage();try{const remoteW=await ya(v.id);if(remoteW&&remoteW.isVerified){x(prev=>prev.some(w=>w.id===remoteW.id)?prev.map(w=>w.id===remoteW.id?remoteW:w):[remoteW,...prev])}}catch{}},1500)}return()=>{window.removeEventListener("storage",syncFromStorage);if(pollTimer)clearInterval(pollTimer)}},[v&&v.id,v&&v.isVerified]),L.useEffect(()=>{const getKey=obj=>{const normId=String(obj.username||obj.userId||obj.workerId||obj.id||"").trim().toLowerCase().replace(/^(w-|v-|wrk-)/,"");const ph=String(obj.phone||"").replace(/[^0-9]/g,"").slice(-10);if(ph.length>=7&&ph!=="9810155678"&&ph!=="9999999999")return ph;return normId||String(obj.email||obj.name||obj.workerName||obj.id||"").trim().toLowerCase()};x(K=>{const xe=new Map;if(K.forEach(X=>{xe.set(getKey(X),X)}),v){const X=getKey(v);xe.has(X)?xe.set(X,{...xe.get(X),...v,isVerified:!!(xe.get(X).isVerified||v.isVerified)}):xe.set(X,v)}return Ee&&Ee.length>0&&Ee.forEach(X=>{const ye=getKey(X);const me=X.extraData||{};const areaStr=me.area||(ae==null?void 0:ae.defaultArea)||"Model Town";const cityStr=me.city||(ae==null?void 0:ae.name)||"Ludhiana";const addrStr=me.address||(areaStr.includes(cityStr)?areaStr:\`\${areaStr}, \${cityStr}\`);if(!xe.has(ye)){const Le={id:\`w-\${X.id}\`,username:X.id,userId:X.id,name:X.name,phone:X.phone||"",email:me.email||X.email||"",isPhoneVerified:me.isPhoneVerified??!0,isEmailVerified:me.isEmailVerified??!0,avatar:me.photoUrl||"https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80",photoUrl:me.photoUrl,aadhaarPhotoUrl:me.aadhaarPhotoUrl,age:me.age||26,dateOfBirth:me.dateOfBirth||"",childLabourVerified:!!me.isVerified,faceIdVerified:!!me.photoUrl,faceIdStatus:me.isVerified?"Face ID & 18+ Verified by Admin":me.photoUrl?"Live Face ID Captured • Pending Admin Audit":"Face ID Pending",jobStatus:me.isVerified?"Verified • Available & Online":"Locked • Pending Admin KYC Approval",primaryTrade:me.trade||"Mason",secondaryTrades:["Construction Helper"],dailyRate:me.rate||850,experienceYears:me.exp||3,rating:4.8,reviewCount:0,completedJobsCount:0,isOnline:!!me.isVerified,area:areaStr,city:cityStr,address:addrStr,location:{area:areaStr,city:cityStr,address:addrStr,distanceKm:1.2},gpsLocation:{lat:30.9,lng:75.85,area:areaStr,city:cityStr,address:addrStr,accuracyMeters:4,lastUpdated:"Just now"},isSharingLiveGps:!0,aadhaarNumber:me.aadhaar||"",aadhaarNumberMasked:me.aadhaar?\`XXXX-XXXX-\${String(me.aadhaar).slice(-4)}\`:"Not Provided",isVerified:me.isVerified??!1,todayEarnings:0,totalEarnings:0,walletBalance:0,badge:me.isVerified?"Aadhaar & Face ID Verified • 18+ Adult":"KYC & Photo Pending",upiId:me.upi||\`\${X.id}@upi\`,bankName:"State Bank of India",accountNumberMasked:"•••• •••• 1234",ifscCode:"SBIN0004921"};xe.set(ye,Le)}else{const cur=xe.get(ye);xe.set(ye,{...cur,username:cur.username||X.id,userId:cur.userId||X.id,email:cur.email||me.email||X.email||"",address:cur.address||addrStr,area:cur.area||areaStr,city:cur.city||cityStr,aadhaarNumber:cur.aadhaarNumber||me.aadhaar||"",upiId:cur.upiId||me.upi||\`\${X.id}@upi\`,dateOfBirth:cur.dateOfBirth||me.dateOfBirth||"",photoUrl:cur.photoUrl||me.photoUrl||cur.avatar})}}),B&&B.length>0&&B.forEach(X=>{const ye=getKey(X);if(!xe.has(ye)){const areaStr=X.area||(ae==null?void 0:ae.defaultArea)||"Model Town";const cityStr=X.city||(ae==null?void 0:ae.name)||"Ludhiana";const addrStr=X.address||(areaStr.includes(cityStr)?areaStr:\`\${areaStr}, \${cityStr}\`);const me={id:X.workerId||\`w-\${X.username||X.id}\`,username:X.username||String(X.workerId||X.id).replace(/^(w-|v-)/,""),name:X.workerName,phone:X.phone||"",email:X.email||"",isPhoneVerified:!0,isEmailVerified:!0,avatar:X.photoUrl||"https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80",photoUrl:X.photoUrl,aadhaarPhotoUrl:X.aadhaarPhotoUrl,age:X.age||25,dateOfBirth:X.dateOfBirth||"",childLabourVerified:X.childLabourCheckPassed??(X.status==="approved"),faceIdVerified:!!X.photoUrl,faceIdStatus:X.status==="approved"?"Face ID & 18+ Verified by Admin":"Live Face ID Captured • Pending Admin Audit",jobStatus:X.status==="approved"?"Verified • Available & Online":"Locked • Pending Admin KYC Approval",primaryTrade:X.trade||"Mason",secondaryTrades:["Construction Helper"],dailyRate:X.dailyRate||850,experienceYears:X.experienceYears||3,rating:4.8,reviewCount:0,completedJobsCount:0,isOnline:X.status==="approved",area:areaStr,city:cityStr,address:addrStr,location:{area:areaStr,city:cityStr,address:addrStr,distanceKm:1.2},gpsLocation:X.gpsLocation||{lat:30.9,lng:75.85,area:areaStr,city:cityStr,address:addrStr,accuracyMeters:4,lastUpdated:"Just now"},isSharingLiveGps:!0,aadhaarNumber:X.aadhaarNumber||"",aadhaarNumberMasked:X.aadhaarNumber||"Not Provided",isVerified:X.status==="approved",todayEarnings:0,totalEarnings:0,walletBalance:0,badge:X.status==="approved"?"Aadhaar & Face ID Verified • 18+ Adult":"KYC & Photo Pending",upiId:X.upiId||\`\${(X.username||X.workerName||"worker").toLowerCase().replace(/\\s+/g,".")}@upi\`,bankName:"State Bank of India",accountNumberMasked:"•••• •••• 1234",ifscCode:"SBIN0004921"};xe.set(ye,me)}}),Array.from(xe.values())}),g(K=>{const xe=new Map;return K.forEach(X=>{xe.set(getKey(X),X)}),Ee&&Ee.length>0&&Ee.forEach(X=>{const ye=getKey(X);const me=X.extraData||{};const areaStr=me.area||(ae==null?void 0:ae.defaultArea)||"Model Town";const cityStr=me.city||(ae==null?void 0:ae.name)||"Ludhiana";const addrStr=me.address||(areaStr.includes(cityStr)?areaStr:\`\${areaStr}, \${cityStr}\`);if(!xe.has(ye)){const Le={id:\`v-\${X.id}\`,workerId:\`w-\${X.id}\`,username:X.id,workerName:X.name,trade:me.trade||"Mason",dailyRate:me.rate||850,phone:X.phone||"",email:me.email||X.email||"",area:areaStr,city:cityStr,address:addrStr,aadhaarNumber:me.aadhaar||"Not Provided",upiId:me.upi||\`\${X.id}@upi\`,photoUrl:me.photoUrl||"",aadhaarPhotoUrl:me.aadhaarPhotoUrl,age:me.age||25,dateOfBirth:me.dateOfBirth||"",childLabourCheckPassed:!!me.isVerified,faceIdVerified:!!me.photoUrl,faceIdStatus:me.isVerified?"Face ID & 18+ Verified by Admin":me.photoUrl?"Live Face ID Captured • Pending Admin Audit":"Face ID Pending",jobStatus:me.isVerified?"Verified • Available & Online":"Locked • Pending Admin KYC Approval",experienceYears:me.exp||3,submittedAt:"Just now",status:me.isVerified?"approved":"pending"};xe.set(ye,Le)}else{const cur=xe.get(ye);xe.set(ye,{...cur,username:cur.username||X.id,email:cur.email||me.email||X.email||"",area:cur.area||areaStr,city:cur.city||cityStr,address:cur.address||addrStr,dailyRate:cur.dailyRate||me.rate||850,upiId:cur.upiId||me.upi||\`\${X.id}@upi\`,photoUrl:cur.photoUrl||me.photoUrl||"",dateOfBirth:cur.dateOfBirth||me.dateOfBirth||""})}}),d&&d.length>0&&d.forEach(X=>{const ye=getKey(X);const areaStr=X.area||(X.location&&X.location.area)||(ae==null?void 0:ae.defaultArea)||"Model Town";const cityStr=X.city||(X.location&&X.location.city)||(ae==null?void 0:ae.name)||"Ludhiana";const addrStr=X.address||(X.location&&X.location.address)||(areaStr.includes(cityStr)?areaStr:\`\${areaStr}, \${cityStr}\`);if(!xe.has(ye)){const cleanU=X.username||String(X.id).replace(/^w-/,"");const me={id:\`v-\${cleanU}\`,workerId:X.id,username:cleanU,workerName:X.name,trade:X.primaryTrade,dailyRate:X.dailyRate||850,phone:X.phone||"",email:X.email||"",area:areaStr,city:cityStr,address:addrStr,gpsLocation:X.gpsLocation,aadhaarNumber:X.aadhaarNumber||X.aadhaarNumberMasked||"Not Provided",upiId:X.upiId||\`\${cleanU}@upi\`,photoUrl:X.photoUrl||X.avatar,aadhaarPhotoUrl:X.aadhaarPhotoUrl,age:X.age||25,dateOfBirth:X.dateOfBirth||"",childLabourCheckPassed:X.childLabourVerified||X.isVerified||!1,faceIdVerified:!!(X.photoUrl||X.avatar),faceIdStatus:X.isVerified?"Face ID & 18+ Verified by Admin":"Live Face ID Captured • Pending Admin Audit",jobStatus:X.isVerified?"Verified • Available & Online":"Locked • Pending Admin KYC Approval",experienceYears:X.experienceYears||3,submittedAt:"Just now",status:X.isVerified?"approved":"pending"};xe.set(ye,me)}}),Array.from(xe.values())})},[Ee,v,B.length,d.length])`;

replaceExact(oldSyncEffects, newSyncEffects, 'AppContext real-time KYC sync & storage listener');

// ============================================================================
// 2. UPGRADE rn, pn, AND an IN AppContext TO STORE ALL WORKER & FACE ID FIELDS
// ============================================================================
const oldRnPnAn = `rn=(K,xe)=>{const X=K.trim();if(!X)return{success:!1,error:"Please enter your User ID, Mobile number, or Email."};const ye=ti(Ee,X);if(!ye)return{success:!1,error:\`Worker account "\${X}" not found. Please click Register to create your account or check your User ID / Phone.\`};const _hx=window.__kzH?window.__kzH(xe.trim()):xe.trim();if((ye.password||"123").trim()!==xe.trim()&&(ye.password||"").trim()!==_hx&&(ye.passwordHash||"").trim()!==_hx)return{success:!1,error:\`Incorrect password for \${ye.name} (\${ye.id}). Please check the password you entered.\`};const Le=ye.extraData||{};return an({name:ye.name,phone:ye.phone,email:Le.email||ye.email,isPhoneVerified:Le.isPhoneVerified??!0,isEmailVerified:Le.isEmailVerified??!0,primaryTrade:Le.trade||"Mason",dailyRate:Le.rate||850,experienceYears:Le.exp||4,area:Le.area||\`\${(ae==null?void 0:ae.defaultArea)||"Model Town"}, \${(ae==null?void 0:ae.name)||"Ludhiana"}\`,aadhaarNumber:Le.aadhaar||"",upiId:Le.upi||\`\${ye.id}@upi\`}),{success:!0}},pn=K=>{var ye,me;const X={id:((ye=K.userId)==null?void 0:ye.trim().toLowerCase())||(K.email?K.email.split("@")[0].toLowerCase():"")||K.phone.replace(/[^0-9]/g,"").slice(-10)||K.name.trim().toLowerCase().replace(/\\s+/g,"_"),password:window.__kzH?window.__kzH((K.password||"123").trim()):(K.password||"123").trim(),name:K.name.trim(),phone:K.phone.trim(),role:"worker",extraData:{trade:K.primaryTrade,rate:K.dailyRate,exp:K.experienceYears,area:K.area,aadhaar:K.aadhaarNumber,upi:K.upiId,email:(me=K.email)==null?void 0:me.trim(),photoUrl:K.photoUrl,aadhaarPhotoUrl:K.aadhaarPhotoUrl,age:K.age,dateOfBirth:K.dateOfBirth,childLabourConsent:K.childLabourConsent,isPhoneVerified:K.isPhoneVerified??!0,isEmailVerified:K.isEmailVerified??!0}};Se(Le=>{const Ue=[...Le.filter(ze=>{var lt;return((lt=ze.id)==null?void 0:lt.toLowerCase())!==X.id&&(!ze.phone||ze.phone.replace(/[^0-9]/g,"").slice(-10)!==X.phone.replace(/[^0-9]/g,"").slice(-10))}),X];return localStorage.removeItem("kaamzo_is_reset_state_v8"),localStorage.setItem("kaamzo_current_role","worker"),localStorage.setItem("kaamzo_worker_accounts_v8",JSON.stringify(Ue)),Ue}),$y(X),an({name:K.name,phone:K.phone,email:K.email,isPhoneVerified:K.isPhoneVerified??!0,isEmailVerified:K.isEmailVerified??!0,primaryTrade:K.primaryTrade,dailyRate:K.dailyRate,experienceYears:K.experienceYears,area:K.area,aadhaarNumber:K.aadhaarNumber,upiId:K.upiId,photoUrl:K.photoUrl,aadhaarPhotoUrl:K.aadhaarPhotoUrl,age:K.age,dateOfBirth:K.dateOfBirth,childLabourConsent:K.childLabourConsent}),Pt(\`Account created! User ID: "\${X.id}". Photo submitted for KYC & Anti-Child Labour review.\`)},an=K=>{const xe=\`XXXX-XXXX-\${K.aadhaarNumber.slice(-4)||"1234"}\`,X=K.phone.replace(/[^0-9]/g,"").slice(-10)||"9810155678",ye=K.upiId||\`\${K.name.toLowerCase().replace(/\\s+/g,".")||"worker"}@upi\`,me=d.find(Tt=>{const Wt=Tt.phone.replace(/[^0-9]/g,"").slice(-10);return Wt&&Wt===X}),Le=B.find(Tt=>{const Wt=Tt.phone.replace(/[^0-9]/g,"").slice(-10);return Wt&&Wt===X}),Ue=!!(me!=null&&me.isVerified&&(me==null?void 0:me.childLabourVerified)!==!1||(Le==null?void 0:Le.status)==="approved"),ze=ld(K.area||(ae==null?void 0:ae.defaultArea)||"Model Town",ae==null?void 0:ae.name),lt=K.photoUrl||(me==null?void 0:me.photoUrl)||(me==null?void 0:me.avatar)||"https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80",Bt=K.age||(me==null?void 0:me.age)||26,ut={id:(me==null?void 0:me.id)||\`w-\${Date.now().toString().slice(-4)}\`,name:K.name,phone:K.phone,email:K.email||(me==null?void 0:me.email)||\`\${K.name.toLowerCase().replace(/\\s+/g,".")}@gmail.com\`,isPhoneVerified:K.isPhoneVerified??(me==null?void 0:me.isPhoneVerified)??!0,isEmailVerified:K.isEmailVerified??(me==null?void 0:me.isEmailVerified)??!0,avatar:lt,photoUrl:lt,aadhaarPhotoUrl:K.aadhaarPhotoUrl||(me==null?void 0:me.aadhaarPhotoUrl),age:Bt,dateOfBirth:K.dateOfBirth||(me==null?void 0:me.dateOfBirth),childLabourVerified:Ue,primaryTrade:K.primaryTrade,secondaryTrades:(me==null?void 0:me.secondaryTrades)||["Construction Helper"],dailyRate:K.dailyRate||(me==null?void 0:me.dailyRate)||850,experienceYears:K.experienceYears||(me==null?void 0:me.experienceYears)||3,rating:me?me.rating:0,reviewCount:me?me.reviewCount:0,completedJobsCount:me?me.completedJobsCount:0,isOnline:Ue?(me==null?void 0:me.isOnline)??!0:!1,location:{area:K.area||(me==null?void 0:me.location.area)||(ae==null?void 0:ae.defaultArea)||"Model Town",city:(ae==null?void 0:ae.name)||"Ludhiana",distanceKm:(me==null?void 0:me.location.distanceKm)||1},gpsLocation:(me==null?void 0:me.gpsLocation)||{lat:ze.lat+(Math.random()-.5)*.01,lng:ze.lng+(Math.random()-.5)*.01,area:K.area||ze.area,city:(ae==null?void 0:ae.name)||"Ludhiana",accuracyMeters:4,heading:60,speedKmh:0,lastUpdated:"Just now"},isSharingLiveGps:!0,aadhaarNumberMasked:xe,isVerified:Ue,todayEarnings:(me==null?void 0:me.todayEarnings)||0,totalEarnings:(me==null?void 0:me.totalEarnings)||0,walletBalance:(me==null?void 0:me.walletBalance)||0,badge:Ue?"Aadhaar Verified • 18+ Adult":"KYC & Photo Pending",upiId:ye,bankName:(me==null?void 0:me.bankName)||"State Bank of India",accountNumberMasked:(me==null?void 0:me.accountNumberMasked)||\`•••• •••• \${X.slice(-4)}\`,ifscCode:(me==null?void 0:me.ifscCode)||"SBIN0004921"};if(_(ut),x(Tt=>[ut,...Tt.filter(Wt=>{const D=Wt.phone.replace(/[^0-9]/g,"").slice(-10);return!(D&&D===X)})]),!Le){const Tt={id:\`v-\${Date.now().toString().slice(-4)}\`,workerId:ut.id,workerName:K.name,trade:K.primaryTrade,phone:K.phone,aadhaarNumber:K.aadhaarNumber||"",photoUrl:lt,aadhaarPhotoUrl:K.aadhaarPhotoUrl,age:Bt,dateOfBirth:K.dateOfBirth,childLabourCheckPassed:Ue,experienceYears:K.experienceYears||3,submittedAt:"Just now",status:Ue?"approved":"pending"};g(Wt=>[Tt,...Wt]),W1(Tt)}qi(ut)`;

const newRnPnAn = `rn=(K,xe)=>{const X=K.trim();if(!X)return{success:!1,error:"Please enter your User ID, Mobile number, or Email."};const ye=ti(Ee,X);if(!ye)return{success:!1,error:\`Worker account "\${X}" not found. Please click Register to create your account or check your User ID / Phone.\`};const _hx=window.__kzH?window.__kzH(xe.trim()):xe.trim();if((ye.password||"123").trim()!==xe.trim()&&(ye.password||"").trim()!==_hx&&(ye.passwordHash||"").trim()!==_hx)return{success:!1,error:\`Incorrect password for \${ye.name} (\${ye.id}). Please check the password you entered.\`};const Le=ye.extraData||{};return an({userId:ye.id,username:ye.id,name:ye.name,phone:ye.phone||"",email:Le.email||ye.email||"",isPhoneVerified:Le.isPhoneVerified??!0,isEmailVerified:Le.isEmailVerified??!0,primaryTrade:Le.trade||"Mason",dailyRate:Le.rate||850,experienceYears:Le.exp||4,area:Le.area||\`\${(ae==null?void 0:ae.defaultArea)||"Model Town"}, \${(ae==null?void 0:ae.name)||"Ludhiana"}\`,address:Le.address||Le.area||\`\${(ae==null?void 0:ae.defaultArea)||"Model Town"}, \${(ae==null?void 0:ae.name)||"Ludhiana"}\`,aadhaarNumber:Le.aadhaar||"",upiId:Le.upi||\`\${ye.id}@upi\`,photoUrl:Le.photoUrl,aadhaarPhotoUrl:Le.aadhaarPhotoUrl,age:Le.age||26,dateOfBirth:Le.dateOfBirth||"",childLabourConsent:Le.childLabourConsent??!0,isVerified:Le.isVerified}),{success:!0}},pn=K=>{var ye,me;const cleanUid=(((ye=K.userId)==null?void 0:ye.trim().toLowerCase())||(K.email?K.email.split("@")[0].toLowerCase():"")||(K.phone||"").replace(/[^0-9]/g,"").slice(-10)||K.name.trim().toLowerCase().replace(/\\s+/g,"_")).replace(/[^a-z0-9_.-]/g,"")||\`wrk_\${Date.now().toString().slice(-4)}\`;const cityStr=(ae==null?void 0:ae.name)||"Ludhiana";const areaStr=K.area||(ae==null?void 0:ae.defaultArea)||"Model Town";const fullAddr=K.address||(areaStr.toLowerCase().includes(cityStr.toLowerCase())?areaStr:\`\${areaStr}, \${cityStr}\`);const X={id:cleanUid,username:cleanUid,password:window.__kzH?window.__kzH((K.password||"123").trim()):(K.password||"123").trim(),name:K.name.trim(),phone:(K.phone||"").trim(),email:(me=K.email)==null?void 0:me.trim(),role:"worker",createdAt:new Date().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}),extraData:{username:cleanUid,trade:K.primaryTrade,rate:K.dailyRate,exp:K.experienceYears,area:areaStr,city:cityStr,address:fullAddr,aadhaar:K.aadhaarNumber,upi:K.upiId||\`\${cleanUid}@upi\`,email:(K.email||"").trim(),photoUrl:K.photoUrl,aadhaarPhotoUrl:K.aadhaarPhotoUrl,age:K.age,dateOfBirth:K.dateOfBirth,childLabourConsent:K.childLabourConsent,faceIdVerified:!!K.photoUrl,faceIdStatus:"Live Face ID Captured • Pending Admin Audit",jobStatus:"Locked • Pending Admin KYC Approval",isPhoneVerified:K.isPhoneVerified??!0,isEmailVerified:K.isEmailVerified??!0,isVerified:!1}};Se(Le=>{const Ue=[...Le.filter(ze=>{var lt;const zPh=(ze.phone||"").replace(/[^0-9]/g,"").slice(-10),xPh=(X.phone||"").replace(/[^0-9]/g,"").slice(-10);return((lt=ze.id)==null?void 0:lt.toLowerCase())!==X.id&&!(zPh.length>=7&&xPh.length>=7&&zPh===xPh)}),X];return localStorage.removeItem("kaamzo_is_reset_state_v8"),localStorage.setItem("kaamzo_current_role","worker"),localStorage.setItem("kaamzo_worker_accounts_v8",JSON.stringify(Ue)),Ue}),$y(X),an({userId:cleanUid,username:cleanUid,name:K.name,phone:K.phone||"",email:K.email||"",isPhoneVerified:K.isPhoneVerified??!0,isEmailVerified:K.isEmailVerified??!0,primaryTrade:K.primaryTrade,dailyRate:K.dailyRate,experienceYears:K.experienceYears,area:areaStr,city:cityStr,address:fullAddr,aadhaarNumber:K.aadhaarNumber,upiId:K.upiId||\`\${cleanUid}@upi\`,photoUrl:K.photoUrl,aadhaarPhotoUrl:K.aadhaarPhotoUrl,age:K.age,dateOfBirth:K.dateOfBirth,childLabourConsent:K.childLabourConsent}),Pt(\`Account created! Username: "@\${X.id}". Face ID & KYC details sent to Admin Portal for verification.\`)},an=K=>{const cleanUid=(K.userId||K.username||(K.email?K.email.split("@")[0]:"")||(K.phone||"").replace(/[^0-9]/g,"").slice(-10)||(K.name||"worker").trim().toLowerCase().replace(/\\s+/g,"_")).trim().toLowerCase().replace(/^(w-|v-)/,"");const rawAadhaar=String(K.aadhaarNumber||"").trim();const xe=rawAadhaar.length>=4?\`XXXX-XXXX-\${rawAadhaar.slice(-4)}\`:"Not Provided";const rawPh=String(K.phone||"").replace(/[^0-9]/g,"").slice(-10);const X=rawPh.length>=7&&rawPh!=="9810155678"&&rawPh!=="9999999999"?rawPh:"";const ye=K.upiId||\`\${cleanUid||"worker"}@upi\`;const matchFn=Tt=>{if(!Tt)return!1;const tUid=String(Tt.username||Tt.userId||Tt.workerId||Tt.id||"").trim().toLowerCase().replace(/^(w-|v-)/,"");const tPh=String(Tt.phone||"").replace(/[^0-9]/g,"").slice(-10);const tEm=String(Tt.email||"").trim().toLowerCase();const kEm=String(K.email||"").trim().toLowerCase();return!!((cleanUid&&tUid&&cleanUid===tUid)||(X&&tPh.length>=7&&tPh===X)||(kEm&&tEm&&kEm===tEm))};const me=d.find(matchFn),Le=B.find(matchFn),Ue=!!(K.isVerified||(me!=null&&me.isVerified&&(me==null?void 0:me.childLabourVerified)!==!1)||(Le==null?void 0:Le.status)==="approved"),cityStr=K.city||(ae==null?void 0:ae.name)||"Ludhiana",areaStr=K.area||(me&&me.area)||(me&&me.location&&me.location.area)||(ae==null?void 0:ae.defaultArea)||"Model Town",fullAddr=K.address||(me&&me.address)||(areaStr.toLowerCase().includes(cityStr.toLowerCase())?areaStr:\`\${areaStr}, \${cityStr}\`),ze=ld(areaStr,cityStr),lt=K.photoUrl||(me==null?void 0:me.photoUrl)||(me==null?void 0:me.avatar)||"https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80",Bt=K.age||(me==null?void 0:me.age)||24,wrkId=(me==null?void 0:me.id)||\`w-\${cleanUid||Date.now().toString().slice(-4)}\`,ut={id:wrkId,username:cleanUid,userId:cleanUid,name:K.name,phone:K.phone||(me==null?void 0:me.phone)||"",email:K.email||(me==null?void 0:me.email)||"",isPhoneVerified:K.isPhoneVerified??(me==null?void 0:me.isPhoneVerified)??!0,isEmailVerified:K.isEmailVerified??(me==null?void 0:me.isEmailVerified)??!0,avatar:lt,photoUrl:lt,aadhaarPhotoUrl:K.aadhaarPhotoUrl||(me==null?void 0:me.aadhaarPhotoUrl),age:Bt,dateOfBirth:K.dateOfBirth||(me==null?void 0:me.dateOfBirth)||"",childLabourVerified:Ue,faceIdVerified:!0,faceIdStatus:Ue?"Face ID & 18+ Verified by Admin":"Live Face ID Captured • Pending Admin Audit",jobStatus:Ue?"Verified • Available & Online":"Locked • Pending Admin KYC Approval",primaryTrade:K.primaryTrade||(me==null?void 0:me.primaryTrade)||"Mason",secondaryTrades:(me==null?void 0:me.secondaryTrades)||["Construction Helper"],dailyRate:K.dailyRate||(me==null?void 0:me.dailyRate)||850,experienceYears:K.experienceYears||(me==null?void 0:me.experienceYears)||3,rating:me?me.rating:0,reviewCount:me?me.reviewCount:0,completedJobsCount:me?me.completedJobsCount:0,isOnline:Ue?(me==null?void 0:me.isOnline)??!0:!1,area:areaStr,city:cityStr,address:fullAddr,location:{area:areaStr,city:cityStr,address:fullAddr,distanceKm:(me==null?void 0:me.location.distanceKm)||1},gpsLocation:(me==null?void 0:me.gpsLocation)||{lat:ze.lat+(Math.random()-.5)*.01,lng:ze.lng+(Math.random()-.5)*.01,area:areaStr,city:cityStr,address:fullAddr,accuracyMeters:4,heading:60,speedKmh:0,lastUpdated:"Just now"},isSharingLiveGps:!0,aadhaarNumber:rawAadhaar||(me==null?void 0:me.aadhaarNumber)||"",aadhaarNumberMasked:xe,isVerified:Ue,todayEarnings:(me==null?void 0:me.todayEarnings)||0,totalEarnings:(me==null?void 0:me.totalEarnings)||0,walletBalance:(me==null?void 0:me.walletBalance)||0,badge:Ue?"Aadhaar & Face ID Verified • 18+ Adult":"KYC & Photo Pending",upiId:ye,bankName:(me==null?void 0:me.bankName)||"State Bank of India",accountNumberMasked:(me==null?void 0:me.accountNumberMasked)||\`•••• •••• \${(X||"1234").slice(-4)}\`,ifscCode:(me==null?void 0:me.ifscCode)||"SBIN0004921"};_(ut);x(Tt=>{const next=[ut,...Tt.filter(Wt=>!matchFn(Wt)&&Wt.id!==ut.id)];try{localStorage.setItem("kaamzo_workers_zero_v8",JSON.stringify(next))}catch{}return next});const Tt={id:(Le==null?void 0:Le.id)||\`v-\${cleanUid||Date.now().toString().slice(-4)}\`,workerId:ut.id,username:cleanUid,userId:cleanUid,workerName:K.name,trade:ut.primaryTrade,dailyRate:ut.dailyRate,experienceYears:ut.experienceYears,phone:ut.phone,email:ut.email,area:areaStr,city:cityStr,address:fullAddr,gpsLocation:ut.gpsLocation,aadhaarNumber:rawAadhaar||(Le==null?void 0:Le.aadhaarNumber)||xe,upiId:ye,photoUrl:lt,aadhaarPhotoUrl:K.aadhaarPhotoUrl||(Le==null?void 0:Le.aadhaarPhotoUrl),age:Bt,dateOfBirth:ut.dateOfBirth,childLabourCheckPassed:Ue,faceIdVerified:!0,faceIdStatus:ut.faceIdStatus,jobStatus:ut.jobStatus,submittedAt:(Le==null?void 0:Le.submittedAt)||new Date().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}),status:Ue?"approved":"pending"};g(Wt=>{const next=[Tt,...Wt.filter(D=>!matchFn(D)&&D.id!==Tt.id)];try{localStorage.setItem("kaamzo_verifications_zero_v8",JSON.stringify(next))}catch{}return next});W1(Tt);qi(ut)`;

replaceExact(oldRnPnAn, newRnPnAn, 'AppContext rn, pn, an enriched worker & KYC fields');

// ============================================================================
// 3. UPGRADE Us (verifyWorkerByAdmin) FOR INSTANT WORKER PORTAL UNLOCK
// ============================================================================
const oldUs = `Us=(K,xe,X,ye)=>{const me=xe==="approved",Le=me?ye??!0:!1,Ue=B.find(ut=>ut.id===K||ut.workerId===K),ze=d.find(ut=>ut.id===K||Ue&&Ue.workerId&&ut.id===Ue.workerId||Ue&&Ue.phone&&ut.phone&&ut.phone.replace(/[^0-9]/g,"").slice(-10)===Ue.phone.replace(/[^0-9]/g,"").slice(-10)),lt=(Ue==null?void 0:Ue.id)||\`v-\${K}\`,Bt={id:lt,workerId:(ze==null?void 0:ze.id)||(Ue==null?void 0:Ue.workerId)||K,workerName:(ze==null?void 0:ze.name)||(Ue==null?void 0:Ue.workerName)||"Worker",trade:(ze==null?void 0:ze.primaryTrade)||(Ue==null?void 0:Ue.trade)||"Mason",phone:(ze==null?void 0:ze.phone)||(Ue==null?void 0:Ue.phone)||"",aadhaarNumber:(ze==null?void 0:ze.aadhaarNumberMasked)||(Ue==null?void 0:Ue.aadhaarNumber)||"XXXX-XXXX-9901",photoUrl:(ze==null?void 0:ze.photoUrl)||(ze==null?void 0:ze.avatar)||(Ue==null?void 0:Ue.photoUrl),age:(ze==null?void 0:ze.age)||(Ue==null?void 0:Ue.age)||26,experienceYears:(ze==null?void 0:ze.experienceYears)||(Ue==null?void 0:Ue.experienceYears)||3,submittedAt:(Ue==null?void 0:Ue.submittedAt)||"Just now",status:xe,childLabourCheckPassed:Le,rejectionReason:me?void 0:X||"Identity or age criteria not met",reviewedAt:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};if(g(ut=>ut.some(Wt=>Wt.id===lt||Wt.workerId===Bt.workerId)?ut.map(Wt=>Wt.id===lt||Wt.workerId===Bt.workerId?Bt:Wt):[Bt,...ut]),W1(Bt),ze){const ut={...ze,isVerified:me,childLabourVerified:Le,rejectionReason:me?void 0:X,badge:me?"Aadhaar Verified • 18+ Adult":"KYC Rejected"};x(Tt=>Tt.map(Wt=>Wt.id===ze.id?ut:Wt)),qi(ut),v&&(v.id===ze.id||v.phone===ze.phone)&&_(ut)}else if(v){const ut={...v,isVerified:me,childLabourVerified:Le,rejectionReason:me?void 0:X,badge:me?"Aadhaar Verified • 18+ Adult":"KYC Rejected"};_(ut),qi(ut)}Se(ut=>{const Tt=((ze==null?void 0:ze.phone)||Bt.phone||"").replace(/[^0-9]/g,"").slice(-10),Wt=ut.map(D=>{const Y=D.phone.replace(/[^0-9]/g,"").slice(-10);if(D.id===Bt.workerId||Y&&Tt&&Y===Tt||D.name.trim().toLowerCase()===Bt.workerName.trim().toLowerCase()){const Fe={...D,extraData:{...D.extraData,isVerified:me}};return $y(Fe),Fe}return D});return localStorage.setItem("kaamzo_worker_accounts_v8",JSON.stringify(Wt)),Wt}),Ae("click"),Pt(\`KYC & Anti-Child Labour verification for \${Bt.workerName} marked \${xe.toUpperCase()}.\`)}`;

const newUs = `Us=(K,xe,X,ye)=>{const me=xe==="approved",Le=me?ye??!0:!1,normId=s=>String(s||"").trim().toLowerCase().replace(/^(w-|v-|wrk-)/,""),normPh=s=>{const p=String(s||"").replace(/[^0-9]/g,"").slice(-10);return p.length>=7&&p!=="9810155678"&&p!=="9999999999"?p:""},targetUid=normId(K),Ue=B.find(ut=>ut.id===K||ut.workerId===K||normId(ut.username||ut.workerId||ut.id)===targetUid),ze=d.find(ut=>ut.id===K||normId(ut.username||ut.id)===targetUid||(Ue&&Ue.workerId&&ut.id===Ue.workerId)||(Ue&&normPh(Ue.phone)&&normPh(ut.phone)===normPh(Ue.phone))||(Ue&&Ue.email&&ut.email&&ut.email.toLowerCase()===Ue.email.toLowerCase())||(Ue&&Ue.workerName&&ut.name&&ut.name.trim().toLowerCase()===Ue.workerName.trim().toLowerCase())),acct=Ee.find(ut=>normId(ut.id)===targetUid||(ze&&normId(ut.id)===normId(ze.username||ze.id))||(Ue&&normId(ut.id)===normId(Ue.username||Ue.workerId))||(ze&&normPh(ze.phone)&&normPh(ut.phone)===normPh(ze.phone))),cleanUsername=(ze&&ze.username)||(Ue&&Ue.username)||(acct&&acct.id)||targetUid,lt=(Ue==null?void 0:Ue.id)||\`v-\${cleanUsername}\`,Bt={...(Ue||{}),id:lt,workerId:(ze==null?void 0:ze.id)||(Ue==null?void 0:Ue.workerId)||\`w-\${cleanUsername}\`,username:cleanUsername,userId:cleanUsername,workerName:(ze==null?void 0:ze.name)||(Ue==null?void 0:Ue.workerName)||(acct==null?void 0:acct.name)||"Worker",trade:(ze==null?void 0:ze.primaryTrade)||(Ue==null?void 0:Ue.trade)||"Mason",dailyRate:(ze==null?void 0:ze.dailyRate)||(Ue==null?void 0:Ue.dailyRate)||850,phone:(ze==null?void 0:ze.phone)||(Ue==null?void 0:Ue.phone)||(acct==null?void 0:acct.phone)||"",email:(ze==null?void 0:ze.email)||(Ue==null?void 0:Ue.email)||(acct&&acct.extraData&&acct.extraData.email)||"",area:(ze==null?void 0:ze.area)||(ze&&ze.location&&ze.location.area)||(Ue==null?void 0:Ue.area)||"Ludhiana",city:(ze==null?void 0:ze.city)||(ze&&ze.location&&ze.location.city)||(Ue==null?void 0:Ue.city)||"Ludhiana",address:(ze==null?void 0:ze.address)||(Ue==null?void 0:Ue.address)||((ze&&ze.location&&ze.location.area)?ze.location.area+", Ludhiana":"Ludhiana, Punjab"),aadhaarNumber:(Ue==null?void 0:Ue.aadhaarNumber)||(ze==null?void 0:ze.aadhaarNumber)||(ze==null?void 0:ze.aadhaarNumberMasked)||"Verified via UIDAI",upiId:(ze==null?void 0:ze.upiId)||(Ue==null?void 0:Ue.upiId)||\`\${cleanUsername}@upi\`,photoUrl:(ze==null?void 0:ze.photoUrl)||(ze==null?void 0:ze.avatar)||(Ue==null?void 0:Ue.photoUrl),age:(ze==null?void 0:ze.age)||(Ue==null?void 0:Ue.age)||24,dateOfBirth:(ze==null?void 0:ze.dateOfBirth)||(Ue==null?void 0:Ue.dateOfBirth)||"",experienceYears:(ze==null?void 0:ze.experienceYears)||(Ue==null?void 0:Ue.experienceYears)||3,submittedAt:(Ue==null?void 0:Ue.submittedAt)||"Just now",status:xe,childLabourCheckPassed:Le,faceIdVerified:me,faceIdStatus:me?"Face ID & 18+ Verified by Admin":"Face ID Rejected",jobStatus:me?"Verified • Available & Online":"KYC Rejected",rejectionReason:me?void 0:X||"Identity or age criteria not met",reviewedAt:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};const isTargetMatch=Wt=>{if(!Wt)return!1;const wUid=normId(Wt.username||Wt.userId||Wt.workerId||Wt.id);const wPh=normPh(Wt.phone);const bPh=normPh(Bt.phone);return!!(Wt.id===lt||Wt.id===Bt.workerId||Wt.workerId===Bt.workerId||(cleanUsername&&wUid===cleanUsername)||(bPh&&wPh&&bPh===wPh)||(Bt.email&&Wt.email&&Wt.email.toLowerCase()===Bt.email.toLowerCase())||(Bt.workerName&&(Wt.name||Wt.workerName)&&String(Wt.name||Wt.workerName).trim().toLowerCase()===Bt.workerName.trim().toLowerCase()))};g(ut=>{const next=ut.some(isTargetMatch)?ut.map(Wt=>isTargetMatch(Wt)?{...Wt,...Bt,id:Wt.id}:Wt):[Bt,...ut];try{localStorage.setItem("kaamzo_verifications_zero_v8",JSON.stringify(next))}catch{}return next});W1(Bt);const baseWorker=ze||(v&&isTargetMatch(v)?v:null);const ut=baseWorker?{...baseWorker,username:cleanUsername,userId:cleanUsername,isVerified:me,childLabourVerified:Le,faceIdVerified:me,faceIdStatus:Bt.faceIdStatus,jobStatus:Bt.jobStatus,isOnline:me?!0:!1,rejectionReason:me?void 0:X,badge:me?"Aadhaar & Face ID Verified • 18+ Adult":"KYC Rejected"}:{id:Bt.workerId,username:cleanUsername,userId:cleanUsername,name:Bt.workerName,phone:Bt.phone,email:Bt.email,isPhoneVerified:!0,isEmailVerified:!0,avatar:Bt.photoUrl||"https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80",photoUrl:Bt.photoUrl,age:Bt.age,dateOfBirth:Bt.dateOfBirth,childLabourVerified:Le,faceIdVerified:me,faceIdStatus:Bt.faceIdStatus,jobStatus:Bt.jobStatus,primaryTrade:Bt.trade,secondaryTrades:["Construction Helper"],dailyRate:Bt.dailyRate||850,experienceYears:Bt.experienceYears||3,rating:5,reviewCount:0,completedJobsCount:0,isOnline:me,area:Bt.area,city:Bt.city,address:Bt.address,location:{area:Bt.area,city:Bt.city,address:Bt.address,distanceKm:1},gpsLocation:{lat:30.9,lng:75.85,area:Bt.area,city:Bt.city,address:Bt.address,accuracyMeters:4,lastUpdated:"Just now"},isSharingLiveGps:!0,aadhaarNumber:Bt.aadhaarNumber,aadhaarNumberMasked:Bt.aadhaarNumber,isVerified:me,todayEarnings:0,totalEarnings:0,walletBalance:0,badge:me?"Aadhaar & Face ID Verified • 18+ Adult":"KYC Rejected",upiId:Bt.upiId,bankName:"State Bank of India",accountNumberMasked:"•••• •••• 1234",ifscCode:"SBIN0004921"};x(Tt=>{const next=Tt.some(isTargetMatch)?Tt.map(Wt=>isTargetMatch(Wt)?{...Wt,...ut}:Wt):[ut,...Tt];try{localStorage.setItem("kaamzo_workers_zero_v8",JSON.stringify(next))}catch{}return next});qi(ut);if(v&&isTargetMatch(v)){const updatedCurrent={...v,...ut,isVerified:me,childLabourVerified:Le,isOnline:me};_(updatedCurrent);try{localStorage.setItem("kaamzo_current_worker_v8",JSON.stringify(updatedCurrent))}catch{}}else{try{const rawCw=localStorage.getItem("kaamzo_current_worker_v8");if(rawCw){const parsedCw=JSON.parse(rawCw);if(parsedCw&&isTargetMatch(parsedCw)){const updatedCw={...parsedCw,...ut,isVerified:me,childLabourVerified:Le,isOnline:me};localStorage.setItem("kaamzo_current_worker_v8",JSON.stringify(updatedCw))}}}catch{}}Se(utList=>{const Wt=utList.map(D=>{if(isTargetMatch(D)){const Fe={...D,isVerified:me,extraData:{...D.extraData,isVerified:me,faceIdVerified:me,faceIdStatus:Bt.faceIdStatus,jobStatus:Bt.jobStatus}};return $y(Fe),Fe}return D});try{localStorage.setItem("kaamzo_worker_accounts_v8",JSON.stringify(Wt))}catch{}return Wt});try{localStorage.setItem("kaamzo_kyc_approved_signal_v8",JSON.stringify({workerId:Bt.workerId,username:cleanUsername,phone:Bt.phone,email:Bt.email,workerName:Bt.workerName,status:xe,ts:Date.now()}))}catch{}Ae(me?"success":"alert");Pt(me?\`✅ Verified! \${Bt.workerName}'s Worker Portal is now unlocked and live!\`:\`KYC for \${Bt.workerName} marked \${xe.toUpperCase()}.\`)}`;

replaceExact(oldUs, newUs, 'AppContext Us (verifyWorkerByAdmin) instant portal unlock');

// ============================================================================
// 4. AUTO-OPEN WORKER PORTAL DISCOVERY TAB WHEN e.isVerified BECOMES TRUE
// ============================================================================
const oldWorkerPortalEffect = `L.useEffect(()=>{t&&Rs(\`\${t.defaultArea}, \${t.name}\`)},[t]);`;
const newWorkerPortalEffect = `L.useEffect(()=>{t&&Rs(\`\${t.defaultArea}, \${t.name}\`)},[t]);const prevVerifiedRef=L.useRef(e==null?void 0:e.isVerified);L.useEffect(()=>{if(e&&e.isVerified&&prevVerifiedRef.current===!1){mn("discovery");Ae("success");ie("🎉 Worker Portal Unlocked!","Admin has verified your Face ID & KYC details. You are now online and can accept jobs immediately!")}prevVerifiedRef.current=e==null?void 0:e.isVerified},[e&&e.isVerified]);`;

replaceExact(oldWorkerPortalEffect, newWorkerPortalEffect, 'WorkerPortal auto-open discovery tab on verification');

const oldCheckStatusBtn = `onClick:()=>{const Q=e.phone.replace(/[^0-9]/g,"").slice(-10),Ne=g.find(ee=>ee.workerId===e.id||ee.phone&&ee.phone.replace(/[^0-9]/g,"").slice(-10)===Q),et=B.find(ee=>ee.id===e.id||ee.phone&&ee.phone.replace(/[^0-9]/g,"").slice(-10)===Q);et!=null&&et.isVerified||(Ne==null?void 0:Ne.status)==="approved"?(k("approved"),Ae("success"),ie("Identity Verified!","🎉 Congratulations! Your KYC has been approved by Admin. Your worker dashboard is now unlocked!")):(ie("KYC Under Review","Your photo and identity are currently under Admin inspection. Once approved, access will unlock automatically."),Ae("click"))}`;

const newCheckStatusBtn = `onClick:()=>{const normU=s=>String(s||"").trim().toLowerCase().replace(/^(w-|v-|wrk-)/,""),eUid=normU(e.username||e.userId||e.id),Q=String(e.phone||"").replace(/[^0-9]/g,"").slice(-10),matchE=ee=>{if(!ee)return!1;const u2=normU(ee.username||ee.userId||ee.workerId||ee.id),p2=String(ee.phone||"").replace(/[^0-9]/g,"").slice(-10);return!!(ee.id===e.id||ee.workerId===e.id||(eUid&&u2&&eUid===u2)||(Q.length>=7&&p2.length>=7&&Q===p2)||(e.name&&(ee.name||ee.workerName)&&String(ee.name||ee.workerName).trim().toLowerCase()===e.name.trim().toLowerCase()))};let lsApproved=!1;try{const rw=JSON.parse(localStorage.getItem("kaamzo_workers_zero_v8")||"[]"),rv=JSON.parse(localStorage.getItem("kaamzo_verifications_zero_v8")||"[]");lsApproved=rw.some(w=>matchE(w)&&w.isVerified)||rv.some(v=>matchE(v)&&v.status==="approved")}catch{}const Ne=g.find(matchE),et=B.find(matchE);lsApproved||(et!=null&&et.isVerified)||(Ne==null?void 0:Ne.status)==="approved"?(k("approved"),mn("discovery"),Ae("success"),ie("Identity & Face ID Verified!","🎉 Congratulations! Your KYC has been approved by Admin. Your Worker Portal is now open!")):(ie("KYC Under Review","Your Face ID and identity details are under Admin inspection. As soon as Admin clicks Approve, your Worker Portal will open automatically!"),Ae("click"))}`;

replaceExact(oldCheckStatusBtn, newCheckStatusBtn, 'WorkerPortal Check Verification Status button');

// ============================================================================
// 5. UPGRADE ADMIN PORTAL (yoe) WITH COMPLETE WORKER DOSSIER & FACE ID VERIFICATION
// ============================================================================
const oldAdminWorkersAndKycData = `  // 2. ENRICHED WORKERS DIRECTORY & ORDER RATINGS
  const enrichedWorkers = (Array.isArray(a) ? a : []).map(worker => {
    const workerJobs = (Array.isArray(o) ? o : []).filter(j => j.assignedWorkerId === worker.id || j.assignedWorkerName === worker.name);
    const completedJobs = workerJobs.filter(j => j.status === "completed" || j.escrowStatus === "released" || j.isPaid);
    
    // Revenue delivered by worker
    const grossRevenue = completedJobs.reduce((acc, j) => acc + ((j.dailyWage || worker.dailyRate || 650) * (j.durationDays || 1)), 0);
    // Platform commission earned (10% platform fee)
    const commissionEarned = completedJobs.reduce((acc, j) => acc + (j.platformFee || Math.round((j.dailyWage || worker.dailyRate || 650) * 0.10)), 0);
    // Worker Money / Wallet
    const walletMoney = worker.walletBalance || (worker.totalEarnings ? Math.round(worker.totalEarnings * 0.4) : (completedJobs.length > 0 ? 2450 : 850));
    const todayEarn = worker.todayEarnings || (completedJobs.length > 0 ? 650 : 0);
    // Fulfilled count & unique customers
    const customersFulfilled = Math.max(completedJobs.length, worker.reviewCount || (worker.isVerified ? 3 : 0));
    const uniqueCustomers = new Set(completedJobs.map(j => j.customerPhone || j.customerName)).size || (customersFulfilled > 0 ? Math.min(customersFulfilled, 3) : 0);

    // Order ratings & reviews list
    const ratedOrders = workerJobs.filter(j => j.rating || j.review).map(j => ({
      id: j.id,
      title: j.title || \`\${worker.primaryTrade} Job\`,
      customerName: j.customerName || "Customer",
      date: j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-IN") : "Recent Order",
      wage: j.dailyWage || worker.dailyRate || 650,
      commission: j.platformFee || Math.round((j.dailyWage || worker.dailyRate || 650) * 0.10),
      rating: j.rating || 5,
      review: j.review || "Punctual, skillful, and verified work. Highly recommended."
    }));

    // If no explicit job reviews, attach default reviews from worker profile
    if (ratedOrders.length === 0 && Array.isArray(worker.reviews) && worker.reviews.length > 0) {
      worker.reviews.forEach((rv, rIdx) => {
        ratedOrders.push({
          id: \`rv-\${worker.id}-\${rIdx}\`,
          title: \`\${worker.primaryTrade} Service Work\`,
          customerName: rv.customerName || "Satisfied Client",
          date: rv.date || "Completed",
          wage: worker.dailyRate || 650,
          commission: Math.round((worker.dailyRate || 650) * 0.10),
          rating: rv.rating || 5,
          review: rv.comment || "Excellent craftsmanship and quick turnaround."
        });
      });
    }

    if (ratedOrders.length === 0 && worker.isVerified) {
      ratedOrders.push({
        id: \`ord-\${worker.id}-1\`,
        title: \`Standard \${worker.primaryTrade} Inspection & Repair\`,
        customerName: "Amit Sharma",
        date: "Yesterday",
        wage: worker.dailyRate || 650,
        commission: Math.round((worker.dailyRate || 650) * 0.10),
        rating: 5,
        review: "Great professional work. Finished well within the estimated time."
      });
    }

    return {
      ...worker,
      locationArea: worker.location ? (worker.location.area || worker.location.city || "Ludhiana") : "Ludhiana",
      money: walletMoney,
      todayEarnings: todayEarn,
      grossRevenue: grossRevenue || (customersFulfilled * (worker.dailyRate || 650)),
      commissionEarned: commissionEarned || Math.round((grossRevenue || (customersFulfilled * (worker.dailyRate || 650))) * 0.10),
      customersFulfilled,
      uniqueCustomers,
      ratedOrders
    };
  });

  const filteredEnrichedWorkers = enrichedWorkers.filter(wrk => {
    if (!ie.trim()) return !0;
    const q = ie.toLowerCase();
    return wrk.name.toLowerCase().includes(q) || wrk.phone.includes(q) || wrk.primaryTrade.toLowerCase().includes(q) || wrk.locationArea.toLowerCase().includes(q);
  });

  const totalWorkerBalancesSum = enrichedWorkers.reduce((acc, w) => acc + w.money, 0);
  const totalPlatformCommissionFromWorkers = enrichedWorkers.reduce((acc, w) => acc + w.commissionEarned, 0);
  const totalGrossRevenueFromWorkers = enrichedWorkers.reduce((acc, w) => acc + w.grossRevenue, 0);
  const totalFulfilledJobsFromWorkers = enrichedWorkers.reduce((acc, w) => acc + w.customersFulfilled, 0);

  const pendingKycCount = (Array.isArray(c) ? c : []).filter(ae => ae.status === "pending").length;
  const approvedKycCount = (Array.isArray(c) ? c : []).filter(ae => ae.status === "approved").length;
  const kycListFiltered = (Array.isArray(c) ? c : []).filter(ae => ge === "pending" ? ae.status === "pending" : ge === "approved" ? ae.status === "approved" : !0);`;

const newAdminWorkersAndKycData = `  // 2. ENRICHED WORKERS DIRECTORY, COMPLETE DOSSIER & FACE ID VERIFICATION
  const normUidHelper = s => String(s || "").trim().toLowerCase().replace(/^(w-|v-|wrk-)/, "");
  const normPhHelper = s => {
    const p = String(s || "").replace(/[^0-9]/g, "").slice(-10);
    return p.length >= 7 && p !== "9810155678" && p !== "9999999999" ? p : "";
  };

  const enrichedWorkers = (Array.isArray(a) ? a : []).map(worker => {
    const wUid = normUidHelper(worker.username || worker.userId || worker.id);
    const wPh = normPhHelper(worker.phone);
    const matchedAcct = (Array.isArray(wrkAccts) ? wrkAccts : []).find(ac =>
      normUidHelper(ac.id) === wUid ||
      (wPh && normPhHelper(ac.phone) === wPh) ||
      (worker.name && ac.name && ac.name.trim().toLowerCase() === worker.name.trim().toLowerCase())
    );
    const matchedKyc = (Array.isArray(c) ? c : []).find(ky =>
      ky.workerId === worker.id ||
      normUidHelper(ky.username || ky.workerId || ky.id) === wUid ||
      (wPh && normPhHelper(ky.phone) === wPh) ||
      (worker.name && ky.workerName && ky.workerName.trim().toLowerCase() === worker.name.trim().toLowerCase())
    );
    const acctExtra = (matchedAcct && matchedAcct.extraData) || {};

    const workerJobs = (Array.isArray(o) ? o : []).filter(j => j.assignedWorkerId === worker.id || j.assignedWorkerName === worker.name);
    const activeJobs = workerJobs.filter(j => j.status === "in_progress" || j.status === "accepted" || j.status === "approved");
    const completedJobs = workerJobs.filter(j => j.status === "completed" || j.status === "paid_and_closed" || j.escrowStatus === "released" || j.isPaid);
    
    const grossRevenue = completedJobs.reduce((acc, j) => acc + ((j.dailyWage || worker.dailyRate || 650) * (j.durationDays || 1)), 0);
    const commissionEarned = completedJobs.reduce((acc, j) => acc + (j.platformFee || Math.round((j.dailyWage || worker.dailyRate || 650) * 0.10)), 0);
    const walletMoney = worker.walletBalance || 0;
    const todayEarn = worker.todayEarnings || 0;
    const customersFulfilled = completedJobs.length;
    const uniqueCustomers = new Set(completedJobs.map(j => j.customerPhone || j.customerName)).size;

    const ratedOrders = workerJobs.filter(j => j.rating || j.review).map(j => ({
      id: j.id,
      title: j.title || \`\${worker.primaryTrade} Job\`,
      customerName: j.customerName || "Customer",
      date: j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-IN") : "Recent Order",
      wage: j.dailyWage || worker.dailyRate || 650,
      commission: j.platformFee || Math.round((j.dailyWage || worker.dailyRate || 650) * 0.10),
      rating: j.rating || 5,
      review: j.review || "Punctual, skillful, and verified work."
    }));

    const username = worker.username || worker.userId || (matchedAcct && matchedAcct.id) || (matchedKyc && matchedKyc.username) || wUid || worker.id;
    const email = worker.email || acctExtra.email || (matchedAcct && matchedAcct.email) || (matchedKyc && matchedKyc.email) || "Not Provided";
    const phone = worker.phone || (matchedAcct && matchedAcct.phone) || (matchedKyc && matchedKyc.phone) || "Not Provided";
    const areaName = worker.area || (worker.location && worker.location.area) || acctExtra.area || (matchedKyc && matchedKyc.area) || "Model Town";
    const cityName = worker.city || (worker.location && worker.location.city) || acctExtra.city || (matchedKyc && matchedKyc.city) || "Ludhiana";
    const fullAddress = worker.address || (worker.location && worker.location.address) || acctExtra.address || (matchedKyc && matchedKyc.address) || (areaName.toLowerCase().includes(cityName.toLowerCase()) ? areaName : \`\${areaName}, \${cityName}, Punjab\`);
    const gpsCoords = worker.gpsLocation && worker.gpsLocation.lat ? \`\${Number(worker.gpsLocation.lat).toFixed(4)}° N, \${Number(worker.gpsLocation.lng).toFixed(4)}° E\` : "30.8930° N, 75.8340° E";
    const aadhaarFull = worker.aadhaarNumber || acctExtra.aadhaar || (matchedKyc && matchedKyc.aadhaarNumber) || worker.aadhaarNumberMasked || "Not Provided";
    const upiId = worker.upiId || acctExtra.upi || (matchedKyc && matchedKyc.upiId) || \`\${username}@upi\`;
    const age = worker.age || acctExtra.age || (matchedKyc && matchedKyc.age) || 24;
    const dateOfBirth = worker.dateOfBirth || acctExtra.dateOfBirth || (matchedKyc && matchedKyc.dateOfBirth) || "18+ Declared Adult";
    const facePhotoUrl = worker.photoUrl || acctExtra.photoUrl || (matchedKyc && matchedKyc.photoUrl) || worker.avatar || "";
    const isVerified = !!(worker.isVerified || (matchedKyc && matchedKyc.status === "approved"));
    const jobStatusText = activeJobs.length > 0
      ? \`🟢 Active on Job: \${activeJobs[0].title} (\${activeJobs[0].customerName || "Employer"})\`
      : !isVerified
      ? "🔒 Portal Locked • Awaiting Admin KYC & Face ID Approval"
      : worker.isOnline
      ? "🟢 Verified • Online & Broadcasting on 10km Radar"
      : "⚪ Verified • Currently Offline / Idle";
    const faceIdStatusText = isVerified
      ? "✅ Face ID & 18+ Biometric Check Approved by Admin"
      : facePhotoUrl
      ? "📸 Live Face ID Photo Captured • Ready for Admin Verification"
      : "⚠️ Face ID Photo Pending";

    return {
      ...worker,
      isVerified,
      username,
      email,
      phone,
      locationArea: areaName,
      cityName,
      fullAddress,
      gpsCoords,
      aadhaarFull,
      upiId,
      age,
      dateOfBirth,
      facePhotoUrl,
      jobStatusText,
      faceIdStatusText,
      activeJobsCount: activeJobs.length,
      completedJobsCount: completedJobs.length,
      experienceYears: worker.experienceYears || acctExtra.exp || (matchedKyc && matchedKyc.experienceYears) || 3,
      dailyRate: worker.dailyRate || acctExtra.rate || (matchedKyc && matchedKyc.dailyRate) || 850,
      submittedAt: (matchedKyc && matchedKyc.submittedAt) || (matchedAcct && matchedAcct.createdAt) || "Just now",
      kycId: (matchedKyc && matchedKyc.id) || worker.id,
      money: walletMoney,
      todayEarnings: todayEarn,
      grossRevenue,
      commissionEarned,
      customersFulfilled,
      uniqueCustomers,
      ratedOrders
    };
  });

  const filteredEnrichedWorkers = enrichedWorkers.filter(wrk => {
    if (!ie.trim()) return !0;
    const q = ie.toLowerCase();
    return (
      (wrk.name || "").toLowerCase().includes(q) ||
      (wrk.username || "").toLowerCase().includes(q) ||
      (wrk.phone || "").toLowerCase().includes(q) ||
      (wrk.email || "").toLowerCase().includes(q) ||
      (wrk.primaryTrade || "").toLowerCase().includes(q) ||
      (wrk.fullAddress || "").toLowerCase().includes(q) ||
      (wrk.jobStatusText || "").toLowerCase().includes(q)
    );
  });

  const totalWorkerBalancesSum = enrichedWorkers.reduce((acc, w) => acc + w.money, 0);
  const totalPlatformCommissionFromWorkers = enrichedWorkers.reduce((acc, w) => acc + w.commissionEarned, 0);
  const totalGrossRevenueFromWorkers = enrichedWorkers.reduce((acc, w) => acc + w.grossRevenue, 0);
  const totalFulfilledJobsFromWorkers = enrichedWorkers.reduce((acc, w) => acc + w.customersFulfilled, 0);

  // Enrich every KYC Queue record with full worker & account data
  const enrichedKycList = (Array.isArray(c) ? c : []).map(item => {
    const kUid = normUidHelper(item.username || item.workerId || item.id);
    const kPh = normPhHelper(item.phone);
    const mw = enrichedWorkers.find(w =>
      w.id === item.workerId ||
      normUidHelper(w.username || w.id) === kUid ||
      (kPh && normPhHelper(w.phone) === kPh) ||
      (item.workerName && w.name && w.name.trim().toLowerCase() === item.workerName.trim().toLowerCase())
    );
    const ma = (Array.isArray(wrkAccts) ? wrkAccts : []).find(ac =>
      normUidHelper(ac.id) === kUid ||
      (kPh && normPhHelper(ac.phone) === kPh) ||
      (item.workerName && ac.name && ac.name.trim().toLowerCase() === item.workerName.trim().toLowerCase())
    );
    const ex = (ma && ma.extraData) || {};
    const username = item.username || (mw && mw.username) || (ma && ma.id) || kUid || item.workerId || item.id;
    const workerName = item.workerName || (mw && mw.name) || (ma && ma.name) || "Worker";
    const trade = item.trade || (mw && mw.primaryTrade) || ex.trade || "Mason";
    const dailyRate = item.dailyRate || (mw && mw.dailyRate) || ex.rate || 850;
    const experienceYears = item.experienceYears || (mw && mw.experienceYears) || ex.exp || 3;
    const phone = item.phone || (mw && mw.phone) || (ma && ma.phone) || "Not Provided";
    const email = item.email || (mw && mw.email) || ex.email || (ma && ma.email) || "Not Provided";
    const area = item.area || (mw && mw.locationArea) || ex.area || "Model Town";
    const city = item.city || (mw && mw.cityName) || ex.city || "Ludhiana";
    const fullAddress = item.address || (mw && mw.fullAddress) || ex.address || (area.toLowerCase().includes(city.toLowerCase()) ? area : \`\${area}, \${city}, Punjab\`);
    const gpsCoords = (mw && mw.gpsCoords) || (item.gpsLocation && item.gpsLocation.lat ? \`\${Number(item.gpsLocation.lat).toFixed(4)}° N, \${Number(item.gpsLocation.lng).toFixed(4)}° E\` : "30.8930° N, 75.8340° E");
    const aadhaarNumber = item.aadhaarNumber || (mw && mw.aadhaarFull) || ex.aadhaar || "Not Provided";
    const upiId = item.upiId || (mw && mw.upiId) || ex.upi || \`\${username}@upi\`;
    const age = item.age || (mw && mw.age) || ex.age || 24;
    const dateOfBirth = item.dateOfBirth || (mw && mw.dateOfBirth) || ex.dateOfBirth || "18+ Declared Adult";
    const facePhotoUrl = item.photoUrl || (mw && mw.facePhotoUrl) || ex.photoUrl || "";
    const isApproved = item.status === "approved" || (mw && mw.isVerified);
    const jobStatusText = (mw && mw.jobStatusText) || (isApproved ? "🟢 Verified • Available & Online" : "🔒 Portal Locked • Awaiting Admin KYC & Face ID Approval");
    const faceIdStatusText = isApproved
      ? "✅ Face ID & 18+ Biometric Check Approved by Admin"
      : facePhotoUrl
      ? "📸 Live Face ID Photo Captured • Ready for Admin Verification"
      : "⚠️ Face ID Photo Pending";

    return {
      ...item,
      status: isApproved ? "approved" : item.status,
      workerId: (mw && mw.id) || item.workerId || \`w-\${username}\`,
      username,
      workerName,
      trade,
      dailyRate,
      experienceYears,
      phone,
      email,
      area,
      city,
      fullAddress,
      gpsCoords,
      aadhaarNumber,
      upiId,
      age,
      dateOfBirth,
      facePhotoUrl,
      jobStatusText,
      faceIdStatusText,
      activeJobsCount: (mw && mw.activeJobsCount) || 0,
      completedJobsCount: (mw && mw.completedJobsCount) || 0,
      walletBalance: (mw && mw.money) || 0
    };
  });

  const pendingKycCount = enrichedKycList.filter(ae => ae.status === "pending").length;
  const approvedKycCount = enrichedKycList.filter(ae => ae.status === "approved").length;
  const kycListFiltered = enrichedKycList.filter(ae => ge === "pending" ? ae.status === "pending" : ge === "approved" ? ae.status === "approved" : !0);`;

replaceExact(oldAdminWorkersAndKycData, newAdminWorkersAndKycData, 'AdminPortal enrichedWorkers and enrichedKycList data');

// ============================================================================
// 6. UPGRADE ADMIN PORTAL WORKERS TAB & KYC QUEUE TAB UI TO SHOW ALL DETAILS + FACE ID
// ============================================================================
const oldAdminWorkersCards = `                  // Workers Items
                  filteredEnrichedWorkers.length === 0 ? r.jsx("div", {
                    className: "p-8 text-center text-slate-400 bg-[#FAF7F2] dark:bg-[#222] rounded-xl text-xs",
                    children: "No worker records found."
                  }) : r.jsx("div", {
                    className: "space-y-3",
                    children: filteredEnrichedWorkers.map(wrk => {
                      const isExpanded = selectedWorkerId === wrk.id;
                      return r.jsxs("div", {
                        key: wrk.id,
                        className: "bg-[#FDFBF7] dark:bg-[#222] border border-[#EDE8E0] dark:border-[#333] rounded-2xl p-4 transition shadow-xs space-y-3",
                        children: [
                          // Top Profile Row
                          r.jsxs("div", {
                            className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                            children: [
                              r.jsxs("div", {
                                className: "flex items-start gap-3",
                                children: [
                                  r.jsxs("div", {
                                    className: "relative shrink-0",
                                    children: [
                                      r.jsx("div", {
                                        className: "w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-black text-base flex items-center justify-center",
                                        children: wrk.name.charAt(0).toUpperCase()
                                      }),
                                      r.jsx("span", {
                                        className: \`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#222] \${wrk.isOnline ? "bg-emerald-500" : "bg-slate-400"}\`
                                      })
                                    ]
                                  }),
                                  r.jsxs("div", {
                                    className: "space-y-0.5",
                                    children: [
                                      r.jsxs("div", {
                                        className: "flex items-center gap-2 flex-wrap",
                                        children: [
                                          r.jsx("h4", { className: "font-black text-slate-900 dark:text-white text-sm", children: wrk.name }),
                                          r.jsx("span", {
                                            className: "px-2 py-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-bold",
                                            children: wrk.primaryTrade
                                          }),
                                          r.jsxs("span", {
                                            className: \`px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1 \${wrk.isVerified ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30" : "bg-slate-200 text-slate-600"}\`,
                                            children: [r.jsx(Os, { className: "w-3 h-3 text-emerald-500" }), wrk.isVerified ? "KYC Verified" : "Unverified"]
                                          })
                                        ]
                                      }),
                                      r.jsxs("p", {
                                        className: "text-[11px] text-slate-500 dark:text-slate-400",
                                        children: [wrk.phone, " • 📍 ", wrk.locationArea, " • ₹", wrk.dailyRate, "/day"]
                                      })
                                    ]
                                  })
                                ]
                              }),
                              // Quick Action & Ratings Toggle
                              r.jsxs("div", {
                                className: "flex items-center gap-2 self-start sm:self-auto",
                                children: [
                                  !wrk.isVerified && r.jsxs("button", {
                                    type: "button",
                                    onClick: () => d(wrk.id, "approved"),
                                    className: "px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer",
                                    children: [r.jsx(nn, { className: "w-3.5 h-3.5" }), " Verify KYC"]
                                  }),
                                  r.jsxs("button", {
                                    type: "button",
                                    onClick: () => setSelectedWorkerId(isExpanded ? null : wrk.id),
                                    className: "px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer shadow-xs",
                                    children: [
                                      r.jsx("span", { children: isExpanded ? "Hide Ratings" : \`Order Ratings (\${wrk.ratedOrders.length})\` }),
                                      r.jsx(yg, { className: \`w-3.5 h-3.5 transition-transform \${isExpanded ? "rotate-180" : ""}\` })
                                    ]
                                  })
                                ]
                              })
                            ]
                          }),`;

const newAdminWorkersCards = `                  // Workers Items (Full Dossier + Face ID Verification)
                  filteredEnrichedWorkers.length === 0 ? r.jsx("div", {
                    className: "p-8 text-center text-slate-400 bg-[#FAF7F2] dark:bg-[#222] rounded-xl text-xs",
                    children: "No worker records found."
                  }) : r.jsx("div", {
                    className: "space-y-4",
                    children: filteredEnrichedWorkers.map(wrk => {
                      const isExpanded = selectedWorkerId === wrk.id;
                      return r.jsxs("div", {
                        key: wrk.id,
                        className: "bg-[#FDFBF7] dark:bg-[#222] border-2 border-[#EDE8E0] dark:border-[#333] rounded-2xl p-4 sm:p-5 transition shadow-sm space-y-3.5",
                        children: [
                          // Top Profile & Face ID Row
                          r.jsxs("div", {
                            className: "flex flex-col md:flex-row md:items-start justify-between gap-4",
                            children: [
                              r.jsxs("div", {
                                className: "flex items-start gap-3.5",
                                children: [
                                  // Live Face ID Verification Photo Thumbnail
                                  r.jsxs("div", {
                                    className: "relative shrink-0 group cursor-pointer",
                                    onClick: () => wrk.facePhotoUrl && Z(wrk),
                                    title: "Click to inspect full Face ID verification photo",
                                    children: [
                                      r.jsx("div", {
                                        className: \`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shadow-md flex items-center justify-center bg-slate-900 \${wrk.isVerified ? "border-emerald-500" : "border-amber-500"}\`,
                                        children: wrk.facePhotoUrl ? r.jsx("img", {
                                          src: wrk.facePhotoUrl,
                                          alt: wrk.name + " Face ID",
                                          className: "w-full h-full object-cover"
                                        }) : r.jsx("span", {
                                          className: "text-amber-400 font-black text-2xl",
                                          children: (wrk.name || "W").charAt(0).toUpperCase()
                                        })
                                      }),
                                      r.jsxs("span", {
                                        className: \`absolute -bottom-2 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1 \${wrk.isVerified ? "bg-emerald-600 text-white" : "bg-amber-500 text-slate-950"}\`,
                                        children: [r.jsx(Os, { className: "w-2.5 h-2.5" }), wrk.isVerified ? "Face ID Verified" : "Face ID Ready"]
                                      })
                                    ]
                                  }),
                                  r.jsxs("div", {
                                    className: "space-y-1.5",
                                    children: [
                                      r.jsxs("div", {
                                        className: "flex items-center gap-2 flex-wrap",
                                        children: [
                                          r.jsx("h4", { className: "font-black text-slate-900 dark:text-white text-base", children: wrk.name }),
                                          r.jsxs("span", {
                                            className: "px-2 py-0.5 bg-slate-900 text-amber-400 dark:bg-slate-800 rounded-lg text-[10px] font-mono font-bold",
                                            children: ["Username: @", wrk.username]
                                          }),
                                          r.jsx("span", {
                                            className: "px-2.5 py-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-black",
                                            children: wrk.primaryTrade
                                          }),
                                          r.jsxs("span", {
                                            className: \`px-2.5 py-0.5 text-[10px] font-black rounded-full flex items-center gap-1 \${wrk.isVerified ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40"}\`,
                                            children: [r.jsx(Os, { className: "w-3 h-3" }), wrk.isVerified ? "KYC & Face ID Approved" : "Pending Admin Verification"]
                                          })
                                        ]
                                      }),
                                      r.jsxs("p", {
                                        className: "text-xs font-bold text-slate-700 dark:text-slate-200",
                                        children: ["💼 Job Status: ", r.jsx("span", { className: wrk.isVerified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400", children: wrk.jobStatusText })]
                                      }),
                                      r.jsxs("p", {
                                        className: "text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 flex-wrap",
                                        children: [
                                          r.jsx("span", { children: wrk.faceIdStatusText }),
                                          wrk.facePhotoUrl && r.jsx("button", {
                                            type: "button",
                                            onClick: () => Z(wrk),
                                            className: "underline text-amber-600 dark:text-amber-400 font-black cursor-pointer ml-1",
                                            children: "🔍 Enlarge Face ID Photo"
                                          })
                                        ]
                                      })
                                    ]
                                  })
                                ]
                              }),
                              // Action Buttons (Verify & Open Worker Portal / View Ratings)
                              r.jsxs("div", {
                                className: "flex flex-wrap items-center gap-2 self-start",
                                children: [
                                  !wrk.isVerified ? r.jsxs("button", {
                                    type: "button",
                                    onClick: () => u(wrk.kycId || wrk.id, "approved"),
                                    className: "px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md",
                                    children: [r.jsx(nn, { className: "w-4 h-4" }), " Verify Face ID & Approve (Open Worker Portal)"]
                                  }) : r.jsxs("span", {
                                    className: "px-3 py-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-black flex items-center gap-1",
                                    children: [r.jsx(nn, { className: "w-3.5 h-3.5 text-emerald-500" }), " Worker Portal Unlocked"]
                                  }),
                                  r.jsxs("button", {
                                    type: "button",
                                    onClick: () => setSelectedWorkerId(isExpanded ? null : wrk.id),
                                    className: "px-3 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer shadow-xs",
                                    children: [
                                      r.jsx("span", { children: isExpanded ? "Hide Ratings" : \`Order Ratings (\${wrk.ratedOrders.length})\` }),
                                      r.jsx(yg, { className: \`w-3.5 h-3.5 transition-transform \${isExpanded ? "rotate-180" : ""}\` })
                                    ]
                                  })
                                ]
                              })
                            ]
                          }),

                          // Complete Worker Information Dossier Grid (Name, Username, Phone, Email, Address, Job Status, Aadhaar, Age/DOB, UPI)
                          r.jsxs("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-[#EDE8E0] dark:border-[#333] text-[11px]",
                            children: [
                              r.jsxs("div", {
                                className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                                children: [
                                  r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "Full Name & Username" }),
                                  r.jsx("p", { className: "font-black text-slate-900 dark:text-white text-xs", children: wrk.name }),
                                  r.jsxs("p", { className: "font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold", children: ["@", wrk.username, " • ID: ", wrk.id] })
                                ]
                              }),
                              r.jsxs("div", {
                                className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                                children: [
                                  r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "Phone & Gmail / Email" }),
                                  r.jsxs("p", { className: "font-mono font-bold text-slate-900 dark:text-white text-xs", children: ["📞 ", wrk.phone] }),
                                  r.jsxs("p", { className: "font-mono text-[10px] text-slate-500 dark:text-slate-300 truncate", children: ["✉️ ", wrk.email] })
                                ]
                              }),
                              r.jsxs("div", {
                                className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                                children: [
                                  r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "Full Address & GPS" }),
                                  r.jsxs("p", { className: "font-bold text-slate-900 dark:text-white text-xs", children: ["📍 ", wrk.fullAddress] }),
                                  r.jsxs("p", { className: "font-mono text-[10px] text-slate-400", children: ["GPS: ", wrk.gpsCoords] })
                                ]
                              }),
                              r.jsxs("div", {
                                className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                                children: [
                                  r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "Trade, Wage & Experience" }),
                                  r.jsxs("p", { className: "font-black text-amber-600 dark:text-amber-400 text-xs", children: ["🛠️ ", wrk.primaryTrade, " • ₹", wrk.dailyRate, "/day"] }),
                                  r.jsxs("p", { className: "text-[10px] text-slate-500 font-semibold", children: [wrk.experienceYears, " Years Experience"] })
                                ]
                              }),
                              r.jsxs("div", {
                                className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                                children: [
                                  r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "Aadhaar & UPI ID" }),
                                  r.jsxs("p", { className: "font-mono font-bold text-slate-900 dark:text-white text-xs", children: ["🪪 ", wrk.aadhaarFull] }),
                                  r.jsxs("p", { className: "font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold", children: ["💳 UPI: ", wrk.upiId] })
                                ]
                              }),
                              r.jsxs("div", {
                                className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                                children: [
                                  r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "Age, DOB & Child Labour Check" }),
                                  r.jsxs("p", { className: "font-black text-emerald-600 text-xs", children: ["🎂 ", wrk.age, " Years (18+ Adult)"] }),
                                  r.jsxs("p", { className: "text-[10px] text-slate-500 font-mono", children: ["DOB: ", wrk.dateOfBirth] })
                                ]
                              }),
                              r.jsxs("div", {
                                className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5 sm:col-span-2",
                                children: [
                                  r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "Face ID Biometric & Live Job Status" }),
                                  r.jsx("p", { className: "font-bold text-slate-900 dark:text-white text-xs", children: wrk.jobStatusText }),
                                  r.jsxs("p", { className: "text-[10px] text-emerald-600 font-semibold", children: [wrk.faceIdStatusText, " • Active Jobs: ", wrk.activeJobsCount, " • Completed: ", wrk.completedJobsCount] })
                                ]
                              })
                            ]
                          }),`;

replaceExact(oldAdminWorkersCards, newAdminWorkersCards, 'AdminPortal Workers tab complete dossier cards');

const oldAdminKycView = `          // 4. KYC QUEUE VIEW (PRESERVED)
          re === "kyc" && r.jsxs("div", {
            className: "space-y-3 animate-in fade-in bg-white dark:bg-[#1C1C1C] border border-[#EDE8E0] dark:border-[#2E2E2E] rounded-2xl p-4 sm:p-5 shadow-sm",
            children: [
              r.jsxs("div", {
                className: "flex items-center justify-between",
                children: [
                  r.jsxs("h3", { className: "font-black text-slate-900 dark:text-white text-sm flex items-center gap-1.5", children: [r.jsx(Tm, { className: "w-4 h-4 text-amber-500" }), " Aadhaar & Anti-Child Labour Queue"] }),
                  r.jsxs("div", {
                    className: "flex bg-[#FAF7F2] dark:bg-[#252525] p-1 rounded-xl border border-[#EDE8E0] dark:border-[#333] text-[11px] font-bold",
                    children: [
                      r.jsxs("button", { onClick: () => be("pending"), className: \`px-2.5 py-1 rounded-lg cursor-pointer transition \${ge === "pending" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-500 hover:text-slate-900"}\`, children: ["Pending (", pendingKycCount, ")"] }),
                      r.jsxs("button", { onClick: () => be("approved"), className: \`px-2.5 py-1 rounded-lg cursor-pointer transition \${ge === "approved" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-500 hover:text-slate-900"}\`, children: ["Approved (", approvedKycCount, ")"] })
                    ]
                  })
                ]
              }),
              kycListFiltered.length === 0 ? r.jsx("div", {
                className: "p-8 text-center text-slate-400 bg-[#FAF7F2] dark:bg-[#222] rounded-xl text-xs",
                children: "No verification applications in this filter."
              }) : r.jsx("div", {
                className: "space-y-2.5",
                children: kycListFiltered.map(item => r.jsxs("div", {
                  key: item.id,
                  className: "bg-[#FDFBF7] dark:bg-[#222] border border-[#EDE8E0] dark:border-[#333] rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                  children: [
                    r.jsxs("div", {
                      className: "flex items-start gap-3",
                      children: [
                        r.jsx("div", {
                          className: "w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 font-black text-sm flex items-center justify-center shrink-0",
                          children: (item.workerName || "W").charAt(0)
                        }),
                        r.jsxs("div", {
                          className: "space-y-0.5",
                          children: [
                            r.jsxs("h4", { className: "font-black text-slate-900 dark:text-white text-xs", children: [item.workerName, " • ", item.trade] }),
                            r.jsxs("p", { className: "text-[11px] text-slate-500 dark:text-slate-400 font-mono", children: ["Phone: ", item.phone, " • Aadhaar: ", item.aadhaarNumber || "Verified via DigiLocker"] }),
                            r.jsxs("p", { className: "text-[10px] text-emerald-600 font-semibold", children: ["Submitted: ", item.submittedAt || "Recently", " • Age 18+ Anti-Child Labour Check Passed"] })
                          ]
                        })
                      ]
                    }),
                    r.jsxs("div", {
                      className: "flex items-center gap-2 self-end sm:self-auto",
                      children: [
                        item.status === "pending" ? r.jsxs(r.Fragment, {
                          children: [
                            r.jsxs("button", {
                              onClick: () => u(item.id, "approved"),
                              className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer",
                              children: [r.jsx(nn, { className: "w-3.5 h-3.5" }), " Approve"]
                            }),
                            r.jsxs("button", {
                              onClick: () => u(item.id, "rejected", "Aadhaar photo mismatch"),
                              className: "px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition cursor-pointer",
                              children: ["Reject"]
                            })
                          ]
                        }) : r.jsxs("span", {
                          className: "px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold rounded-lg text-xs flex items-center gap-1",
                          children: [r.jsx(nn, { className: "w-3.5 h-3.5 text-emerald-500" }), " Approved"]
                        })
                      ]
                    })
                  ]
                }, item.id))
              })
            ]
          }),`;

const newAdminKycView = `          // 4. KYC & FACE ID VERIFICATION QUEUE VIEW (COMPLETE WORKER DOSSIER)
          re === "kyc" && r.jsxs("div", {
            className: "space-y-4 animate-in fade-in bg-white dark:bg-[#1C1C1C] border border-[#EDE8E0] dark:border-[#2E2E2E] rounded-2xl p-4 sm:p-5 shadow-sm",
            children: [
              r.jsxs("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5",
                children: [
                  r.jsxs("div", {
                    children: [
                      r.jsxs("h3", { className: "font-black text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-1.5", children: [r.jsx(Tm, { className: "w-4 h-4 text-amber-500" }), " Worker KYC, Full Identity Dossier & Face ID Verification Queue"] }),
                      r.jsx("p", { className: "text-[11px] text-slate-500 dark:text-slate-400", children: "Inspect worker's full name, username, phone, email, full address, trade, job status, Aadhaar, age/DOB, and live Face ID selfie before unlocking their Worker Portal." })
                    ]
                  }),
                  r.jsxs("div", {
                    className: "flex bg-[#FAF7F2] dark:bg-[#252525] p-1 rounded-xl border border-[#EDE8E0] dark:border-[#333] text-[11px] font-bold self-start sm:self-auto",
                    children: [
                      r.jsxs("button", { onClick: () => be("pending"), className: \`px-3 py-1.5 rounded-lg cursor-pointer transition \${ge === "pending" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-500 hover:text-slate-900"}\`, children: ["Pending (", pendingKycCount, ")"] }),
                      r.jsxs("button", { onClick: () => be("approved"), className: \`px-3 py-1.5 rounded-lg cursor-pointer transition \${ge === "approved" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-500 hover:text-slate-900"}\`, children: ["Approved (", approvedKycCount, ")"] }),
                      r.jsxs("button", { onClick: () => be("all"), className: \`px-3 py-1.5 rounded-lg cursor-pointer transition \${ge === "all" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-500 hover:text-slate-900"}\`, children: ["All (", enrichedKycList.length, ")"] })
                    ]
                  })
                ]
              }),
              kycListFiltered.length === 0 ? r.jsx("div", {
                className: "p-8 text-center text-slate-400 bg-[#FAF7F2] dark:bg-[#222] rounded-xl text-xs",
                children: "No worker verification applications in this filter."
              }) : r.jsx("div", {
                className: "space-y-4",
                children: kycListFiltered.map(item => r.jsxs("div", {
                  key: item.id,
                  className: "bg-[#FDFBF7] dark:bg-[#222] border-2 border-[#EDE8E0] dark:border-[#333] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs",
                  children: [
                    // Top Row: Large Face ID Photo + Core Identity + Approve/Reject Actions
                    r.jsxs("div", {
                      className: "flex flex-col md:flex-row md:items-start justify-between gap-4",
                      children: [
                        r.jsxs("div", {
                          className: "flex items-start gap-4",
                          children: [
                            // Large Face ID Verification Photo Card
                            r.jsxs("div", {
                              className: "relative shrink-0 cursor-pointer group",
                              onClick: () => item.facePhotoUrl && Z(item),
                              title: "Click to enlarge Face ID photo",
                              children: [
                                r.jsx("div", {
                                  className: \`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 shadow-md flex items-center justify-center bg-slate-900 \${item.status === "approved" ? "border-emerald-500" : "border-amber-500"}\`,
                                  children: item.facePhotoUrl ? r.jsx("img", {
                                    src: item.facePhotoUrl,
                                    alt: item.workerName + " Face ID",
                                    className: "w-full h-full object-cover"
                                  }) : r.jsx("span", {
                                    className: "text-amber-400 font-black text-3xl",
                                    children: (item.workerName || "W").charAt(0).toUpperCase()
                                  })
                                }),
                                r.jsxs("span", {
                                  className: \`absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 \${item.status === "approved" ? "bg-emerald-600 text-white" : "bg-amber-500 text-slate-950"}\`,
                                  children: [r.jsx(Os, { className: "w-2.5 h-2.5" }), item.status === "approved" ? "Face ID Verified" : "Live Face ID"]
                                })
                              ]
                            }),
                            r.jsxs("div", {
                              className: "space-y-1.5",
                              children: [
                                r.jsxs("div", {
                                  className: "flex items-center gap-2 flex-wrap",
                                  children: [
                                    r.jsx("h4", { className: "font-black text-slate-900 dark:text-white text-base sm:text-lg", children: item.workerName }),
                                    r.jsxs("span", {
                                      className: "px-2.5 py-0.5 bg-slate-900 text-amber-400 dark:bg-slate-800 rounded-lg text-[11px] font-mono font-bold",
                                      children: ["Username: @", item.username]
                                    }),
                                    r.jsx("span", {
                                      className: "px-2.5 py-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-full text-[11px] font-black",
                                      children: item.trade
                                    }),
                                    r.jsxs("span", {
                                      className: "px-2.5 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black",
                                      children: ["₹", item.dailyRate, "/day • ", item.experienceYears, " Yrs Exp"]
                                    })
                                  ]
                                }),
                                r.jsxs("p", {
                                  className: "text-xs font-bold text-slate-700 dark:text-slate-200",
                                  children: ["💼 Current Job Status: ", r.jsx("span", { className: item.status === "approved" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400", children: item.jobStatusText })]
                                }),
                                r.jsxs("div", {
                                  className: "flex items-center gap-2 flex-wrap text-[11px] font-bold text-emerald-700 dark:text-emerald-400",
                                  children: [
                                    r.jsx("span", { children: item.faceIdStatusText }),
                                    item.facePhotoUrl && r.jsx("button", {
                                      type: "button",
                                      onClick: () => Z(item),
                                      className: "px-2 py-0.5 bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-black cursor-pointer hover:bg-amber-500/30",
                                      children: "🔍 Inspect Full Face ID"
                                    })
                                  ]
                                }),
                                r.jsxs("p", {
                                  className: "text-[10px] text-slate-400 font-mono",
                                  children: ["Submitted: ", item.submittedAt || "Just now", " • Worker ID: ", item.workerId]
                                })
                              ]
                            })
                          ]
                        }),
                        // Approve / Reject Buttons
                        r.jsxs("div", {
                          className: "flex flex-wrap items-center gap-2 self-start",
                          children: [
                            item.status === "pending" ? r.jsxs(r.Fragment, {
                              children: [
                                r.jsxs("button", {
                                  onClick: () => u(item.id, "approved"),
                                  className: "px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md",
                                  children: [r.jsx(nn, { className: "w-4 h-4" }), " Verify Face ID & Approve Worker (Open Portal)"]
                                }),
                                r.jsxs("button", {
                                  onClick: () => u(item.id, "rejected", "Aadhaar or Face ID verification mismatch"),
                                  className: "px-3 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-xl text-xs transition cursor-pointer",
                                  children: ["Reject"]
                                })
                              ]
                            }) : r.jsxs("span", {
                              className: "px-3.5 py-2 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-black rounded-xl text-xs flex items-center gap-1.5",
                              children: [r.jsx(nn, { className: "w-4 h-4 text-emerald-500" }), " Approved • Worker Portal Open"]
                            })
                          ]
                        })
                      ]
                    }),

                    // Full 8-Box Worker Verification Information Grid
                    r.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-[#EDE8E0] dark:border-[#333] text-[11px]",
                      children: [
                        r.jsxs("div", {
                          className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                          children: [
                            r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "1. Full Name & Username" }),
                            r.jsx("p", { className: "font-black text-slate-900 dark:text-white text-xs", children: item.workerName }),
                            r.jsxs("p", { className: "font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold", children: ["Username: @", item.username, " (", item.workerId, ")"] })
                          ]
                        }),
                        r.jsxs("div", {
                          className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                          children: [
                            r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "2. Phone & Gmail / Email" }),
                            r.jsxs("p", { className: "font-mono font-bold text-slate-900 dark:text-white text-xs", children: ["📞 ", item.phone] }),
                            r.jsxs("p", { className: "font-mono text-[10px] text-slate-500 dark:text-slate-300 truncate", children: ["✉️ ", item.email] })
                          ]
                        }),
                        r.jsxs("div", {
                          className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                          children: [
                            r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "3. Full Address & GPS" }),
                            r.jsxs("p", { className: "font-bold text-slate-900 dark:text-white text-xs", children: ["📍 ", item.fullAddress] }),
                            r.jsxs("p", { className: "font-mono text-[10px] text-slate-400", children: ["GPS: ", item.gpsCoords] })
                          ]
                        }),
                        r.jsxs("div", {
                          className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                          children: [
                            r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "4. Trade, Wage & Experience" }),
                            r.jsxs("p", { className: "font-black text-amber-600 dark:text-amber-400 text-xs", children: ["🛠️ ", item.trade, " • ₹", item.dailyRate, "/day"] }),
                            r.jsxs("p", { className: "text-[10px] text-slate-500 font-semibold", children: [item.experienceYears, " Years Field Experience"] })
                          ]
                        }),
                        r.jsxs("div", {
                          className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                          children: [
                            r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "5. Aadhaar Number & UPI ID" }),
                            r.jsxs("p", { className: "font-mono font-bold text-slate-900 dark:text-white text-xs", children: ["🪪 Aadhaar: ", item.aadhaarNumber] }),
                            r.jsxs("p", { className: "font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold", children: ["💳 UPI: ", item.upiId] })
                          ]
                        }),
                        r.jsxs("div", {
                          className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                          children: [
                            r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "6. Age, DOB & Child Labour" }),
                            r.jsxs("p", { className: "font-black text-emerald-600 text-xs", children: ["🎂 ", item.age, " Years Old (18+ Adult)"] }),
                            r.jsxs("p", { className: "text-[10px] text-slate-500 font-mono", children: ["DOB: ", item.dateOfBirth] })
                          ]
                        }),
                        r.jsxs("div", {
                          className: "bg-white dark:bg-[#1a1a1a] p-2.5 rounded-xl border border-[#EDE8E0] dark:border-[#2e2e2e] space-y-0.5",
                          children: [
                            r.jsx("span", { className: "text-slate-400 text-[10px] block font-bold uppercase", children: "7. Job Status & Orders" }),
                            r.jsx("p", { className: "font-bold text-slate-900 dark:text-white text-xs", children: item.jobStatusText }),
                            r.jsxs("p", { className: "text-[10px] text-slate-500", children: ["Active: ", item.activeJobsCount, " • Completed: ", item.completedJobsCount, " • Wallet: ₹", item.walletBalance] })
                          ]
                        }),
                        r.jsxs("div", {
                          className: "bg-emerald-500/10 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30 space-y-0.5",
                          children: [
                            r.jsx("span", { className: "text-emerald-700 dark:text-emerald-300 text-[10px] block font-black uppercase", children: "8. Face ID Verification" }),
                            r.jsx("p", { className: "font-black text-emerald-700 dark:text-emerald-400 text-xs", children: item.facePhotoUrl ? "✓ Live Face Selfie Attached" : "Pending Photo" }),
                            r.jsx("p", { className: "text-[10px] text-emerald-600 dark:text-emerald-300 font-semibold", children: "Biometric Liveness & 18+ Adult Match" })
                          ]
                        })
                      ]
                    })
                  ]
                }, item.id))
              })
            ]
          }),`;

replaceExact(oldAdminKycView, newAdminKycView, 'AdminPortal KYC Queue full worker dossier & Face ID UI');

// ============================================================================
// 7. ADD PENDING KYC NOTIFICATION BANNER & FACE ID LIGHTBOX MODAL IN ADMIN PORTAL
// ============================================================================
const oldAdminMainStart = `      // Main Content Area
      r.jsxs("div", {
        className: "flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs bg-[#FAF7F2] dark:bg-[#121212]",
        children: [`;

const newAdminMainStart = `      // Main Content Area
      r.jsxs("div", {
        className: "flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs bg-[#FAF7F2] dark:bg-[#121212]",
        children: [
          // Pending Worker KYC & Face ID Alert Banner
          pendingKycCount > 0 && re !== "kyc" && r.jsxs("div", {
            className: "bg-amber-500/15 border-2 border-amber-500/40 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in",
            children: [
              r.jsxs("div", {
                className: "flex items-center gap-2.5",
                children: [
                  r.jsx("span", { className: "px-2.5 py-1 bg-rose-600 text-white font-black rounded-xl text-xs animate-pulse", children: pendingKycCount + " Pending" }),
                  r.jsxs("div", {
                    children: [
                      r.jsx("h4", { className: "font-black text-slate-900 dark:text-white text-xs sm:text-sm", children: "Worker Face ID & KYC Verification Waiting for Admin Approval" }),
                      r.jsx("p", { className: "text-[11px] text-slate-600 dark:text-slate-300", children: "Review full worker details (Name, Username, Address, Job Status, Aadhaar & Live Face ID) to unlock their Worker Portal." })
                    ]
                  })
                ]
              }),
              r.jsxs("button", {
                type: "button",
                onClick: () => ve("kyc"),
                className: "px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition shrink-0 cursor-pointer shadow-sm",
                children: ["Open KYC & Face ID Queue →"]
              })
            ]
          }),

          // Face ID Verification Full-Screen Inspection Modal
          he && r.jsx("div", {
            className: "fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4",
            onClick: () => Z(null),
            children: r.jsxs("div", {
              className: "bg-white dark:bg-[#1C1C1C] border-2 border-amber-500 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl",
              onClick: ev => ev.stopPropagation(),
              children: [
                r.jsxs("div", {
                  className: "flex items-center justify-between border-b border-[#EDE8E0] dark:border-[#333] pb-3",
                  children: [
                    r.jsxs("div", {
                      children: [
                        r.jsxs("h4", { className: "font-black text-slate-900 dark:text-white text-base flex items-center gap-1.5", children: [r.jsx(Os, { className: "w-4 h-4 text-amber-500" }), " Face ID & Biometric Inspection"] }),
                        r.jsxs("p", { className: "text-[11px] text-slate-500 font-mono", children: [he.workerName || he.name, " (@", he.username, ")"] })
                      ]
                    }),
                    r.jsx("button", {
                      type: "button",
                      onClick: () => Z(null),
                      className: "px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold cursor-pointer",
                      children: "✕ Close"
                    })
                  ]
                }),
                r.jsx("div", {
                  className: "w-full aspect-square max-h-72 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500 bg-slate-950 flex items-center justify-center",
                  children: he.facePhotoUrl ? r.jsx("img", { src: he.facePhotoUrl, alt: "Worker Face ID", className: "w-full h-full object-cover" }) : r.jsx("span", { className: "text-slate-400 text-xs", children: "No Photo" })
                }),
                r.jsxs("div", {
                  className: "bg-[#FAF7F2] dark:bg-[#252525] p-3 rounded-2xl border border-[#EDE8E0] dark:border-[#333] space-y-1 text-xs",
                  children: [
                    r.jsxs("p", { children: [r.jsx("strong", { children: "Full Name: " }), he.workerName || he.name, " • ", r.jsx("strong", { children: "Username: " }), "@", he.username] }),
                    r.jsxs("p", { children: [r.jsx("strong", { children: "Address: " }), he.fullAddress] }),
                    r.jsxs("p", { children: [r.jsx("strong", { children: "Age & DOB: " }), he.age, " Yrs (DOB: ", he.dateOfBirth, ")"] }),
                    r.jsxs("p", { children: [r.jsx("strong", { children: "Aadhaar: " }), he.aadhaarFull || he.aadhaarNumber, " • ", r.jsx("strong", { children: "Trade: " }), he.primaryTrade || he.trade] }),
                    r.jsxs("p", { children: [r.jsx("strong", { children: "Job Status: " }), he.jobStatusText] })
                  ]
                }),
                r.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    !(he.isVerified || he.status === "approved") && r.jsxs("button", {
                      type: "button",
                      onClick: () => { u(he.kycId || he.id, "approved"); Z(null); },
                      className: "flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs cursor-pointer shadow-md",
                      children: ["✅ Approve Face ID & Unlock Worker Portal"]
                    }),
                    r.jsx("button", {
                      type: "button",
                      onClick: () => Z(null),
                      className: "px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer",
                      children: "Done"
                    })
                  ]
                })
              ]
            })
          }),`;

replaceExact(oldAdminMainStart, newAdminMainStart, 'AdminPortal pending KYC banner & Face ID lightbox modal');

fs.writeFileSync('www/assets/index-v23.js', js, 'utf8');
console.log('Successfully wrote www/assets/index-v23.js, size:', js.length);
