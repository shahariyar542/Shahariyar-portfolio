import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { aboutData, personalInfo, achievements } from '../../data/portfolio.js';
import './About.css';

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

/* ── Card 1: 3D Academic Identity Card (University / Education) ── */
function AcademicCard3D() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = (y / rect.height - 0.5) * -12;
    const tiltY = (x / rect.width - 0.5) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <article
      ref={cardRef}
      className={`about-3d-card about-card--academic ${isHovered ? 'about-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Animated Light Reflection Border */}
      <div className="academic-reflection-border" aria-hidden="true" />
      <div className="academic-card-sheen" aria-hidden="true" />

      <div className="about-card-interior">
        {/* Academic Header Badge */}
        <div className="academic-top-strip">
          <div className="academic-badge-wrap">
            <span className="academic-glyph">◈</span>
            <span className="academic-inst-tag">ACADEMIC CREDENTIAL</span>
          </div>
          <span className="academic-batch-pill">Batch {personalInfo.batch}</span>
        </div>

        <h3 className="academic-institution-name">{personalInfo.university}</h3>
        <p className="academic-dept-name">Department of {personalInfo.department}</p>

        <div className="academic-divider" aria-hidden="true" />

        <div className="academic-footer-details">
          <div className="academic-field-group">
            <span className="academic-field-label">PROGRAM</span>
            <span className="academic-field-val">B.Sc. in Software Engineering</span>
          </div>
          <div className="academic-field-group">
            <span className="academic-field-label">STATUS</span>
            <span className="academic-status-pill">Active Undergraduate</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Card 2: Interactive 3D Profile Card (Personal / AI Engineering Identity) ── */
function ProfileIdentityCard3D() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    setMousePos({ x: xPct, y: yPct });

    const tiltX = (y / rect.height - 0.5) * -12;
    const tiltY = (x / rect.width - 0.5) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <article
      ref={cardRef}
      className={`about-3d-card about-card--profile ${isHovered ? 'about-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Interactive Specular Glow tracking cursor */}
      <div
        className="profile-cursor-glow"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(34, 211, 238, 0.22) 0%, rgba(59, 130, 246, 0.06) 45%, transparent 70%)`,
          opacity: isHovered ? 1 : 0.4,
        }}
        aria-hidden="true"
      />

      <div className="about-card-interior">
        <div className="profile-top-strip">
          <div className="profile-avatar-chip">
            <span className="profile-chip-icon">◎</span>
            <span className="profile-chip-text">AI ENGINEER</span>
          </div>
          <span className="profile-location-tag">
            <span className="profile-pulse-dot" />
            {personalInfo.location}
          </span>
        </div>

        <h3 className="profile-full-name">{personalInfo.fullName}</h3>
        <p className="profile-tagline">{personalInfo.title}</p>

        <p className="profile-mission-text">
          Engineering scalable systems with deep curiosity at the frontier of machine learning, neural architectures, and algorithmic problem solving.
        </p>

        <div className="profile-tech-strip">
          <span className="profile-mini-badge">Applied AI</span>
          <span className="profile-mini-badge">System Design</span>
          <span className="profile-mini-badge">Data Intelligence</span>
        </div>
      </div>
    </article>
  );
}

/* ── Card 3: 3D Achievement Showcase (Prestigious Award) ── */
function AwardShowcaseCard3D() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const award = achievements[0];

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = (y / rect.height - 0.5) * -12;
    const tiltY = (x / rect.width - 0.5) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <article
      ref={cardRef}
      className={`about-3d-card about-card--award ${isHovered ? 'about-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Warm Golden Sheen Sweep Animation */}
      <div className="award-gold-sweep" aria-hidden="true" />
      <div className="award-ambient-gold-glow" aria-hidden="true" />

      <div className="about-card-interior">
        <div className="award-card-header">
          <div className="award-trophy-ring">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
              <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
              <path d="M12 2v20" />
              <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
            </svg>
          </div>
          <span className="award-badge-pill">★ {award.badge || 'Regional 1st Place'}</span>
        </div>

        <span className="award-event-label">{award.title}</span>
        <h3 className="award-distinction-title">{award.award}</h3>

        <p className="award-distinction-desc">
          Honored for demonstrated excellence in scientific inquiry, creative methodology, and technical innovation.
        </p>

        <div className="award-card-footer">
          <span className="award-category-tag">{award.category}</span>
          <span className="award-verified-check">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Verified
          </span>
        </div>
      </div>
    </article>
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

        {/* ── Three Unique Interactive 3D Identity Cards ── */}
        <div className="about-cards-3d-grid" ref={cardsRef}>
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={cardsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <AcademicCard3D />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={cardsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProfileIdentityCard3D />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={cardsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <AwardShowcaseCard3D />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
