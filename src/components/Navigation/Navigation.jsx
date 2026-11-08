import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems, socialLinks } from '../../data/portfolio';
import './Navigation.css';

/* ── Animation Variants ── */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1], delay: 0.15 },
  },
};

const linkContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
  exit: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const linkItemVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.25, ease: [0.65, 0, 0.35, 1] },
  },
};

const socialContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.5 },
  },
  exit: {},
};

const socialItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ── Social links config ── */
const socialEntries = [
  { key: 'github', label: 'GitHub', url: socialLinks.github },
  { key: 'linkedin', label: 'LinkedIn', url: socialLinks.linkedin },
  { key: 'facebook', label: 'Facebook', url: socialLinks.facebook },
  { key: 'email', label: 'Email', url: socialLinks.email },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  /* ── Scroll detection for top bar backdrop ── */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Intersection Observer for active section ── */
  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  /* ── Lock body scroll when menu open ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* ── Scroll to section ── */
  const scrollTo = useCallback(
    (id) => {
      setIsOpen(false);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    },
    []
  );

  /* ── Scroll to top ── */
  const scrollToTop = useCallback(() => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* ── Format number ── */
  const formatNum = (i) => String(i + 1).padStart(2, '0');

  return (
    <>
      {/* ── Top Bar ── */}
      <header
        className={`nav-topbar${isScrolled ? ' nav-topbar--scrolled' : ''}`}
        role="banner"
      >
        <a
          href="#home"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="Scroll to top"
        >
          S.
        </a>

        <button
          className={`nav-hamburger${isOpen ? ' nav-hamburger--open' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
        </button>
      </header>

      {/* ── Side Dots Navigation (desktop) ── */}
      <nav className="nav-dots" aria-label="Section navigation">
        {navItems.map((item) => (
          <div key={item.id} className="nav-dot-item">
            <span className="nav-dot-tooltip">{item.label}</span>
            <button
              className={`nav-dot-btn${activeSection === item.id ? ' nav-dot-btn--active' : ''}`}
              onClick={() => scrollTo(item.id)}
              aria-label={`Go to ${item.label}`}
              aria-current={activeSection === item.id ? 'true' : undefined}
            />
          </div>
        ))}
      </nav>

      {/* ── Full-Screen Menu Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="nav-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="nav-overlay"
            role="dialog"
            aria-label="Navigation menu"
          >
            <motion.nav
              className="nav-overlay-links"
              variants={linkContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className="nav-overlay-link"
                  variants={linkItemVariants}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item.id);
                  }}
                >
                  <span className="nav-overlay-link-number">
                    {formatNum(i)}
                  </span>
                  <span className="nav-overlay-link-label">{item.label}</span>
                </motion.a>
              ))}
            </motion.nav>

            <motion.div
              className="nav-overlay-socials"
              variants={socialContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {socialEntries.map((s) => (
                <motion.a
                  key={s.key}
                  href={s.url}
                  className="nav-overlay-social-link"
                  variants={socialItemVariants}
                  target={s.key !== 'email' ? '_blank' : undefined}
                  rel={s.key !== 'email' ? 'noopener noreferrer' : undefined}
                >
                  {s.label}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
