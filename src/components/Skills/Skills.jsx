import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '../../data/portfolio.js';
import './Skills.css';

const categoryKeys = Object.keys(skills);

const proficiencyColorMap = {
  'Daily Driver': {
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.35)',
  },
  'Learning & Building': {
    color: '#22D3EE',
    bg: 'rgba(34, 211, 238, 0.12)',
    border: 'rgba(34, 211, 238, 0.35)',
  },
  'Exploring & Learning': {
    color: '#60A5FA',
    bg: 'rgba(96, 165, 250, 0.12)',
    border: 'rgba(96, 165, 250, 0.35)',
  },
  'Comfortable': {
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.35)',
  },
  'Working Knowledge': {
    color: '#A5B4FC',
    bg: 'rgba(165, 180, 252, 0.12)',
    border: 'rgba(165, 180, 252, 0.35)',
  },
  'Academic Foundation': {
    color: '#CBD5E1',
    bg: 'rgba(203, 213, 225, 0.08)',
    border: 'rgba(203, 213, 225, 0.22)',
  },
};

/* ── Interactive 3D Skill Category Card ── */
function SkillCategoryCard3D({ data, index }) {
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
      className={`skills-3d-card ${isHovered ? 'skills-3d-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Dynamic Specular Light Flare */}
      <div
        className="skills-3d-sheen"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(96, 165, 250, 0.18) 0%, rgba(34, 211, 238, 0.04) 45%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Layer 1: Ambient Lighting Border */}
      <div className="skills-3d-glow-border" aria-hidden="true" />

      {/* Layer 2: Elevated 3D Content Surface */}
      <div className="skills-3d-content">
        <header className="skills-card-header">
          <div className="skills-icon-wrap">
            <span className="skills-icon-glyph">{data.icon}</span>
          </div>
          <div className="skills-header-meta">
            <div className="skills-header-top">
              <span className="skills-category-index">0{index + 1}</span>
              <span className="skills-count-tag">
                {data.items.length} {data.items.length === 1 ? 'Tech' : 'Techs'}
              </span>
            </div>
            <h3 className="skills-card-title">{data.label}</h3>
          </div>
        </header>

        {data.description && (
          <p className="skills-card-desc">{data.description}</p>
        )}

        <div className="skills-badge-grid">
          {data.items.map((skill) => {
            const levelStyle = proficiencyColorMap[skill.level] || {
              color: '#CBD5E1',
              bg: 'rgba(203, 213, 225, 0.08)',
              border: 'rgba(203, 213, 225, 0.2)',
            };

            return (
              <div
                key={skill.name}
                className={`skill-tech-badge ${skill.highlight ? 'skill-tech-badge--highlight' : ''}`}
              >
                <div className="skill-tech-main">
                  <span className="skill-tech-dot" aria-hidden="true" />
                  <span className="skill-tech-name">{skill.name}</span>
                  {skill.highlight && (
                    <span className="skill-tech-star" title="Core Focus" aria-label="Core Focus">
                      ★
                    </span>
                  )}
                </div>
                <span
                  className="skill-tech-level"
                  style={{
                    color: levelStyle.color,
                    backgroundColor: levelStyle.bg,
                    borderColor: levelStyle.border,
                  }}
                >
                  {skill.level}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="skills section section-dark" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-label"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          02 — Technical Matrix
        </motion.div>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Skills & <em>Competencies</em>
        </motion.h2>

        <motion.p
          className="skills-intro"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          Curated across five fundamental engineering domains with focus on machine intelligence, robust backend systems, and modern interactive technologies.
        </motion.p>

        {/* 5-Category Interactive 3D Grid */}
        <div className="skills-3d-grid">
          {categoryKeys.map((key, index) => (
            <SkillCategoryCard3D
              key={key}
              categoryKey={key}
              data={skills[key]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
