import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { educationData } from '../../data/portfolio.js';
import SectionHeader from '../SectionHeader/SectionHeader';
import './Education.css';

const glyphMap = {
  university: '◈',
  college: '◇',
  school: '○',
};

export default function Education() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const switcherBarRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [blinkKey, setBlinkKey] = useState(0);
  const tabRefs = useRef([]);

  // Snappy auto-cycle through milestones every 2.3s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % educationData.length);
      setBlinkKey((k) => k + 1);
    }, 2300);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Keep switcher bar container horizontally aligned on mobile (NEVER scrolls page window!)
  useEffect(() => {
    const container = switcherBarRef.current;
    const el = tabRefs.current[activeIndex];
    if (container && el && container.scrollWidth > container.clientWidth) {
      const scrollLeft = el.offsetLeft - (container.clientWidth / 2) + (el.clientWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeIndex]);

  const handleSelect = (idx) => {
    if (idx === activeIndex) return;
    setActiveIndex(idx);
    setBlinkKey((k) => k + 1);
  };

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    setMousePos({ x: xPct, y: yPct });

    const tiltX = ((y / rect.height) - 0.5) * -8;
    const tiltY = ((x / rect.width) - 0.5) * 8;
    setTilt({ x: tiltX, y: tiltY });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPaused(false);
    setTilt({ x: 0, y: 0 });
  };

  const currentItem = educationData[activeIndex];

  return (
    <section id="education" className="education section" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <SectionHeader
          theme="education"
          badgeText="Academic Foundation"
          title="Formal"
          highlightWord="Education"
          subtitle="Building rigorous foundations, strengthening computational fundamentals, and growing through disciplined continuous learning."
          align="center"
        />

        {/* ── Interactive 3D Flipper Deck Container ── */}
        <div className="education-flipper-container">
          {/* Milestone Switcher Pills */}
          <div ref={switcherBarRef} className="education-switcher-bar" role="tablist" aria-label="Education Milestones">
            {educationData.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  ref={(el) => (tabRefs.current[idx] = el)}
                  role="tab"
                  aria-selected={isActive}
                  className={`education-switcher-tab ${isActive ? 'education-switcher-tab--active' : ''}`}
                  onClick={() => handleSelect(idx)}
                  type="button"
                  style={{
                    color: isActive ? item.accentColor : undefined,
                  }}
                >
                  <span className="education-tab-glyph" style={{ color: item.accentColor }}>
                    {glyphMap[item.badgeType] || '◈'}
                  </span>
                  <span className="education-tab-text education-tab-text--desktop">{item.level}</span>
                  <span className="education-tab-text education-tab-text--mobile">{item.shortLevel || item.level}</span>
                  {isActive && (
                    <motion.span
                      className="education-tab-indicator"
                      layoutId="educationTabIndicator"
                      style={{
                        borderColor: item.borderColor,
                        boxShadow: `0 0 16px ${item.glowColor}`,
                      }}
                      transition={{ type: 'spring', damping: 26, stiffness: 380 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Unified 3D Stage with Top-Hinged Blink Flip & Rich Deep Glow Color */}
          <div
            ref={cardRef}
            className={`education-3d-stage ${isHovered ? 'education-3d-stage--hovered' : ''} ${currentItem.themeClass}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              borderColor: currentItem.borderColor,
              boxShadow: isHovered ? currentItem.deepGlowHover : currentItem.deepGlow,
            }}
          >
            {/* Specular Sheen matched to active card's glow color */}
            <div
              className="education-3d-sheen"
              style={{
                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${currentItem.glowColor} 0%, transparent 68%)`,
                opacity: isHovered ? 0.35 : 0.12,
              }}
              aria-hidden="true"
            />

            {/* Glowing Border Frame */}
            <div
              className="education-3d-glow"
              style={{
                borderColor: currentItem.borderColor,
                boxShadow: `0 0 20px ${currentItem.glowColor}`,
              }}
              aria-hidden="true"
            />

            {/* Snappy 3D Top Flip Animation Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                className="education-flip-card"
                initial={{ rotateX: -80, opacity: 0.15, scale: 0.98, filter: 'brightness(1.4)' }}
                animate={{ rotateX: 0, opacity: 1, scale: 1, filter: 'brightness(1)' }}
                exit={{ rotateX: 75, opacity: 0, scale: 0.98, filter: 'brightness(0.7)' }}
                transition={{ duration: 0.20, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Instant Cyber Blink Flash overlay */}
                <div
                  key={`flash-${blinkKey}`}
                  className="education-blink-flash"
                  style={{
                    background: `linear-gradient(to bottom, ${currentItem.glowColor} 0%, rgba(255, 255, 255, 0.2) 20%, transparent 80%)`,
                  }}
                  aria-hidden="true"
                />

                <div className="education-card-inner">
                  {/* Left Indicator Column */}
                  <div className="education-indicator-col">
                    <div
                      className="education-icon-box"
                      style={{
                        borderColor: currentItem.borderColor,
                        background: `${currentItem.accentColor}18`,
                        boxShadow: `0 0 16px ${currentItem.glowColor}`,
                      }}
                    >
                      <span className="education-glyph" style={{ color: currentItem.accentColor }}>
                        {glyphMap[currentItem.badgeType] || '◈'}
                      </span>
                    </div>
                    <div
                      className="education-rule-line"
                      style={{
                        background: `linear-gradient(to bottom, ${currentItem.accentColor} 0%, transparent 100%)`,
                      }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="education-body">
                    <div className="education-meta-strip">
                      <span
                        className="education-status-tag"
                        style={{
                          borderColor: currentItem.borderColor,
                          color: currentItem.accentColor,
                          background: `${currentItem.accentColor}15`,
                        }}
                      >
                        {currentItem.level}
                      </span>

                      {/* Render badge only if present (prevents duplicate GPA 5.00 pill) */}
                      {currentItem.badge && (
                        <span className="education-badge-pill">
                          {currentItem.badge}
                        </span>
                      )}

                      {/* Single clean status pill */}
                      <span
                        className="education-period-tag"
                        style={{
                          color: currentItem.accentColor,
                          borderColor: currentItem.borderColor,
                          background: `${currentItem.accentColor}10`,
                          fontWeight: 600,
                        }}
                      >
                        {currentItem.status}
                      </span>
                    </div>

                    <h3 className="education-institution">{currentItem.institution}</h3>
                    <h4 className="education-degree-title" style={{ color: currentItem.accentColor }}>
                      {currentItem.degree}
                    </h4>
                    <p className="education-department">{currentItem.department}</p>

                    <div
                      className="education-editorial-quote"
                      style={{ borderLeftColor: currentItem.accentColor }}
                    >
                      &ldquo;{currentItem.quote}&rdquo;
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Cyber Progress Dots */}
            <div className="education-dots-nav">
              {educationData.map((dotItem, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  aria-label={`Switch to milestone ${dotIdx + 1}`}
                  className={`education-dot-pill ${dotIdx === activeIndex ? 'education-dot-pill--active' : ''}`}
                  onClick={() => handleSelect(dotIdx)}
                  style={{
                    background: dotIdx === activeIndex ? dotItem.accentColor : undefined,
                    boxShadow: dotIdx === activeIndex ? `0 0 12px ${dotItem.glowColor}` : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
