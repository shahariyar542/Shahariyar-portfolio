import {
  portfolioFacts,
  detectLanguage,
} from './irisKnowledge.js';

/**
 * Intelligent Intent-Based Retrieval & Conversation Engine for IRIS
 * Accurately handles:
 * 1. Friendly Social Conversations (Hello, Compliments, Joking, Thanks, Bye)
 * 2. Direct Contact & Social Links (contact, sontact, email, github, linkedin, cv, facebook)
 * 3. Portfolio Queries (Skills, Projects, Education, Experience, Achievements, Identity)
 * 4. Typo-tolerant single-word inputs (skill, contact, sontact, projek, edu)
 * 5. Contextual Follow-up Questions (Which one uses AI, Give me its GitHub link)
 * 6. Context-Aware Cute Refusals for Unrelated Questions (Math, Teaching, Trivia, Country names)
 */
export function processIrisQuery(userMessage, conversationHistory = []) {
  const text = (userMessage || '').trim();
  const rawQ = text.toLowerCase();
  // Strip punctuation for robust word boundary matching
  const q = rawQ.replace(/[?!.,;:()_~`'"[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
  const lang = detectLanguage(text);

  // Extract recent context from the last 3 messages
  const lastUserMessages = conversationHistory
    .filter((m) => m.sender === 'user')
    .slice(-3)
    .map((m) => m.text.toLowerCase());
  const lastContext = lastUserMessages.join(' ');

  // =========================================================================
  // 1. FRIENDLY SOCIAL INTERACTIONS (ALLOWED CHIT-CHAT)
  // =========================================================================

  // Compliments & Flattery (e.g. "Tumi onek cute!", "You're so cute!", "So pretty", "You are awesome")
  if (
    /(cute|pretty|sweet|beautiful|smart|awesome|cool|sundor|bhalo|valo|intelligent)/i.test(q) &&
    /(you|iris|tumi|ur|tumar|tomar)/i.test(q)
  ) {
    if (lang === 'english') {
      return "Awww! Reallyyy? 🥹 You're making my little circuits blush! Thank you so much! 💙 What would you like to discover about Shahariyar today?";
    }
    return "Awww! Reallyyy? 🥹 You're making my little circuits blush! অনেক অনেক ধন্যবাদ! 💙 Shahariyar-এর Projects বা Skills নিয়ে কিছু দেখতে চাও?";
  }

  // Laughter & Playful Teasing (e.g. "Hahaha tumi moja koro!", "lol", "haha", "moja koro")
  if (
    /\b(hahaha+|haha+|hehe+|lol|rofl|lmao|joke|funny|laugh)\b|(moja koro|moja korcho|moja korteso)/i.test(q)
  ) {
    if (lang === 'english') {
      return "Hehehe! 😂 I guess Shahariyar programmed a little humor into my circuits! How can I help you explore his work today? 💙";
    }
    return "Hehehe! 😂 I guess Shahariyar programmed a little humor into me! হাহা, বলো শাহারিয়ারের কোন প্রজেক্ট বা স্কিল সম্পর্কে জানতে চাও? 💙";
  }

  // Greetings (e.g. "Hey Iris!", "Hello", "Hi", "Kemon acho", "Salam")
  if (
    /\b(hey iris|hello iris|hi iris|heyy+|hey|hello|hi|kemon acho|kemon achen|assalamu alaikum|salam|namoshkar)\b/i.test(q) &&
    !/(github|email|cv|project|skill|education|university|who|somporke|shomporke|contact|sontact)/i.test(q)
  ) {
    if (lang === 'english') {
      return "Heyyyy! 💙 You're back! What would you like to discover about Shahariyar today?";
    }
    if (lang === 'bengali') {
      return "হ্যালোও! 💙 কেমন আছো বলো? Shahariyar-এর পোর্টফোলিও ঘুরে দেখতে আমি প্রস্তুত! কী জানতে চাও?";
    }
    return "Heyyyy! 💙 Kemon acho? Shahariyar er portfolio explore korte ami ready! Ajke ki dekhbe bolo?";
  }

  // Gratitude / Thanks
  if (/(thank you|thanks|dhonnobad|thx|arigatou|shukriya)/i.test(q)) {
    if (lang === 'english') {
      return "You're always welcome! Happy to help! 💙 Feel free to ask if there's anything else you'd like to explore!";
    }
    return "You're always welcome! Happy to help! 💙 Shahariyar-এর কাজ সম্পর্কে আর কিছু জানার থাকলে জিজ্ঞেস করো!";
  }

  // Parting / Goodbye
  if (/(bye|goodbye|see you|tata|bidai|pore kotha hobe)/i.test(q)) {
    if (lang === 'english') {
      return "See you around! 👋 Don't forget to explore more of Shahariyar's work! Have an amazing day! 💙";
    }
    return "See you around! 👋 ভালো থেকো! Shahariyar-এর পোর্টফোলিও ঘুরে দেখার জন্য অনেক ধন্যবাদ! 💙";
  }

  // Help / Capabilities / Commands
  if (
    /\b(help|commands|what can you do|ki korte paro|tumi ki paro|help me|guide me|options)\b/i.test(q) ||
    /(কি করতে পারো|সাহায্য|হেল্প|তুমি কি জানো)/.test(text)
  ) {
    if (lang === 'english') {
      return `Hey! I'm IRIS, Shahariyar's AI portfolio assistant! 💙 Here's what I can help you with:\n\n• 💻 **Skills**: Learn about his Python, Java, C++, AI/ML, and web tech stack.\n• 🤖 **Projects**: Ask about his AI transit tracker, personal AI, or interactive portfolio.\n• 📬 **Contact**: Get his direct Email, LinkedIn, GitHub, and Facebook!\n• 🎓 **Education**: Check his DIU Software Engineering studies & batch.\n• 📄 **CV / Resume**: Get the instant download link for his verified CV.\n\nJust type what you're curious about! 😊`;
    }
    return `আমি IRIS, Shahariyar-এর পোর্টফোলিও অ্যাসিস্ট্যান্ট! 💙 আমি যেসব তথ্য দিতে পারি:\n\n• 💻 **স্কিলস**: পাইথন, জাভা, সি++, মেশিন লার্নিং এবং ওয়েব ডেভেলপমেন্ট স্কিল।\n• 🤖 **প্রজেক্টস**: তাঁর AI স্মার্ট ট্রানজিট, পার্সোনাল AI বা ৩D পোর্টফোলিও সম্পর্কে।\n• 📬 **যোগাযোগ**: সরাসরি ইমেইল, লিংকডইন, গিটহাব ও ফেসবুক লিংক!\n• 🎓 **এডুকেশন**: DIU সফটওয়্যার ইঞ্জিনিয়ারিং স্টাডিজ ও ব্যাকগ্রাউন্ড।\n• 📄 **সিভি (CV)**: সরাসরি ভেরিফাইড সিভি ডাউনলোড লিংক।\n\nতুমি শুধু লিখে দিলেই আমি বিস্তারিত জানিয়ে দেব! 😊`;
  }

  // =========================================================================
  // 2. CONTACT & DIRECT SOCIAL LINKS (WITH TYPO TOLERANCE)
  // =========================================================================

  // General Contact Info (e.g. "contact", "sontact", "kontact", "jogajog", "যোগাযোগ", "reach", "how to contact")
  if (
    /\b(contact|sontact|kontact|contct|conatct|jogajog|jogajuk|reach|connect|socials?|hire|address|location|phone|number)\b/i.test(q) ||
    (/(contact|sontact|reach|jogajog|connect)/i.test(q) && /(kivabe|how|kora|korbo|chai|koro|den|dao|info|details)/i.test(q)) ||
    /(যোগাযোগ|কন্টাক্ট|যোগাযোগের উপায়|ঠিকানা|সোশ্যাল)/.test(text)
  ) {
    if (lang === 'english') {
      return `Here's how you can connect directly with Shahariyar:\n\n• 📧 **Email**: [Email Shahariyar](${portfolioFacts.links.email}) (\`${portfolioFacts.links.emailRaw}\`)\n• 💼 **LinkedIn**: [Connect on LinkedIn](${portfolioFacts.links.linkedin})\n• 🐙 **GitHub**: [Visit GitHub](${portfolioFacts.links.github})\n• 🌐 **Facebook**: [Visit Facebook](${portfolioFacts.links.facebook})\n• 📄 **Verified CV**: [Download CV](${portfolioFacts.links.cv})\n\nFeel free to reach out for software collaborations, AI projects, or academic discussions! 💙`;
    }
    if (lang === 'bengali') {
      return `Shahariyar-এর সাথে সরাসরি যোগাযোগের মাধ্যমসমূহ:\n\n• 📧 **ইমেইল**: [Email Shahariyar](${portfolioFacts.links.email}) (\`${portfolioFacts.links.emailRaw}\`)\n• 💼 **লিংকডইন**: [Connect on LinkedIn](${portfolioFacts.links.linkedin})\n• 🐙 **গিটহাব**: [Visit GitHub](${portfolioFacts.links.github})\n• 🌐 **ফেসবুক**: [Visit Facebook](${portfolioFacts.links.facebook})\n• 📄 **অফিসিয়াল সিভি**: [Download CV](${portfolioFacts.links.cv})\n\nযে কোনো সফটওয়্যার প্রজেক্ট, এআই কোলাবোরেশন বা আলোচনার জন্য নির্দ্বিধায় যোগাযোগ করতে পারো! 💙`;
    }
    return `Shahariyar er sathe jogajog korar ways:\n\n• 📧 **Email**: [Email Shahariyar](${portfolioFacts.links.email}) (\`${portfolioFacts.links.emailRaw}\`)\n• 💼 **LinkedIn**: [Connect on LinkedIn](${portfolioFacts.links.linkedin})\n• 🐙 **GitHub**: [Visit GitHub](${portfolioFacts.links.github})\n• 🌐 **Facebook**: [Visit Facebook](${portfolioFacts.links.facebook})\n• 📄 **CV**: [Download CV](${portfolioFacts.links.cv})\n\nSoftware collaboration ba kono proyojone reach out korte paro! 💙`;
  }

  // GitHub Link
  if (
    /(github|git repo|repository|repo link|code link)/i.test(q) ||
    (q.includes('github') && /(link|dao|den|show|give|profile)/i.test(q))
  ) {
    if (lang === 'english') {
      return `Of course! 💙 Here's Shahariyar's GitHub:\n[Visit GitHub](${portfolioFacts.links.github})`;
    }
    if (lang === 'bengali') {
      return `অবশ্যই! 💙 Shahariyar-এর গিটহাব প্রোফাইল ও কোড রিপোজিটরি লিংক:\n[Visit GitHub](${portfolioFacts.links.github})`;
    }
    return `Of course! 💙 Here's Shahariyar's GitHub:\n[Visit GitHub](${portfolioFacts.links.github})`;
  }

  // Specific Email Request
  if (
    /(email|mail|inbox|gmail)/i.test(q) &&
    !/(github|facebook|linkedin|cv)/i.test(q)
  ) {
    if (lang === 'english') {
      return `You can reach Shahariyar directly at:\n[Email Shahariyar](${portfolioFacts.links.email})\n\nEmail address: \`${portfolioFacts.links.emailRaw}\` 📧`;
    }
    return `Shahariyar-এর সাথে সরাসরি যোগাযোগ করার ইমেইল:\n[Email Shahariyar](${portfolioFacts.links.email})\n\nইমেইল অ্যাড্রেস: \`${portfolioFacts.links.emailRaw}\` 📧`;
  }

  // CV / Resume Download Link
  if (
    /(cv|resume|curriculum vitae|biodata)/i.test(q) ||
    (/(cv|resume)/i.test(q) && /(dao|den|dekh|dekhte|chai|download|pdf|link|see)/i.test(q))
  ) {
    if (lang === 'english') {
      return `Absolutely! 💙 Here is Shahariyar's CV ready for download:\n[Download CV](${portfolioFacts.links.cv}) 📄`;
    }
    return `নিশ্চয়ই! 💙 Shahariyar-এর অফিসিয়াল সিভি এখান থেকে সরাসরি ডাউনলোড করতে পারো:\n[Download CV](${portfolioFacts.links.cv}) 📄`;
  }

  // Facebook Profile Link
  if (/facebook|fb\b/i.test(q)) {
    if (lang === 'english') {
      return `You can connect with Shahariyar on Facebook here:\n[Visit Facebook](${portfolioFacts.links.facebook}) 💙`;
    }
    return `Shahariyar-এর ফেসবুক প্রোফাইল লিংক এখানে:\n[Visit Facebook](${portfolioFacts.links.facebook}) 💙`;
  }

  // LinkedIn Profile Link
  if (/linkedin/i.test(q)) {
    if (lang === 'english') {
      return `Here is Shahariyar's professional LinkedIn profile:\n[Visit LinkedIn](${portfolioFacts.links.linkedin}) 💼`;
    }
    return `Shahariyar-এর প্রফেশনাল লিংকডইন প্রোফাইল লিংক:\n[Visit LinkedIn](${portfolioFacts.links.linkedin}) 💼`;
  }

  // =========================================================================
  // 3. CONTEXTUAL FOLLOW-UPS (CONVERSATION MEMORY)
  // =========================================================================

  // "Which one uses AI?" / "Which project uses AI?" / "AI project konta"
  if (
    /(which.*ai|which one uses ai|which project uses ai|ai project konta|ai kon project e|ai projects)/i.test(q) ||
    ((/which.*(one|project)/i.test(q) || /konta/i.test(q)) && /ai|ml|machine learning/i.test(q)) ||
    (/(কোন প্রজেক্টে এআই|কোন প্রজেক্টে ai|এআই প্রজেক্ট)/.test(text))
  ) {
    if (lang === 'english') {
      return `The projects where Shahariyar actively harnesses Artificial Intelligence include:\n\n1. 🚌 **Smart Public Transport Tracking & Demand Prediction System**: Employs predictive machine learning models to forecast commuter demand patterns and optimize transit fleet scheduling.\n2. 🤖 **IRIS — AI Companion**: Real-time conversational AI powered by Google Gemini API and structured reasoning loops (that's me! 💙).\n3. 🧠 **Personal AI Knowledge Assistant**: Conceptual AI indexing engine for contextual knowledge synthesis and automated retrieval.`;
    }
    if (lang === 'bengali') {
      return `Shahariyar-এর যে প্রজেক্টগুলোতে আর্টিফিশিয়াল ইন্টেলিজেন্স (AI) ব্যবহৃত হচ্ছে:\n\n1. 🚌 **Smart Public Transport Tracking & Demand Prediction System**: পাবলিক ট্রানজিট ট্র্যাকিং এবং যাত্রী চাহিদার পূর্বাভাসে মেশিন লার্নিং প্রিডিকশন মডেল ব্যবহৃত হচ্ছে।\n2. 🤖 **IRIS — AI Companion**: Google Gemini API এবং ন্যাচারাল ল্যাঙ্গুয়েজ প্রসেসিং দিয়ে তৈরি কনভারসেশনাল অ্যাসিস্ট্যান্ট (সেটা আমি! 💙)।\n3. 🧠 **Personal AI Knowledge Assistant**: কনটেক্সচুয়াল জ্ঞান ইনডেক্সিং এবং সার্চে এআই রিট্রিভাল প্রযুক্তি।`;
    }
    return `Shahariyar er je project gulo te AI/ML use hocche:\n\n1. 🚌 **Smart Public Transport Tracking & Demand Prediction System**: Transit tracking ebong demand forecast korar jonno predictive ML models use kora hocche.\n2. 🤖 **IRIS — AI Companion**: Google Gemini API ebong NLP diye toiri intelligent companion — seta ami! 💙\n3. 🧠 **Personal AI Knowledge Assistant**: Smart contextual search ebong AI retrieval engine.`;
  }

  // "Give me its GitHub link" (Follow-up)
  if (
    /(give me its github|give its github|tar github link dao|tar link dao|its github link)/i.test(q) &&
    (lastContext.includes('project') || lastContext.includes('ai') || lastContext.includes('transport') || lastContext.includes('built'))
  ) {
    if (lang === 'english') {
      return `Here is the GitHub repository for that project:\n[Visit GitHub Repository](${portfolioFacts.links.github}) 💙`;
    }
    return `প্রজেক্টটির গিটহাব রিপোজিটরি লিংক:\n[Visit GitHub Repository](${portfolioFacts.links.github}) 💙`;
  }

  // =========================================================================
  // 4. VERIFIED PORTFOLIO QUESTIONS (SKILLS, PROJECTS, EDUCATION, ABOUT)
  // =========================================================================

  // Technical Skills (Handles single word "skill", "skills", "skil", "tech stack", "languages")
  if (
    /\b(skills?|skils?|tech stack|stack|technologies|technology|programming languages?|languages?|coding|tools)\b/i.test(q) ||
    /(skill|skil)/i.test(q) ||
    /(দক্ষতা|স্কিল|টেকনিক্যাল স্কিল|প্রোগ্রামিং|ল্যাঙ্গুয়েজ)/.test(text)
  ) {
    if (lang === 'english') {
      return `Shahariyar's technical skills toolkit includes:\n\n• 💻 **Programming Languages**: Python, Java, C++\n• 🤖 **AI & Machine Learning**: Python-based AI/ML, Data Analysis, Predictive Modeling, Prompt Engineering, Google Gemini API\n• 🌐 **Web Development**: HTML5, Modern CSS3, JavaScript (ES6+), React, Vite\n• 🗄️ **Databases**: MySQL, Relational Schema Design\n• 🛠️ **Tools & Platforms**: Git, GitHub, VS Code, Vite, Three.js`;
    }
    if (lang === 'bengali') {
      return `Shahariyar-এর টেকনিক্যাল স্কিলসমূহ:\n\n• 💻 **Programming Languages**: Python, Java, C++\n• 🤖 **AI & Machine Learning**: Python-based AI/ML, Data Analysis, Predictive Models, Prompt Engineering, Google Gemini API\n• 🌐 **Web Development**: HTML5, Modern CSS, JavaScript (ES6+), React, Vite\n• 🗄️ **Databases**: MySQL, Relational Schema Design\n• 🛠️ **Tools & Workflow**: Git, GitHub, VS Code, Vite, Three.js`;
    }
    return `Shahariyar er technical skills toolkit:\n\n• 💻 **Programming**: Python, Java, C++\n• 🤖 **AI/ML**: Python-based AI/ML, Data Analysis, Predictive Modeling, Google Gemini API\n• 🌐 **Web**: HTML5, Modern CSS, JavaScript (ES6+), React, Vite\n• 🗄️ **Database**: MySQL\n• 🛠️ **Tools**: Git, GitHub, VS Code, Three.js`;
  }

  // Projects List (Handles single word "project", "projects", "projek", "projct", "kaj")
  if (
    /\b(projects?|projcts?|projeks?|works?)\b/i.test(q) ||
    /(what projects has he built|tell me about his projects|project gulo ki|project shomporke|ki ki project)/i.test(q) ||
    (q.includes('project') && !/(teach|shikhaba|python|capital|math)/i.test(q)) ||
    /(প্রজেক্ট|প্রজেক্টগুলো|কাজগুলো|কী কী প্রজেক্ট)/.test(text)
  ) {
    if (lang === 'english') {
      return `Here are the projects Shahariyar has built and is currently developing:\n\n• 🚌 **Smart Public Transport Tracking & Demand Prediction System** (In Development) — Real-time fleet tracking and commuter demand pattern forecasting.\n• 🤖 **IRIS — AI Companion** (In Development) — Intelligent conversational AI powered by Google Gemini (that's me! 💙).\n• 🛡️ **Smart Poultry Security System** (Concept) — Ambient sensing and hazard alert architecture for poultry livestock.\n• 🧠 **Personal AI Knowledge Assistant** (Concept) — AI indexing engine for cognitive productivity.\n• 💻 **SHAHARIYAR.EXE** (Active) — His interactive 3D personal portfolio!\n\nExplore his repositories:\n[Visit GitHub](${portfolioFacts.links.github})`;
    }
    if (lang === 'bengali') {
      return `Shahariyar-এর প্রজেক্টসমূহ:\n\n• 🚌 **Smart Public Transport Tracking & Demand Prediction System** (In Development) — পাবলিক ট্রানজিট ট্র্যাকিং ও যাত্রী চাহিদার পূর্বাভাস মডেল।\n• 🤖 **IRIS — AI Companion** (In Development) — রিয়েল-টাইম বুদ্ধিমান চ্যাট সঙ্গী (আমি! 😊)।\n• 🛡️ **Smart Poultry Security System** (Concept) — পোল্ট্রি ফার্মের জন্য আইওটি সিকিউরিটি ও অ্যাম্বিয়েন্ট মনিটরিং।\n• 🧠 **Personal AI Knowledge Assistant** (Concept) — কনটেক্সচুয়াল জ্ঞান ইনডেক্সিং ও অটোমেটেড রিট্রিভাল।\n• 💻 **SHAHARIYAR.EXE** (Active) — আধুনিক ইন্টারঅ্যাক্টিভ পোর্টফোলিও ওয়েবসাইট!\n\nসব প্রজেক্টের কোড দেখতে পারো:\n[Visit GitHub](${portfolioFacts.links.github})`;
    }
    return `Shahariyar je project gulo build korchen:\n\n• 🚌 **Smart Public Transport Tracking & Demand Prediction System** (In Development) — Real-time transit tracking ebong demand forecasting.\n• 🤖 **IRIS — AI Companion** (In Development) — Smart conversational AI (ami nijey! 💙).\n• 🛡️ **Smart Poultry Security System** (Concept) — IoT based hazard sensing ebong farm security.\n• 🧠 **Personal AI Knowledge Assistant** (Concept) — Cognitive knowledge retrieval system.\n• 💻 **SHAHARIYAR.EXE** (Active) — Ei interactive 3D portfolio!\n\nCode dekhar jonno:\n[Visit GitHub](${portfolioFacts.links.github})`;
  }

  // Education / University (e.g. "education", "edu", "university", "diu", "varsity", "porashona")
  if (
    /\b(education|edu|educations?|university|college|degree|varsity|department|batch|shikkha|porashona|poralekha|study|diu|daffodil)\b/i.test(q) ||
    /university.*konta/i.test(q) ||
    /or education ki/i.test(q) ||
    /kothay porashona/i.test(q) ||
    /(বিশ্ববিদ্যালয়|ভার্সিটি|কোথায় পড়াশোনা|কোন বিশ্ববিদ্যালয়|university কোনটা|শিক্ষা)/.test(text)
  ) {
    if (lang === 'english') {
      return `Shahariyar is pursuing his B.Sc. in Software Engineering at Daffodil International University (Batch 44), Bangladesh. 🎓 His academic focus encompasses Data Structures, Algorithms, Object-Oriented Programming (Java/C++/Python), Relational Databases (MySQL), and Software Architecture.`;
    }
    if (lang === 'bengali') {
      return `Shahariyar ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটির (DIU) সফটওয়্যার ইঞ্জিনিয়ারিং বিভাগের ৪৪তম ব্যাচের শিক্ষার্থী। 🎓 তিনি ডেটা স্ট্রাকচার, অ্যালগরিদম, ওওপি (জাভা, সি++, পাইথন), রিলেশনাল ডেটাবেজ এবং সফটওয়্যার সিস্টেম ডিজাইনে গভীর একাডেমিক ভিত্তি তৈরি করছেন।`;
    }
    return `Shahariyar Daffodil International University (DIU) er Software Engineering department er Batch 44 er student! 🎓 Uni DSA, OOP, MySQL ebong modern software engineering foundations niye porashona korchen.`;
  }

  // Identity / Who is Shahariyar / About (e.g. "Who is Shahariyar?", "শাহারিয়ার সম্পর্কে বলো।", "about")
  if (
    /\b(who is shahariyar|about shahariyar|tell me about him|shahariyar ke|shahariyar somporke|shahariyar shomporke|about him|introduce shahariyar|who|about|shahariyar|rashad)\b/i.test(q) ||
    (/(who|about)/i.test(q) && /shahariyar/i.test(q)) ||
    ((/(শাহারিয়ার|শাহরিয়ার)/.test(text) && /(সম্পর্কে|সম্পরকে|কে|কে উনি|বলো|জানাও|পরিচয়)/.test(text)) ||
    /(কে এই শাহারিয়ার|কে এই শাহরিয়ার|পরিচয়)/.test(text))
  ) {
    if (lang === 'english') {
      return `Shahariyar Khan Rashad is an Aspiring AI Engineer and Software Engineering undergraduate at Daffodil International University (Batch 44), Bangladesh. 🌟 Passionate about machine learning, predictive models, and software architecture, he combines algorithmic logic with creative thinking to solve real-world problems!`;
    }
    if (lang === 'bengali') {
      return `Shahariyar Khan Rashad হলেন একজন Aspiring AI Engineer এবং ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটির (DIU) সফটওয়্যার ইঞ্জিনিয়ারিং বিভাগের শিক্ষার্থী (ব্যাচ ৪৪)। 🌟 তিনি কৃত্রিম বুদ্ধিমত্তা, মেশিন লার্নিং এবং বাস্তবমুখী সফটওয়্যার সলিউশন তৈরিতে নিবেদিতপ্রাণ। তাঁর লক্ষ্য হলো ডেটা ও কোডিং এর সমন্বয়ে মানুষের বাস্তব সমস্যার উদ্ভাবনী সমাধান তৈরি করা!`;
    }
    return `Shahariyar Khan Rashad hocchen একজন Aspiring AI Engineer ebong Daffodil International University (DIU)-r Software Engineering (Batch 44) er student. 🌟 Uni Artificial Intelligence, machine learning models ebong scalable software architecture niye passionate-bhabe kaj korchen!`;
  }

  // Experience & Roles
  if (
    /\b(experience|roles?|responsibilities|work experience|career|background|onushilon)\b/i.test(q) &&
    !/(capital|python|teach|math|bangladesh er name)/i.test(q)
  ) {
    if (lang === 'english') {
      return `Shahariyar's experience encompasses:\n\n1. 🎓 **Software Engineering Student**: Strong foundations in data structures, algorithms, OOP, and relational databases at DIU.\n2. 🛠️ **Project Contributor & Builder**: Architecting responsive web applications and clean codebases.\n3. 🔬 **Research Enthusiast**: Formulating smart public transit demand prediction models and telemetry systems.\n4. 🤖 **AI Technology Explorer**: Prototyping generative AI solutions with Google Gemini API and predictive learning pipelines.`;
    }
    return `Shahariyar-এর অভিজ্ঞতা ও দায়িত্বসমূহ:\n\n1. 🎓 **Software Engineering Student**: কোডিং ও অ্যালগরিদম ফাউন্ডেশন, ডিএসএ, ওওপি এবং মাইএসকিউএল ডেটাবেজ।\n2. 🛠️ **Project Contributor & Builder**: আধুনিক ওয়েব অ্যাপ্লিকেশন এবং ক্লিন কোড আর্কিটেকচার তৈরি।\n3. 🔬 **Research Enthusiast**: এআই লিটারেচার, স্মার্ট ট্রানজিট এবং আইওটি সিস্টেম ডিজাইন।\n4. 🤖 **AI Technology Explorer**: এলএলএম, প্রম্পট ইঞ্জিনিয়ারিং এবং স্বয়ংক্রিয় এজেন্টিক ওয়ার্কফ্লো।`;
  }

  // Achievements & Certificates
  if (
    /\b(achievements?|awards?|certificates?|certs?|recognition|honor|science week|saylor|intellipaat)\b/i.test(q) ||
    /(অর্জন|সার্টিফিকেট|পুরস্কার|স্বীকৃতি)/.test(text)
  ) {
    if (lang === 'english') {
      return `Shahariyar's verified achievements and certifications include:\n\n🏆 **National Science Week**: Regional Champion (1st Place) for Scientific Excellence & Technical Innovation.\n📜 **CS301: Computer Architecture**: Saylor Academy (Grade: 93.75%, ID: 3160446853SR).\n📜 **Free SQL Certification Course**: Intellipaat Academy (ID: 31679-619-332486).`;
    }
    return `Shahariyar-এর স্বীকৃতি ও সার্টিফিকেশন:\n\n🏆 **National Science Week** — Regional Champion (1st Place) বৈজ্ঞানিক উদ্ভাবন ও প্রযুক্তিতে শ্রেষ্ঠত্ব!\n📜 **CS301: Computer Architecture** — Saylor Academy (Grade: 93.75%, ID: 3160446853SR)\n📜 **Free SQL Certification Course** — Intellipaat Academy (ID: 31679-619-332486)`;
  }

  // =========================================================================
  // 5. UNRELATED / GENERAL KNOWLEDGE QUESTIONS -> CUTE CONTEXTUAL REFUSAL
  // =========================================================================

  // Specific Case 1: Tutoring / Teaching (e.g. "Tumi ki amake Python shikhaba?", "Can you teach me Python?")
  if (
    /(teach|shikhaba|shikhao|course|tutorial|learn python|shikhte)/i.test(q)
  ) {
    if (lang === 'english') {
      return "Hehe! 🥹 I'm not a programming teacher! I'm here to help you discover Shahariyar's projects, skills and technical journey! 💙";
    }
    return "Hehe! 🥹 I'm not a programming teacher! আমি তো এখানে Shahariyar-এর প্রজেক্ট, স্কিল আর টেকনিক্যাল জার্নি শেয়ার করতে এসেছি! 💙 ওর কাজের বিষয়ে কিছু দেখবে?";
  }

  // Specific Case 2: Math / Homework (e.g. "2+2 koto?", "Solve 2+2", "calculate")
  if (
    /(\d+\s*[+/*%^-]\s*\d+)/.test(q) ||
    /(solve|calculate|math|koto|equation|algebra|hisab)/i.test(q)
  ) {
    if (lang === 'english') {
      return "Oops! My little brain isn't designed for maths homework! 😂 I'm Shahariyar's portfolio assistant, remember? 💙";
    }
    return "Oops! My little brain isn't designed for maths homework! 😂 I'm Shahariyar's portfolio assistant, remember? 💙 ওর প্রজেক্ট বা স্কিল নিয়ে কিছু দেখতে চাও?";
  }

  // Specific Case 3: Weather / News
  if (/(weather|temperature|abohawa|news|khobor|brishti|rain)/i.test(q)) {
    if (lang === 'english') {
      return "Haha! ☁️ I'm not a weather reporter or news anchor! I'm Shahariyar's personal AI portfolio assistant! 💙 Would you like to check out his software projects or skills instead?";
    }
    return "হাহা! ☁️ আমি তো কোনো ওয়েদার বা নিউজ রিপোর্টার নই! আমি শুধুই Shahariyar-এর AI portfolio companion! 💙 ওনার প্রোফাইল বা কাজ নিয়ে কিছু জানতে চাও?";
  }

  // Specific Case 4: General Trivia / Country names / Capitals / Politics / ANY OTHER UNRELATED QUERY
  if (lang === 'bengali') {
    return "Oopsie! 🥺 Sorryyy! এই প্রশ্নটার উত্তর দিতে পারলে ভালোই হতো! কিন্তু আমি তো Shahariyar-এর Personal AI Assistant! 💙 ওর Projects, Skills কিংবা Achievements নিয়ে কিছু জানতে চাও?";
  }
  if (lang === 'banglish') {
    return "Oopsie! 🥺 Sorryyy! এই প্রশ্নটার উত্তর দিতে পারলে ভালোই হতো! কিন্তু আমি তো Shahariyar-এর Personal AI Assistant! 💙 ওর Projects, Skills কিংবা Achievements নিয়ে কিছু জানতে চাও?";
  }

  // Default English refusal
  return "Oopsie! 😅 That's a little outside my universe! I'm Shahariyar's personal portfolio assistant. I can help you explore his projects, technical skills, achievements, or get his CV instead! 💙";
}
