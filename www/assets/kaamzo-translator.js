(function() {
  if (window.__kaamzoFullTranslatorLoaded) return;
  window.__kaamzoFullTranslatorLoaded = true;

  var STORAGE_KEY = 'kaamzo_language';
  var CACHE_KEY = 'kaamzo_i18n_cache_v5';
  try {
    localStorage.removeItem('kaamzo_i18n_cache_v3');
    localStorage.removeItem('kaamzo_i18n_cache_v4');
  } catch (e) {}

  // Comprehensive Zero-Latency Built-in Dictionary for Home, Customer, Worker, Jobs, Register, Modals & Admin
  var GLOSSARY = {
    hi: {
      // TopUtilityBar & Global Navigation
      "Listen": "सुनें",
      "Audio On": "ऑडियो चालू",
      "Audio reader on": "ऑडियो रीडर चालू है",
      "Tap any word or job card on screen to hear it read aloud": "किसी भी शब्द या काम कार्ड पर टैप करें और उसे आवाज़ में सुनें",
      "Stop": "रोकें",
      "Exit": "बंद करें",
      "Settings": "सेटिंग्स",
      "SETTINGS": "सेटिंग्स",
      "LANGUAGE": "भाषा चुनें",
      "OPERATING CITY & GPS": "शहर और 10 किमी GPS",
      "PROFILE & ACCOUNT": "प्रोफ़ाइल और खाता",
      "Dark mode": "डार्क मोड",
      "Easier on the eyes at night": "रात में आँखों के लिए आरामदायक",
      "Voice assistant": "आवाज़ सहायक",
      "Hear the app in your language": "अपनी भाषा में ऐप सुनें",
      "Admin Portal": "एडमिन पोर्टल",
      "ADMIN PORTAL": "एडमिन पोर्टल",
      "KYC verification & escrow console": "KYC सत्यापन और एस्क्रो कंसोल",
      "Investor Pitch Deck": "निवेशक प्रस्तुति",
      "Investor Pitch": "निवेशक प्रस्तुति",
      "Kaamzo overview & metrics": "कामज़ो जानकारी और आँकड़े",
      "Terms & conditions": "नियम और शर्तें",
      "Terms": "नियम व शर्तें",
      "Sign in": "लॉग इन",
      "Sign In": "लॉग इन",
      "Sign out": "लॉग आउट",
      "Sign Out": "लॉग आउट",
      "Not signed in": "लॉग इन नहीं है",
      "Switch role": "भूमिका बदलें",
      "Switch Role": "भूमिका बदलें",
      "Customer ⇄ Worker": "ग्राहक ⇄ कामगार",
      "Register or Sign in": "रजिस्टर या लॉग इन करें",
      "Register or switch account": "रजिस्टर करें या खाता बदलें",
      "Account, KYC & UPI": "खाता, KYC और UPI",
      "My profile & bookings": "मेरी प्रोफ़ाइल और बुकिंग",
      "Your live pin": "आपकी लाइव लोकेशन",
      "Calibrate GPS": "GPS अपडेट करें",
      "Locating…": "लोकेशन खोजी जा रही है…",
      "Ludhiana · 10 km GPS": "लुधियाना · 10 किमी GPS",
      "Live · 10 km radar": "लाइव · 10 किमी रडार",
      "Coming soon": "जल्द आ रहा है",
      "Verify Gmail": "ईमेल सत्यापित करें",

      // HomePage (/)
      "Services": "सेवाएं",
      "How it works": "यह कैसे काम करता है",
      "For workers": "कामगारों के लिए",
      "Jobs": "काम",
      "Now live in Ludhiana": "अब लुधियाना में लाइव",
      "Homes that can trust. Workers that can thrive.": "भरोसेमंद घर। तरक्की करते कामगार।",
      "Leaking tap, fan repair, wall painting…": "नल ठीक करना, पंखा रिपेयर, दीवार पेंटिंग…",
      "Find a worker": "कारीगर खोजें",
      "I'm a worker, I want jobs": "मैं कामगार हूँ, मुझे काम चाहिए",
      "Available now": "अभी उपलब्ध",
      "Wiring, fans, switchboards and appliances.": "वायरिंग, पंखे, स्विचबोर्ड और उपकरण रिपेयर।",
      "PAYMENT IN ESCROW": "सुरक्षित एस्क्रो पेमेंट",
      "Released to the worker only with your OTP": "आपके OTP के बाद ही कामगार को भुगतान मिलता है",
      "100% Aadhaar verified": "100% आधार सत्यापित",
      "Every worker, before every job": "हर काम से पहले, हर कामगार सत्यापित",
      "One app,": "एक ऐप,",
      "two ways": "दो रास्ते",
      "in.": "।",
      "FOR HOMES & CONTRACTORS": "घरों और ठेकेदारों के लिए",
      "I need": "मुझे",
      "a worker": "कारीगर चाहिए",
      "See fair rates upfront, choose from your top 5 nearby, and pay nothing until it is done.": "सही रेट पहले देखें, नज़दीकी टॉप 5 कारीगरों में से चुनें, और काम पूरा होने पर ही भुगतान करें।",
      "Book a worker →": "कारीगर बुक करें →",
      "FOR SKILLED WORKERS": "कुशल कारीगरों के लिए",
      "I want": "मुझे",
      "work": "काम चाहिए",
      "Jobs within 10 km, paid straight to your UPI the moment the customer confirms.": "10 किमी के अंदर काम, ग्राहक की पुष्टि होते ही सीधे आपके UPI में पैसा।",
      "Open Worker Portal →": "कामगार पोर्टल खोलें →",
      "MEET THE HANDS": "कुशल कारीगरों से मिलें",
      "Skilled people,": "हुनरमंद लोग,",
      "right around the corner.": "बिल्कुल आपके पड़ोस में।",
      "Leaking taps, blocked drains, new fittings and motor connections.": "टपकते नल, बंद नाली, नई फिटिंग और मोटर कनेक्शन।",
      "Furniture repairs, doors and hinges, shelves and custom woodwork.": "फर्नीचर रिपेयर, दरवाज़े, अलमारी और लकड़ी का काम।",
      "Fresh walls, primer, touch-ups and full-room colour changes.": "दीवार पेंटिंग, प्राइमर, टच-अप और पूरे कमरे का रंग।",
      "SERVICES IN LUDHIANA": "लुधियाना में सेवाएं",
      "Fair rates,": "उचित रेट,",
      "shown upfront.": "पहले से साफ़।",
      "See all services →": "सभी सेवाएं देखें →",
      "HOW IT WORKS": "यह कैसे काम करता है",
      "Booked & done in": "बुक करें और काम पूरा करें",
      "four clear steps.": "चार आसान चरणों में।",
      "Broadcast your job": "अपना काम पोस्ट करें",
      "Post your task & location — Kaamzo broadcasts instantly to verified workers within 10 km.": "अपना काम और पता लिखें — कामज़ो 10 किमी के सत्यापित कारीगरों को तुरंत सूचना भेजता है।",
      "Worker arrives on live map": "लाइव मैप पर कामगार आता है",
      "Track your accepted worker live on GPS with ETA and confirm arrival using your 4-digit Start OTP.": "GPS मैप पर कामगार को लाइव ट्रैक करें और आने पर 4-अंकीय Start OTP से काम शुरू करें।",
      "Work in progress": "काम चालू है",
      "Watch live work progress and digital attendance while your verified neighbour completes the job.": "जब आपका सत्यापित कारीगर काम पूरा करे, तो लाइव प्रगति और डिजिटल हाज़िरी देखें।",
      "Pay via Razorpay UPI": "FamPay / Razorpay UPI से भुगतान करें",
      "Once the worker marks completed, tap Pay Now to settle cleanly via UPI with instant status updates.": "काम पूरा होने पर Pay Now दबाएं और UPI द्वारा तुरंत सुरक्षित भुगतान करें।",
      "Aadhaar verified": "आधार सत्यापित",
      "Every worker checks ID and face before taking jobs.": "हर कामगार काम लेने से पहले आधार और फेस-आईडी सत्यापित करता है।",
      "Escrow payments": "सुरक्षित एस्क्रो भुगतान",
      "Money is released only with your OTP.": "आपके OTP/QR के बाद ही पैसा जारी होता है।",
      "Live GPS on every job": "हर काम पर लाइव GPS",
      "Both sides see where the job is in real time.": "दोनों पक्ष रियल-टाइम में मैप पर लोकेशन देखते हैं।",
      "One-tap SOS": "1-टैप आपातकालीन SOS",
      "Call 112 straight from an active job.": "किसी भी चालू काम से सीधे 112 पर कॉल करें।",
      "Register free in 2 minutes with your phone number and UPI ID. Pick your trade, set your daily rate, and start getting jobs nearby.": "अपने फ़ोन नंबर और UPI ID से 2 मिनट में मुफ़्त रजिस्टर करें। अपना काम चुनें, दिहाड़ी तय करें और नज़दीकी काम पाएं।",
      "Free registration": "मुफ़्त रजिस्ट्रेशन",
      "Phone number and UPI ID is all you need.": "सिर्फ़ फ़ोन नंबर और UPI ID चाहिए।",
      "Jobs within 10 km": "10 किमी के अंदर काम",
      "Less travel, more jobs in a day.": "कम सफ़र, दिन में ज़्यादा कमाई।",
      "Paid straight to UPI": "सीधे UPI में भुगतान",
      "PhonePe, GPay or Paytm, as soon as the customer confirms.": "ग्राहक की पुष्टि होते ही FamPay, PhonePe, GPay या Paytm में पैसा।",
      "Bonuses as you grow": "काम बढ़ने पर बोनस",
      "Milestone bonus ladder from 10 to 100 jobs.": "10 से 100 काम पूरे करने पर दोगुना तक बोनस।",
      "Customer login": "ग्राहक लॉग इन",
      "Worker login": "कामगार लॉग इन",
      "AI Price Bot & Help": "AI रेट बॉट और मदद",
      "AI Price Bot": "AI रेट बॉट",
      "Support & SOS": "सहायता और SOS",
      "Ask": "पूछें",
      "WhatsApp us": "व्हाट्सऐप करें",
      "Live support chat": "लाइव सहायता चैट",
      "SOS · Dial 112": "आपातकालीन SOS · 112",

      // Trades
      "Electrician": "इलेक्ट्रीशियन",
      "Plumber": "प्लंबर",
      "Carpenter": "बढ़ई",
      "Painter": "पेंटर",
      "Mason": "राजमिस्त्री",
      "Tile worker": "टाइल मिस्त्री",
      "Tile Worker": "टाइल मिस्त्री",
      "Welder": "वेल्डर",
      "Loader / mover": "लोडर / मूवर",
      "Loader / Mover": "लोडर / मूवर",
      "Helper": "हेल्पर / सहायक",
      "All trades": "सभी काम",
      "All Trades": "सभी काम",
      "Wiring, MCB & fans": "वायरिंग, MCB और पंखे",
      "Pipes, taps & motors": "पाइप, नल और मोटर",
      "Woodwork & doors": "लकड़ी और दरवाज़े का काम",
      "Wall painting": "दीवार पेंटिंग",
      "Brickwork & plaster": "ईंट और पलस्तर का काम",
      "Flooring & tiles": "फ़र्श और टाइल लगाना",
      "Metal & fabrication": "वेल्डिंग और लोहे का काम",
      "Shifting goods": "सामान शिफ्टिंग और लोडिंग",
      "General labour": "सामान्य मज़दूरी / सहायता",

      // Customer Portal (/customer/*)
      "Find workers": "कारीगर खोजें",
      "Find Workers": "कारीगर खोजें",
      "My bookings": "मेरी बुकिंग",
      "My Bookings": "मेरी बुकिंग",
      "Support": "सहायता",
      "Post a job": "काम पोस्ट करें",
      "Post a Job": "काम पोस्ट करें",
      "+ Post a job": "+ काम पोस्ट करें",
      "Live ETA": "लाइव मैप व समय",
      "Crew & rebook": "टीम और दोबारा बुक",
      "SOS check-in": "SOS सुरक्षा",
      "10 km Radar": "10 किमी रडार",
      "Scan & chat": "स्कैन और चैट",
      "Find": "खोजें",
      "Post": "पोस्ट करें",
      "Bookings": "बुकिंग",
      "Live": "लाइव",
      "Find trusted,": "भरोसेमंद और",
      "verified": "सत्यापित",
      "workers.": "कारीगर खोजें।",
      "Aadhaar and face-ID verified electricians, plumbers, carpenters, painters and masons nearby. 20% flat platform fee, 100% UPI escrow.": "आधार और फेस-आईडी सत्यापित इलेक्ट्रीशियन, प्लंबर, बढ़ई, पेंटर और राजमिस्त्री। 20% पारदर्शी शुल्क, 100% UPI एस्क्रो।",
      "Search trade, skill or worker": "काम, कौशल या कारीगर खोजें",
      "Post Custom Job": "नया काम पोस्ट करें",
      "LIVE DISPATCH SUMMARY": "लाइव डिस्पैच सारांश",
      "Aadhaar-verified workers active inside your strict 10 km radar.": "आपके 10 किमी रडार के अंदर सक्रिय आधार-सत्यापित कारीगर।",
      "Strict 10 km GPS filter": "सख्त 10 किमी GPS फ़िल्टर",
      "Open 10 km Radar →": "10 किमी रडार खोलें →",
      "Recent Work Order Status": "हाल के काम की स्थिति",
      "Open My Bookings →": "मेरी बुकिंग खोलें →",
      "Track Live →": "लाइव ट्रैक करें →",
      "View all bookings →": "सभी बुकिंग देखें →",
      "+ Post Job Requirement": "+ काम की आवश्यकता पोस्ट करें",
      "1 · Which trade?": "1 · कौन सा कारीगर चाहिए?",
      "2 · Job details": "2 · काम का विवरण",
      "✨ Ask AI for Price": "✨ AI से सही रेट पूछें",
      "Asking AI for Price…": "AI रेट निकाल रहा है…",
      "Ask AI for Price Now →": "अभी AI से रेट पूछें →",
      "Schedule Next →": "आगे समय चुनें →",
      "Step required: Write your job details above and tap 'Ask AI for Price' to unlock Schedule & Broadcast.": "ज़रूरी कदम: ऊपर अपने काम का विवरण लिखें और आगे बढ़ने के लिए 'AI से सही रेट पूछें' दबाएं।",
      "3 · Schedule & Ludhiana site": "3 · समय और लुधियाना पता",
      "← Edit Trade & Job Details": "← काम का विवरण बदलें",
      "Start Date": "शुरू होने की तारीख",
      "Shift Start Time": "काम शुरू करने का समय",
      "Duration (Days)": "अवधि (दिन)",
      "Ludhiana Area": "लुधियाना का इलाका",
      "Full Site Address": "काम का पूरा पता",
      "AI VERIFIED LABOUR PRICE": "AI सत्यापित मज़दूरी रेट",
      "Daily Labour Rate (₹)": "दैनिक मज़दूरी रेट (₹)",
      "Platform fee (+20% escrow)": "प्लेटफॉर्म शुल्क (+20% एस्क्रो)",
      "Payments done by": "आपके खाते द्वारा",
      "your account.": "किए गए भुगतान।",
      "TOTAL PAID BY YOUR ACCOUNT": "आपके खाते द्वारा कुल भुगतान",
      "PAYMENTS DONE (YOUR ACCOUNT)": "पूर्ण भुगतान (आपका खाता)",
      "PENDING PAYMENT (YOUR ACCOUNT)": "बाकी भुगतान (आपका खाता)",
      "Post new job": "नया काम पोस्ट करें",
      "No payments done by your account yet": "अभी तक आपके खाते से कोई भुगतान नहीं हुआ है",
      "4-STEP LIVE JOB TRACKER": "4-चरण लाइव काम ट्रैकर",
      "Live job": "लाइव काम",
      "condition & progress.": "स्थिति और प्रगति।",
      "← All My Bookings": "← मेरी सभी बुकिंग",
      "Job Broadcasted": "काम प्रसारित",
      "10 km verified radar": "10 किमी सत्यापित रडार",
      "Worker Coming": "कारीगर आ रहा है",
      "Live GPS map & Start OTP": "लाइव GPS मैप और Start OTP",
      "Work In Progress": "काम चल रहा है",
      "Job being completed": "काम पूरा किया जा रहा है",
      "Completed & Paid": "काम पूरा और भुगतान",
      "Razorpay UPI settlement": "UPI द्वारा भुगतान",
      "Switch Worker": "दूसरा कारीगर चुनें",
      "✓ Confirm Worker & Show Start QR": "✓ कारीगर पक्का करें और Start QR दिखाएं",
      "Open Google Maps App ↗": "गूगल मैप्स ऐप खोलें ↗",
      "📞 Call Worker": "📞 कारीगर को कॉल करें",
      "💬 Message": "💬 मैसेज करें",
      "Hide QR": "QR छिपाएं",
      "Show QR": "QR दिखाएं",
      "Attendance clock": "काम का समय",
      "Booked": "बुक किया गया",
      "Assigned": "कारीगर मिला",
      "Completed & UPI": "काम पूरा व UPI",
      "Razorpay Pay": "UPI भुगतान",
      "Paid & Settled": "भुगतान सफल",

      // Worker Portal (/worker/* & /jobs)
      "Work": "काम",
      "Account & pay": "खाता और कमाई",
      "Khata & pass": "खाता और गेट-पास",
      "Bonus ladder": "बोनस सीढ़ी",
      "Khata": "खाता",
      "Bonus": "बोनस",
      "● Online · broadcasting": "● ऑनलाइन · काम के लिए तैयार",
      "○ Offline": "○ ऑफ़लाइन",
      "🚫 Blocked by Admin": "🚫 एडमिन द्वारा ब्लॉक",
      "Wallet": "बटुआ",
      "Hyperlocal 10 km GPS radar active": "10 किमी स्थानीय GPS रडार चालू है",
      "Jobs near you,": "आपके पास काम,",
      "paid before": "शुरू करने से पहले",
      "you start.": "सुरक्षित।",
      "paid daily.": "रोज़ाना भुगतान।",
      "100% Escrow backed": "100% एस्क्रो सुरक्षित",
      "Keep 80% of every job": "हर काम का 80% आपका",
      "≤ 10 km strict GPS radius": "≤ 10 किमी सख्त GPS दायरा",
      "Sort: Nearest first": "छांटें: सबसे पास पहले",
      "Sort: Highest payout": "छांटें: सबसे ज़्यादा कमाई",
      "Sort: Newest": "छांटें: सबसे नया",
      "All nearby": "सभी नज़दीकी",
      "Urgent / Today": "तुरंत / आज",
      "High pay (₹800+)": "ज़्यादा कमाई (₹800+)",
      "≤ 3 km close": "≤ 3 किमी पास",
      "Your net payout (80%)": "आपकी शुद्ध कमाई (80%)",
      "100% yours (Zero-fee pass)": "100% आपका (ज़ीरो-फ़ीस पास)",
      "Interested": "दिलचस्पी है",
      "✓ Interested": "✓ दिलचस्पी भेजी",
      "Negotiate": "रेट बात करें",
      "Skip": "छोड़ें",
      "1-Tap Accept →": "1-टैप में काम लें →",
      "1-Tap Accept": "1-टैप में काम लें",
      "Send Proposal": "अपना रेट भेजें",
      "Active work": "चालू काम",
      "No active jobs. Accept one from the list and it will show up here with its start code.": "कोई चालू काम नहीं है। सूची से कोई काम स्वीकार करें, वह यहाँ दिखाई देगा।",
      "Start Job": "काम शुरू करें",
      "Mark Completed · Enter UPI": "काम पूरा करें · UPI डालें",
      "Mark Completed →": "काम पूरा करें →",
      "10-to-100 cash doubler": "10-से-100 कैश डबलर बोनस",
      "See ladder →": "बोनस सीढ़ी देखें →",
      "Ludhiana live demand": "लुधियाना में काम की मांग",
      "Tap an area to filter its jobs.": "उस इलाके के काम देखने के लिए टैप करें।",
      "Help": "मदद",
      "SOS 112": "आपातकालीन 112",
      "No jobs match right now": "अभी कोई काम नहीं मिला",
      "Live hyperlocal job broadcasts": "नज़दीकी लाइव काम प्रसारण",
      "Work within your 10 km neighbourhood. No middlemen. Payouts go straight to your UPI the moment work is confirmed.": "अपने 10 किमी इलाके में काम करें। कोई बिचौलिया नहीं। काम पूरा होते ही सीधे आपके UPI में पैसा।",
      "Open 10 km Job Board →": "10 किमी जॉब बोर्ड खोलें →",
      "WITHDRAWABLE WALLET": "निकालने योग्य बैलेंस",
      "TODAY'S EARNINGS": "आज की कमाई",
      "JOBS COMPLETED": "पूरे किए गए काम",
      "MATCHING WITHIN 10 KM": "10 किमी में उपलब्ध काम",
      "Your Assigned & Active Jobs": "आपके चालू काम",
      "Open Live Job View →": "लाइव काम पेज खोलें →",
      "See all jobs in 10 km Radar →": "10 किमी रडार में सभी काम देखें →",
      "WITHDRAWABLE BALANCE": "निकालने योग्य राशि",
      "Trade & Daily Rate Settings": "काम और दिहाड़ी रेट सेटिंग",
      "Daily Base Rate (₹)": "दैनिक दिहाड़ी रेट (₹)",
      "Save Rate & UPI": "रेट और UPI सेव करें",
      "WITHDRAWABLE": "निकालने योग्य",
      "ESCROW PENDING": "एस्क्रो में सुरक्षित",
      "TOTAL WITHDRAWN": "कुल निकाला गया पैसा",
      "Payout Ledger": "भुगतान खाता (लेजर)",
      "Withdraw Wallet →": "पैसे UPI में निकालें →",
      "Download Official Gate Pass PNG": "आधिकारिक गेट-पास डाउनलोड करें",

      // Worker Live Job Page (/worker/live-job)
      "1. Picked": "1. काम लिया",
      "Job accepted": "काम स्वीकार किया",
      "2. Go to Site": "2. काम पर जाएं",
      "3. Work Live": "3. काम चालू",
      "Start QR verified": "Start QR सत्यापित",
      "4. Completed": "4. काम पूरा",
      "End QR & FamPay UPI": "End QR और FamPay UPI",
      "YOUR LABOUR PAYOUT": "आपकी मज़दूरी कमाई",
      "100% Escrow Protected": "100% एस्क्रो सुरक्षित",
      "📞 Call Customer": "📞 ग्राहक को कॉल करें",
      "💬 Message Customer": "💬 ग्राहक को मैसेज करें",
      "WhatsApp Customer ↗": "ग्राहक को व्हाट्सऐप करें ↗",
      "Open Work Site in Google Maps ↗": "गूगल मैप्स में रास्ता खोलें ↗",
      "1 · QR for Starting the Job": "1 · काम शुरू करने का QR / OTP",
      "2 · QR for Ending the Job": "2 · काम खत्म करने का QR / OTP",
      "Ask Customer for Start OTP": "ग्राहक से Start OTP पूछें",
      "Ask Customer for End OTP": "ग्राहक से End OTP पूछें",
      "📷 Open Camera QR Scanner": "📷 कैमरा QR स्कैनर खोलें",
      "📷 Camera Scan End QR": "📷 कैमरा से End QR स्कैन करें",
      "Scan / Verify Start OTP & Begin Job →": "Start OTP सत्यापित करें और काम शुरू करें →",
      "Scan / Verify End QR & Complete Job →": "End QR/OTP सत्यापित करें और काम पूरा करें →",
      "Cannot complete this job?": "क्या आप यह काम पूरा नहीं कर सकते?",
      "Reject / Cancel Job to Leave Page": "पेज छोड़ने के लिए काम रद्द करें",
      "Stay & Complete Job": "रुकें और काम पूरा करें",
      "Confirm Reject · Offline for 24h": "काम रद्द करें · 24 घंटे ऑफ़लाइन",

      // FamPay Real Money Transfer Modal
      "● REAL UPI MONEY TRANSFER · NPCI VERIFIED": "● असली UPI मनी ट्रांसफर · NPCI सत्यापित",
      "STEP 1 · SCAN QR OR TAP UPI APP BELOW": "चरण 1 · QR स्कैन करें या नीचे UPI ऐप दबाएं",
      "Copy ID": "ID कॉपी करें",
      "Copied ✓": "कॉपी हो गया ✓",
      "⬇ Save QR to Gallery": "⬇ QR गैलरी में सेव करें",
      "📋 Paste UTR": "📋 UTR पेस्ट करें",
      "📷 Attach Screenshot": "📷 स्क्रीनशॉट जोड़ें",
      "Open Razorpay Gateway →": "रेज़रपे गेटवे खोलें →",

      // Register Page (/register)
      "Already registered?": "पहले से खाता है?",
      "New to Kaamzo?": "कामज़ो पर नए हैं?",
      "Register free": "मुफ़्त रजिस्टर करें",
      "CREATE YOUR ACCOUNT": "अपना खाता बनाएं",
      "RETURNING USER SIGN IN": "पुराने यूज़र लॉग इन करें",
      "Customer / Employer": "ग्राहक / मालिक",
      "Worker": "कामगार / कारीगर",
      "Sign in →": "लॉग इन करें →",
      "Continue with Google": "Google से जारी रखें",
      "I need a worker": "मुझे कारीगर चाहिए",
      "Customer / employer · hire verified help": "ग्राहक · सत्यापित कारीगर बुक करें",
      "WORKER REGISTRATION": "कामगार रजिस्ट्रेशन",
      "CUSTOMER REGISTRATION": "ग्राहक रजिस्ट्रेशन",
      "Continue": "आगे बढ़ें",
      "Create my Kaamzo account": "मेरा कामज़ो खाता बनाएं",
      "Press Enter to continue": "आगे बढ़ने के लिए Enter दबाएं",
      "Take live selfie": "लाइव सेल्फ़ी लें",
      "Upload photo": "फ़ोटो अपलोड करें",
      "Capture Selfie": "सेल्फ़ी खींचें",
      "Snap my real-world address": "मेरी लाइव GPS लोकेशन भरें",
      "✅ Yes — I bring my own full toolkit": "✅ हाँ — मेरे पास अपने पूरे औज़ार (टूलकिट) हैं",
      "🔧 Basic tools only": "🔧 सिर्फ़ बेसिक (सामान्य) औज़ार हैं",
      "❌ No — I need customer's tools": "❌ नहीं — मुझे ग्राहक के औज़ार चाहिए",
      "⛔ Sorry, you need your own tools to register on Kaamzo.": "⛔ क्षमा करें, कामज़ो पर जुड़ने के लिए आपके पास अपने औज़ार होने ज़रूरी हैं।"
    },
    pa: {
      // TopUtilityBar & Global Navigation
      "Listen": "ਸੁਣੋ",
      "Audio On": "ਆਡੀਓ ਚਾਲੂ",
      "Audio reader on": "ਆਡੀਓ ਰੀਡਰ ਚਾਲੂ ਹੈ",
      "Tap any word or job card on screen to hear it read aloud": "ਕਿਸੇ ਵੀ ਸ਼ਬਦ ਜਾਂ ਕੰਮ ਕਾਰਡ 'ਤੇ ਟੈਪ ਕਰੋ ਅਤੇ ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ",
      "Stop": "ਰੋਕੋ",
      "Exit": "ਬੰਦ ਕਰੋ",
      "Settings": "ਸੈਟਿੰਗਾਂ",
      "SETTINGS": "ਸੈਟਿੰਗਾਂ",
      "LANGUAGE": "ਭਾਸ਼ਾ ਚੁਣੋ",
      "OPERATING CITY & GPS": "ਸ਼ਹਿਰ ਅਤੇ 10 ਕਿਮੀ GPS",
      "PROFILE & ACCOUNT": "ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਖਾਤਾ",
      "Dark mode": "ਡਾਰਕ ਮੋਡ",
      "Easier on the eyes at night": "ਰਾਤ ਵੇਲੇ ਅੱਖਾਂ ਲਈ ਆਰਾਮਦਾਇਕ",
      "Voice assistant": "ਆਵਾਜ਼ ਸਹਾਇਕ",
      "Hear the app in your language": "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਐਪ ਸੁਣੋ",
      "Admin Portal": "ਐਡਮਿਨ ਪੋਰਟਲ",
      "ADMIN PORTAL": "ਐਡਮਿਨ ਪੋਰਟਲ",
      "KYC verification & escrow console": "KYC ਤਸਦੀਕ ਅਤੇ ਐਸਕ੍ਰੋ ਕੰਸੋਲ",
      "Investor Pitch Deck": "ਨਿਵੇਸ਼ਕ ਪੇਸ਼ਕਾਰੀ",
      "Investor Pitch": "ਨਿਵੇਸ਼ਕ ਪੇਸ਼ਕਾਰੀ",
      "Kaamzo overview & metrics": "ਕਾਮਜ਼ੋ ਜਾਣਕਾਰੀ ਅਤੇ ਅੰਕੜੇ",
      "Terms & conditions": "ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ",
      "Terms": "ਨਿਯਮ ਤੇ ਸ਼ਰਤਾਂ",
      "Sign in": "ਲੌਗ ਇਨ",
      "Sign In": "ਲੌਗ ਇਨ",
      "Sign out": "ਲੌਗ ਆਊਟ",
      "Sign Out": "ਲੌਗ ਆਊਟ",
      "Not signed in": "ਲੌਗ ਇਨ ਨਹੀਂ ਹੈ",
      "Switch role": "ਭੂਮਿਕਾ ਬਦਲੋ",
      "Switch Role": "ਭੂਮਿਕਾ ਬਦਲੋ",
      "Customer ⇄ Worker": "ਗਾਹਕ ⇄ ਕਾਮਾ",
      "Register or Sign in": "ਰਜਿਸਟਰ ਜਾਂ ਲੌਗ ਇਨ ਕਰੋ",
      "Register or switch account": "ਰਜਿਸਟਰ ਕਰੋ ਜਾਂ ਖਾਤਾ ਬਦਲੋ",
      "Account, KYC & UPI": "ਖਾਤਾ, KYC ਅਤੇ UPI",
      "My profile & bookings": "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਬੁਕਿੰਗਾਂ",
      "Your live pin": "ਤੁਹਾਡੀ ਲਾਈਵ ਲੋਕੇਸ਼ਨ",
      "Calibrate GPS": "GPS ਅਪਡੇਟ ਕਰੋ",
      "Locating…": "ਲੋਕੇਸ਼ਨ ਲੱਭੀ ਜਾ ਰਹੀ ਹੈ…",
      "Ludhiana · 10 km GPS": "ਲੁਧਿਆਣਾ · 10 ਕਿਮੀ GPS",
      "Live · 10 km radar": "ਲਾਈਵ · 10 ਕਿਮੀ ਰਡਾਰ",
      "Coming soon": "ਜਲਦ ਆ ਰਿਹਾ ਹੈ",
      "Verify Gmail": "ਈਮੇਲ ਤਸਦੀਕ ਕਰੋ",

      // HomePage (/)
      "Services": "ਸੇਵਾਵਾਂ",
      "How it works": "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
      "For workers": "ਕਾਮਿਆਂ ਲਈ",
      "Jobs": "ਕੰਮ",
      "Now live in Ludhiana": "ਹੁਣ ਲੁਧਿਆਣਾ ਵਿੱਚ ਲਾਈਵ",
      "Homes that can trust. Workers that can thrive.": "ਭਰੋਸੇਮੰਦ ਘਰ। ਤਰੱਕੀ ਕਰਦੇ ਕਾਮੇ।",
      "Leaking tap, fan repair, wall painting…": "ਟੂਟੀ ਰਿਪੇਅਰ, ਪੱਖਾ ਰਿਪੇਅਰ, ਕੰਧ ਪੇਂਟਿੰਗ…",
      "Find a worker": "ਕਾਰੀਗਰ ਲੱਭੋ",
      "I'm a worker, I want jobs": "ਮੈਂ ਕਾਮਾ ਹਾਂ, ਮੈਨੂੰ ਕੰਮ ਚਾਹੀਦਾ ਹੈ",
      "Available now": "ਹੁਣੇ ਉਪਲਬਧ",
      "Wiring, fans, switchboards and appliances.": "ਵਾਇਰਿੰਗ, ਪੱਖੇ, ਸਵਿੱਚਬੋਰਡ ਅਤੇ ਉਪਕਰਣ ਰਿਪੇਅਰ।",
      "PAYMENT IN ESCROW": "ਸੁਰੱਖਿਅਤ ਐਸਕ੍ਰੋ ਭੁਗਤਾਨ",
      "Released to the worker only with your OTP": "ਤੁਹਾਡੇ OTP ਤੋਂ ਬਾਅਦ ਹੀ ਕਾਮੇ ਨੂੰ ਪੈਸੇ ਮਿਲਦੇ ਹਨ",
      "100% Aadhaar verified": "100% ਆਧਾਰ ਤਸਦੀਕਸ਼ੁਦਾ",
      "Every worker, before every job": "ਹਰ ਕੰਮ ਤੋਂ ਪਹਿਲਾਂ, ਹਰ ਕਾਮਾ ਤਸਦੀਕਸ਼ੁਦਾ",
      "One app,": "ਇੱਕ ਐਪ,",
      "two ways": "ਦੋ ਰਸਤੇ",
      "in.": "।",
      "FOR HOMES & CONTRACTORS": "ਘਰਾਂ ਅਤੇ ਠੇਕੇਦਾਰਾਂ ਲਈ",
      "I need": "ਮੈਨੂੰ",
      "a worker": "ਕਾਰੀਗਰ ਚਾਹੀਦਾ ਹੈ",
      "See fair rates upfront, choose from your top 5 nearby, and pay nothing until it is done.": "ਸਹੀ ਰੇਟ ਪਹਿਲਾਂ ਦੇਖੋ, ਨੇੜਲੇ ਟੌਪ 5 ਕਾਰੀਗਰਾਂ ਵਿੱਚੋਂ ਚੁਣੋ, ਅਤੇ ਕੰਮ ਪੂਰਾ ਹੋਣ 'ਤੇ ਹੀ ਪੈਸੇ ਦਿਓ।",
      "Book a worker →": "ਕਾਰੀਗਰ ਬੁੱਕ ਕਰੋ →",
      "FOR SKILLED WORKERS": "ਹੁਨਰਮੰਦ ਕਾਰੀਗਰਾਂ ਲਈ",
      "I want": "ਮੈਨੂੰ",
      "work": "ਕੰਮ ਚਾਹੀਦਾ ਹੈ",
      "Jobs within 10 km, paid straight to your UPI the moment the customer confirms.": "10 ਕਿਮੀ ਦੇ ਅੰਦਰ ਕੰਮ, ਗਾਹਕ ਦੀ ਪੁਸ਼ਟੀ ਹੁੰਦੇ ਹੀ ਸਿੱਧਾ ਤੁਹਾਡੇ UPI ਵਿੱਚ ਪੈਸੇ।",
      "Open Worker Portal →": "ਕਾਮਾ ਪੋਰਟਲ ਖੋਲ੍ਹੋ →",
      "MEET THE HANDS": "ਹੁਨਰਮੰਦ ਕਾਰੀਗਰਾਂ ਨੂੰ ਮਿਲੋ",
      "Skilled people,": "ਹੁਨਰਮੰਦ ਲੋਕ,",
      "right around the corner.": "ਬਿਲਕੁਲ ਤੁਹਾਡੇ ਗੁਆਂਢ ਵਿੱਚ।",
      "Leaking taps, blocked drains, new fittings and motor connections.": "ਲੀਕ ਕਰਦੀਆਂ ਟੂਟੀਆਂ, ਬੰਦ ਨਾਲੀਆਂ, ਨਵੀਂ ਫਿਟਿੰਗ ਅਤੇ ਮੋਟਰ ਕਨੈਕਸ਼ਨ।",
      "Furniture repairs, doors and hinges, shelves and custom woodwork.": "ਫਰਨੀਚਰ ਰਿਪੇਅਰ, ਦਰਵਾਜ਼ੇ, ਅਲਮਾਰੀਆਂ ਅਤੇ ਲੱਕੜ ਦਾ ਕੰਮ।",
      "Fresh walls, primer, touch-ups and full-room colour changes.": "ਕੰਧਾਂ ਦੀ ਪੇਂਟਿੰਗ, ਪ੍ਰਾਈਮਰ, ਟੱਚ-ਅੱਪ ਅਤੇ ਪੂਰੇ ਕਮਰੇ ਦਾ ਰੰਗ।",
      "SERVICES IN LUDHIANA": "ਲੁਧਿਆਣਾ ਵਿੱਚ ਸੇਵਾਵਾਂ",
      "Fair rates,": "ਸਹੀ ਰੇਟ,",
      "shown upfront.": "ਪਹਿਲਾਂ ਹੀ ਸਾਫ਼।",
      "See all services →": "ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ ਦੇਖੋ →",
      "HOW IT WORKS": "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
      "Booked & done in": "ਬੁੱਕ ਕਰੋ ਅਤੇ ਕੰਮ ਪੂਰਾ ਕਰੋ",
      "four clear steps.": "ਚਾਰ ਆਸਾਨ ਕਦਮਾਂ ਵਿੱਚ।",
      "Broadcast your job": "ਆਪਣਾ ਕੰਮ ਪੋਸਟ ਕਰੋ",
      "Post your task & location — Kaamzo broadcasts instantly to verified workers within 10 km.": "ਆਪਣਾ ਕੰਮ ਅਤੇ ਪਤਾ ਲਿਖੋ — ਕਾਮਜ਼ੋ 10 ਕਿਮੀ ਦੇ ਤਸਦੀਕਸ਼ੁਦਾ ਕਾਰੀਗਰਾਂ ਨੂੰ ਤੁਰੰਤ ਸੂਚਨਾ ਭੇਜਦਾ ਹੈ।",
      "Worker arrives on live map": "ਲਾਈਵ ਮੈਪ 'ਤੇ ਕਾਰੀਗਰ ਆਉਂਦਾ ਹੈ",
      "Track your accepted worker live on GPS with ETA and confirm arrival using your 4-digit Start OTP.": "GPS ਮੈਪ 'ਤੇ ਕਾਰੀਗਰ ਨੂੰ ਲਾਈਵ ਟ੍ਰੈਕ ਕਰੋ ਅਤੇ ਆਉਣ 'ਤੇ 4-ਅੰਕਾਂ ਦੇ Start OTP ਨਾਲ ਕੰਮ ਸ਼ੁਰੂ ਕਰੋ।",
      "Work in progress": "ਕੰਮ ਚੱਲ ਰਿਹਾ ਹੈ",
      "Watch live work progress and digital attendance while your verified neighbour completes the job.": "ਜਦੋਂ ਤੁਹਾਡਾ ਤਸਦੀਕਸ਼ੁਦਾ ਕਾਰੀਗਰ ਕੰਮ ਪੂਰਾ ਕਰੇ, ਤਾਂ ਲਾਈਵ ਪ੍ਰਗਤੀ ਅਤੇ ਡਿਜੀਟਲ ਹਾਜ਼ਰੀ ਦੇਖੋ।",
      "Pay via Razorpay UPI": "FamPay / Razorpay UPI ਰਾਹੀਂ ਭੁਗਤਾਨ ਕਰੋ",
      "Once the worker marks completed, tap Pay Now to settle cleanly via UPI with instant status updates.": "ਕੰਮ ਪੂਰਾ ਹੋਣ 'ਤੇ Pay Now ਦਬਾਓ ਅਤੇ UPI ਰਾਹੀਂ ਤੁਰੰਤ ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਕਰੋ।",
      "Aadhaar verified": "ਆਧਾਰ ਤਸਦੀਕਸ਼ੁਦਾ",
      "Every worker checks ID and face before taking jobs.": "ਹਰ ਕਾਮਾ ਕੰਮ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਆਧਾਰ ਅਤੇ ਫੇਸ-ਆਈਡੀ ਤਸਦੀਕ ਕਰਦਾ ਹੈ।",
      "Escrow payments": "ਸੁਰੱਖਿਅਤ ਐਸਕ੍ਰੋ ਭੁਗਤਾਨ",
      "Money is released only with your OTP.": "ਤੁਹਾਡੇ OTP/QR ਤੋਂ ਬਾਅਦ ਹੀ ਪੈਸੇ ਜਾਰੀ ਹੁੰਦੇ ਹਨ।",
      "Live GPS on every job": "ਹਰ ਕੰਮ 'ਤੇ ਲਾਈਵ GPS",
      "Both sides see where the job is in real time.": "ਦੋਵੇਂ ਧਿਰਾਂ ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਮੈਪ 'ਤੇ ਲੋਕੇਸ਼ਨ ਦੇਖਦੀਆਂ ਹਨ।",
      "One-tap SOS": "1-ਟੈਪ ਐਮਰਜੈਂਸੀ SOS",
      "Call 112 straight from an active job.": "ਕਿਸੇ ਵੀ ਚੱਲ ਰਹੇ ਕੰਮ ਤੋਂ ਸਿੱਧਾ 112 'ਤੇ ਕਾਲ ਕਰੋ।",
      "Register free in 2 minutes with your phone number and UPI ID. Pick your trade, set your daily rate, and start getting jobs nearby.": "ਆਪਣੇ ਫ਼ੋਨ ਨੰਬਰ ਅਤੇ UPI ID ਨਾਲ 2 ਮਿੰਟ ਵਿੱਚ ਮੁਫ਼ਤ ਰਜਿਸਟਰ ਕਰੋ। ਆਪਣਾ ਕੰਮ ਚੁਣੋ, ਦਿਹਾੜੀ ਤੈਅ ਕਰੋ ਅਤੇ ਨੇੜਲੇ ਕੰਮ ਪਾਓ।",
      "Free registration": "ਮੁਫ਼ਤ ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
      "Phone number and UPI ID is all you need.": "ਸਿਰਫ਼ ਫ਼ੋਨ ਨੰਬਰ ਅਤੇ UPI ID ਚਾਹੀਦੀ ਹੈ।",
      "Jobs within 10 km": "10 ਕਿਮੀ ਦੇ ਅੰਦਰ ਕੰਮ",
      "Less travel, more jobs in a day.": "ਘੱਟ ਸਫ਼ਰ, ਦਿਨ ਵਿੱਚ ਵੱਧ ਕਮਾਈ।",
      "Paid straight to UPI": "ਸਿੱਧਾ UPI ਵਿੱਚ ਭੁਗਤਾਨ",
      "PhonePe, GPay or Paytm, as soon as the customer confirms.": "ਗਾਹਕ ਦੀ ਪੁਸ਼ਟੀ ਹੁੰਦੇ ਹੀ FamPay, PhonePe, GPay ਜਾਂ Paytm ਵਿੱਚ ਪੈਸੇ।",
      "Bonuses as you grow": "ਕੰਮ ਵਧਣ 'ਤੇ ਬੋਨਸ",
      "Milestone bonus ladder from 10 to 100 jobs.": "10 ਤੋਂ 100 ਕੰਮ ਪੂਰੇ ਕਰਨ 'ਤੇ ਦੁੱਗਣਾ ਤੱਕ ਬੋਨਸ।",
      "Customer login": "ਗਾਹਕ ਲੌਗ ਇਨ",
      "Worker login": "ਕਾਮਾ ਲੌਗ ਇਨ",
      "AI Price Bot & Help": "AI ਰੇਟ ਬੌਟ ਅਤੇ ਮਦਦ",
      "AI Price Bot": "AI ਰੇਟ ਬੌਟ",
      "Support & SOS": "ਮਦਦ ਅਤੇ SOS",
      "Ask": "ਪੁੱਛੋ",
      "WhatsApp us": "ਵਟਸਐਪ ਕਰੋ",
      "Live support chat": "ਲਾਈਵ ਮਦਦ ਚੈਟ",
      "SOS · Dial 112": "ਐਮਰਜੈਂਸੀ SOS · 112",

      // Trades
      "Electrician": "ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ",
      "Plumber": "ਪਲੰਬਰ",
      "Carpenter": "ਤਰਖਾਣ",
      "Painter": "ਪੇਂਟਰ",
      "Mason": "ਰਾਜਮਿਸਤਰੀ",
      "Tile worker": "ਟਾਈਲ ਮਿਸਤਰੀ",
      "Tile Worker": "ਟਾਈਲ ਮਿਸਤਰੀ",
      "Welder": "ਵੈਲਡਰ",
      "Loader / mover": "ਲੋਡਰ / ਮੂਵਰ",
      "Loader / Mover": "ਲੋਡਰ / ਮੂਵਰ",
      "Helper": "ਹੈਲਪਰ / ਸਹਾਇਕ",
      "All trades": "ਸਾਰੇ ਕੰਮ",
      "All Trades": "ਸਾਰੇ ਕੰਮ",
      "Wiring, MCB & fans": "ਵਾਇਰਿੰਗ, MCB ਅਤੇ ਪੱਖੇ",
      "Pipes, taps & motors": "ਪਾਈਪ, ਟੂਟੀਆਂ ਅਤੇ ਮੋਟਰਾਂ",
      "Woodwork & doors": "ਲੱਕੜ ਅਤੇ ਦਰਵਾਜ਼ਿਆਂ ਦਾ ਕੰਮ",
      "Wall painting": "ਕੰਧਾਂ ਦੀ ਪੇਂਟਿੰਗ",
      "Brickwork & plaster": "ਇੱਟਾਂ ਅਤੇ ਪਲਸਤਰ ਦਾ ਕੰਮ",
      "Flooring & tiles": "ਫ਼ਰਸ਼ ਅਤੇ ਟਾਈਲਾਂ ਲਗਾਉਣਾ",
      "Metal & fabrication": "ਵੈਲਡਿੰਗ ਅਤੇ ਲੋਹੇ ਦਾ ਕੰਮ",
      "Shifting goods": "ਸਾਮਾਨ ਸ਼ਿਫਟਿੰਗ ਅਤੇ ਲੋਡਿੰਗ",
      "General labour": "ਆਮ ਮਜ਼ਦੂਰੀ / ਮਦਦ",

      // Customer Portal (/customer/*)
      "Find workers": "ਕਾਰੀਗਰ ਲੱਭੋ",
      "Find Workers": "ਕਾਰੀਗਰ ਲੱਭੋ",
      "My bookings": "ਮੇਰੀਆਂ ਬੁਕਿੰਗਾਂ",
      "My Bookings": "ਮੇਰੀਆਂ ਬੁਕਿੰਗਾਂ",
      "Support": "ਮਦਦ",
      "Post a job": "ਕੰਮ ਪੋਸਟ ਕਰੋ",
      "Post a Job": "ਕੰਮ ਪੋਸਟ ਕਰੋ",
      "+ Post a job": "+ ਕੰਮ ਪੋਸਟ ਕਰੋ",
      "Live ETA": "ਲਾਈਵ ਮੈਪ ਤੇ ਸਮਾਂ",
      "Crew & rebook": "ਟੀਮ ਅਤੇ ਦੁਬਾਰਾ ਬੁੱਕ",
      "SOS check-in": "SOS ਸੁਰੱਖਿਆ",
      "10 km Radar": "10 ਕਿਮੀ ਰਡਾਰ",
      "Scan & chat": "ਸਕੈਨ ਅਤੇ ਚੈਟ",
      "Find": "ਲੱਭੋ",
      "Post": "ਪੋਸਟ ਕਰੋ",
      "Bookings": "ਬੁਕਿੰਗਾਂ",
      "Live": "ਲਾਈਵ",
      "Find trusted,": "ਭਰੋਸੇਮੰਦ ਅਤੇ",
      "verified": "ਤਸਦੀਕਸ਼ੁਦਾ",
      "workers.": "ਕਾਰੀਗਰ ਲੱਭੋ।",
      "Aadhaar and face-ID verified electricians, plumbers, carpenters, painters and masons nearby. 20% flat platform fee, 100% UPI escrow.": "ਆਧਾਰ ਅਤੇ ਫੇਸ-ਆਈਡੀ ਤਸਦੀਕਸ਼ੁਦਾ ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ, ਪਲੰਬਰ, ਤਰਖਾਣ, ਪੇਂਟਰ ਅਤੇ ਰਾਜਮਿਸਤਰੀ। 20% ਪਾਰਦਰਸ਼ੀ ਫੀਸ, 100% UPI ਐਸਕ੍ਰੋ।",
      "Search trade, skill or worker": "ਕੰਮ, ਹੁਨਰ ਜਾਂ ਕਾਰੀਗਰ ਲੱਭੋ",
      "Post Custom Job": "ਨਵਾਂ ਕੰਮ ਪੋਸਟ ਕਰੋ",
      "LIVE DISPATCH SUMMARY": "ਲਾਈਵ ਡਿਸਪੈਚ ਸੰਖੇਪ",
      "Aadhaar-verified workers active inside your strict 10 km radar.": "ਤੁਹਾਡੇ 10 ਕਿਮੀ ਰਡਾਰ ਦੇ ਅੰਦਰ ਸਰਗਰਮ ਆਧਾਰ-ਤਸਦੀਕਸ਼ੁਦਾ ਕਾਰੀਗਰ।",
      "Strict 10 km GPS filter": "ਸਖ਼ਤ 10 ਕਿਮੀ GPS ਫਿਲਟਰ",
      "Open 10 km Radar →": "10 ਕਿਮੀ ਰਡਾਰ ਖੋਲ੍ਹੋ →",
      "Recent Work Order Status": "ਹਾਲੀਆ ਕੰਮ ਦੀ ਸਥਿਤੀ",
      "Open My Bookings →": "ਮੇਰੀਆਂ ਬੁਕਿੰਗਾਂ ਖੋਲ੍ਹੋ →",
      "Track Live →": "ਲਾਈਵ ਟ੍ਰੈਕ ਕਰੋ →",
      "View all bookings →": "ਸਾਰੀਆਂ ਬੁਕਿੰਗਾਂ ਦੇਖੋ →",
      "+ Post Job Requirement": "+ ਕੰਮ ਦੀ ਲੋੜ ਪੋਸਟ ਕਰੋ",
      "1 · Which trade?": "1 · ਕਿਹੜਾ ਕਾਰੀਗਰ ਚਾਹੀਦਾ ਹੈ?",
      "2 · Job details": "2 · ਕੰਮ ਦਾ ਵੇਰਵਾ",
      "✨ Ask AI for Price": "✨ AI ਤੋਂ ਸਹੀ ਰੇਟ ਪੁੱਛੋ",
      "Asking AI for Price…": "AI ਰੇਟ ਕੱਢ ਰਿਹਾ ਹੈ…",
      "Ask AI for Price Now →": "ਹੁਣੇ AI ਤੋਂ ਰੇਟ ਪੁੱਛੋ →",
      "Schedule Next →": "ਅੱਗੇ ਸਮਾਂ ਚੁਣੋ →",
      "Step required: Write your job details above and tap 'Ask AI for Price' to unlock Schedule & Broadcast.": "ਜ਼ਰੂਰੀ ਕਦਮ: ਉੱਪਰ ਆਪਣੇ ਕੰਮ ਦਾ ਵੇਰਵਾ ਲਿਖੋ ਅਤੇ ਅੱਗੇ ਵਧਣ ਲਈ 'AI ਤੋਂ ਸਹੀ ਰੇਟ ਪੁੱਛੋ' ਦਬਾਓ।",
      "3 · Schedule & Ludhiana site": "3 · ਸਮਾਂ ਅਤੇ ਲੁਧਿਆਣਾ ਪਤਾ",
      "← Edit Trade & Job Details": "← ਕੰਮ ਦਾ ਵੇਰਵਾ ਬਦਲੋ",
      "Start Date": "ਸ਼ੁਰੂ ਹੋਣ ਦੀ ਤਾਰੀਖ",
      "Shift Start Time": "ਕੰਮ ਸ਼ੁਰੂ ਕਰਨ ਦਾ ਸਮਾਂ",
      "Duration (Days)": "ਮਿਆਦ (ਦਿਨ)",
      "Ludhiana Area": "ਲੁਧਿਆਣਾ ਦਾ ਇਲਾਕਾ",
      "Full Site Address": "ਕੰਮ ਦਾ ਪੂਰਾ ਪਤਾ",
      "AI VERIFIED LABOUR PRICE": "AI ਤਸਦੀਕਸ਼ੁਦਾ ਮਜ਼ਦੂਰੀ ਰੇਟ",
      "Daily Labour Rate (₹)": "ਰੋਜ਼ਾਨਾ ਮਜ਼ਦੂਰੀ ਰੇਟ (₹)",
      "Platform fee (+20% escrow)": "ਪਲੇਟਫਾਰਮ ਫੀਸ (+20% ਐਸਕ੍ਰੋ)",
      "Payments done by": "ਤੁਹਾਡੇ ਖਾਤੇ ਵੱਲੋਂ",
      "your account.": "ਕੀਤੇ ਗਏ ਭੁਗਤਾਨ।",
      "TOTAL PAID BY YOUR ACCOUNT": "ਤੁਹਾਡੇ ਖਾਤੇ ਵੱਲੋਂ ਕੁੱਲ ਭੁਗਤਾਨ",
      "PAYMENTS DONE (YOUR ACCOUNT)": "ਪੂਰੇ ਹੋਏ ਭੁਗਤਾਨ (ਤੁਹਾਡਾ ਖਾਤਾ)",
      "PENDING PAYMENT (YOUR ACCOUNT)": "ਬਾਕੀ ਭੁਗਤਾਨ (ਤੁਹਾਡਾ ਖਾਤਾ)",
      "Post new job": "ਨਵਾਂ ਕੰਮ ਪੋਸਟ ਕਰੋ",
      "No payments done by your account yet": "ਅਜੇ ਤੱਕ ਤੁਹਾਡੇ ਖਾਤੇ ਤੋਂ ਕੋਈ ਭੁਗਤਾਨ ਨਹੀਂ ਹੋਇਆ ਹੈ",
      "4-STEP LIVE JOB TRACKER": "4-ਕਦਮ ਲਾਈਵ ਕੰਮ ਟ੍ਰੈਕਰ",
      "Live job": "ਲਾਈਵ ਕੰਮ",
      "condition & progress.": "ਸਥਿਤੀ ਅਤੇ ਪ੍ਰਗਤੀ।",
      "← All My Bookings": "← ਮੇਰੀਆਂ ਸਾਰੀਆਂ ਬੁਕਿੰਗਾਂ",
      "Job Broadcasted": "ਕੰਮ ਪ੍ਰਸਾਰਿਤ",
      "10 km verified radar": "10 ਕਿਮੀ ਤਸਦੀਕਸ਼ੁਦਾ ਰਡਾਰ",
      "Worker Coming": "ਕਾਰੀਗਰ ਆ ਰਿਹਾ ਹੈ",
      "Live GPS map & Start OTP": "ਲਾਈਵ GPS ਮੈਪ ਅਤੇ Start OTP",
      "Work In Progress": "ਕੰਮ ਚੱਲ ਰਿਹਾ ਹੈ",
      "Job being completed": "ਕੰਮ ਪੂਰਾ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ",
      "Completed & Paid": "ਕੰਮ ਪੂਰਾ ਅਤੇ ਭੁਗਤਾਨ",
      "Razorpay UPI settlement": "UPI ਰਾਹੀਂ ਭੁਗਤਾਨ",
      "Switch Worker": "ਦੂਜਾ ਕਾਰੀਗਰ ਚੁਣੋ",
      "✓ Confirm Worker & Show Start QR": "✓ ਕਾਰੀਗਰ ਪੱਕਾ ਕਰੋ ਅਤੇ Start QR ਦਿਖਾਓ",
      "Open Google Maps App ↗": "ਗੂਗਲ ਮੈਪਸ ਐਪ ਖੋਲ੍ਹੋ ↗",
      "📞 Call Worker": "📞 ਕਾਰੀਗਰ ਨੂੰ ਕਾਲ ਕਰੋ",
      "💬 Message": "💬 ਮੈਸੇਜ ਕਰੋ",
      "Hide QR": "QR ਲੁਕਾਓ",
      "Show QR": "QR ਦਿਖਾਓ",
      "Attendance clock": "ਕੰਮ ਦਾ ਸਮਾਂ",
      "Booked": "ਬੁੱਕ ਕੀਤਾ",
      "Assigned": "ਕਾਰੀਗਰ ਮਿਲਿਆ",
      "Completed & UPI": "ਕੰਮ ਪੂਰਾ ਤੇ UPI",
      "Razorpay Pay": "UPI ਭੁਗਤਾਨ",
      "Paid & Settled": "ਭੁਗਤਾਨ ਸਫਲ",

      // Worker Portal (/worker/* & /jobs)
      "Work": "ਕੰਮ",
      "Account & pay": "ਖਾਤਾ ਅਤੇ ਕਮਾਈ",
      "Khata & pass": "ਖਾਤਾ ਅਤੇ ਗੇਟ-ਪਾਸ",
      "Bonus ladder": "ਬੋਨਸ ਪੌੜੀ",
      "Khata": "ਖਾਤਾ",
      "Bonus": "ਬੋਨਸ",
      "● Online · broadcasting": "● ਆਨਲਾਈਨ · ਕੰਮ ਲਈ ਤਿਆਰ",
      "○ Offline": "○ ਆਫ਼ਲਾਈਨ",
      "🚫 Blocked by Admin": "🚫 ਐਡਮਿਨ ਵੱਲੋਂ ਬਲੌਕ",
      "Wallet": "ਬਟੂਆ",
      "Hyperlocal 10 km GPS radar active": "10 ਕਿਮੀ ਸਥਾਨਕ GPS ਰਡਾਰ ਚਾਲੂ ਹੈ",
      "Jobs near you,": "ਤੁਹਾਡੇ ਨੇੜੇ ਕੰਮ,",
      "paid before": "ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ",
      "you start.": "ਸੁਰੱਖਿਅਤ।",
      "paid daily.": "ਰੋਜ਼ਾਨਾ ਭੁਗਤਾਨ।",
      "100% Escrow backed": "100% ਐਸਕ੍ਰੋ ਸੁਰੱਖਿਅਤ",
      "Keep 80% of every job": "ਹਰ ਕੰਮ ਦਾ 80% ਤੁਹਾਡਾ",
      "≤ 10 km strict GPS radius": "≤ 10 ਕਿਮੀ ਸਖ਼ਤ GPS ਘੇਰਾ",
      "Sort: Nearest first": "ਛਾਂਟੋ: ਸਭ ਤੋਂ ਨੇੜੇ ਪਹਿਲਾਂ",
      "Sort: Highest payout": "ਛਾਂਟੋ: ਸਭ ਤੋਂ ਵੱਧ ਕਮਾਈ",
      "Sort: Newest": "ਛਾਂਟੋ: ਸਭ ਤੋਂ ਨਵਾਂ",
      "All nearby": "ਸਾਰੇ ਨੇੜਲੇ",
      "Urgent / Today": "ਤੁਰੰਤ / ਅੱਜ",
      "High pay (₹800+)": "ਵੱਧ ਕਮਾਈ (₹800+)",
      "≤ 3 km close": "≤ 3 ਕਿਮੀ ਨੇੜੇ",
      "Your net payout (80%)": "ਤੁਹਾਡੀ ਸ਼ੁੱਧ ਕਮਾਈ (80%)",
      "100% yours (Zero-fee pass)": "100% ਤੁਹਾਡਾ (ਜ਼ੀਰੋ-ਫੀਸ ਪਾਸ)",
      "Interested": "ਦਿਲਚਸਪੀ ਹੈ",
      "✓ Interested": "✓ ਦਿਲਚਸਪੀ ਭੇਜੀ",
      "Negotiate": "ਰੇਟ ਗੱਲ ਕਰੋ",
      "Skip": "ਛੱਡੋ",
      "1-Tap Accept →": "1-ਟੈਪ ਵਿੱਚ ਕੰਮ ਲਓ →",
      "1-Tap Accept": "1-ਟੈਪ ਵਿੱਚ ਕੰਮ ਲਓ",
      "Send Proposal": "ਆਪਣਾ ਰੇਟ ਭੇਜੋ",
      "Active work": "ਚੱਲ ਰਿਹਾ ਕੰਮ",
      "No active jobs. Accept one from the list and it will show up here with its start code.": "ਕੋਈ ਚੱਲ ਰਿਹਾ ਕੰਮ ਨਹੀਂ ਹੈ। ਸੂਚੀ ਵਿੱਚੋਂ ਕੋਈ ਕੰਮ ਮਨਜ਼ੂਰ ਕਰੋ, ਉਹ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗਾ।",
      "Start Job": "ਕੰਮ ਸ਼ੁਰੂ ਕਰੋ",
      "Mark Completed · Enter UPI": "ਕੰਮ ਪੂਰਾ ਕਰੋ · UPI ਪਾਓ",
      "Mark Completed →": "ਕੰਮ ਪੂਰਾ ਕਰੋ →",
      "10-to-100 cash doubler": "10-ਤੋਂ-100 ਕੈਸ਼ ਡਬਲਰ ਬੋਨਸ",
      "See ladder →": "ਬੋਨਸ ਪੌੜੀ ਦੇਖੋ →",
      "Ludhiana live demand": "ਲੁਧਿਆਣਾ ਵਿੱਚ ਕੰਮ ਦੀ ਮੰਗ",
      "Tap an area to filter its jobs.": "ਉਸ ਇਲਾਕੇ ਦੇ ਕੰਮ ਦੇਖਣ ਲਈ ਟੈਪ ਕਰੋ।",
      "Help": "ਮਦਦ",
      "SOS 112": "ਐਮਰਜੈਂਸੀ 112",
      "No jobs match right now": "ਇਸ ਵੇਲੇ ਕੋਈ ਕੰਮ ਨਹੀਂ ਮਿਲਿਆ",
      "Live hyperlocal job broadcasts": "ਨੇੜਲੇ ਲਾਈਵ ਕੰਮ ਪ੍ਰਸਾਰਣ",
      "Work within your 10 km neighbourhood. No middlemen. Payouts go straight to your UPI the moment work is confirmed.": "ਆਪਣੇ 10 ਕਿਮੀ ਇਲਾਕੇ ਵਿੱਚ ਕੰਮ ਕਰੋ। ਕੋਈ ਵਿਚੋਲਾ ਨਹੀਂ। ਕੰਮ ਪੂਰਾ ਹੁੰਦੇ ਹੀ ਸਿੱਧਾ ਤੁਹਾਡੇ UPI ਵਿੱਚ ਪੈਸੇ।",
      "Open 10 km Job Board →": "10 ਕਿਮੀ ਜੌਬ ਬੋਰਡ ਖੋਲ੍ਹੋ →",
      "WITHDRAWABLE WALLET": "ਕਢਵਾਉਣ ਯੋਗ ਬੈਲੇਂਸ",
      "TODAY'S EARNINGS": "ਅੱਜ ਦੀ ਕਮਾਈ",
      "JOBS COMPLETED": "ਪੂਰੇ ਕੀਤੇ ਕੰਮ",
      "MATCHING WITHIN 10 KM": "10 ਕਿਮੀ ਵਿੱਚ ਉਪਲਬਧ ਕੰਮ",
      "Your Assigned & Active Jobs": "ਤੁਹਾਡੇ ਚੱਲ ਰਹੇ ਕੰਮ",
      "Open Live Job View →": "ਲਾਈਵ ਕੰਮ ਪੇਜ ਖੋਲ੍ਹੋ →",
      "See all jobs in 10 km Radar →": "10 ਕਿਮੀ ਰਡਾਰ ਵਿੱਚ ਸਾਰੇ ਕੰਮ ਦੇਖੋ →",
      "WITHDRAWABLE BALANCE": "ਕਢਵਾਉਣ ਯੋਗ ਰਕਮ",
      "Trade & Daily Rate Settings": "ਕੰਮ ਅਤੇ ਦਿਹਾੜੀ ਰੇਟ ਸੈਟਿੰਗ",
      "Daily Base Rate (₹)": "ਰੋਜ਼ਾਨਾ ਦਿਹਾੜੀ ਰੇਟ (₹)",
      "Save Rate & UPI": "ਰੇਟ ਅਤੇ UPI ਸੇਵ ਕਰੋ",
      "WITHDRAWABLE": "ਕਢਵਾਉਣ ਯੋਗ",
      "ESCROW PENDING": "ਐਸਕ੍ਰੋ ਵਿੱਚ ਸੁਰੱਖਿਅਤ",
      "TOTAL WITHDRAWN": "ਕੁੱਲ ਕਢਵਾਏ ਪੈਸੇ",
      "Payout Ledger": "ਭੁਗਤਾਨ ਖਾਤਾ (ਲੇਜਰ)",
      "Withdraw Wallet →": "ਪੈਸੇ UPI ਵਿੱਚ ਕਢਵਾਓ →",
      "Download Official Gate Pass PNG": "ਅਧਿਕਾਰਤ ਗੇਟ-ਪਾਸ ਡਾਊਨਲੋਡ ਕਰੋ",

      // Worker Live Job Page (/worker/live-job)
      "1. Picked": "1. ਕੰਮ ਲਿਆ",
      "Job accepted": "ਕੰਮ ਮਨਜ਼ੂਰ ਕੀਤਾ",
      "2. Go to Site": "2. ਕੰਮ 'ਤੇ ਜਾਓ",
      "3. Work Live": "3. ਕੰਮ ਚਾਲੂ",
      "Start QR verified": "Start QR ਤਸਦੀਕ",
      "4. Completed": "4. ਕੰਮ ਪੂਰਾ",
      "End QR & FamPay UPI": "End QR ਅਤੇ FamPay UPI",
      "YOUR LABOUR PAYOUT": "ਤੁਹਾਡੀ ਮਜ਼ਦੂਰੀ ਕਮਾਈ",
      "100% Escrow Protected": "100% ਐਸਕ੍ਰੋ ਸੁਰੱਖਿਅਤ",
      "📞 Call Customer": "📞 ਗਾਹਕ ਨੂੰ ਕਾਲ ਕਰੋ",
      "💬 Message Customer": "💬 ਗਾਹਕ ਨੂੰ ਮੈਸੇਜ ਕਰੋ",
      "WhatsApp Customer ↗": "ਗਾਹਕ ਨੂੰ ਵਟਸਐਪ ਕਰੋ ↗",
      "Open Work Site in Google Maps ↗": "ਗੂਗਲ ਮੈਪਸ ਵਿੱਚ ਰਸਤਾ ਖੋਲ੍ਹੋ ↗",
      "1 · QR for Starting the Job": "1 · ਕੰਮ ਸ਼ੁਰੂ ਕਰਨ ਦਾ QR / OTP",
      "2 · QR for Ending the Job": "2 · ਕੰਮ ਖਤਮ ਕਰਨ ਦਾ QR / OTP",
      "Ask Customer for Start OTP": "ਗਾਹਕ ਤੋਂ Start OTP ਪੁੱਛੋ",
      "Ask Customer for End OTP": "ਗਾਹਕ ਤੋਂ End OTP ਪੁੱਛੋ",
      "📷 Open Camera QR Scanner": "📷 ਕੈਮਰਾ QR ਸਕੈਨਰ ਖੋਲ੍ਹੋ",
      "📷 Camera Scan End QR": "📷 ਕੈਮਰੇ ਨਾਲ End QR ਸਕੈਨ ਕਰੋ",
      "Scan / Verify Start OTP & Begin Job →": "Start OTP ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਕੰਮ ਸ਼ੁਰੂ ਕਰੋ →",
      "Scan / Verify End QR & Complete Job →": "End QR/OTP ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਕੰਮ ਪੂਰਾ ਕਰੋ →",
      "Cannot complete this job?": "ਕੀ ਤੁਸੀਂ ਇਹ ਕੰਮ ਪੂਰਾ ਨਹੀਂ ਕਰ ਸਕਦੇ?",
      "Reject / Cancel Job to Leave Page": "ਪੇਜ ਛੱਡਣ ਲਈ ਕੰਮ ਰੱਦ ਕਰੋ",
      "Stay & Complete Job": "ਰੁਕੋ ਅਤੇ ਕੰਮ ਪੂਰਾ ਕਰੋ",
      "Confirm Reject · Offline for 24h": "ਕੰਮ ਰੱਦ ਕਰੋ · 24 ਘੰਟੇ ਆਫ਼ਲਾਈਨ",

      // FamPay Real Money Transfer Modal
      "● REAL UPI MONEY TRANSFER · NPCI VERIFIED": "● ਅਸਲੀ UPI ਮਨੀ ਟ੍ਰਾਂਸਫਰ · NPCI ਤਸਦੀਕਸ਼ੁਦਾ",
      "STEP 1 · SCAN QR OR TAP UPI APP BELOW": "ਕਦਮ 1 · QR ਸਕੈਨ ਕਰੋ ਜਾਂ ਹੇਠਾਂ UPI ਐਪ ਦਬਾਓ",
      "Copy ID": "ID ਕਾਪੀ ਕਰੋ",
      "Copied ✓": "ਕਾਪੀ ਹੋ ਗਿਆ ✓",
      "⬇ Save QR to Gallery": "⬇ QR ਗੈਲਰੀ ਵਿੱਚ ਸੇਵ ਕਰੋ",
      "📋 Paste UTR": "📋 UTR ਪੇਸਟ ਕਰੋ",
      "📷 Attach Screenshot": "📷 ਸਕ੍ਰੀਨਸ਼ੌਟ ਜੋੜੋ",
      "Open Razorpay Gateway →": "ਰੇਜ਼ਰਪੇ ਗੇਟਵੇ ਖੋਲ੍ਹੋ →",

      // Register Page (/register)
      "Already registered?": "ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?",
      "New to Kaamzo?": "ਕਾਮਜ਼ੋ 'ਤੇ ਨਵੇਂ ਹੋ?",
      "Register free": "ਮੁਫ਼ਤ ਰਜਿਸਟਰ ਕਰੋ",
      "CREATE YOUR ACCOUNT": "ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ",
      "RETURNING USER SIGN IN": "ਪੁਰਾਣੇ ਯੂਜ਼ਰ ਲੌਗ ਇਨ ਕਰੋ",
      "Customer / Employer": "ਗਾਹਕ / ਮਾਲਕ",
      "Worker": "ਕਾਮਾ / ਕਾਰੀਗਰ",
      "Sign in →": "ਲੌਗ ਇਨ ਕਰੋ →",
      "Continue with Google": "Google ਨਾਲ ਜਾਰੀ ਰੱਖੋ",
      "I need a worker": "ਮੈਨੂੰ ਕਾਰੀਗਰ ਚਾਹੀਦਾ ਹੈ",
      "Customer / employer · hire verified help": "ਗਾਹਕ · ਤਸਦੀਕਸ਼ੁਦਾ ਕਾਰੀਗਰ ਬੁੱਕ ਕਰੋ",
      "WORKER REGISTRATION": "ਕਾਮਾ ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
      "CUSTOMER REGISTRATION": "ਗਾਹਕ ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
      "Continue": "ਅੱਗੇ ਵਧੋ",
      "Create my Kaamzo account": "ਮੇਰਾ ਕਾਮਜ਼ੋ ਖਾਤਾ ਬਣਾਓ",
      "Press Enter to continue": "ਅੱਗੇ ਵਧਣ ਲਈ Enter ਦਬਾਓ",
      "Take live selfie": "ਲਾਈਵ ਸੈਲਫ਼ੀ ਲਓ",
      "Upload photo": "ਫ਼ੋਟੋ ਅਪਲੋਡ ਕਰੋ",
      "Capture Selfie": "ਸੈਲਫ਼ੀ ਖਿੱਚੋ",
      "Snap my real-world address": "ਮੇਰੀ ਲਾਈਵ GPS ਲੋਕੇਸ਼ਨ ਭਰੋ",
      "✅ Yes — I bring my own full toolkit": "✅ ਹਾਂ — ਮੇਰੇ ਕੋਲ ਆਪਣੇ ਪੂਰੇ ਔਜ਼ਾਰ (ਟੂਲਕਿੱਟ) ਹਨ",
      "🔧 Basic tools only": "🔧 ਸਿਰਫ਼ ਬੇਸਿਕ (ਆਮ) ਔਜ਼ਾਰ ਹਨ",
      "❌ No — I need customer's tools": "❌ ਨਹੀਂ — ਮੈਨੂੰ ਗਾਹਕ ਦੇ ਔਜ਼ਾਰ ਚਾਹੀਦੇ ਹਨ",
      "⛔ Sorry, you need your own tools to register on Kaamzo.": "⛔ ਮਾਫ਼ ਕਰਨਾ, ਕਾਮਜ਼ੋ ਨਾਲ ਜੁੜਨ ਲਈ ਤੁਹਾਡੇ ਕੋਲ ਆਪਣੇ ਔਜ਼ਾਰ ਹੋਣੇ ਜ਼ਰੂਰੀ ਹਨ।"
    }
  };

  // Build normalized (case-insensitive) lookup & reverse (HI/PA -> EN) map for 100% reliable restoration
  var NORM_GLOSSARY = { hi: {}, pa: {} };
  var REVERSE_TO_EN = {};
  ['hi', 'pa'].forEach(function(lg) {
    Object.keys(GLOSSARY[lg]).forEach(function(enKey) {
      var val = GLOSSARY[lg][enKey];
      NORM_GLOSSARY[lg][enKey.toLowerCase()] = val;
      if (val) REVERSE_TO_EN[val.trim()] = enKey;
    });
  });

  var persistentCache = { hi: {}, pa: {} };
  try {
    var rawCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    if (rawCache && typeof rawCache === 'object') {
      if (rawCache.hi) persistentCache.hi = rawCache.hi;
      if (rawCache.pa) persistentCache.pa = rawCache.pa;
      ['hi', 'pa'].forEach(function(lg) {
        Object.keys(persistentCache[lg]).forEach(function(enKey) {
          var val = persistentCache[lg][enKey];
          if (val) REVERSE_TO_EN[val.trim()] = enKey;
        });
      });
    }
  } catch (e) {}

  function savePersistentCache() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(persistentCache));
    } catch (e) {}
  }

  // Track original English text cleanly without replacing DOM Text nodes (100% React-safe!)
  var origTextMap = new WeakMap();
  var origPlaceholderMap = new WeakMap();
  var inFlight = { hi: new Set(), pa: new Set() };
  var currentLang = 'en';
  var sweepTimer = null;
  var isApplying = false;

  function getActiveLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('kaamzo_language_v8') || 'en';
      return (v === 'hi' || v === 'pa') ? v : 'en';
    } catch (e) {
      return 'en';
    }
  }

  function shouldSkipString(str) {
    if (!str) return true;
    var s = str.trim();
    if (!s || s.length < 2 || s.length > 380) return true;
    if (/^(kaamzo\.?|india|en|hi|pa|qr|otp|upi|gps|kmz-[a-z0-9-]+|pb-[0-9a-z-]+)$/i.test(s)) return true;
    if (/^[\d\s₹$%.,:+/\-()★•→↗←✕✓🔒⚡👷‍♂️📒🚨📍🔊💰🔥🔴🟡🟢🔵🗺️🔍⏱📜📥🖨️🏦🛠️🎉🛵🔒]+$/.test(s)) return true;
    if (/^https?:\/\//i.test(s) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return true;
    if (!/[a-zA-Z]{2,}/.test(s)) return true;
    if (/[\u0900-\u097F\u0A00-\u0A7F]/.test(s) && !/[a-zA-Z]{4,}/.test(s)) return true;
    return false;
  }

  function lookupTranslation(orig, lang) {
    var trimmed = orig.trim();
    if (!trimmed) return null;
    if (GLOSSARY[lang] && GLOSSARY[lang][trimmed]) return GLOSSARY[lang][trimmed];
    var lower = trimmed.toLowerCase();
    if (NORM_GLOSSARY[lang] && NORM_GLOSSARY[lang][lower]) return NORM_GLOSSARY[lang][lower];
    if (persistentCache[lang] && persistentCache[lang][trimmed]) return persistentCache[lang][trimmed];
    return null;
  }

  function formatPreservingWhitespace(orig, translated) {
    var lead = (orig.match(/^\s*/) || [''])[0];
    var trail = (orig.match(/\s*$/) || [''])[0];
    return lead + translated + trail;
  }

  function isSkippedElement(el) {
    if (!el || el.nodeType !== 1) return false;
    var tag = (el.tagName || '').toUpperCase();
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SVG' || tag === 'CODE' || tag === 'PRE') return true;
    if (el.closest && el.closest('.notranslate, [data-no-translate], [aria-label="Language selection"]')) {
      return true;
    }
    return false;
  }

  function hasIndicScript(s) {
    return /[\u0900-\u097F\u0A00-\u0A7F]/.test(s || '');
  }

  function collectAndApply(lang) {
    if (!document.body) return;
    isApplying = true;
    var missing = [];
    var seenMissing = new Set();

    try {
      // 1. Walk all visible text nodes safely
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      var node;
      while ((node = walker.nextNode())) {
        var parent = node.parentElement;
        if (!parent || isSkippedElement(parent)) continue;

        var curVal = node.nodeValue || '';
        var curTrim = curVal.trim();
        if (!curTrim) continue;

        if (!origTextMap.has(node)) {
          if (!hasIndicScript(curVal)) {
            origTextMap.set(node, curVal);
          } else if (REVERSE_TO_EN[curTrim]) {
            origTextMap.set(node, formatPreservingWhitespace(curVal, REVERSE_TO_EN[curTrim]));
          }
        } else {
          // If React updated the node text to a new English value while in HI/PA mode, update original map
          var prevOrig = origTextMap.get(node);
          if (!hasIndicScript(curVal) && /[a-zA-Z]{2,}/.test(curVal)) {
            var knownHi = lookupTranslation(prevOrig, 'hi');
            var knownPa = lookupTranslation(prevOrig, 'pa');
            if (curTrim !== prevOrig.trim() && (!knownHi || curTrim !== knownHi) && (!knownPa || curTrim !== knownPa)) {
              origTextMap.set(node, curVal);
            }
          }
        }

        if (!origTextMap.has(node)) continue;
        var orig = origTextMap.get(node);
        if (lang === 'en') {
          if (node.nodeValue !== orig) {
            node.nodeValue = orig;
          }
          continue;
        }

        if (shouldSkipString(orig)) continue;
        var tr = lookupTranslation(orig, lang);
        if (tr) {
          var nextStr = formatPreservingWhitespace(orig, tr);
          if (node.nodeValue !== nextStr) node.nodeValue = nextStr;
        } else {
          var key = orig.trim();
          if (!seenMissing.has(key) && !inFlight[lang].has(key)) {
            seenMissing.add(key);
            missing.push(key);
          }
        }
      }

      // 2. Translate input/textarea placeholders
      var inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
      for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        var curPh = inp.placeholder || '';
        if (!origPlaceholderMap.has(inp)) {
          if (!hasIndicScript(curPh)) {
            origPlaceholderMap.set(inp, curPh);
          } else if (REVERSE_TO_EN[curPh.trim()]) {
            origPlaceholderMap.set(inp, REVERSE_TO_EN[curPh.trim()]);
          }
        }
        var origPh = origPlaceholderMap.get(inp);
        if (!origPh) continue;
        if (lang === 'en') {
          if (inp.placeholder !== origPh) inp.placeholder = origPh;
          continue;
        }
        if (shouldSkipString(origPh)) continue;
        var trPh = lookupTranslation(origPh, lang);
        if (trPh) {
          if (inp.placeholder !== trPh) inp.placeholder = trPh;
        } else {
          var phKey = origPh.trim();
          if (!seenMissing.has(phKey) && !inFlight[lang].has(phKey)) {
            seenMissing.add(phKey);
            missing.push(phKey);
          }
        }
      }
    } finally {
      isApplying = false;
    }

    // 3. Batch-fetch any unseen strings from our fast first-party /api/translate endpoint
    if (lang !== 'en' && missing.length > 0) {
      fetchMissingBatches(missing, lang);
    }
  }

  function fetchMissingBatches(items, lang) {
    var chunks = [];
    for (var i = 0; i < items.length; i += 40) {
      chunks.push(items.slice(i, i + 40));
    }
    var apiBase = '';
    try {
      if (window.location.protocol === 'capacitor:' || (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) {
        apiBase = 'https://www.kaamzo.site';
      }
    } catch (e) {}

    chunks.forEach(function(chunk) {
      chunk.forEach(function(k) { inFlight[lang].add(k); });
      fetch(apiBase + '/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: lang, texts: chunk })
      })
        .then(function(res) { return res.ok ? res.json() : null; })
        .then(function(data) {
          if (data && data.translations) {
            var changed = false;
            Object.keys(data.translations).forEach(function(src) {
              var dst = data.translations[src];
              if (dst && typeof dst === 'string' && !/[\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]/.test(dst)) {
                persistentCache[lang][src] = dst;
                REVERSE_TO_EN[dst.trim()] = src;
                changed = true;
              }
            });
            if (changed) {
              savePersistentCache();
              if (getActiveLang() === lang) collectAndApply(lang);
            }
          }
        })
        .catch(function() {})
        .finally(function() {
          chunk.forEach(function(k) { inFlight[lang].delete(k); });
        });
    });
  }

  function scheduleSweep() {
    if (sweepTimer) clearTimeout(sweepTimer);
    sweepTimer = setTimeout(function() {
      var lang = getActiveLang();
      currentLang = lang;
      if (lang !== 'en') collectAndApply(lang);
    }, 45);
  }

  window.kaamzoApplyFullLanguage = function(lang) {
    var target = (lang === 'hi' || lang === 'pa') ? lang : 'en';
    currentLang = target;
    try { document.documentElement.lang = target; } catch (e) {}
    collectAndApply(target);
  };

  // Expose window.kaamzoSetLanguage (called directly by TopUtilityBar, HomePage & RegisterPage!)
  window.kaamzoSetLanguage = function(lang) {
    var target = (lang === 'hi' || lang === 'pa') ? lang : 'en';
    currentLang = target;
    try {
      localStorage.setItem(STORAGE_KEY, target);
      localStorage.setItem('kaamzo_language_v8', target);
      document.documentElement.lang = target;
    } catch (e) {}
    collectAndApply(target);
    setTimeout(function() { collectAndApply(target); }, 35);
    setTimeout(function() { collectAndApply(target); }, 140);
  };

  // Intercept localStorage.setItem so switching EN <-> HI <-> PA in React applies immediately
  try {
    var origSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, val) {
      origSetItem.apply(this, arguments);
      if (this === window.localStorage && (key === STORAGE_KEY || key === 'kaamzo_language_v8')) {
        var target = (val === 'hi' || val === 'pa') ? val : 'en';
        collectAndApply(target);
        setTimeout(function() {
          window.kaamzoApplyFullLanguage(target);
        }, 40);
      }
    };
  } catch (e) {}

  // Observe dynamic React DOM updates (tab switches, modals, route changes)
  function startObserver() {
    if (!document.body || typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(function() {
      if (isApplying) return;
      if (getActiveLang() !== 'en') scheduleSweep();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Apply immediately if user already had HI or PA selected
    var initial = getActiveLang();
    if (initial !== 'en') {
      collectAndApply(initial);
      setTimeout(function() { collectAndApply(getActiveLang()); }, 180);
      setTimeout(function() { collectAndApply(getActiveLang()); }, 600);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
})();
