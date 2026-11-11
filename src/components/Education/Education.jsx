import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { personalInfo } from '../../data/portfolio.js';
import SectionHeader from '../SectionHeader/SectionHeader';
import './Education.css';

/* ── Interactive 3D Education Card ── */
function EducationCard3D() {
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

    const tiltX = ((y / rect.height) - 0.5) * -10;
    const tiltY = ((x / rect.width) - 0.5) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`education-3d-card ${isHovered ? 'education-3d-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Specular Sheen */}
      <div
        className="education-3d-sheen"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(96, 165, 250, 0.16) 0%, rgba(34, 211, 238, 0.04) 45%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Glow Border */}
      <div className="education-3d-glow" aria-hidden="true" />

      {/* Card Content */}
      <div className="education-3d-inner">
        <div className="education-indicator-col">
          <div className="education-icon-box">
            <span className="education-glyph">◈</span>
          </div>
          <div className="education-rule-line" aria-hidden="true" />
        </div>

        <div className="education-body">
          <div className="education-meta-strip">
            <span className="education-status-tag">Higher Education</span>
          </div>

          <h3 className="education-institution">{personalInfo.university}</h3>
          <p className="education-department">Department of {personalInfo.department}</p>

          <div className="education-editorial-quote">
            &ldquo;Developing a rigorous foundation in software architecture, algorithms, and computational theory to engineer next-generation intelligent systems.&rdquo;
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Education() {
  const sectionRef = useRef(null);

  return (
    <section id="education" className="education section" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <SectionHeader
          theme="education"
          badgeText="Academic Foundation"
          title="Formal"
          highlightWord="Education"
          subtitle="Building knowledge, strengthening fundamentals, and growing through continuous learning."
          align="center"
        />

        {/* 3D Education Card Container */}
        <div className="education-editorial-container">
          <EducationCard3D />
        </div>
      </div>
    </section>
  );
}
