import { useEffect, useCallback, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';
import { personalInfo } from '../../data/portfolio';
import './Hero.css';

/* ── Ease helper ── */
const ease = [0.16, 1, 0.3, 1];

/* ── Animation variants ── */
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
    transition: { duration: 0.8, ease, delay },
  },
});

const fadeRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease, delay },
  },
});

const decorFloat = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease, delay },
  },
});

/* ── Scroll indicator pulsing ── */
const scrollLinePulse = {
  initial: { scaleY: 0 },
  animate: {
    scaleY: [0, 1, 0],
    transition: {
      duration: 2,
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
  const springConfig = { damping: 30, stiffness: 120, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  /* Transform ranges for parallax — subtle, max ±15px */
  const paraX1 = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);
  const paraY1 = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10]);
  const paraX2 = useTransform(smoothMouseX, [-0.5, 0.5], [8, -8]);
  const paraY2 = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const paraX3 = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);
  const paraY3 = useTransform(smoothMouseY, [-0.5, 0.5], [-15, 15]);
  const photoX = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6]);
  const photoY = useTransform(smoothMouseY, [-0.5, 0.5], [-6, 6]);

  /* ── Track mouse for parallax ── */
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

  /* ── Reset mouse on leave ── */
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  /* ── Scroll handlers ── */
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
      <div className="hero-inner">
        {/* ── LEFT: Typography ── */}
        <div className="hero-content">
          {/* Label */}
          <motion.p
            className="hero-label"
            variants={fadeUp(0)}
            initial="hidden"
            animate={animateState}
          >
            PORTFOLIO — 2026
          </motion.p>

          {/* Greeting */}
          <motion.h2
            className="hero-greeting"
            variants={fadeUp(0.15)}
            initial="hidden"
            animate={animateState}
          >
            HELLO, I&rsquo;M
          </motion.h2>

          {/* Name reveal */}
          <div className="hero-name-wrapper">
            <motion.h1
              className="hero-name"
              variants={slideReveal(0.3)}
              initial="hidden"
              animate={animateState}
            >
              {personalInfo.firstName.toUpperCase()}
              <span className="hero-name-dot">.</span>
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            className="hero-description"
            variants={fadeUp(0.55)}
            initial="hidden"
            animate={animateState}
          >
            Software Engineering Student. Exploring the world of Artificial
            Intelligence, Software Engineering, and Creative Technology.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="hero-buttons"
            variants={fadeUp(0.7)}
            initial="hidden"
            animate={animateState}
          >
            <button
              className="hero-btn hero-btn--primary"
              onClick={() => scrollToSection('about')}
              type="button"
            >
              Explore My World
            </button>
            <button
              className="hero-btn hero-btn--outline"
              onClick={() => scrollToSection('contact')}
              type="button"
            >
              Let&rsquo;s Connect
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT: Visual ── */}
        <motion.div
          className="hero-visual"
          variants={fadeRight(0.5)}
          initial="hidden"
          animate={animateState}
        >
          {/* Background "S" */}
          <motion.span
            className="hero-letter-bg"
            style={{ x: paraX3, y: paraY3 }}
            aria-hidden="true"
          >
            S
          </motion.span>

          {/* Photo with parallax */}
          <motion.div
            className="hero-photo-wrapper"
            style={{ x: photoX, y: photoY }}
          >
            {/* Corner accents */}
            <span
              className="hero-photo-accent hero-photo-accent--tl"
              aria-hidden="true"
            />
            <span
              className="hero-photo-accent hero-photo-accent--br"
              aria-hidden="true"
            />

            <img
              className="hero-photo"
              src={personalInfo.profileImage}
              alt={`Portrait of ${personalInfo.fullName}`}
              loading="eager"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Floating Decorations ── */}
      <motion.div
        className="hero-decor hero-decor--1"
        style={{ x: paraX1, y: paraY1 }}
        variants={decorFloat(0.8)}
        initial="hidden"
        animate={animateState}
        aria-hidden="true"
      >
        <div className="hero-decor-circle" />
      </motion.div>

      <motion.div
        className="hero-decor hero-decor--2"
        style={{ x: paraX2, y: paraY2 }}
        variants={decorFloat(0.9)}
        initial="hidden"
        animate={animateState}
        aria-hidden="true"
      >
        <div className="hero-decor-circle hero-decor-circle--lg" />
      </motion.div>

      <motion.div
        className="hero-decor hero-decor--3"
        style={{ x: paraX1, y: paraY2 }}
        variants={decorFloat(1.0)}
        initial="hidden"
        animate={animateState}
        aria-hidden="true"
      >
        <div className="hero-decor-line" />
      </motion.div>

      <motion.div
        className="hero-decor hero-decor--4"
        style={{ x: paraX2, y: paraY1 }}
        variants={decorFloat(1.1)}
        initial="hidden"
        animate={animateState}
        aria-hidden="true"
      >
        <div className="hero-decor-line hero-decor-line--vertical" />
      </motion.div>

      <motion.div
        className="hero-decor hero-decor--5"
        style={{ x: paraX3, y: paraY2 }}
        variants={decorFloat(1.15)}
        initial="hidden"
        animate={animateState}
        aria-hidden="true"
      >
        <div className="hero-decor-circle" />
      </motion.div>

      <motion.div
        className="hero-decor hero-decor--6"
        style={{ x: paraX2, y: paraY1 }}
        variants={decorFloat(1.2)}
        initial="hidden"
        animate={animateState}
        aria-hidden="true"
      >
        <div className="hero-decor-circle hero-decor-circle--lg" />
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        className="hero-scroll"
        variants={fadeUp(1.3)}
        initial="hidden"
        animate={animateState}
      >
        <motion.div
          className="hero-scroll-line"
          variants={scrollLinePulse}
          initial="initial"
          animate="animate"
        />
        <span className="hero-scroll-text">Scroll to explore</span>
      </motion.div>
    </section>
  );
}
