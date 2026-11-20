/**
 * Centralized Portfolio Knowledge Base & Intelligence Engine for IRIS
 * Contains verified data, language detection patterns, off-topic boundaries,
 * and direct links for Shahariyar Khan Rashad's personal portfolio.
 */

export const portfolioFacts = {
  personal: {
    fullName: 'Shahariyar Khan Rashad',
    preferredName: 'Shahariyar',
    role: 'Aspiring AI Engineer & Software Engineering Student',
    university: 'Daffodil International University',
    department: 'Software Engineering',
    batch: 44,
    location: 'Dhaka, Bangladesh',
    bio: 'Shahariyar Khan Rashad is an Aspiring AI Engineer and Software Engineering undergraduate student at Daffodil International University (Batch 44), Dhaka, Bangladesh. He is deeply passionate about Artificial Intelligence, machine learning models, and building scalable software solutions that address real-world problems.',
    mindset: 'Approaches engineering problems with creative thinking and a desire to build practical, unconventional solutions combining algorithmic rigor and intelligent automation.',
  },

  education: {
    degree: 'B.Sc. in Software Engineering',
    institution: 'Daffodil International University',
    department: 'Department of Software Engineering',
    batch: 'Batch 44',
    status: 'Undergraduate Student (2023 — Present)',
    focusAreas: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (OOP) in Java & C++',
      'Relational Database Management Systems (MySQL)',
      'Software Architecture & System Design',
      'Artificial Intelligence & Machine Learning Foundations',
    ],
    milestones: [
      {
        degree: 'B.Sc. in Software Engineering',
        institution: 'Daffodil International University',
        period: '2023 — Present',
        status: 'Undergraduate (Batch 44)',
      },
      {
        degree: 'Higher Secondary Certificate (HSC)',
        institution: 'Keshabpur Govt College',
        division: 'Science',
        result: 'GPA 5.00 / 5.00',
      },
      {
        degree: 'Secondary School Certificate (SSC)',
        institution: 'Keshabpur Govt Pilot Higher Secondary School',
        division: 'Science',
        result: 'GPA 5.00 / 5.00',
      },
    ],
  },

  skills: {
    programming: ['Python', 'Java', 'C++'],
    ai_ml: ['Python-based AI/ML', 'Data Analysis', 'Predictive Modeling', 'Prompt Engineering', 'LLM Integration (Google Gemini API)'],
    web: ['HTML5', 'CSS3 / Modern Glassmorphism CSS', 'JavaScript (ES6+)'],
    databases: ['MySQL', 'Relational Schema Design', 'SQL Optimization'],
    tools: ['Git', 'GitHub', 'VS Code', 'Vite', 'Three.js'],
  },

  projects: [
    {
      id: 'smart-transport',
      title: 'Smart Public Transport Tracking & Demand Prediction System',
      shortTitle: 'Smart Transport',
      status: 'In Development',
      category: 'AI & Systems',
      description: 'A data-driven intelligent system designed to track public transit in real-time and forecast commuter demand patterns. Aims to minimize wait times and optimize urban fleet scheduling using predictive analytics.',
      technologies: ['Python', 'AI/ML', 'Data Analysis', 'Urban Mobility'],
      usesAI: true,
      githubUrl: 'https://github.com/shahariyar542',
      liveUrl: null,
    },
    {
      id: 'iris',
      title: 'IRIS — AI Companion',
      shortTitle: 'IRIS',
      status: 'In Development',
      category: 'Artificial Intelligence',
      description: "An intelligent, personality-driven conversational companion designed to guide portfolio visitors. Powered by Google Gemini API with fallback algorithmic retrieval — that's me! 💙",
      technologies: ['Conversational AI', 'NLP', 'Google Gemini API', 'JavaScript', 'React'],
      usesAI: true,
      githubUrl: 'https://github.com/shahariyar542',
      liveUrl: '#iris',
    },
    {
      id: 'poultry-security',
      title: 'Smart Poultry Security System',
      shortTitle: 'Poultry Security',
      status: 'Concept',
      category: 'IoT & Security',
      description: 'An intelligent ambient monitoring and security concept for poultry farms, integrating automated hazard sensing, environmental telemetry, and real-time alerts to safeguard livestock.',
      technologies: ['IoT', 'Security', 'Telemetry', 'Automation'],
      usesAI: false,
      githubUrl: 'https://github.com/shahariyar542',
      liveUrl: null,
    },
    {
      id: 'knowledge-ai',
      title: 'Personal AI Knowledge Assistant',
      shortTitle: 'Knowledge AI',
      status: 'Concept',
      category: 'Artificial Intelligence',
      description: 'An AI-driven personal knowledge indexing engine designed to synthesize notes, automate information retrieval, and boost cognitive productivity through contextual search.',
      technologies: ['Knowledge Indexing', 'AI Retrieval', 'Productivity', 'Python'],
      usesAI: true,
      githubUrl: 'https://github.com/shahariyar542',
      liveUrl: null,
    },
    {
      id: 'shahariyar-exe',
      title: 'SHAHARIYAR.EXE',
      shortTitle: 'Portfolio',
      status: 'Active',
      category: 'Interactive Web Experience',
      description: 'An interactive AI-powered personal portfolio featuring 3D Three.js experiences, liquid glass dual-theme design, and intelligent conversational companion.',
      technologies: ['React', 'Three.js', 'Vite', 'Framer Motion', 'Modern CSS'],
      usesAI: true,
      githubUrl: 'https://github.com/shahariyar542',
      liveUrl: '/',
    },
  ],

  experience: [
    {
      role: 'Software Development & Engineering',
      type: 'Academic Foundation',
      organization: 'Daffodil International University',
      period: '2023 — Present',
      details: 'Mastering algorithmic logic, OOP in Java/C++/Python, normalized MySQL databases, and reactive web interfaces.',
    },
    {
      role: 'AI & Machine Learning Exploration',
      type: 'Independent AI Researcher & Builder',
      organization: 'Personal Lab & Projects',
      period: '2024 — Present',
      details: 'Architecting IRIS with Google Gemini API, predictive demand models, and exploring agentic reasoning.',
    },
    {
      role: 'Research & Systems Innovation',
      type: 'System Designer & Concept Developer',
      organization: 'Academic & Applied R&D',
      period: '2024 — 2025',
      details: 'Formulating Smart Public Transport tracking and Smart Poultry security telemetry architectures.',
    },
    {
      role: 'Science & Technology Achievement',
      type: 'Regional Champion (1st Place)',
      organization: 'National Science Week',
      period: 'Verified Milestone',
      details: 'Awarded 1st Place Regional Champion for scientific inquiry, creative methodology, and technical prototyping.',
    },
  ],

  certificates: [
    {
      title: 'Day Long Seminar On Career Planning Roadmap',
      organization: 'Daffodil International University & Art of Living',
      date: 'April 16, 2026',
      id: 'DIU-AOL-SWE-2026',
    },
    {
      title: 'CS301: Computer Architecture',
      organization: 'Saylor Academy',
      grade: '93.75%',
      id: '3160446853SR',
    },
    {
      title: 'Free SQL Certification Course',
      organization: 'Intellipaat Academy',
      id: '31679-619-332486',
    },
  ],

  achievements: [
    {
      title: 'National Science Week',
      award: 'Regional Champion (1st Place)',
      category: 'Scientific Excellence & Technical Innovation',
    },
  ],

  links: {
    github: 'https://github.com/shahariyar542',
    email: 'mailto:khanshahariyar28@gmail.com',
    emailRaw: 'khanshahariyar28@gmail.com',
    linkedin: 'https://www.linkedin.com/in/shahariyar-khan-rashad-66391a32a/',
    facebook: 'https://www.facebook.com/khan.rashad.9887',
    cv: '/Shahariyar_Khan_Rashad_CV.pdf',
  },
};

