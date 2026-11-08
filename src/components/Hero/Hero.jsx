import { useCallback, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';
import { personalInfo } from '../../data/portfolio';
import ThreeHeroCanvas from '../ThreeCanvas/ThreeHeroCanvas';
import './Hero.css';

const ease = [0.16, 1, 0.3, 1];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay },
  },
});

const slideReveal = (delay = 0) => ({
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.85, ease, delay },
  },
});

const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.85, ease, delay },
  },
});

/* ── Scroll indicator pulsing ── */
const scrollLinePulse = {
  initial: { scaleY: 0 },
  animate: {
    scaleY: [0, 1, 0],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: [0.65, 0, 0.35, 1],
    },
  },
};

export default function Hero() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  /* ── Mouse parallax ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 100, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const photoX = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);
  const photoY = useTransform(smoothMouseY, [-0.5, 0.5], [-12, 12]);
  const badgeX = useTransform(smoothMouseX, [-0.5, 0.5], [16, -16]);
  const badgeY = useTransform(smoothMouseY, [-0.5, 0.5], [16, -16]);

  const handleMouseMove = useCallback(
    (e) => {
      if (window.innerWidth < 1024) return;
      const { clientX, clientY, currentTarget } = e;
      const rect = currentTarget.getBoundingClientRect();
      const xRatio = (clientX - rect.left) / rect.width - 0.5;
      const yRatio = (clientY - rect.top) / rect.height - 0.5;
      mouseX.set(xRatio);
      mouseY.set(yRatio);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const animateState = isInView ? 'visible' : 'hidden';

  return (
    <section
      id="home"
      className="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Interactive 3D WebGL Canvas ── */}
      <ThreeHeroCanvas />

      {/* Subtle tech background glow */}
      <div className="hero-glow-layer" aria-hidden="true" />

      <div className="hero-inner">
        {/* ── LEFT: Typography & Identity ── */}
        <div className="hero-content">
          {/* Status Badge */}
          <motion.div
            className="hero-status-pill"
            variants={fadeUp(0)}
            initial="hidden"
            animate={animateState}
          >
            <span className="hero-status-dot" />
            <span className="hero-status-text">AI & Software Engineering</span>
          </motion.div>

          {/* Subheading greeting */}
          <motion.p
            className="hero-greeting"
            variants={fadeUp(0.12)}
            initial="hidden"
            animate={animateState}
          >
            HELLO, I&rsquo;M
          </motion.p>

          {/* Full Name presentation */}
          <div className="hero-name-wrapper">
            <motion.h1
              className="hero-name"
              variants={slideReveal(0.24)}
              initial="hidden"
              animate={animateState}
            >
              Shahariyar Khan Rashad
              <span className="hero-name-dot">.</span>
            </motion.h1>
          </div>

          {/* Subtitle required: Software Engineering Student | Aspiring AI Engineer */}
          <motion.h2
            className="hero-subtitle"
            variants={fadeUp(0.4)}
            initial="hidden"
            animate={animateState}
          >
            Software Engineering Student <span className="hero-subtitle-divider">|</span>{' '}
            <span className="hero-subtitle-accent">Aspiring AI Engineer</span>
          </motion.h2>

          {/* Supporting description */}
          <motion.p
            className="hero-description"
            variants={fadeUp(0.55)}
            initial="hidden"
            animate={animateState}
          >
            Engineering next-generation intelligent systems, exploring predictive architectures,
            machine learning models, and human-centric digital experiences.
          </motion.p>

          {/* Professional CTA buttons */}
          <motion.div
            className="hero-buttons"
            variants={fadeUp(0.7)}
            initial="hidden"
            animate={animateState}
          >
            <button
              className="hero-btn hero-btn--primary"
              onClick={() => scrollToSection('projects')}
              type="button"
            >
              <span>Explore Projects</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              className="hero-btn hero-btn--outline"
              onClick={() => scrollToSection('contact')}
              type="button"
            >
              <span>Contact Me</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT: Profile Image in Futuristic Geometric Presentation ── */}
        <motion.div
          className="hero-visual"
          variants={scaleIn(0.4)}
          initial="hidden"
          animate={animateState}
        >
          {/* Cyber Ring Decor */}
          <div className="hero-cyber-ring" aria-hidden="true" />
          <div className="hero-cyber-ring-outer" aria-hidden="true" />

          {/* Photo frame with mouse parallax */}
          <motion.div
            className="hero-photo-wrapper"
            style={{ x: photoX, y: photoY }}
          >
            <div className="hero-photo-glass-halo" />
            <img
              className="hero-photo"
              src={personalInfo.profileImage}
              alt={`Portrait of ${personalInfo.fullName}`}
              loading="eager"
            />
          </motion.div>

          {/* Floating Cyber Badge */}
          <motion.div
            className="hero-floating-badge"
            style={{ x: badgeX, y: badgeY }}
          >
            <span className="hero-badge-icon">⚡</span>
            <div className="hero-badge-text">
              <span className="hero-badge-title">IRIS Active</span>
              <span className="hero-badge-caption">AI Companion Online</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        className="hero-scroll"
        variants={fadeUp(1.0)}
        initial="hidden"
        animate={animateState}
        onClick={() => scrollToSection('about')}
        role="button"
        tabIndex={0}
        aria-label="Scroll to explore"
      >
        <div className="hero-scroll-line-track">
          <motion.div
            className="hero-scroll-line"
            variants={scrollLinePulse}
            initial="initial"
            animate="animate"
          />
        </div>
        <span className="hero-scroll-text">SCROLL TO EXPLORE</span>
      </motion.div>
    </section>
  );
}
