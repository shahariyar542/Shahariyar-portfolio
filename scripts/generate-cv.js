import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const outputPath = path.resolve('public/Shahariyar_Khan_Rashad_CV.pdf');

// Ensure public directory exists
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create A4 PDF with 40pt margins
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 36, bottom: 36, left: 40, right: 40 },
  info: {
    Title: 'Shahariyar Khan Rashad — Curriculum Vitae',
    Author: 'Shahariyar Khan Rashad',
    Subject: 'Curriculum Vitae — Aspiring AI Engineer',
    Keywords: 'Software Engineering, AI, Machine Learning, Python, Shahariyar Khan Rashad',
  },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Color Palette
const NAVY_DARK = '#070B18';
const NAVY_ACCENT = '#0D1528';
const BLUE_LIGHT = '#2563EB';
const CYAN = '#0891B2';
const TEXT_DARK = '#0F172A';
const TEXT_MUTED = '#475569';
const LINE_COLOR = '#CBD5E1';

// Top Banner Header
doc.rect(0, 0, doc.page.width, 100).fill(NAVY_DARK);

// Name & Title in Header
doc.fillColor('#FFFFFF')
   .font('Helvetica-Bold')
   .fontSize(22)
   .text('SHAHARIYAR KHAN RASHAD', 40, 24, { characterSpacing: 1 });

doc.fillColor('#38BDF8')
   .font('Helvetica')
   .fontSize(10.5)
   .text('SOFTWARE ENGINEERING STUDENT  |  ASPIRING AI ENGINEER', 40, 52, { characterSpacing: 0.5 });

doc.fillColor('#94A3B8')
   .font('Helvetica')
   .fontSize(8.5)
   .text('Dhaka, Bangladesh  •  khanshahariyar28@gmail.com  •  github.com/shahariyar542  •  linkedin.com/in/shahariyar-khan-rashad-66391a32a', 40, 72);

// Move below header
doc.y = 114;

// Section Helper
function drawSectionHeader(title) {
  doc.moveDown(0.6);
  const currentY = doc.y;
  
  doc.rect(40, currentY, 4, 14).fill(BLUE_LIGHT);
  
  doc.fillColor(NAVY_DARK)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text(title.toUpperCase(), 50, currentY + 1.5, { characterSpacing: 0.8 });
     
  doc.moveTo(40, currentY + 17)
     .lineTo(doc.page.width - 40, currentY + 17)
     .lineWidth(0.75)
     .strokeColor(LINE_COLOR)
     .stroke();
     
  doc.y = currentY + 23;
}

// ── 1. PROFESSIONAL SUMMARY ──
drawSectionHeader('Professional Summary');
doc.fillColor(TEXT_DARK)
   .font('Helvetica')
   .fontSize(9)
   .text(
     'Enthusiastic and analytical Software Engineering undergraduate at Daffodil International University with a dedicated specialization in Artificial Intelligence, predictive data modeling, and modern software architectures. Driven by curiosity and rigorous engineering practices to build scalable, human-centric software solutions that solve real-world problems.',
     { lineGap: 2.5 }
   );

// ── 2. EDUCATION ──
drawSectionHeader('Education');
doc.fillColor(TEXT_DARK)
   .font('Helvetica-Bold')
   .fontSize(10)
   .text('Daffodil International University', 40, doc.y);

doc.fillColor(TEXT_MUTED)
   .font('Helvetica-Oblique')
   .fontSize(8.5)
   .text('Bachelor of Science in Software Engineering — Batch 44  |  Dhaka, Bangladesh', 40, doc.y + 1);

doc.moveDown(0.3);
doc.fillColor(TEXT_DARK)
   .font('Helvetica')
   .fontSize(8.5)
   .text('• Core Academic Focus: Software Design & Architecture, Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computational Logic.', { lineGap: 1.5 });

// ── 3. TECHNICAL SKILLS ──
drawSectionHeader('Technical Skills & Competencies');

const skillsData = [
  { category: 'Programming Languages', items: 'Python (Learning & Building), Java (Academic), C++ (Academic)' },
  { category: 'AI & Machine Learning', items: 'Python-based AI/ML, Predictive Modeling, Data Analysis, Neural Concept Exploration' },
  { category: 'Web Technologies', items: 'HTML5, CSS3, JavaScript (ES6+), Modern Responsive UI Design' },
  { category: 'Database Systems', items: 'MySQL, Relational Schema Architecture, SQL Query Optimization' },
  { category: 'Developer Tools', items: 'Git, GitHub Version Control, Visual Studio Code, Postman' },
];

