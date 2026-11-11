import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './SectionHeader.css';

/* ── Context-Aware Decorative Visual Icons (Part 3) ── */
function HeaderVisual({ theme }) {
  switch (theme) {
    case 'about':
      /* Abstract Orbital & Geometric Visual */
      return (
        <div className="sh-visual sh-visual--about" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" stroke="rgba(96, 165, 250, 0.22)" strokeWidth="1" strokeDasharray="3 3" />
            <ellipse cx="20" cy="20" rx="16" ry="7" transform="rotate(-30 20 20)" stroke="rgba(34, 211, 238, 0.45)" strokeWidth="1.2" />
            <ellipse cx="20" cy="20" rx="16" ry="7" transform="rotate(30 20 20)" stroke="rgba(129, 140, 248, 0.4)" strokeWidth="1.2" />
            <circle cx="20" cy="20" r="4.5" fill="rgba(96, 165, 250, 0.25)" stroke="#60A5FA" strokeWidth="1.5" />
            <circle cx="28" cy="12" r="2" fill="#22D3EE" className="sh-orbit-bead" />
          </svg>
        </div>
      );

    case 'skills':
      /* Technical Digital Grid Matrix */
      return (
        <div className="sh-visual sh-visual--skills" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="5" y="5" width="30" height="30" rx="8" stroke="rgba(34, 211, 238, 0.35)" strokeWidth="1" />
            <path d="M10 20h20M20 10v20" stroke="rgba(96, 165, 250, 0.2)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="10" cy="10" r="1.5" fill="#22D3EE" />
            <circle cx="30" cy="10" r="1.5" fill="#22D3EE" />
            <circle cx="10" cy="30" r="1.5" fill="#22D3EE" />
            <circle cx="30" cy="30" r="1.5" fill="#22D3EE" />
            <rect x="15" y="15" width="10" height="10" rx="2.5" fill="rgba(34, 211, 238, 0.18)" stroke="#22D3EE" strokeWidth="1.2" />
          </svg>
        </div>
      );

    case 'experience':
      /* Premium Timeline Capsule Rail */
      return (
        <div className="sh-visual sh-visual--experience" aria-hidden="true">
          <svg width="42" height="40" viewBox="0 0 42 40" fill="none">
            <rect x="4" y="12" width="34" height="16" rx="8" stroke="rgba(96, 165, 250, 0.32)" strokeWidth="1" fill="rgba(96, 165, 250, 0.05)" />
            <line x1="10" y1="20" x2="32" y2="20" stroke="rgba(148, 163, 184, 0.35)" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="12" cy="20" r="3" fill="#60A5FA" />
            <circle cx="21" cy="20" r="2.5" fill="rgba(34, 211, 238, 0.85)" />
            <circle cx="30" cy="20" r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.2" className="sh-pip-active" />
          </svg>
        </div>
      );

    case 'projects':
      /* Abstract Innovation Prism Geometry */
      return (
        <div className="sh-visual sh-visual--projects" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <polygon points="20,6 33,14 33,28 20,35 7,28 7,14" stroke="rgba(96, 165, 250, 0.45)" strokeWidth="1.2" fill="rgba(96, 165, 250, 0.06)" />
            <polyline points="20,6 20,35" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="1" />
            <polyline points="20,20 33,14" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="1" />
            <polyline points="20,20 7,14" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="1" />
            <circle cx="20" cy="6" r="2.5" fill="#22D3EE" />
          </svg>
        </div>
      );

    case 'roles':
      /* Interconnected Node Network */
      return (
        <div className="sh-visual sh-visual--roles" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 9L31 29H9L20 9Z" stroke="rgba(167, 139, 250, 0.35)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="20" cy="9" r="4" fill="rgba(96, 165, 250, 0.25)" stroke="#60A5FA" strokeWidth="1.5" />
            <circle cx="31" cy="29" r="4" fill="rgba(34, 211, 238, 0.25)" stroke="#22D3EE" strokeWidth="1.5" />
            <circle cx="9" cy="29" r="4" fill="rgba(167, 139, 250, 0.25)" stroke="#A78BFA" strokeWidth="1.5" />
            <circle cx="20" cy="22" r="2.5" fill="#34D399" />
          </svg>
        </div>
      );

    case 'education':
      /* Minimal Architectural Isometric Pillar */
      return (
        <div className="sh-visual sh-visual--education" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="8" y="30" width="24" height="4" rx="1.5" fill="rgba(96, 165, 250, 0.3)" stroke="#60A5FA" strokeWidth="1" />
            <path d="M12 30V15M20 30V15M28 30V15" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1.2" />
            <polygon points="20,6 32,15 8,15" stroke="#22D3EE" strokeWidth="1.2" fill="rgba(34, 211, 238, 0.12)" />
            <circle cx="20" cy="11" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'recognition':
      /* Elegant Trophy & Laurel Insignia with Restrained Gold */
      return (
        <div className="sh-visual sh-visual--recognition" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M13 14H10a2 2 0 0 0-2 2v2a5 5 0 0 0 5 5h1M27 14h3a2 2 0 0 1 2 2v2a5 5 0 0 1-5 5h-1" stroke="#FBBF24" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M14 11h12v9a6 6 0 0 1-12 0v-9z" fill="rgba(251, 191, 36, 0.16)" stroke="#FBBF24" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M20 26v4M15 30h10" stroke="#FBBF24" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'contact':
    default:
      /* Connection Transmission Beacon */
      return (
        <div className="sh-visual sh-visual--contact" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" className="sh-radar-wave sh-radar-wave--2" />
            <circle cx="20" cy="20" r="10" stroke="rgba(96, 165, 250, 0.35)" strokeWidth="1" className="sh-radar-wave sh-radar-wave--1" />
            <circle cx="20" cy="20" r="4.5" fill="#22D3EE" stroke="#FFFFFF" strokeWidth="1.2" />
            <path d="M10 20C10 14.477 14.477 10 20 10M30 20C30 25.523 25.523 30 20 30" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      );
  }
}

export default function SectionHeader({
  theme = 'about',
  badgeText,
  title,
  highlightWord,
  titlePrefix,
  titleSuffix,
  subtitle,
  description,
  align = 'center',
  className = '',
  children,
}) {
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: '-60px' });
  const textSubtitle = subtitle || description;

  return (
    <motion.header
      ref={headerRef}
      className={`section-header-glass section-header-glass--${theme} section-header-glass--${align} ${className}`}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Glass Pill Eyebrow with Theme Visual (NO Serial Numbers) ── */}
      <div className="sh-glass-capsule">
        <HeaderVisual theme={theme} />
        {badgeText && <span className="sh-badge-text">{badgeText}</span>}
      </div>

      {/* ── Prominent Visually Distinct Original Main Heading ── */}
      <h2 className="sh-title">
        {children ? (
          children
        ) : (
          <>
            {titlePrefix && <span>{titlePrefix} </span>}
            {title && <span>{title} </span>}
            {highlightWord && <em className="sh-highlight">{highlightWord}</em>}
            {titleSuffix && <span> {titleSuffix}</span>}
          </>
        )}
      </h2>

      {/* ── Meaningful Contextual Subtitle Directly Underneath ── */}
      {textSubtitle && <p className="sh-description">{textSubtitle}</p>}

      {/* ── Subtle Under-Glow Refractor ── */}
      <div className="sh-ambient-refractor" aria-hidden="true" />
    </motion.header>
  );
}
