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
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export const aboutData = {
  intro: "A Software Engineering student at Daffodil International University with a deep curiosity for Artificial Intelligence and its transformative potential.",
  journey: "My journey in technology began with a fascination for how intelligent systems can solve real-world problems. This curiosity led me to Software Engineering, where I'm building the technical foundation to pursue AI engineering.",
  aiInterest: "I'm drawn to the intersection of AI, machine learning, and practical software solutions. From building AI companions to exploring predictive systems, I believe in creating technology that genuinely helps people.",
  mindset: "I approach problems with creative thinking and a desire to build unconventional solutions. Whether it's a smart transport system or a personal AI assistant, I look for the intersection of practicality and innovation.",
};

export const skills = {
  programming: {
    label: 'Programming',
    icon: '⟨/⟩',
    items: [
      { name: 'Python', level: 'Learning & Building' },
      { name: 'Java', level: 'Academic Foundation' },
      { name: 'C++', level: 'Academic Foundation' },
    ],
  },
  web: {
    label: 'Web Development',
    icon: '◈',
    items: [
      { name: 'HTML', level: 'Comfortable' },
      { name: 'CSS', level: 'Comfortable' },
      { name: 'JavaScript', level: 'Learning & Building' },
    ],
  },
  database: {
    label: 'Database',
    icon: '⊞',
    items: [
      { name: 'MySQL', level: 'Academic Foundation' },
    ],
  },
  ai: {
    label: 'AI & Machine Learning',
    icon: '◎',
    items: [
      { name: 'Python-based AI/ML', level: 'Exploring & Learning' },
    ],
  },
  tools: {
    label: 'Tools',
    icon: '⚙',
    items: [
      { name: 'Git', level: 'Working Knowledge' },
      { name: 'GitHub', level: 'Working Knowledge' },
      { name: 'VS Code', level: 'Daily Driver' },
    ],
  },
};

export const projects = [
  {
    id: 1,
    title: 'Smart Public Transport Tracking and Demand Prediction System',
    shortTitle: 'Smart Transport',
    description: 'A system designed to track public transport in real-time and predict demand patterns using data-driven approaches. Aims to improve urban transportation efficiency.',
    tags: ['AI/ML', 'Data Analysis', 'Transportation'],
    status: 'In Development',
    category: 'AI & Systems',
  },
  {
    id: 2,
    title: 'IRIS — AI Companion',
    shortTitle: 'IRIS',
    description: 'An intelligent, friendly AI companion designed to assist, inform, and engage users with warmth and personality. Built with conversational AI capabilities.',
    tags: ['AI', 'NLP', 'Conversational AI'],
    status: 'In Development',
    category: 'Artificial Intelligence',
  },
  {
    id: 3,
    title: 'Smart Poultry Security System',
    shortTitle: 'Poultry Security',
    description: 'An intelligent security monitoring system for poultry farms, leveraging smart technology to detect threats and ensure safety of livestock.',
    tags: ['IoT', 'Security', 'Smart Systems'],
    status: 'Concept',
    category: 'IoT & Security',
  },
  {
    id: 4,
    title: 'Personal AI Knowledge Assistant',
    shortTitle: 'Knowledge AI',
    description: 'A personal AI assistant designed to organize, retrieve, and present knowledge efficiently. Aimed at enhancing personal productivity through intelligent information management.',
    tags: ['AI', 'Knowledge Management', 'Productivity'],
    status: 'Concept',
    category: 'Artificial Intelligence',
  },
  {
    id: 5,
    title: 'SHAHARIYAR.EXE — Interactive Personal Portfolio',
    shortTitle: 'This Portfolio',
    description: 'An unconventional, premium, interactive developer portfolio featuring creative design, advanced animations, and an AI companion named IRIS.',
    tags: ['Web Development', 'Creative Design', 'AI Integration'],
    status: 'Active',
    category: 'Web & Creative',
  },
];

export const researchInterests = [
  {
    title: 'Artificial Intelligence',
    description: 'Exploring the frontiers of AI systems, from neural architectures to practical applications that transform how we interact with technology.',
    icon: '◈',
  },
  {
    title: 'Machine Learning',
    description: 'Investigating predictive models, pattern recognition, and data-driven decision-making systems with real-world applications.',
    icon: '⊛',
  },
  {
    title: 'Software Engineering',
    description: 'Studying modern software design principles, system architecture, and development methodologies for building scalable solutions.',
    icon: '⟨⟩',
  },
  {
    title: 'Research-Oriented Development',
    description: 'Bridging the gap between academic research and practical implementation, focusing on building systems grounded in scientific methodology.',
    icon: '◎',
  },
];

export const achievements = [
  {
    title: 'National Science Week',
    award: 'Regional Champion',
    description: 'Recognized as a Regional Champion at the National Science Week, demonstrating excellence in scientific thinking and innovation.',
    certificateImage: null, // To be added later
    year: null,
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
    "Smart Public Transport Tracking and Demand Prediction System (In Development) — A system to track transport and predict demand patterns.",
    "IRIS — AI Companion (In Development) — An intelligent, friendly AI companion.",
    "Smart Poultry Security System (Concept) — Intelligent security monitoring for poultry farms.",
    "Personal AI Knowledge Assistant (Concept) — An AI assistant for knowledge management.",
    "SHAHARIYAR.EXE (Active) — This interactive portfolio website.",
  ],
  skills: "Programming: Python (Learning & Building), Java (Academic), C++ (Academic). Web: HTML, CSS, JavaScript. Database: MySQL. AI/ML: Python-based exploration. Tools: Git, GitHub, VS Code.",
  interests: "Artificial Intelligence, Machine Learning, Software Engineering, Research-Oriented Development, Creative Technology.",
  achievements: "National Science Week — Regional Champion.",
  contact: "Email: khanshahariyar28@gmail.com. LinkedIn: linkedin.com/in/shahariyar-khan-rashad-66391a32a. GitHub: github.com/shahariyar542. Facebook: facebook.com/khan.rashad.9887.",
};

export const irisSuggestedQuestions = [
  "Who is Shahariyar?",
  "Tell me about his education.",
  "What projects is he working on?",
  "What are his technical interests?",
  "How can I contact him?",
  "What makes him interested in AI?",
];
