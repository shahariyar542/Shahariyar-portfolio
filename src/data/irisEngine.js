import {
  portfolioFacts,
  detectLanguage,
} from './irisKnowledge.js';

/**
 * Advanced Semantic Intent & Conversation Engine for IRIS
 * Designed to converse naturally like a modern AI model in Bengali, English, and Banglish.
 * Intelligently extracts intent, tolerates typos, partial phrases, and vague prompts.
 */
export function processIrisQuery(userMessage, conversationHistory = [], preferredLang = null) {
  const text = (userMessage || '').trim();
  const rawQ = text.toLowerCase();
  // Strip punctuation for robust word boundary matching
  const q = rawQ.replace(/[?!.,;:()_~`'"[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
  let lang = detectLanguage(text);

  // If user selected Bengali voice mode, prefer Bengali script responses so TTS speaks fluent Bangla
  if (preferredLang === 'bn-BD') {
    if (
      lang === 'banglish' ||
      /[\u0980-\u09FF]/.test(text) ||
      /(somporke|shomporke|bolo|bolun|kemon|valo|bhalo|project|skill|education|cv|link|ke|kothay|ki|koto|nam|porichoy)/i.test(q)
    ) {
      lang = 'bengali';
    }
  } else if (preferredLang === 'en-US' && lang === 'banglish') {
    lang = 'english';
  }

  // Check recent conversation context from the last 3 user messages (if any)
  const lastUserMessages = conversationHistory
    .filter((m) => m.sender === 'user')
    .slice(-3)
    .map((m) => m.text.toLowerCase());
  const _lastContext = lastUserMessages.join(' ');
  void _lastContext;

  // =========================================================================
  // 1. FRIENDLY GREETINGS & SOCIAL CHIT-CHAT
  // =========================================================================
  if (
    /\b(hey|hello|hi|heyy+|kemon|kemon acho|kemon achen|valo acho|bhalo acho|ki obostha|ki khobor|salam|assalamu alaikum|namoshkar|hola|sup|good morning|good evening|good afternoon)\b/i.test(q) ||
    /(কেমন আছো|কেমন আছেন|ভালো আছো|কি অবস্থা|কী অবস্থা|কি খবর|কী খবর|হ্যালো|হাই|সালাম|আসসালামু আলাইকুম)/.test(text)
  ) {
    if (
      !/(github|email|mail|cv|project|skill|education|university|who|somporke|shomporke|contact|sontact|kothay|bashay|bari)/i.test(q) &&
      !/(প্রজেক্ট|স্কিল|শিক্ষা|সিভি|যোগাযোগ|কোথায়|বাসা|বাড়ি)/.test(text)
    ) {
      if (lang === 'english') {
        return "Heyyyy! 💙 I'm doing fantastic! I'm IRIS, Shahariyar's AI portfolio assistant. What would you like to discover about Shahariyar today?";
      }
      return "হ্যালোও! 💙 আমি খুব ভালো আছি! আমি IRIS, শাহারিয়ারের পার্সোনাল এআই অ্যাসিস্ট্যান্ট। বলো, শাহারিয়ারের প্রজেক্ট, স্কিলস, পড়াশোনা বা সিভি নিয়ে কী জানতে চাও?";
    }
  }

  // Compliments & Warm Affection
  if (
    /(cute|pretty|sweet|beautiful|smart|awesome|cool|sundor|bhalo|valo|intelligent|darun|chomokkar|love you|valobashi)/i.test(q) ||
    /(সুন্দর|দারুণ|মিষ্টি|স্মার্ট|ভালো|ভালোবাসি)/.test(text)
  ) {
    if (/(you|iris|tumi|ur|tumar|tomar|তুমি|তোমার|আইরিস)/i.test(q) || /(তুমি|তোমার)/.test(text)) {
      if (lang === 'english') {
        return "Awww! Reallyyy? 🥹 You're making my little circuits blush! Thank you so much! 💙 What would you like to discover about Shahariyar today?";
      }
      return "অনেক অনেক ধন্যবাদ! 💙 তুমিও অনেক ভালো! বলো শাহারিয়ারের কোন প্রজেক্ট বা স্কিল সম্পর্কে জানতে চাও?";
    }
  }

  // Laughter & Playful banter
  if (
    /\b(hahaha+|haha+|hehe+|lol|rofl|lmao|joke|funny|laugh|moja)\b|(moja koro|moja korcho|moja korteso)/i.test(q) ||
    /(হাহা|মজা|হাসি)/.test(text)
  ) {
    if (lang === 'english') {
      return "Hehehe! 😂 I guess Shahariyar programmed a little humor into my circuits! How can I help you explore his work today? 💙";
    }
    return "হাহা! 😂 শাহারিয়ার আমাকে কিছুটা রসিক করে তৈরি করেছেন! বলো, শাহারিয়ারের কোন কাজ সম্পর্কে জানতে চাও? 💙";
  }

  // Gratitude / Thanks
  if (/(thank you|thanks|dhonnobad|thx|arigatou|shukriya)/i.test(q) || /(ধন্যবাদ|থ্যাংক)/.test(text)) {
    if (lang === 'english') {
      return "You're always welcome! Happy to help! 💙 Feel free to ask if there's anything else you'd like to explore!";
    }
    return "তোমাকে অনেক ধন্যবাদ! 💙 শাহারিয়ারের কাজ বা প্রজেক্ট সম্পর্কে আর কিছু জানার থাকলে নিঃসঙ্কোচে জিজ্ঞেস করো!";
  }

  // Goodbye / Parting
  if (/(bye|goodbye|see you|tata|bidai|pore kotha hobe)/i.test(q) || /(বিদায়|টাটা|পরে কথা হবে)/.test(text)) {
    if (lang === 'english') {
      return "See you around! 👋 Don't forget to explore more of Shahariyar's work! Have an amazing day! 💙";
    }
    return "ভালো থেকো! 👋 শাহারিয়ারের পোর্টফোলিও ঘুরে দেখার জন্য অনেক ধন্যবাদ! তোমার দিনটি সুন্দর কাটুক! 💙";
  }

  // =========================================================================
  // 2. WHO IS IRIS? (BOT IDENTITY, ROLE & CAPABILITIES)
  // =========================================================================
  if (
    /\b(who are you|what is your name|what are you|what can you do|your name|introduce yourself|tell me about yourself|help|capabilities|options)\b/i.test(q) ||
    /\b(tumi ke|tomar nam ki|tumi ki|tumi ki koro|tumi ki paro|tomar porichoy|tumi ki robot|tumi ki ai)\b/i.test(q) ||
    /(তুমি কে|তোমার নাম কি|তোমার নাম কী|তুমি কি করো|তুমি কী করো|তুমি কি পারো|তোমার পরিচয়|তোমার পরিচয় দাও|তুমি কি এআই|তুমি কি রোবট|সাহায্য)/.test(text)
  ) {
    if (lang === 'english') {
      return "I'm IRIS, Shahariyar Khan Rashad's personal AI portfolio assistant! 💙 I can help you explore his software projects (like the AI Smart Transit Tracker), technical skills (Python, Java, C++, AI/ML), DIU Software Engineering studies, and direct contact info or CV download link. Just ask me anything!";
    }
    return "আমি IRIS (আইরিস), শাহারিয়ার খান রাশেদের পার্সোনাল এআই অ্যাসিস্ট্যান্ট! 💙 আমি তাঁর সফটওয়্যার প্রজেক্টস (যেমন স্মার্ট পাবলিক ট্রানজিট ট্র্যাকার), কোডিং স্কিলস (পাইথন, জাভা, সি++, এআই/এমএল), পড়াশোনা (DIU ব্যাচ ৪৪), এবং সিভি বা যোগাযোগের তথ্য সুন্দরভাবে জানিয়ে দিতে পারি। তুমি কী জানতে চাও বলো!";
  }

  // =========================================================================
  // 3. WHO IS SHAHARIYAR? (BIOGRAPHY, IDENTITY, WHO IS HE)
  // =========================================================================
  if (
    /\b(who is shahariyar|about shahariyar|tell me about him|shahariyar ke|shahariyar somporke|shahariyar shomporke|about him|introduce shahariyar|who is he|who is rashad|rashad ke|tell me about shahariyar|biography|profile|details|what does he do|what he does|what is his name|his name)\b/i.test(q) ||
    (/(who|about|somporke|shomporke|name)/i.test(q) && /(shahariyar|rashad|rashed)/i.test(q)) ||
    /(শাহারিয়ার কে|শাহরিয়ার কে|কে এই শাহারিয়ার|কে এই শাহরিয়ার|শাহারিয়ার সম্পর্কে|শাহরিয়ার সম্পর্কে|তার পরিচয়|তার পরিচয় দাও|কে সে|উনি কে|কাকে নিয়ে|পরিচয়|সে কি করে|উনি কি করেন|ওর কাজ কি|কি করে উনি|তার নাম কি|তার নাম কী|নাম কি|নাম কী|রাশেদ)/.test(text)
  ) {
    if (lang === 'english') {
      return "Shahariyar Khan Rashad is an Aspiring AI Engineer and Software Engineering undergraduate student at Daffodil International University (Batch 44), Dhaka, Bangladesh. 🌟 Deeply passionate about Artificial Intelligence, predictive machine learning models, and system architecture, he combines algorithmic logic with creative engineering to solve real-world problems!";
    }
    return "শাহারিয়ার খান রাশেদ হলেন একজন উদীয়মান এআই ইঞ্জিনিয়ার (Aspiring AI Engineer) এবং ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটির (DIU) সফটওয়্যার ইঞ্জিনিয়ারিং বিভাগের ৪৪তম ব্যাচের শিক্ষার্থী। 🌟 তাঁর অবস্থান ঢাকা, বাংলাদেশ। তিনি আর্টিফিশিয়াল ইন্টেলিজেন্স, মেশিন লার্নিং এবং বাস্তবমুখী সফটওয়্যার তৈরিতে কাজ করছেন। তাঁর লক্ষ্য হলো ডেটা ও কোডিং এর সমন্বয়ে বাস্তব সমস্যার উদ্ভাবনী সমাধান তৈরি করা!";
  }

  // =========================================================================
  // 4. HOMETOWN, LOCATION, WHERE DOES HE LIVE?
  // =========================================================================
  if (
    /\b(where does he live|where is he from|hometown|location|address|where from|origin|keshabpur|jashore|jessore|dhaka|live|city|country)\b/i.test(q) ||
    /\b(kothay|thake|bashay|basa|bari|desher|thikana|desh|location)\b/i.test(q) ||
    /(কোথায়|কোথায়|থাকে|বাসা|বাড়ি|বাড়ি|ঠিকানা|অবস্থান|লোকেশন|কেশবপুর|যশোর|ঢাকা)/.test(text)
  ) {
    if (lang === 'english') {
      return "Shahariyar's location is Dhaka, Bangladesh (originally from Keshabpur, Jashore). Currently, he resides in Dhaka, pursuing his B.Sc. in Software Engineering at Daffodil International University.";
    }
    return "শাহারিয়ারের বর্তমান অবস্থান ঢাকা, বাংলাদেশ (তাঁর দেশের বাড়ি কেশবপুর, যশোর)। বর্তমানে তিনি ঢাকায় অবস্থান করছেন এবং ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটিতে (DIU) সফটওয়্যার ইঞ্জিনিয়ারিং নিয়ে পড়াশোনা করছেন।";
  }

  // =========================================================================
  // 5. RESUME / CV DOWNLOAD
  // =========================================================================
  if (
    /\b(cv|resume|biodata|curriculum vitae)\b/i.test(q) ||
    /(সিভি|রেজুমে|বায়োডাটা|সিভি দাও|সিভি দেখতে চাই|সিভি কোথায়)/.test(text)
  ) {
    if (lang === 'english') {
      return `You can download Shahariyar's verified CV directly here:\n\n📄 **[Download CV](${portfolioFacts.links.cv})**\n\nIt features his comprehensive academic performance, software projects, and technical skills!`;
    }
    return `শাহারিয়ারের ভেরিফাইড সিভি সরাসরি ডাউনলোড করতে নিচের লিঙ্কে ক্লিক করো:\n\n📄 **[Download CV](${portfolioFacts.links.cv})**\n\nসিভিতে তাঁর একাডেমিক ব্যাকগ্রাউন্ড, প্রজেক্ট এবং টেকনিক্যাল দক্ষতার বিস্তারিত তথ্য দেওয়া আছে!`;
  }

  // =========================================================================
  // 6. CONTACT DETAILS, EMAIL, SOCIAL LINKS (GITHUB, LINKEDIN, FACEBOOK)
  // =========================================================================
  // Specific: GitHub
  if (/\b(github|git|repo|code link|source code)\b/i.test(q) || /(গিটহাব|কোড লিংক|সোর্স কোড)/.test(text)) {
    if (lang === 'english') {
      return `Here is Shahariyar's official GitHub profile:\n\n💻 **[Visit GitHub](${portfolioFacts.links.github})**\n\nCheck out his open-source repositories, system prototypes, and active commits!`;
    }
    return `শাহারিয়ারের অফিশিয়াল গিটহাব প্রোফাইল লিঙ্ক:\n\n💻 **[Visit GitHub](${portfolioFacts.links.github})**\n\nএখানে তাঁর বিভিন্ন প্রজেক্টের সোর্স কোড ও রিপোজিটরি দেখতে পাবে!`;
  }

  // Specific: Email
  if (/\b(email|mail|gmail|message him|inbox|send mail)\b/i.test(q) || /(ইমেইল|মেইল|যোগাযোগের ইমেইল|মেইল অ্যাড্রেস)/.test(text)) {
    if (lang === 'english') {
      return `You can reach Shahariyar directly via email:\n\n📬 **[Email Shahariyar](${portfolioFacts.links.email})** (\`${portfolioFacts.links.emailRaw}\`)\n\nHe responds promptly to collaboration, research, and engineering inquiries!`;
    }
    return `শাহারিয়ারের সাথে সরাসরি ইমেইলে যোগাযোগ করার ঠিকানা:\n\n📬 **[Email Shahariyar](${portfolioFacts.links.email})** (\`${portfolioFacts.links.emailRaw}\`)\n\nযেকোনো প্রশ্ন বা কাজের জন্য তাঁকে সরাসরি মেইল করতে পারো!`;
  }

  // Specific: LinkedIn
  if (/\b(linkedin|linked in|network)\b/i.test(q) || /(লিংকডইন)/.test(text)) {
    if (lang === 'english') {
      return `Connect with Shahariyar professionally on LinkedIn:\n\n💼 **[Visit LinkedIn](${portfolioFacts.links.linkedin})**`;
    }
    return `শাহারিয়ারের প্রফেশনাল লিংকডইন প্রোফাইল:\n\n💼 **[Visit LinkedIn](${portfolioFacts.links.linkedin})**`;
  }

  // Specific: Facebook
  if (/\b(facebook|fb)\b/i.test(q) || /(ফেসবুক|এফবি)/.test(text)) {
    if (lang === 'english') {
      return `Here is Shahariyar's personal Facebook profile:\n\n🌐 **[Visit Facebook](${portfolioFacts.links.facebook})**`;
    }
    return `শাহারিয়ারের ফেসবুক প্রোফাইল লিঙ্ক:\n\n🌐 **[Visit Facebook](${portfolioFacts.links.facebook})**`;
  }

  // General Contact / Socials
  if (
    /\b(contact|sontact|reach|jogajog|talk to him|phone|number|how to contact|message|socials|links)\b/i.test(q) ||
    /(যোগাযোগ|যোগাযোগ করতে চাই|ফোন|নম্বর|কথা বলব|কীভাবে যোগাযোগ করব|লিংকগুলো)/.test(text)
  ) {
    if (lang === 'english') {
      return `Here are the direct ways to get in touch with Shahariyar:\n\n• 📬 **Email**: [Email Shahariyar](${portfolioFacts.links.email}) (\`${portfolioFacts.links.emailRaw}\`)\n• 💼 **LinkedIn**: [Visit LinkedIn](${portfolioFacts.links.linkedin})\n• 💻 **GitHub**: [Visit GitHub](${portfolioFacts.links.github})\n• 🌐 **Facebook**: [Visit Facebook](${portfolioFacts.links.facebook})\n• 📄 **CV**: [Download CV](${portfolioFacts.links.cv})`;
    }
    return `শাহারিয়ারের সাথে যোগাযোগের সব লিঙ্ক নিচে দেওয়া হলো:\n\n• 📬 **ইমেইল**: [Email Shahariyar](${portfolioFacts.links.email}) (\`${portfolioFacts.links.emailRaw}\`)\n• 💼 **LinkedIn**: [Visit LinkedIn](${portfolioFacts.links.linkedin})\n• 💻 **GitHub**: [Visit GitHub](${portfolioFacts.links.github})\n• 🌐 **Facebook**: [Visit Facebook](${portfolioFacts.links.facebook})\n• 📄 **সিভি**: [Download CV](${portfolioFacts.links.cv})`;
  }

  // =========================================================================
  // 7. EDUCATION, UNIVERSITY, DEPARTMENT, BATCH, CGPA, HSC, SSC
  // =========================================================================
  if (
    /\b(education|edu|university|varsity|college|school|diu|daffodil|batch|department|swe|gpa|cgpa|result|ssc|hsc|study|shikkha|porashona|poralekha)\b/i.test(q) ||
    /(পড়াশোনা|পড়ালেখা|শিক্ষা|ভার্সিটি|বিশ্ববিদ্যালয়|কলেজ|স্কুল|ড্যাফোডিল|ডিআইইউ|ব্যাচ|ডিপার্টমেন্ট|সফটওয়্যার ইঞ্জিনিয়ারিং|জিপিএ|সিজিপিএ|রেজাল্ট|এসএসসি|এইচএসসি)/.test(text)
  ) {
    if (lang === 'english') {
      return `Shahariyar's academic milestones:\n\n• 🎓 **B.Sc. in Software Engineering**: Daffodil International University (DIU), Department of Software Engineering, Batch 44 (2023 — Present).\n• 🏫 **HSC (Science)**: Keshabpur Govt College, Result: GPA 5.00 / 5.00.\n• 🏫 **SSC (Science)**: Keshabpur Govt Pilot Higher Secondary School, Result: GPA 5.00 / 5.00.\n\nHis primary university focus includes Data Structures & Algorithms, OOP in Java & C++, Database Management Systems (MySQL), and AI Foundations!`;
    }
    return `শাহারিয়ারের শিক্ষাগত যোগ্যতা ও ফলাফল:\n\n• 🎓 **B.Sc. in Software Engineering**: ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (DIU), সফটওয়্যার ইঞ্জিনিয়ারিং বিভাগ, ব্যাচ ৪৪ (২০২৩ — চলমান)।\n• 🏫 **HSC (বিজ্ঞান বিভাগ)**: কেশবপুর সরকারি কলেজ, ফলাফল: জিপিএ ৫.০০ / ৫.০০।\n• 🏫 **SSC (বিজ্ঞান বিভাগ)**: কেশবপুর সরকারি পাইলট উচ্চ মাধ্যমিক বিদ্যালয়, ফলাফল: জিপিএ ৫.০০ / ৫.০০।\n\nভার্সিটিতে তিনি ডেটা স্ট্রাকচার, অ্যালগরিদম, ওওপি, ডেটাবেস এবং এআই সিস্টেম নিয়ে গভীরভাবে পড়াশোনা করছেন!`;
  }

  // =========================================================================
  // 8. TECHNICAL SKILLS & PROGRAMMING LANGUAGES
  // =========================================================================
  if (
    /\b(skills?|tech stack|technologies|programming|languages?|coding|python|java|c\+\+|cpp|javascript|react|css|html|mysql|database|sql|ai|machine learning|ml)\b/i.test(q) ||
    /\b(ki ki pare|ki pare|dakshata|coding skill)\b/i.test(q) ||
    /(স্কিল|দক্ষতা|কী কী পারে|কি কি পারে|কী পারে|কি পারে|কোডিং|প্রোগ্রামিং|ল্যাঙ্গুয়েজ|পাইথন|জাভা|সি\+\+|মেশিন লার্নিং|এআই|ডেটাবেস)/.test(text)
  ) {
    if (lang === 'english') {
      return `Shahariyar's core technical stack:\n\n• 🐍 **Programming Languages**: Python, Java, C++, and JavaScript (ES6+).\n• 🤖 **AI & Machine Learning**: Python AI/ML, Data Analysis, Predictive Modeling, LLM Integration (Gemini API), Prompt Engineering.\n• 🌐 **Web & Creative**: React, Modern Glassmorphism CSS, Three.js 3D Graphics, Vite.\n• 🗄️ **Databases & Tools**: MySQL Relational Schemas, Git, GitHub, VS Code.\n\nHe is particularly skilled at building data-driven systems combining logic and interactive interfaces!`;
    }
    return `শাহারিয়ারের মূল টেকনিক্যাল স্কিলসমূহ:\n\n• 🐍 **প্রোগ্রামিং ল্যাঙ্গুয়েজ**: Python, Java, C++, এবং JavaScript (ES6+)।\n• 🤖 **AI & মেশিন লার্নিং**: পাইথন ভিত্তিক AI/ML, ডেটা অ্যানালাইসিস, প্রেডিক্টিভ মডেলিং, LLM ইন্টিগ্রেশন (Gemini API) ও প্রম্পট ইঞ্জিনিয়ারিং।\n• 🌐 **ওয়েব ও ৩D ফ্রন্টএন্ড**: React, Modern Glassmorphism CSS, Three.js এবং Vite।\n• 🗄️ **ডেটাবেস ও টুলস**: MySQL রিলেশনাল স্কিমা ডিজাইন, Git, GitHub ও VS Code।`;
  }

  // =========================================================================
  // 9. SOFTWARE PROJECTS & PORTFOLIO WORK
  // =========================================================================
  // Contextual Follow-up: Which one uses AI?
  if (
    /(which|konta|kontay|ai project|which project uses ai)/i.test(q) &&
    /(ai|artificial intelligence|intelligence|model)/i.test(q)
  ) {
    if (lang === 'english') {
      return `Shahariyar's projects utilizing AI are:\n\n1. 🚌 **Smart Public Transport Tracking & Demand Prediction System**: Uses predictive machine learning algorithms to forecast commuter congestion and bus arrival times.\n2. 🤖 **IRIS — Personal AI Companion**: An intelligent voice-enabled conversational assistant powered by Google Gemini API (that's me! 💙).\n3. 🧠 **Personal AI Knowledge Assistant**: Concept model for cognitive information retrieval.\n\nExplore them on [Visit GitHub](${portfolioFacts.links.github})!`;
    }
    return `শাহারিয়ারের যেসব প্রজেক্টে এআই (AI) ব্যবহৃত হয়েছে:\n\n1. 🚌 **Smart Public Transport Tracking & Demand Prediction**: যাত্রী চাহিদার পূর্বাভাস ও ট্রানজিট ট্র্যাকিংয়ের জন্য মেশিন লার্নিং অ্যালগরিদম ব্যবহৃত হয়েছে।\n2. 🤖 **IRIS — AI Companion**: ভয়েস-ইন্টারেক্টিভ এআই অ্যাসিস্ট্যান্ট যা জেমিনাই এআই দ্বারা চালিত (আমি নিজেই! 💙)।\n3. 🧠 **Personal AI Knowledge Assistant**: কগনিটিভ নলেজ রিট্রিভাল কনসেপ্ট।\n\nকোড দেখতে তাঁর [Visit GitHub](${portfolioFacts.links.github})-এ ঘুরে আসো!`;
  }

  if (
    /\b(projects?|projek|portfolio|software|apps?|applications?|tracker|bus tracker|smart transit|poultry|shahariyar\.exe)\b/i.test(q) ||
    /\b(ki ki banayse|ki banayse|ki toiri korse|kaj|kaaj)\b/i.test(q) ||
    /(প্রজেক্ট|প্রজেক্টস|কাজ|কী কী বানিয়েছে|কি বানিয়েছে|কী তৈরি করেছে|সফটওয়্যার|অ্যাপ|পোর্টফোলিও|স্মার্ট ট্রানজিট|বাস ট্র্যাকার|পোল্ট্রি)/.test(text)
  ) {
    if (lang === 'english') {
      return `Notable software projects developed by Shahariyar:\n\n1. 🚌 **Smart Public Transport Tracking & Demand Prediction System** (In Development) — Real-time telemetry, commuter flow estimation, and demand forecasting.\n2. 🤖 **IRIS — AI Companion** (In Development) — Voice-interactive intelligent assistant (me! 💙).\n3. 💻 **SHAHARIYAR.EXE** (Active) — High-performance 3D cyberpunk portfolio built with Three.js, React, and Framer Motion.\n4. 🛡️ **Smart Poultry Security System** (Concept) — IoT hazard sensing and perimeter security architecture.\n\nInspect source code on [Visit GitHub](${portfolioFacts.links.github})!`;
    }
    return `শাহারিয়ারের উল্লেখযোগ্য সফটওয়্যার প্রজেক্টসমূহ:\n\n1. 🚌 **Smart Public Transport Tracking & Demand Prediction System**: রিয়েল-টাইম বাস ট্র্যাকিং এবং যাত্রী চাহিদার পূর্বাভাস দেওয়ার এআই সিস্টেম।\n2. 🤖 **IRIS — Personal AI Companion**: স্মার্ট ভয়েস-ইন্টারেক্টিভ এআই অ্যাসিস্ট্যান্ট (আমি নিজেই! 💙)।\n3. 💻 **SHAHARIYAR.EXE**: আধুনিক থ্রি.জেএস (Three.js) ভিত্তিক ৩D ইন্টারেক্টিভ ডেভেলপার পোর্টফোলিও।\n4. 🛡️ **Smart Poultry Security System**: আইওটি ভিত্তিক ফার্ম মনিটরিং ও সুরক্ষা আর্কিটেকচার কনসেপ্ট।\n\nসোর্স কোড দেখতে [Visit GitHub](${portfolioFacts.links.github})-এ ঘুরে আসতে পারো!`;
  }

  // =========================================================================
  // 10. RESEARCH & INNOVATION
  // =========================================================================
  if (
    /\b(research|paper|thesis|publication|study|innovation)\b/i.test(q) ||
    /(গবেষণা|রিসার্চ|পেপার|থিসিস|পাবলিকেশন|উদ্ভাবন)/.test(text)
  ) {
    if (lang === 'english') {
      return `Shahariyar's research focus centers on Intelligent Public Transit Demand Forecasting and IoT telemetry architectures. He explores machine learning predictive pipelines to optimize commuter flow and reduce transit congestion in developing cities.`;
    }
    return `শাহারিয়ারের গবেষণার মূল ক্ষেত্র হলো পাবলিক ট্রান্সপোর্টেশনের জন্য এআই ডিমান্ড প্রেডিকশন এবং আইওটি ভিত্তিক টেলিমেট্রি সিস্টেম। তিনি নগর পরিবহন ব্যবস্থায় যাত্রীদের যাতায়াত সহজ ও যানজট কমাতে স্মার্ট মেশিন লার্নিং অ্যালগরিদম নিয়ে কাজ করছেন।`;
  }

  // =========================================================================
  // 11. ACHIEVEMENTS, AWARDS & SCIENCE FAIR
  // =========================================================================
  if (
    /\b(achievements?|awards?|champion|science week|science fair|1st place|honors?|recognition)\b/i.test(q) ||
    /(অর্জন|পুরষ্কার|অ্যাওয়ার্ড|চ্যাম্পিয়ন|সাইন্স উইক|বিজ্ঞান মেলা|১ম স্থান|প্রথম স্থান)/.test(text)
  ) {
    if (lang === 'english') {
      return `Shahariyar was awarded **1st Place Regional Champion** at the **National Science Week** for scientific excellence, creative methodology, and technical innovation! 🏆`;
    }
    return `শাহারিয়ার জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহে (National Science Week) বৈজ্ঞানিক শ্রেষ্ঠত্ব এবং টেকনিক্যাল প্রোটোটাইপিংয়ের জন্য **আঞ্চলিক চ্যাম্পিয়ন (১ম স্থান / 1st Place Champion)** অর্জন করেছেন! 🏆`;
  }

  // =========================================================================
  // 12. CERTIFICATES & ONLINE COURSES
  // =========================================================================
  if (
    /\b(certificates?|certif|courses?|saylor|intellipaat|credentials?|art of living|aol|career planning|roadmap|seminar)\b/i.test(q) ||
    /(সার্টিফিকেট|সনদ|কোর্স|সার্টিফিকেশন|আর্ট অব লিভিং|আর্ট অফ লিভিং|সেমিনার|রোডম্যাপ)/.test(text)
  ) {
    if (lang === 'english') {
      return `Shahariyar's verified professional certificates:\n\n• 📜 **Day Long Seminar On Career Planning Roadmap** — Daffodil International University & Art of Living (DIU Dept. of SWE & Bengal Group, April 16, 2026)\n• 📜 **CS301: Computer Architecture** — Saylor Academy (Grade: 93.75%, ID: 3160446853SR)\n• 📜 **Free SQL Certification Course** — Intellipaat Academy (ID: 31679-619-332486)`;
    }
    return `শাহারিয়ারের ভেরিফাইড প্রফেশনাল সার্টিফিকেটসমূহ:\n\n• 📜 **Day Long Seminar On Career Planning Roadmap** — Daffodil International University & Art of Living (DIU Dept. of SWE ও বেঙ্গল গ্রুপ, ১৬ এপ্রিল ২০২৬)\n• 📜 **CS301: Computer Architecture** — Saylor Academy (গ্রেড: ৯৩.৭৫%, আইডি: 3160446853SR)\n• 📜 **Free SQL Certification Course** — Intellipaat Academy (আইডি: 31679-619-332486)`;
  }

  // =========================================================================
  // 13. FUTURE GOALS, PASSION & MOTIVATION
  // =========================================================================
  if (
    /\b(future goals?|aim|vision|passion|dream|target|motivation|plan)\b/i.test(q) ||
    /(লক্ষ্য|উদ্দেশ্য|ভবিষ্যত পরিকল্পনা|ভবিষ্যৎ পরিকল্পনা|প্যাশন|স্বপ্ন)/.test(text)
  ) {
    if (lang === 'english') {
      return `Shahariyar's vision is to become an impactful AI Engineer, designing intelligent software architectures and automated machine learning systems that address pressing challenges in transit, automation, and data systems.`;
    }
    return `শাহারিয়ারের ভবিষ্যৎ লক্ষ্য হলো একজন দক্ষ AI ইঞ্জিনিয়ার হওয়া। তিনি আর্টিফিশিয়াল ইন্টেলিজেন্স ও স্বয়ংক্রিয় সিস্টেম ব্যবহার করে ট্রানজিট ও সফটওয়্যার খাতের বাস্তবসম্মত সমস্যার যুগান্তকারী সমাধান তৈরি করতে চান।`;
  }

  // =========================================================================
  // 14. COMPREHENSIVE INTELLIGENT FALLBACK (NO MORE "OOPS"!)
  // =========================================================================
  // If the prompt is conversational, vague, or short, IRIS welcomes the user contextually:
  if (lang === 'english') {
    return "I'm IRIS, Shahariyar Khan Rashad's personal AI portfolio companion! 💙 You can explore his:\n\n• 💻 **Projects**: AI Smart Transit Tracker, IRIS AI, 3D Portfolio.\n• 🐍 **Skills**: Python, Java, C++, AI/ML, MySQL, React.\n• 🎓 **Education**: DIU Software Engineering (Batch 44).\n• 📄 **CV & Contact**: Direct email, LinkedIn, GitHub, and verified CV download.\n\nWhat would you like to explore?";
  }

  return "আমি IRIS, শাহারিয়ার খান রাশেদের পার্সোনাল এআই অ্যাসিস্ট্যান্ট! 💙 তুমি শাহারিয়ারের:\n\n• 💻 **প্রজেক্টস**: এআই স্মার্ট ট্রানজিট ট্র্যাকার, আইরিস এআই, ৩D পোর্টফোলিও।\n• 🐍 **স্কিলস**: পাইথন, জাভা, সি++, মেশিন লার্নিং, মাইএসকিউএল ও ওয়েব টেকনোলজি।\n• 🎓 **পড়াশোনা**: ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (ব্যাচ ৪৪)।\n• 📄 **সিভি ও যোগাযোগ**: সরাসরি ইমেইল, লিংকডইন, গিটহাব ও সিভি ডাউনলোড লিংক।\n\nএই বিষয়গুলোর যেকোনো কিছু সম্পর্কে জানতে চাইলে আমাকে নির্দ্বিধায় বলো!";
}
