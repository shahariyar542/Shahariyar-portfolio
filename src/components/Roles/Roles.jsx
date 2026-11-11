import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { rolesData } from '../../data/portfolio.js';
import SectionHeader from '../SectionHeader/SectionHeader';
import './Roles.css';

/* ── Interactive Role Card ── */
function RoleCard({ role, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: xPct, y: yPct });
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'code':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case 'layers':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        );
      case 'search':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        );
      case 'cpu':
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </svg>
        );
    }
  };

  return (
    <motion.article
      ref={cardRef}
      className={`role-card ${isHovered ? 'role-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        '--role-accent': role.accentColor,
      }}
    >
      {/* Specular Sheen */}
      <div
        className="role-card-sheen"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Ambient Accent Glow */}
      <div className="role-card-accent-glow" aria-hidden="true" />

      {/* Role Card Header */}
      <div className="role-card-top">
        <div className="role-icon-box">
          {renderIcon(role.icon)}
        </div>
        <span className="role-category-badge">{role.category}</span>
      </div>

      {/* Role Title & Tagline */}
      <h3 className="role-title">{role.role}</h3>
      <p className="role-tagline">{role.tagline}</p>

      {/* Responsibilities list */}
      <div className="role-responsibilities">
        <h4 className="role-resp-heading">Key Focus &amp; Responsibilities</h4>
        <ul className="role-resp-list">
          {role.responsibilities.map((resp, i) => (
            <li key={i} className="role-resp-item">
              <span className="role-resp-check">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Base Accent Line */}
      <div className="role-bottom-line" aria-hidden="true" />
    </motion.article>
  );
}

export default function Roles() {
  const sectionRef = useRef(null);

  return (
    <section id="roles" className="roles section" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <SectionHeader
          theme="roles"
          badgeText="Focus &amp; Contributions"
          title="Roles &amp;"
          highlightWord="Responsibilities"
          subtitle="The roles I embrace, the contributions I make, and the responsibilities I value."
          align="center"
        />

        {/* Roles 2x2 Grid */}
        <div className="roles-grid">
          {rolesData.map((role, index) => (
            <RoleCard key={role.id} role={role} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
