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
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease, delay },
  },
});

const slideReveal = (delay = 0) => ({
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.75, ease, delay },
  },
});

const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.75, ease, delay },
  },
});

export default function Hero() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  /* Mouse parallax */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 100, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const photoX = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  const photoY = useTransform(smoothMouseY, [-0.5, 0.5], [-8, 8]);

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
      {/* Interactive 3D WebGL Canvas */}
      <ThreeHeroCanvas />

      <div className="hero-inner">
        {/* ── LEFT: Typography & Clear Hierarchy ── */}
        <div className="hero-content">
          {/* Status Badge */}
          <motion.div
            className="hero-badge"
            variants={fadeUp(0)}
            initial="hidden"
            animate={animateState}
          >
            <span className="hero-badge-dot" />
            <span className="hero-badge-text">Available for AI &amp; Engineering Projects</span>
          </motion.div>

          {/* Subheading Greeting */}
          <motion.div
            className="hero-greeting"
            variants={fadeUp(0.1)}
            initial="hidden"
            animate={animateState}
          >
            <span className="hero-greeting-icon" aria-hidden="true">◈</span>
            <span className="hero-greeting-text">HELLO, I AM</span>
          </motion.div>

          {/* Large Name */}
          <div className="hero-name-wrapper">
            <motion.h1
              className="hero-name"
              variants={slideReveal(0.2)}
              initial="hidden"
              animate={animateState}
            >
              Shahariyar Khan Rashad<span className="hero-dot">.</span>
            </motion.h1>
          </div>

          {/* Professional Title */}
          <motion.h2
            className="hero-title"
            variants={fadeUp(0.35)}
            initial="hidden"
            animate={animateState}
          >
            Software Engineering Student <span className="hero-title-separator">/</span>{' '}
            <span className="hero-title-highlight">Aspiring AI Engineer</span>
          </motion.h2>

          {/* Description — high contrast body text */}
          <motion.p
            className="hero-description"
            variants={fadeUp(0.48)}
            initial="hidden"
            animate={animateState}
          >
            Focused on building intelligent software systems, machine learning architectures, and data-driven solutions at Daffodil International University.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-actions"
            variants={fadeUp(0.6)}
            initial="hidden"
            animate={animateState}
          >
            <button
              className="btn btn-primary"
              onClick={() => scrollToSection('projects')}
              type="button"
            >
              <span>Explore Projects</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <a
              href="/Shahariyar_Khan_Rashad_CV.pdf"
              download="Shahariyar_Khan_Rashad_CV.pdf"
              className="btn btn-accent"
              aria-label="Download Professional CV"
            >
              <span>Download CV</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>

            <button
              className="btn btn-secondary"
              onClick={() => scrollToSection('contact')}
              type="button"
            >
              <span>Contact Me</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT: Profile Image in Premium Circular White Glow Presentation ── */}
        <motion.div
          className="hero-visual"
          variants={scaleIn(0.35)}
          initial="hidden"
          animate={animateState}
        >
          <motion.div
            className="hero-profile-container"
            style={{ x: photoX, y: photoY }}
          >
            {/* Soft white ambient radial glow */}
            <div className="hero-profile-glow" aria-hidden="true" />
            <div className="hero-profile-glow-ambient" aria-hidden="true" />
            
            {/* Subtle animated circular light rings */}
            <div className="hero-profile-ring" aria-hidden="true" />
            <div className="hero-profile-ring-outer" aria-hidden="true" />

            {/* Perfectly circular image frame */}
            <div className="hero-profile-frame">
              <img
                className="hero-profile-img"
                src={personalInfo.profileImage}
                alt={personalInfo.fullName}
                loading="eager"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Clean Scroll Cue */}
      <div
        className="hero-scroll-cue"
        onClick={() => scrollToSection('about')}
        role="button"
        tabIndex={0}
        aria-label="Scroll to content"
      >
        <span className="hero-scroll-mouse">
          <span className="hero-scroll-wheel" />
        </span>
        <span className="hero-scroll-text">EXPLORE</span>
      </div>
    </section>
  );
}
