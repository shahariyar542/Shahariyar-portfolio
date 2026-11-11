import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

/* ── Refined Sun Icon (Night Mode Active -> Click for Day) ── */
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
      className="theme-icon theme-icon--sun"
    >
      <circle cx="12" cy="12" r="5" fill="rgba(253, 224, 71, 0.25)" stroke="#FBBF24" />
      <line x1="12" y1="1" x2="12" y2="3" stroke="#FBBF24" />
      <line x1="12" y1="21" x2="12" y2="23" stroke="#FBBF24" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#FBBF24" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#FBBF24" />
      <line x1="1" y1="12" x2="3" y2="12" stroke="#FBBF24" />
      <line x1="21" y1="12" x2="23" y2="12" stroke="#FBBF24" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#FBBF24" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#FBBF24" />
    </svg>
  );
}

/* ── Refined Moon Icon (Day Mode Active -> Click for Night) ── */
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
        fill="rgba(37, 99, 235, 0.2)"
        stroke="#2563EB"
      />
      <circle cx="17.5" cy="5.5" r="1" fill="#0284C7" stroke="none" />
      <circle cx="19" cy="9" r="0.75" fill="#3B82F6" stroke="none" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-wrapper">
      <button
        type="button"
        className={`theme-toggle-btn ${isDark ? 'theme-toggle-btn--dark' : 'theme-toggle-btn--light'}`}
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to Day Mode (Crystal Glass)' : 'Switch to Night Mode (Dark Master)'}
        title={isDark ? 'Switch to Day Mode (Crystal Glass)' : 'Switch to Night Mode (Dark Master)'}
      >
        <span className="theme-toggle-sheen" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun-icon"
              className="theme-icon-container"
              initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <SunIcon />
            </motion.span>
          ) : (
            <motion.span
              key="moon-icon"
              className="theme-icon-container"
              initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <MoonIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
