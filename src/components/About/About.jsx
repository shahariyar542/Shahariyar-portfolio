import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { aboutData } from '../../data/portfolio.js';
import './About.css';

// Original 3 Identity Cards preserved exactly as designed
const identityCards = [
  {
    number: '01',
    title: 'Software Engineer',
    icon: '⟨/⟩',
    text: 'Building robust, scalable software with a foundation in engineering principles and a passion for clean, purposeful code.',
    accent: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.22)',
  },
  {
    number: '02',
    title: 'AI Explorer',
    icon: '◎',
    text: 'Driven by curiosity about intelligent systems — from machine learning models to conversational AI that genuinely helps people.',
    accent: '#22D3EE',
    glow: 'rgba(34, 211, 238, 0.22)',
  },
  {
    number: '03',
    title: 'Creative Thinker',
    icon: '◈',
    text: 'Finding unconventional solutions at the intersection of practicality and innovation, turning abstract ideas into tangible impact.',
    accent: '#818CF8',
    glow: 'rgba(129, 140, 248, 0.22)',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/* ── Upgraded Interactive 3D Card for Original About Content ── */
function AboutCard3D({ card, index, isInView }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
    const tiltX = (y / rect.height - 0.5) * -12;
    const tiltY = (x / rect.width - 0.5) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.article
      ref={cardRef}
      className={`about-card about-card--3d ${isHovered ? 'about-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.15 + 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Cursor-following specular light reflection */}
      <div
        className="about-card-sheen"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${card.glow} 0%, transparent 68%)`,
          opacity: isHovered ? 1 : 0.35,
        }}
        aria-hidden="true"
      />

      {/* Subtle border glow */}
      <div
        className="about-card-glow-border"
        style={{
          borderColor: isHovered ? card.accent : 'transparent',
        }}
        aria-hidden="true"
      />

      {/* Original Card Content preserved exactly */}
      <div className="about-card-content">
        <span className="about-card-number" style={{ color: card.accent }}>
          {card.number}
        </span>
        <div className="about-card-icon" style={{ color: card.accent }} aria-hidden="true">
          {card.icon}
        </div>
        <h3 className="about-card-title">{card.title}</h3>
        <p className="about-card-text">{card.text}</p>
      </div>
    </motion.article>
  );
}

function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: '-60px' });

  return (
    <section id="about" className="about section" ref={sectionRef}>
      <div className="container">
        {/* Section Label */}
        <motion.div
          className="section-label"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          01 — About
        </motion.div>

        {/* Section Title */}
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          The <em>Story</em>
        </motion.h2>

        {/* Asymmetric Content Grid */}
        <div className="about-grid">
          {/* Left Column — Pull Quote */}
          <motion.div
            className="about-pullquote"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <blockquote className="about-pullquote-text">
              {aboutData.intro}
            </blockquote>
          </motion.div>

          {/* Right Column — Paragraphs */}
          <div className="about-content">
            <motion.p
              className="about-paragraph"
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={2}
            >
              {aboutData.journey}
            </motion.p>
            <motion.p
              className="about-paragraph"
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={3}
            >
              {aboutData.aiInterest}
            </motion.p>
            <motion.p
              className="about-paragraph"
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={4}
            >
              {aboutData.mindset}
            </motion.p>
            <motion.div
              className="about-cv-wrapper"
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={5}
            >
              <a
                href="/Shahariyar_Khan_Rashad_CV.pdf"
                download="Shahariyar_Khan_Rashad_CV.pdf"
                className="about-cv-btn"
                aria-label="Download Professional Curriculum Vitae"
              >
                <span>Download Verified CV (PDF)</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Original Identity Cards with Interactive 3D Effects */}
        <div className="about-cards" ref={cardsRef}>
          {identityCards.map((card, index) => (
            <AboutCard3D
              key={card.number}
              card={card}
              index={index}
              isInView={cardsInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
