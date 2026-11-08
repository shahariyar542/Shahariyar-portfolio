/**
 * SHAHARIYAR.EXE — Portfolio Data
 * All verified personal and project information
 */

export const personalInfo = {
  fullName: 'Shahariyar Khan Rashad',
  firstName: 'Shahariyar',
  lastName: 'Rashad',
  identity: 'Aspiring AI Engineer',
  university: 'Daffodil International University',
  department: 'Software Engineering',
  batch: 44,
  location: 'Bangladesh',
  email: 'khanshahariyar28@gmail.com',
  phone: '01602292216', // configurable, not displayed by default
  showPhone: false,
  profileImage: '/images/profile.jpg',
  cvPdf: '/Shahariyar_Khan_Rashad_CV.pdf',
  aiAssistantName: 'IRIS',
};

export const socialLinks = {
  facebook: 'https://www.facebook.com/khan.rashad.9887',
  linkedin: 'https://www.linkedin.com/in/shahariyar-khan-rashad-66391a32a/',
  github: 'https://github.com/shahariyar542',
  email: 'mailto:khanshahariyar28@gmail.com',
};

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export const aboutData = {
  intro: "A Software Engineering student at Daffodil International University with a deep curiosity for Artificial Intelligence and its transformative potential.",
  journey: "My journey in technology began with a fascination for how intelligent systems can solve real-world problems. This curiosity led me to Software Engineering, where I'm building the technical foundation to pursue AI engineering.",
  aiInterest: "I'm drawn to the intersection of AI, machine learning, and practical software solutions. From building conversational companions to exploring predictive systems, I believe in creating technology that genuinely helps people.",
  mindset: "I approach problems with creative thinking and a desire to build unconventional solutions. Whether it's a smart transport system or an intelligent knowledge assistant, I look for the intersection of practicality and innovation.",
};

export const skills = {
  programming: {
    label: 'Programming Languages',
    icon: '⟨/⟩',
    description: 'Foundational and modern languages for algorithmic thinking and system design.',
    items: [
      { name: 'Python', level: 'Learning & Building', highlight: true },
      { name: 'Java', level: 'Academic Foundation', highlight: false },
      { name: 'C++', level: 'Academic Foundation', highlight: false },
    ],
  },
  ai: {
    label: 'AI & Machine Learning',
    icon: '◎',
    description: 'Core exploration in predictive modeling, deep learning architectures, and NLP.',
    items: [
      { name: 'Python-based AI/ML', level: 'Exploring & Learning', highlight: true },
      { name: 'Data Analysis', level: 'Exploring & Learning', highlight: false },
      { name: 'Neural Concept Models', level: 'Learning & Building', highlight: true },
    ],
  },
  web: {
    label: 'Web Development',
    icon: '◈',
    description: 'Modern frontend interfaces and reactive user experiences.',
    items: [
      { name: 'HTML5', level: 'Comfortable', highlight: false },
      { name: 'CSS3 / Modern CSS', level: 'Comfortable', highlight: false },
      { name: 'JavaScript (ES6+)', level: 'Learning & Building', highlight: true },
    ],
  },
  database: {
    label: 'Database Technologies',
    icon: '⊞',
    description: 'Relational data modeling, querying, and structured persistence.',
    items: [
      { name: 'MySQL', level: 'Academic Foundation', highlight: true },
      { name: 'Relational Schema Design', level: 'Academic Foundation', highlight: false },
    ],
  },
  tools: {
    label: 'Tools & Technologies',
    icon: '⚙',
    description: 'Development environment, version control, and collaborative workflows.',
    items: [
      { name: 'Git', level: 'Working Knowledge', highlight: false },
      { name: 'GitHub', level: 'Working Knowledge', highlight: true },
      { name: 'VS Code', level: 'Daily Driver', highlight: true },
    ],
  },
};

