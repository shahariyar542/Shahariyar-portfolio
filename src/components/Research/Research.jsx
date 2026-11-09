import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { researchInterests } from '../../data/portfolio';
import './Research.css';

// 4 Distinct coordinated accent color systems
const researchColorThemes = [
  {
    name: 'Electric Blue',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    glow: 'rgba(59, 130, 246, 0.28)',
    border: 'rgba(59, 130, 246, 0.45)',
    bg: 'rgba(59, 130, 246, 0.08)',
    sheen: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.22) 0%, transparent 70%)',
  },
  {
    name: 'Cyan',
    primary: '#06B6D4',
    secondary: '#22D3EE',
    glow: 'rgba(34, 211, 238, 0.28)',
    border: 'rgba(34, 211, 238, 0.45)',
    bg: 'rgba(34, 211, 238, 0.08)',
    sheen: 'radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.22) 0%, transparent 70%)',
  },
  {
    name: 'Violet',
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    glow: 'rgba(139, 92, 246, 0.28)',
    border: 'rgba(139, 92, 246, 0.45)',
    bg: 'rgba(139, 92, 246, 0.08)',
    sheen: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.22) 0%, transparent 70%)',
  },
  {
    name: 'Emerald',
    primary: '#10B981',
    secondary: '#34D399',
    glow: 'rgba(16, 185, 129, 0.28)',
    border: 'rgba(16, 185, 129, 0.45)',
    bg: 'rgba(16, 185, 129, 0.08)',
    sheen: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
  },
];

export default function Research() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: '-80px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const totalCards = researchInterests.length;

  // Active theme based on current card index
  const activeTheme = useMemo(
    () => researchColorThemes[activeIndex % researchColorThemes.length],
    [activeIndex]
  );

  const nextCard = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const prevCard = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  const goToCard = useCallback(
    (index) => {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex]
  );

  // Automatic rotation every 2 seconds (2000ms), paused on hover or when out of view
  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || isPaused || !isInView) return;

    const timer = setInterval(() => {
      nextCard();
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, isInView, nextCard]);

  // Framer motion 3D slide-and-rotate variants
  const cardVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 140 : -140,
      y: 0,
      rotateY: dir > 0 ? 32 : -32,
      scale: 0.88,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      y: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -140 : 140,
      y: 0,
      rotateY: dir > 0 ? -32 : 32,
      scale: 0.88,
      opacity: 0,
      filter: 'blur(4px)',
      transition: {
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const activeInterest = researchInterests[activeIndex];

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
            Research &amp; <em>Exploration</em>
          </h2>
        </motion.header>

        {/* ── 3D Auto-Rotating Carousel Stage ── */}
        <div
          className="research-carousel-stage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          role="region"
          aria-label="3D Research card showcase"
        >
          {/* Dynamic Ambient Color Aura */}
          <div
            className="research-dynamic-aura"
            style={{
              background: `radial-gradient(circle, ${activeTheme.glow} 0%, transparent 68%)`,
            }}
            aria-hidden="true"
          />

          {/* 3D Perspective Card Stage */}
          <div className="research-3d-viewport">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.article
                key={activeIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="research-active-3d-card"
                style={{
                  borderColor: activeTheme.border,
                  boxShadow: `0 16px 40px rgba(0, 0, 0, 0.5), 0 0 35px ${activeTheme.glow}`,
                }}
              >
                {/* Dynamic Specular Sheen */}
                <div
                  className="research-card-sheen"
                  style={{ background: activeTheme.sheen }}
                  aria-hidden="true"
                />

                {/* Card Interior */}
                <div className="research-card-inner">
                  {/* Top Bar with Icon & Tag */}
                  <div className="research-card-topbar">
                    <div
                      className="research-card-iconbox"
                      style={{
                        backgroundColor: activeTheme.bg,
                        borderColor: activeTheme.border,
                        color: activeTheme.secondary,
                      }}
                    >
                      <span className="research-glyph">{activeInterest.icon}</span>
                    </div>

                    <div className="research-card-badges">
                      <span
                        className="research-topic-tag"
                        style={{
                          color: '#FFFFFF',
                          borderColor: activeTheme.border,
                          backgroundColor: activeTheme.bg,
                        }}
                      >
                        {activeInterest.tag}
                      </span>
                    </div>
                  </div>

                  {/* Domain Index */}
                  <span
                    className="research-domain-index"
                    style={{ color: activeTheme.secondary }}
                  >
                    INVESTIGATION 0{activeIndex + 1}
                  </span>

                  {/* Title */}
                  <h3 className="research-card-heading">{activeInterest.title}</h3>

                  {/* Description */}
                  <p className="research-card-body">{activeInterest.description}</p>

                  {/* Bottom Metagroup */}
                  <div className="research-card-footer">
                    <span className="research-status-cue">
                      <span
                        className="research-status-dot"
                        style={{
                          backgroundColor: activeTheme.secondary,
                          boxShadow: `0 0 8px ${activeTheme.secondary}`,
                        }}
                      />
                      Active Theoretical Exploration
                    </span>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* ── Carousel Controls & Progress Bar ── */}
          <div className="research-controls-wrap">
            {/* Prev Button */}
            <button
              type="button"
              className="research-nav-arrow"
              onClick={prevCard}
              aria-label="Previous Research Domain"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Navigation Dots with coordinated theme colors */}
            <div className="research-nav-indicators" aria-label="Research domain indicators">
              {researchInterests.map((interest, i) => {
                const isActive = activeIndex === i;
                const theme = researchColorThemes[i % researchColorThemes.length];
                return (
                  <button
                    key={interest.title}
                    type="button"
                    className={`research-indicator-dot ${isActive ? 'research-indicator-dot--active' : ''}`}
                    onClick={() => goToCard(i)}
                    aria-label={`Jump to ${interest.title}`}
                    style={{
                      '--dot-accent': theme.secondary,
                    }}
                  >
                    <span className="indicator-dot-inner" />
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              className="research-nav-arrow"
              onClick={nextCard}
              aria-label="Next Research Domain"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* 2-Second Timer Progress Bar (Internal) */}
            <div className="research-timer-bar" aria-hidden="true">
              <div
                key={activeIndex}
                className={`research-timer-fill ${isPaused ? 'research-timer-fill--paused' : ''}`}
                style={{
                  backgroundColor: activeTheme.secondary,
                  boxShadow: `0 0 10px ${activeTheme.secondary}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Future Growth Note */}
        <motion.aside
          className="research-note"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Future research note"
        >
          <p className="research-note-text">
            <span className="research-note-icon" aria-hidden="true">✦</span>
            This research corridor expands dynamically with peer-reviewed publications, algorithmic whitepapers, and collaborative laboratory inquiries as academic investigations advance.
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
