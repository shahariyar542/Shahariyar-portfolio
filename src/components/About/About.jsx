import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { aboutData } from '../../data/portfolio.js';
import './About.css';

const identityCards = [
  {
    number: '01',
    title: 'Software Engineer',
    icon: '⟨/⟩',
    text: 'Building robust, scalable software with a foundation in engineering principles and a passion for clean, purposeful code.',
  },
  {
    number: '02',
    title: 'AI Explorer',
    icon: '◎',
    text: 'Driven by curiosity about intelligent systems — from machine learning models to conversational AI that genuinely helps people.',
  },
  {
    number: '03',
    title: 'Creative Thinker',
    icon: '◈',
    text: 'Finding unconventional solutions at the intersection of practicality and innovation, turning abstract ideas into tangible impact.',
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

        {/* Identity Cards */}
        <div className="about-cards" ref={cardsRef}>
          {identityCards.map((card, index) => (
            <motion.article
              key={card.number}
              className="about-card"
              initial={{ opacity: 0, y: 40 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: index * 0.15 + 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="about-card-number">{card.number}</span>
              <div className="about-card-icon" aria-hidden="true">
                {card.icon}
              </div>
              <h3 className="about-card-title">{card.title}</h3>
              <p className="about-card-text">{card.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
