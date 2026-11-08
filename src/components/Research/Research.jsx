import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { researchInterests } from '../../data/portfolio';
import './Research.css';

/* ── Interactive 3D Research Card ── */
function ResearchCard3D({ interest, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });
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

    const tiltX = ((y / rect.height) - 0.5) * -12;
    const tiltY = ((x / rect.width) - 0.5) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.article
      ref={cardRef}
      className={`research-3d-card ${isHovered ? 'research-3d-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Dynamic Specular Sheen */}
      <div
        className="research-3d-sheen"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(96, 165, 250, 0.18) 0%, rgba(34, 211, 238, 0.04) 45%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Glow Border */}
      <div className="research-3d-glow" aria-hidden="true" />

      {/* Content */}
      <div className="research-3d-content">
        <div className="research-card-top">
          <div className="research-card-icon-box">
            <span className="research-card-icon" aria-hidden="true">
              {interest.icon}
            </span>
          </div>
          {interest.tag && (
            <span className="research-card-tag">{interest.tag}</span>
          )}
        </div>

        <h3 className="research-card-title">{interest.title}</h3>
        <p className="research-card-description">{interest.description}</p>
      </div>
    </motion.article>
  );
}

/* ── Research Section ── */
export default function Research() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const noteRef = useRef(null);
  const noteInView = useInView(noteRef, { once: true, margin: '-40px' });

  return (
    <section id="research" className="section section-dark research-section" ref={sectionRef}>
      <div className="research-container">
        {/* Section Header */}
        <motion.header
          className="research-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">04 — Research Directions</p>
          <h2 className="section-title">
            Research & <em>Exploration</em>
          </h2>
        </motion.header>

        {/* 3D Research Interests Grid */}
        <div className="research-3d-grid">
          {researchInterests.map((interest, index) => (
            <ResearchCard3D
              key={interest.title}
              interest={interest}
              index={index}
            />
          ))}
        </div>

        {/* Academic Note */}
        <motion.aside
          ref={noteRef}
          className="research-note"
          initial={{ opacity: 0, x: -20 }}
          animate={noteInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Future research note"
        >
          <p className="research-note-text">
            <span className="research-note-icon" aria-hidden="true">✦</span>
            This section expands with publications, research papers, and algorithmic explorations as academic investigations progress.
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
