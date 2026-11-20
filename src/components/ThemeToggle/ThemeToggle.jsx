import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/useTheme';
import './ThemeToggle.css';

/* ── 1. Cyber Dark Moon Icon ── */
function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="theme-icon theme-icon--moon"
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="rgba(56, 189, 248, 0.2)"
        stroke="#38BDF8"
      />
      <circle cx="17.5" cy="5.5" r="1" fill="#22D3EE" stroke="none" />
      <circle cx="19" cy="9" r="0.75" fill="#60A5FA" stroke="none" />
    </svg>
  );
}

/* ── 2. Crystal Ice-Blue Diamond/Prism Icon ── */
function CrystalIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="theme-icon theme-icon--ice"
    >
      <polygon
        points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"
        fill="rgba(2, 132, 199, 0.18)"
        stroke="#0284C7"
      />
      <line x1="12" y1="2" x2="12" y2="22" stroke="#38BDF8" strokeWidth="1.5" />
      <polyline points="2,8.5 12,12 22,8.5" stroke="#0284C7" strokeWidth="1.5" />
      <polyline points="2,15.5 12,12 22,15.5" stroke="#38BDF8" strokeWidth="1.5" />
    </svg>
  );
}

/* ── 3. Champagne Gold Radiant Sun/Sparkle Icon ── */
function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="theme-icon theme-icon--gold"
    >
      <circle cx="12" cy="12" r="4.5" fill="rgba(245, 158, 11, 0.28)" stroke="#D97706" />
      <line x1="12" y1="2" x2="12" y2="4.5" stroke="#F59E0B" />
      <line x1="12" y1="19.5" x2="12" y2="22" stroke="#F59E0B" />
      <line x1="2" y1="12" x2="4.5" y2="12" stroke="#F59E0B" />
      <line x1="19.5" y1="12" x2="22" y2="12" stroke="#F59E0B" />
      <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" stroke="#D97706" />
      <line x1="17.3" y1="17.3" x2="19.07" y2="19.07" stroke="#D97706" />
      <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" stroke="#D97706" />
      <line x1="17.3" y1="6.7" x2="19.07" y2="4.93" stroke="#D97706" />
    </svg>
  );
}

const THEME_CONFIG = {
  dark: {
    label: 'Cyber Dark',
    next: 'Ice-Blue Glass',
    ariaLabel: 'Currently Cyber Dark mode. Click to switch to Crystal Ice-Blue Glass.',
    icon: <MoonIcon />,
    classSuffix: 'dark',
  },
  light: {
    label: 'Ice-Blue Glass',
    next: 'Golden Mirror',
    ariaLabel: 'Currently Crystal Ice-Blue Glass mode. Click to switch to Champagne Gold Mirror.',
    icon: <CrystalIcon />,
    classSuffix: 'light',
  },
  gold: {
    label: 'Golden Mirror',
    next: 'Cyber Dark',
    ariaLabel: 'Currently Champagne Gold Mirror mode. Click to switch to Cyber Dark.',
    icon: <SunIcon />,
    classSuffix: 'gold',
  },
};

export default function ThemeToggle() {
  const { theme, toggleTheme, selectTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const current = THEME_CONFIG[theme] || THEME_CONFIG.dark;

  return (
    <div
      className="theme-toggle-wrapper"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {/* Main Single-Click Cycle Button */}
      <button
        type="button"
        className={`theme-toggle-btn theme-toggle-btn--${current.classSuffix}`}
        onClick={toggleTheme}
        aria-label={current.ariaLabel}
        title={`${current.label} • Click to switch to ${current.next}`}
      >
        <span className="theme-toggle-sheen" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            className="theme-icon-container"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {current.icon}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Floating 3-Way Quick Selector Menu on Hover */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="theme-quick-selector"
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            aria-label="Theme selector"
          >
            <button
              type="button"
              className={`theme-pill-opt ${theme === 'dark' ? 'theme-pill-opt--active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                selectTheme('dark');
              }}
              title="Cyber Dark (Night Mode)"
            >
              <span className="theme-pill-glyph">🌙</span>
              <span className="theme-pill-text">Dark</span>
            </button>

            <button
              type="button"
              className={`theme-pill-opt ${theme === 'light' ? 'theme-pill-opt--active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                selectTheme('light');
              }}
              title="Crystal Ice-Blue Liquid Glass"
            >
              <span className="theme-pill-glyph">💎</span>
              <span className="theme-pill-text">Ice Blue</span>
            </button>

            <button
              type="button"
              className={`theme-pill-opt ${theme === 'gold' ? 'theme-pill-opt--active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                selectTheme('gold');
              }}
              title="Champagne Gold Mirror Glass"
            >
              <span className="theme-pill-glyph">✨</span>
              <span className="theme-pill-text">Gold</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
