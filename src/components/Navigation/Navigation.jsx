import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems, socialLinks } from '../../data/portfolio';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navigation.css';

/* ── Section SVG Icons ── */
const NAV_ICONS = {
  home: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6H4.5A1.5 1.5 0 0 1 3 20V10.5z" />
    </svg>
  ),
  about: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  skills: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  experience: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12m0 0L7 7m5 5l5-5M12 12V3" />
      <circle cx="12" cy="3" r="1.5" />
      <circle cx="7" cy="7" r="1.5" />
      <circle cx="17" cy="7" r="1.5" />
    </svg>
  ),
  projects: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  research: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16" y2="16" />
      <path d="M11 7.5a3.5 3.5 0 0 0-3.5 3.5" />
    </svg>
  ),
  roles: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  education: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5" />
    </svg>
  ),
  recognition: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5.5" />
      <path d="M15 12.5L16.5 21l-4.5-2.5L7.5 21 9 12.5" />
    </svg>
  ),
  contact: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
};

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
          {/* Desktop Nav Links with 3D Rotating Alphabets & Tailored Section Logos */}
          <nav className="nav-desktop-menu" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-desktop-link${isActive ? ' nav-desktop-link--active' : ''}`}
                  onClick={() => scrollTo(item.id)}
                  type="button"
                  title={`Navigate to ${item.label}`}
                >
                  <span className="nav-item-icon" aria-hidden="true">
                    {NAV_ICONS[item.id]}
                  </span>
                  <span className="nav-item-text">
                    {item.label.split('').map((char, charIdx) => (
                      <span
                        key={charIdx}
                        className="nav-char"
                        style={{ '--char-idx': charIdx }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
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

          {/* CTA + Mobile Toggle + Theme Toggle (Extreme Top-Right) */}
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

            <ThemeToggle />
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
                  <span className="nav-overlay-link-icon" aria-hidden="true">
                    {NAV_ICONS[item.id]}
                  </span>
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
