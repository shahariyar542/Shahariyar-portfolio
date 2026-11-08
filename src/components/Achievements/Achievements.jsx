import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { achievements } from '../../data/portfolio';
import './Achievements.css';

/* ── Interactive 3D Achievement Card ── */
function AchievementCard3D({ item }) {
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
      className={`achievement-3d-card ${isHovered ? 'achievement-3d-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 30 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Specular Sheen */}
      <div
        className="achievement-3d-sheen"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(251, 191, 36, 0.15) 0%, rgba(96, 165, 250, 0.06) 45%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Ambient Glow */}
      <div className="achievement-3d-glow" aria-hidden="true" />

      {/* 3D Elevated Interior */}
      <div className="achievement-3d-inner">
        {/* Award Trophy Emblem */}
        <div className="achievement-emblem-wrap">
          <div className="achievement-emblem-halo" aria-hidden="true" />
          <div className="achievement-emblem-icon">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
              <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
              <path d="M12 2v20" />
              <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
            </svg>
          </div>
        </div>

        {/* Badges strip */}
        <div className="achievement-badges">
          <span className="achievement-badge-gold">
            <span className="achievement-badge-star">★</span> {item.badge || 'Regional 1st Place'}
          </span>
          <span className="achievement-badge-category">
            {item.category || 'Scientific Innovation'}
          </span>
        </div>

        {/* Main Title & Award */}
        <h3 className="achievement-main-title">{item.title}</h3>
        <p className="achievement-award-rank">{item.award}</p>

        {/* Description */}
        <p className="achievement-main-desc">{item.description}</p>

        {/* Verified Indicator Footer */}
        <div className="achievement-footer">
          <div className="achievement-verified-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Verified Regional Distinction</span>
          </div>
          <span className="achievement-tagline">Excellence in Scientific Methodology</span>
        </div>
      </div>
    </motion.article>
  );
}

export default function Achievements() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const achievement = achievements[0];

  return (
    <section id="achievements" className="section achievements-section" ref={sectionRef}>
      <div className="achievements-container">
        {/* Section Header */}
        <motion.header
          className="achievements-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">05 — Honors & Recognition</p>
          <h2 className="section-title">
            Awards & <em>Distinctions</em>
          </h2>
        </motion.header>

        {/* Interactive 3D Showcase Card */}
        <div className="achievements-showcase">
          <AchievementCard3D item={achievement} />
        </div>
      </div>
    </section>
  );
}