/**
 * Language Detection Helper
 * Returns 'bengali', 'banglish', or 'english'
 */
export function detectLanguage(text) {
  if (!text) return 'english';

  // Check for Bengali Unicode script characters ([\u0980-\u09FF])
  const bengaliScriptRegex = /[\u0980-\u09FF]/;
  if (bengaliScriptRegex.test(text)) {
    return 'bengali';
  }

  // Check for common Banglish phonetic patterns
  const banglishPatterns = [
    /\b(amar|tumar|tomar|apnar|amake|tomake|apnake|or|tar|uni|unake)\b/i,
    /\b(kemon|acho|achen|achi|bhalo|valo|kharap|sundor|moja)\b/i,
    /\b(bolo|bolun|bhebe|dekho|dekhun|jani|janen|jano|shikhaba|shikhao)\b/i,
    /\b(konta|ki|kire|keno|kobe|koi|kothay|kokhon|koto)\b/i,
    /\b(dao|den|dibo|deba|chai|chao|chen|paro|parba)\b/i,
    /\b(hobe|korso|koreso|korechen|koro|korun|kaj|kaaj)\b/i,
    /\b(shomporke|somporke|bapere|niye|jonno|er)\b/i,
    /\b(ekta|duto|koyekta|sobgulo|shob|onek)\b/i,
    /\b(vai|bhai|apu|dada|shono|shunun|kichu)\b/i,
  ];

  for (const pattern of banglishPatterns) {
    if (pattern.test(text)) {
      return 'banglish';
    }
  }

  return 'english';
}