export const projects = [
  {
    id: 1,
    title: 'Smart Public Transport Tracking & Demand Prediction System',
    shortTitle: 'Smart Transport',
    description: 'A data-driven intelligent system designed to track public transit in real-time and forecast commuter demand patterns. Aims to minimize wait times and optimize urban fleet scheduling using algorithmic analysis.',
    tags: ['AI/ML', 'Data Analysis', 'Urban Mobility', 'Python'],
    status: 'In Development',
    category: 'AI & Systems',
    githubUrl: 'https://github.com/shahariyar542',
    liveUrl: null,
    metrics: 'Demand Forecast Model',
  },
  {
    id: 2,
    title: 'IRIS — AI Companion',
    shortTitle: 'IRIS',
    description: 'An intelligent conversational companion designed to provide seamless dialogue, contextual assistance, and responsive interactions. Powered by Google Gemini API with fallback algorithmic retrieval.',
    tags: ['Conversational AI', 'NLP', 'Google Gemini API', 'JavaScript'],
    status: 'In Development',
    category: 'Artificial Intelligence',
    githubUrl: 'https://github.com/shahariyar542',
    liveUrl: '#iris',
    metrics: 'Real-time Dialog Engine',
  },
  {
    id: 3,
    title: 'Smart Poultry Security System',
    shortTitle: 'Poultry Security',
    description: 'An intelligent security and ambient monitoring system for poultry farms. Integrates automated hazard sensing, environmental condition telemetry, and immediate threat notification to safeguard livestock.',
    tags: ['IoT', 'Security', 'Smart Hardware', 'Automation'],
    status: 'Concept',
    category: 'IoT & Security',
    githubUrl: 'https://github.com/shahariyar542',
    liveUrl: null,
    metrics: 'Hazard Sensing Architecture',
  },
  {
    id: 4,
    title: 'Personal AI Knowledge Assistant',
    shortTitle: 'Knowledge AI',
    description: 'An AI-driven personal knowledge indexing engine designed to synthesize notes, automate information retrieval, and enhance cognitive productivity through structured contextual search.',
    tags: ['Knowledge Management', 'AI Retrieval', 'Productivity', 'Python'],
    status: 'Concept',
    category: 'Artificial Intelligence',
    githubUrl: 'https://github.com/shahariyar542',
    liveUrl: null,
    metrics: 'Contextual Search Engine',
  },
];

export const researchInterests = [
  {
    title: 'Artificial Intelligence',
    description: 'Investigating autonomous agents, cognitive architectures, and neural foundations that transform computational interaction.',
    icon: '◈',
    tag: 'Core Focus',
  },
  {
    title: 'Machine Learning',
    description: 'Exploring supervised, unsupervised, and predictive models for real-world pattern recognition and algorithmic optimization.',
    icon: '⊛',
    tag: 'Predictive Systems',
  },
  {
    title: 'Software Engineering',
    description: 'Architecting scalable software, robust component abstractions, and maintainable distributed application designs.',
    icon: '⟨⟩',
    tag: 'System Architecture',
  },
  {
    title: 'Research-Oriented Development',
    description: 'Synthesizing empirical scientific research into pragmatic, production-grade technological implementations.',
    icon: '◎',
    tag: 'Methodology',
  },
];

export const achievements = [
  {
    title: 'National Science Week',
    award: 'Regional Champion',
    category: 'Scientific Excellence & Innovation',
    description: 'Recognized as Regional Champion at the National Science Week for demonstrated excellence in scientific inquiry, creative methodology, and technical innovation.',
    certificateImage: null,
    badge: 'Regional 1st Place',
  },
];

export const irisKnowledge = {
  identity: {
    name: 'Shahariyar Khan Rashad',
    role: 'Aspiring AI Engineer',
    university: 'Daffodil International University',
    department: 'Software Engineering',
    batch: 44,
    location: 'Bangladesh',
  },
  about: "Shahariyar Khan Rashad is a Software Engineering student at Daffodil International University (Batch 44) with a deep passion for Artificial Intelligence. He approaches technology with creative thinking and a desire to build unconventional solutions. His journey began with a fascination for how intelligent systems solve real-world problems.",
  projects: [
    "Smart Public Transport Tracking and Demand Prediction System (In Development) — Real-time tracking and demand pattern forecasting.",
    "IRIS — AI Companion (In Development) — Intelligent conversational assistant powered by Google Gemini.",
    "Smart Poultry Security System (Concept) — Ambient sensing and security threat prevention.",
    "Personal AI Knowledge Assistant (Concept) — Contextual knowledge indexing and retrieval assistant.",
  ],
  skills: "Programming: Python, Java, C++. AI/ML: Python-based AI/ML, data analysis. Web: HTML5, CSS3, JavaScript. Database: MySQL. Tools: Git, GitHub, VS Code.",
  interests: "Artificial Intelligence, Machine Learning, Software Engineering, Research-Oriented Development.",
  achievements: "National Science Week — Regional Champion.",
  contact: "Email: khanshahariyar28@gmail.com. LinkedIn: linkedin.com/in/shahariyar-khan-rashad-66391a32a. GitHub: github.com/shahariyar542. Facebook: facebook.com/khan.rashad.9887.",
};

export const irisSuggestedQuestions = [
  "Who is Shahariyar?",
  "Tell me about his education.",
  "What software projects has he developed?",
  "What are his technical skills?",
  "How can I contact him?",
  "Can I download his CV?",
];