skillsData.forEach((s) => {
  doc.fillColor(TEXT_DARK)
     .font('Helvetica-Bold')
     .fontSize(8.5)
     .text(`${s.category}: `, { continued: true });
     
  doc.font('Helvetica')
     .fillColor(TEXT_MUTED)
     .text(s.items, { lineGap: 2 });
});

// ── 4. PROJECTS ──
drawSectionHeader('Software & AI Projects');

const projectList = [
  {
    title: 'Smart Public Transport Tracking & Demand Prediction System',
    status: 'In Development',
    tags: 'Python, AI/ML, Predictive Analytics, Transportation Optimization',
    desc: 'An intelligent transit intelligence system designed to capture real-time commuter patterns and forecast peak demand surges using data-driven algorithmic models, minimizing fleet downtime and commuter wait intervals.',
  },
  {
    title: 'IRIS — AI Companion',
    status: 'In Development',
    tags: 'Google Gemini API, NLP, Conversational Systems, JavaScript',
    desc: 'A contextual conversational AI agent providing real-time dialogue and responsive assistance. Integrated directly into digital interfaces with graceful algorithmic knowledge retrieval fallback.',
  },
  {
    title: 'Smart Poultry Security System',
    status: 'Concept Architecture',
    tags: 'IoT Sensors, Smart Hardware, Threat Detection, Automated Alerts',
    desc: 'An automated security and telemetry platform for poultry agriculture, monitoring environmental parameters and notifying operators of perimeter breaches and livestock hazards.',
  },
  {
    title: 'Personal AI Knowledge Assistant',
    status: 'Concept Architecture',
    tags: 'Knowledge Retrieval, NLP Indexing, Productivity Tools, Python',
    desc: 'A personal productivity system engineered to index, synthesize, and contextualize unstructured technical notes and documentation through structured semantic retrieval.',
  },
];

projectList.forEach((p) => {
  doc.fillColor(TEXT_DARK)
     .font('Helvetica-Bold')
     .fontSize(9.5)
     .text(p.title, { continued: true });
     
  doc.fillColor(CYAN)
     .font('Helvetica-Bold')
     .fontSize(8)
     .text(`  [${p.status}]`);
     
  doc.fillColor(TEXT_MUTED)
     .font('Helvetica-Oblique')
     .fontSize(8)
     .text(`Technologies: ${p.tags}`, { lineGap: 1.5 });
     
  doc.fillColor(TEXT_DARK)
     .font('Helvetica')
     .fontSize(8.5)
     .text(p.desc, { lineGap: 2 });
     
  doc.moveDown(0.35);
});

// ── 5. ACHIEVEMENTS & RECOGNITION ──
drawSectionHeader('Honors & Achievements');
doc.fillColor(TEXT_DARK)
   .font('Helvetica-Bold')
   .fontSize(9.5)
   .text('Regional Champion — National Science Week');

doc.fillColor(TEXT_MUTED)
   .font('Helvetica')
   .fontSize(8.5)
   .text('Recognized with 1st Place distinction at the National Science Week for innovative scientific inquiry, creative methodology, and technical excellence in computing and applied sciences.', { lineGap: 2 });

// ── 6. RESEARCH INTERESTS ──
drawSectionHeader('Research Interests');
doc.fillColor(TEXT_DARK)
   .font('Helvetica')
   .fontSize(8.5)
   .text('• Artificial Intelligence & Deep Learning: Autonomous cognitive workflows, neural representations, NLP.', { lineGap: 1.5 })
   .text('• Predictive Machine Learning: Time-series forecasting, pattern recognition in structured and spatial datasets.', { lineGap: 1.5 })
   .text('• Software Systems Engineering: Scalable software architecture, component modularity, empirical engineering.', { lineGap: 1.5 });

// Footer
doc.rect(0, doc.page.height - 24, doc.page.width, 24).fill(NAVY_ACCENT);
doc.fillColor('#94A3B8')
   .font('Helvetica')
   .fontSize(7.5)
   .text('Shahariyar Khan Rashad — Professional CV  |  Generated directly from verified portfolio records', 40, doc.page.height - 16, { align: 'center', width: doc.page.width - 80 });

doc.end();

stream.on('finish', () => {
  console.log(`✅ CV PDF generated successfully at: ${outputPath}`);
});
