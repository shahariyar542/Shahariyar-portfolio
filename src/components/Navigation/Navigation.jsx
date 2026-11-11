import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems, socialLinks } from '../../data/portfolio';
import './Navigation.css';

/* ── Animation Variants ── */
const overlayVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.25, ease: [0.65, 0, 0.35, 1] },
  },
};

const linkContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const linkItemVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: { duration: 0.2, ease: [0.65, 0, 0.35, 1] },
  },
};

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

  /* ── Scroll detection for sticky bar styling ── */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
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
        { rootMargin: '-35% 0px -45% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  /* ── Lock body scroll when mobile menu open ── */
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
  const scrollTo = useCallback((id) => {
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  }, []);

  return (
    <>
      {/* ── Premium Sticky Navigation Bar ── */}
      <header
        className={`nav-topbar${isScrolled ? ' nav-topbar--scrolled' : ''}`}
        role="banner"
      >
        <div className="nav-topbar-inner">
          {/* Desktop Nav Links */}
          <nav className="nav-desktop-menu" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-desktop-link${isActive ? ' nav-desktop-link--active' : ''}`}
                  onClick={() => scrollTo(item.id)}
                  type="button"
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      className="nav-active-indicator"
                      layoutId="activeNavIndicator"
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="nav-actions">
            <button
              className="nav-cta-btn"
              onClick={() => scrollTo('contact')}
              type="button"
            >
              Let&rsquo;s Connect
            </button>

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
          </div>
        </div>
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

      {/* ── Full-Screen Mobile Menu Overlay ── */}
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
            aria-label="Mobile Navigation menu"
          >
            <motion.nav
              className="nav-overlay-links"
              variants={linkContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-overlay-link${activeSection === item.id ? ' nav-overlay-link--active' : ''}`}
                  variants={linkItemVariants}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item.id);
                  }}
                >
                  <span className="nav-overlay-link-label">{item.label}</span>
                  {activeSection === item.id && <span className="nav-overlay-active-tag">Active</span>}
                </motion.a>
              ))}
            </motion.nav>

            <div className="nav-overlay-footer">
              <p className="nav-overlay-caption">Aspiring AI Engineer • Dhaka, Bangladesh</p>
              <div className="nav-overlay-socials">
                {socialEntries.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    className="nav-overlay-social-link"
                    target={s.key !== 'email' ? '_blank' : undefined}
                    rel={s.key !== 'email' ? 'noopener noreferrer' : undefined}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
