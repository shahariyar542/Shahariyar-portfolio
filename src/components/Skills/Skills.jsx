import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '../../data/portfolio.js';
import './Skills.css';

const categoryKeys = Object.keys(skills);

const proficiencyColorMap = {
  'Daily Driver': {
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.14)',
    border: 'rgba(59, 130, 246, 0.35)',
  },
  'Learning & Building': {
    color: '#22D3EE',
    bg: 'rgba(34, 211, 238, 0.14)',
    border: 'rgba(34, 211, 238, 0.35)',
  },
  'Exploring & Learning': {
    color: '#60A5FA',
    bg: 'rgba(96, 165, 250, 0.14)',
    border: 'rgba(96, 165, 250, 0.35)',
  },
  'Comfortable': {
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.35)',
  },
  'Working Knowledge': {
    color: '#A5B4FC',
    bg: 'rgba(165, 180, 252, 0.14)',
    border: 'rgba(165, 180, 252, 0.35)',
  },
  'Academic Foundation': {
    color: '#CBD5E1',
    bg: 'rgba(203, 213, 225, 0.08)',
    border: 'rgba(203, 213, 225, 0.22)',
  },
};

export default function Skills() {
  const sectionRef = useRef(null);
  const orbitContainerRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: '-60px' });

  const categories = useMemo(() => categoryKeys.map((k) => skills[k]), []);
  const totalCards = categories.length; // 5

  const [angle, setAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [orbitRadii, setOrbitRadii] = useState({ rx: 420, rz: 420 });
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // Touch tracking refs
  const touchStartRef = useRef(0);
  const angleAtTouchStartRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Speed: rotates smoothly from right to left (negative angle increment)
  const ROTATION_SPEED = 0.22; // degrees per frame

  // Compute intelligently responsive orbit radius:
  // On mobile, use elliptical orbit (compressed X-spread) so cards never clip horizontally
  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      if (w < 380) {
        setOrbitRadii({ rx: 24, rz: 120 });
        setIsMobile(true);
      } else if (w < 480) {
        setOrbitRadii({ rx: 36, rz: 135 });
        setIsMobile(true);
      } else if (w < 640) {
        setOrbitRadii({ rx: 48, rz: 150 });
        setIsMobile(true);
      } else if (w <= 768) {
        setOrbitRadii({ rx: 110, rz: 210 });
        setIsMobile(true);
      } else if (w < 1024) {
        setOrbitRadii({ rx: 210, rz: 260 });
        setIsMobile(false);
      } else if (w < 1366) {
        setOrbitRadii({ rx: 320, rz: 340 });
        setIsMobile(false);
      } else {
        setOrbitRadii({ rx: 400, rz: 400 });
        setIsMobile(false);
      }
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Animation loop with requestAnimationFrame
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !isAutoRotate) return;

    let animId;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const delta = (currentTime - lastTime) / 16.666; // normalize to 60fps
      lastTime = currentTime;

      if (!isHovered && !isDraggingRef.current && isInView) {
        setAngle((prev) => (prev - ROTATION_SPEED * Math.min(delta, 2)) % 360);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, isInView, isAutoRotate]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
    angleAtTouchStartRef.current = angle;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartRef.current;
    // 0.4 deg per pixel drag
    setAngle(angleAtTouchStartRef.current + diff * 0.4);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Step rotation manually
  const rotateStep = useCallback(
    (direction) => {
      const step = 360 / totalCards;
      setAngle((prev) => prev + direction * step);
    },
    [totalCards]
  );

  const jumpToCard = useCallback(
    (index) => {
      const targetAngle = -(index * (360 / totalCards));
      setAngle(targetAngle);
    },
    [totalCards]
  );

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
          Skills &amp; <em>Competencies</em>
        </motion.h2>

        {/* ── 3D Orbit Viewport ── */}
        <div
          className="skills-orbit-viewport"
          ref={orbitContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setHoveredCardIndex(null);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="3D Skills Orbiting Carousel"
        >
          {/* Central Holographic Core */}
          <div className="skills-orbit-nucleus" aria-hidden="true">
            <div className="nucleus-ring nucleus-ring--outer" />
            <div className="nucleus-ring nucleus-ring--inner" />
            <div className="nucleus-orb">
              <span className="nucleus-glyph">✦</span>
              <span className="nucleus-text">AI CORE</span>
            </div>
          </div>

          {/* Orbit Track Rings in 3D Perspective */}
          <div className="skills-orbit-floor" aria-hidden="true">
            <div
              className="skills-orbit-ring"
              style={{
                width: `${orbitRadii.rx * 2 + 80}px`,
                height: `${orbitRadii.rz * 2 + 80}px`,
              }}
            />
          </div>

          {/* 3D Orbit Stage */}
          <div className="skills-orbit-stage">
            {categories.map((category, i) => {
              const baseAngle = i * (360 / totalCards);
              const currentAngle = (baseAngle + angle) % 360;
              const rad = (currentAngle * Math.PI) / 180;

              // Responsive 3D coordinates in orbit:
              const x = Math.sin(rad) * orbitRadii.rx;
              const z = Math.cos(rad) * orbitRadii.rz;

              // Normalized depth factor from 0 (back) to 1 (front)
              const zNorm = (Math.cos(rad) + 1) / 2;

              // Scale: on mobile, subtle scaling keeps back cards legible and prevents viewport clipping
              let scale = isMobile ? 0.70 + zNorm * 0.16 : 0.72 + zNorm * 0.34;
              let opacity = 0.36 + zNorm * 0.64;
              let brightness = 0.65 + zNorm * 0.45;

              // Face angle: reduced on mobile so front card faces viewer directly
              const rotateY = -currentAngle * (isMobile ? 0.12 : 0.32);

              const isThisCardHovered = hoveredCardIndex === i;
              if (isThisCardHovered) {
                scale += 0.05;
                opacity = 1;
                brightness = 1.15;
              }

              const zIndex = Math.round(zNorm * 100) + (isThisCardHovered ? 50 : 0);

              return (
                <article
                  key={category.label}
                  className={`skills-orbit-card ${isThisCardHovered ? 'skills-orbit-card--hovered' : ''}`}
                  style={{
                    transform: `translate3d(${x}px, 0px, ${z + (isThisCardHovered ? 35 : 0)}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    filter: `brightness(${brightness})`,
                  }}
                  onMouseEnter={() => setHoveredCardIndex(i)}
                  onMouseLeave={() => setHoveredCardIndex(null)}
                >
                  {/* Subtle dynamic sheen */}
                  <div className="skills-card-sheen" aria-hidden="true" />
                  <div className="skills-card-glow-border" aria-hidden="true" />

                  {/* Card Interior */}
                  <div className="skills-card-inner">
                    <header className="skills-card-head">
                      <div className="skills-card-icon-box">
                        <span className="skills-card-glyph">{category.icon}</span>
                      </div>
                      <div className="skills-card-head-meta">
                        <span className="skills-card-index">DOMAIN 0{i + 1}</span>
                        <h3 className="skills-card-heading">{category.label}</h3>
                      </div>
                    </header>

                    <p className="skills-card-summary">{category.description}</p>

                    <div className="skills-card-pill-list">
                      {category.items.map((skill) => {
                        const levelConfig = proficiencyColorMap[skill.level] || {
                          color: '#CBD5E1',
                          bg: 'rgba(203, 213, 225, 0.08)',
                          border: 'rgba(203, 213, 225, 0.2)',
                        };

                        return (
                          <div
                            key={skill.name}
                            className={`skills-pill-item ${skill.highlight ? 'skills-pill-item--highlight' : ''}`}
                          >
                            <div className="skills-pill-main">
                              <span className="skills-pill-dot" aria-hidden="true" />
                              <span className="skills-pill-name">{skill.name}</span>
                              {skill.highlight && (
                                <span className="skills-pill-star" title="Core Focus">
                                  ★
                                </span>
                              )}
                            </div>
                            <span
                              className="skills-pill-level"
                              style={{
                                color: levelConfig.color,
                                backgroundColor: levelConfig.bg,
                                borderColor: levelConfig.border,
                              }}
                            >
                              {skill.level}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Orbit Navigation & Controls Bar */}
          <div className="skills-orbit-controls" aria-label="Orbit controls">
            <button
              type="button"
              className="orbit-nav-btn"
              onClick={() => rotateStep(1)}
              aria-label="Rotate Orbit Right"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Orbit Waypoints / Indicators */}
            <div className="orbit-indicators">
              {categories.map((c, i) => {
                const baseAngle = i * (360 / totalCards);
                const currentAngle = (baseAngle + angle) % 360;
                const rad = (currentAngle * Math.PI) / 180;
                const isClosest = Math.cos(rad) > 0.8;

                return (
                  <button
                    key={c.label}
                    type="button"
                    className={`orbit-dot ${isClosest ? 'orbit-dot--active' : ''}`}
                    onClick={() => jumpToCard(i)}
                    aria-label={`Jump to ${c.label}`}
                  >
                    <span className="orbit-dot-fill" />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="orbit-nav-btn"
              onClick={() => rotateStep(-1)}
              aria-label="Rotate Orbit Left"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Play/Pause Toggle */}
            <button
              type="button"
              className={`orbit-toggle-btn ${isAutoRotate ? 'orbit-toggle-btn--playing' : ''}`}
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              aria-label={isAutoRotate ? 'Pause 3D Orbit' : 'Resume 3D Orbit'}
              title={isAutoRotate ? 'Pause Orbit' : 'Resume Orbit'}
            >
              {isAutoRotate ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