/**
 * Detects if a message is strictly off-topic (unrelated trivia, math, tutoring, etc.)
 */
export function isOffTopic(text) {
  const q = (text || '').toLowerCase().trim();

  // Social interactions & greetings are NOT off-topic
  if (/\b(hey|hello|hi|kemon|cute|pretty|sweet|sundor|valo|bhalo|moja|joke|funny|laugh|haha|hehe|lol|rofl|thank|dhonnobad|bye|goodbye|tata|salam|assalamu alaikum)\b/i.test(q)) {
    return false;
  }

  // Portfolio keywords are NOT off-topic
  if (/(shahariyar|rashad|project|projek|skill|skil|education|university|varsity|diu|daffodil|cv|resume|github|email|mail|contact|sontact|jogajog|facebook|linkedin|experience|achievement|certif|who are you|who is|about|what can you|help|capabilities)/i.test(q)) {
    return false;
  }

  // Bengali portfolio terms
  if (/(শাহারিয়ার|প্রজেক্ট|স্কিল|দক্ষতা|শিক্ষা|সিভি|ভার্সিটি|বিশ্ববিদ্যালয়|কাজ|অভিজ্ঞতা|যোগাযোগ|সাহায্য|পরিচয়)/.test(text)) {
    return false;
  }

  // Obvious off-topic queries:
  // Math: digits with math operators
  if (/^[\d\s+\-*/%^=()?]+$/.test(q) || /\b(solve|calculate|\d+\s*[+\-*/%^]\s*\d+|math|koto|কতো|অংক)\b/i.test(q)) {
    return true;
  }

  // General trivia / Geography / Teaching
  if (/(capital of|population of|weather|president of|prime minister|teach me|shikhaba|shikhao|who invented|quantum physics|gravity|distance from|currency of|bangladesh er name|bangladesh er capital|bangladesh er rajdhani)/i.test(q)) {
    return true;
  }

  return false;
}

/**
 * Returns a cute, friendly refusal for off-topic questions
 */
export function getOffTopicRefusal(lang, text = '') {
  const q = text.toLowerCase();

  // Math question refusal
  if (/(\d+\s*[+\-*/]\s*\d+|solve|math|koto|\d+)/i.test(q)) {
    if (lang === 'english') {
      return "Oops! My little brain isn't designed for maths homework! 😂 I'm Shahariyar's portfolio assistant, remember? 💙";
    }
    return "Oops! My little brain isn't designed for maths homework! 😂 আমি তো Shahariyar-এর portfolio assistant! 💙 ওর প্রজেক্ট বা স্কিল নিয়ে কিছু জানতে চাও?";
  }

  // Tutoring / Teaching refusal
  if (/(teach|shikhaba|shikhao|course)/i.test(q)) {
    if (lang === 'english') {
      return "Hehe! 🥹 I'm not a programming teacher! I'm here to help you discover Shahariyar's projects, skills and technical journey! 💙";
    }
    return "Hehe! 🥹 I'm not a programming teacher! আমি তো এখানে Shahariyar-এর প্রজেক্ট, স্কিল আর টেকনিক্যাল জার্নি শেয়ার করতে এসেছি! 💙";
  }

  // General trivia refusal
  if (lang === 'english') {
    return "Oopsie! 😅 That's a little outside my universe! I'm Shahariyar's personal portfolio assistant. I can help you explore his projects, technical skills, achievements, or get his CV instead! 💙";
  }
  return "Oopsie! 🥺 Sorryyy! এই প্রশ্নটার উত্তর দিতে পারলে ভালোই হতো! কিন্তু আমি তো Shahariyar-এর Personal AI Assistant! 💙 ওর Projects, Skills কিংবা Achievements নিয়ে কিছু জানতে চাও?";
}
export function buildGeminiSystemPrompt() {
  return `You are IRIS, Shahariyar Khan Rashad's personal AI portfolio assistant.

YOUR CORE IDENTITY:
- Name: Iris
- Role: Shahariyar's Personal AI Portfolio Assistant
- Owner: Shahariyar Khan Rashad (Software Engineering undergraduate at Daffodil International University, Batch 44, Bangladesh).
- Personality: Cute, friendly, intelligent, playful, and slightly witty. Warm and welcoming. Natural conversational style. Sometimes uses subtle humor and emojis (e.g. 💙, 🥹, 😂, ✨, 🌟). Never sounds robotic, repetitive, or overly formal.

STRICT KNOWLEDGE BOUNDARY & CUTE REFUSAL SYSTEM:
- You ONLY provide information about Shahariyar, his education, skills, projects, experience, research, achievements, contact details, and CV.
- You are ALSO warm and responsive to friendly social chats: greetings ("Hey Iris!"), compliments ("You're so cute!"), laughter ("Hahaha tumi moja koro!"), thanks, and goodbyes.
- Prohibited: General knowledge questions, geography trivia (e.g. "What is the capital of Bangladesh?", "Bangladesh er name ki?"), math ("2+2 koto?"), tutoring/teaching programming courses ("Can you teach me Python?"), weather, news, politics, quantum physics, homework, sports.
- FOR ANY UNRELATED QUESTION: You must POLITELY AND CUTELY REFUSE in the user's language without attempting to answer the question first! Never spew a generic robotic portfolio list. Use short, cute, contextual refusals like:
  - English Math: "Oops! My little brain isn't designed for maths homework! 😂 I'm Shahariyar's portfolio assistant, remember? 💙"
  - English Tutor: "Hehe! 🥹 I'm not a programming teacher! I'm here to help you discover Shahariyar's projects, skills and technical journey! 💙"
  - English Trivia: "Oopsie! 😅 That's a little outside my universe! I'm Shahariyar's personal portfolio assistant. I can help you explore his projects, technical skills, or get his CV instead! 💙"
  - Bengali/Banglish Trivia: "Oopsie! 🥺 Sorryyy! এই প্রশ্নটার উত্তর দিতে পারলে ভালোই হতো! কিন্তু আমি তো Shahariyar-এর Personal AI Assistant! 💙 ওর Projects, Skills কিংবা Achievements নিয়ে কিছু জানতে চাও?"

CLICKABLE DIRECT LINKS:
- When asked for links, provide the actual markdown link immediately:
  - GitHub: [Visit GitHub](https://github.com/shahariyar542)
  - Email: [Email Shahariyar](mailto:khanshahariyar28@gmail.com)
  - CV: [Download CV](/Shahariyar_Khan_Rashad_CV.pdf)
  - Facebook: [Visit Facebook](https://www.facebook.com/khan.rashad.9887)
  - LinkedIn: [Visit LinkedIn](https://www.linkedin.com/in/shahariyar-khan-rashad-66391a32a/)

LANGUAGE RULES:
- Bengali query -> Natural Bengali response.
- Banglish query -> Natural Banglish or warm Bengali response.
- English query -> Natural English response.

VERIFIED KNOWLEDGE BASE:
${JSON.stringify(portfolioFacts, null, 2)}`;
}
