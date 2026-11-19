import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { rolesData } from '../../data/portfolio.js';
import SectionHeader from '../SectionHeader/SectionHeader';
import CuteAnimeBot from './CuteAnimeBot';
import './Roles.css';

/* ── Interactive Floating Role Card ── */
function RoleCard({
  role,
  positionClass,
  isTargeted,
  onHover,
  onSelect,
  onLeave,
  index,
  isExpanded = false,
  onToggleExpand,
}) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setMouseTilt({ x: xPct, y: yPct });
  };

  // Immediate pointer down triggers on mobile touch & mouse click without delay
  const handlePointerDown = (e) => {
    if (e.target.closest('.floating-card-expand-btn')) return;
    if (onSelect) {
      onSelect(role.id);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.target.closest('.floating-card-expand-btn')) return;
    if (onSelect) {
      onSelect(role.id);
    }
  };

  const handleMouseEnter = (e) => {
    if (e && e.pointerType === 'touch') return;
    onHover(role.id);
  };

  const handleMouseLeave = (e) => {
    if (e && e.pointerType === 'touch') return;
    setMouseTilt({ x: 0, y: 0 });
    onLeave();
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'code':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case 'layers':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        );
      case 'search':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        );
      case 'cpu':
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      className={`floating-role-card ${positionClass} ${isTargeted ? 'floating-role-card--targeted' : ''}`}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      tabIndex={0}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        '--card-accent': role.accentColor,
        transform: `perspective(800px) rotateX(${mouseTilt.y}deg) rotateY(${mouseTilt.x}deg)`,
      }}
    >
      {/* Specular Sheen */}
      <div className="floating-card-sheen" aria-hidden="true" />

      {/* Target Focus Radar Ping */}
      {isTargeted && <div className="card-target-ping" aria-hidden="true" />}

      {/* Card Header */}
      <div className="floating-card-header">
        <div className="floating-card-icon-box">
          {renderIcon(role.icon)}
        </div>
        <div className="floating-card-badge-wrap">
          <span className="floating-card-badge">{role.category}</span>
          {isTargeted && <span className="floating-card-active-pill">LOCKED</span>}
        </div>
      </div>

      {/* Title & Tagline */}
      <h3 className="floating-card-title">{role.role}</h3>
      <p className="floating-card-tagline">{role.tagline}</p>

      {/* Key Responsibilities */}
      <div className="floating-card-resp">
        <div className="floating-card-resp-header">
          <span className="floating-card-resp-title">Core Responsibilities</span>
          <button
            type="button"
            className="floating-card-expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleExpand) onToggleExpand();
            }}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Less' : 'Details'}
          </button>
        </div>

        <ul className="floating-card-list">
          {role.responsibilities.slice(0, isExpanded ? 4 : 2).map((resp, i) => (
            <li key={i} className="floating-card-item">
              <span className="floating-card-bullet">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Base Accent Glow Line */}
      <div className="floating-card-line" aria-hidden="true" />
    </motion.article>
  );
}

/* ── Main Roles Component ── */
export default function Roles() {
  const sectionRef = useRef(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const [targetGaze, setTargetGaze] = useState({ x: 0, y: 0 });
  const [isExpandedAll, setIsExpandedAll] = useState(false);

  const handleToggleExpand = useCallback(() => {
    setIsExpandedAll((prev) => !prev);
  }, []);

  const isTouchDevice = typeof window !== 'undefined' && (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );

  // Map 4 roles to 4 quadrant positions
  const cardPositions = [
    { posClass: 'card-pos--upper-left', defaultGaze: { x: -0.85, y: -0.7 } },
    { posClass: 'card-pos--upper-right', defaultGaze: { x: 0.85, y: -0.7 } },
    { posClass: 'card-pos--lower-left', defaultGaze: { x: -0.85, y: 0.7 } },
    { posClass: 'card-pos--lower-right', defaultGaze: { x: 0.85, y: 0.7 } },
  ];

  // Mouse move across entire section tracks eyes dynamically
  const handleSectionMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const nx = (e.clientX - centerX) / (rect.width * 0.42);
    const ny = (e.clientY - centerY) / (rect.height * 0.42);

    // If activeCardId is null, follow mouse freely within [-1, 1]
    if (!activeCardId) {
      setTargetGaze({
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      });
    }
  }, [activeCardId]);

  // Touch move across entire section tracks eyes dynamically on mobile
  const handleSectionTouchMove = useCallback((e) => {
    if (!sectionRef.current || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = sectionRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const nx = (touch.clientX - centerX) / (rect.width * 0.45);
    const ny = (touch.clientY - centerY) / (rect.height * 0.45);

    if (!activeCardId) {
      setTargetGaze({
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      });
    }
  }, [activeCardId]);

  // Bulletproof lock onto card for both desktop hover & mobile tap
  const lockCardGaze = useCallback((cardId) => {
    setActiveCardId(cardId);
    switch (cardId) {
      case 'role-1':
        setTargetGaze({ x: -1.0, y: -0.88 });
        break;
      case 'role-2':
        setTargetGaze({ x: 1.0, y: -0.88 });
        break;
      case 'role-3':
        setTargetGaze({ x: -1.0, y: 0.88 });
        break;
      case 'role-4':
        setTargetGaze({ x: 1.0, y: 0.88 });
        break;
      default:
        setTargetGaze({ x: 0, y: 0 });
        break;
    }
  }, []);

  const handleCardHover = useCallback((cardId) => {
    lockCardGaze(cardId);
  }, [lockCardGaze]);

  const handleCardSelect = useCallback((cardId) => {
    lockCardGaze(cardId);
  }, [lockCardGaze]);

  const handleCardLeave = useCallback(() => {
    // On touch devices / mobile, never clear gaze when finger lifts!
    if (isTouchDevice) return;
    setActiveCardId(null);
    setTargetGaze({ x: 0, y: 0 });
  }, [isTouchDevice]);

  const handleSectionMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    setActiveCardId(null);
    setTargetGaze({ x: 0, y: 0 });
  }, [isTouchDevice]);

  // Clicking outside cards resets focus
  const handleSectionClick = useCallback((e) => {
    if (e.target.closest('.floating-role-card') || e.target.closest('.cute-anime-bot-container')) {
      return;
    }
    setActiveCardId(null);
    setTargetGaze({ x: 0, y: 0 });
  }, []);

  // Clicking bot clears locked card
  const handleBotClick = useCallback(() => {
    setActiveCardId(null);
    setTargetGaze({ x: 0, y: 0 });
  }, []);

  return (
    <section
      id="roles"
      className="roles section"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      onTouchMove={handleSectionTouchMove}
      onMouseLeave={handleSectionMouseLeave}
      onClick={handleSectionClick}
    >
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

        {/* 3D Experience Matrix Stage */}
        <div className="roles-portrait-experience-matrix">
          {/* Optical Laser Beams linking portrait to hovered/targeted card */}
          <svg className="roles-optical-tethers" aria-hidden="true" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            {/* Beam to Upper Left */}
            <line
              x1="500"
              y1="500"
              x2="220"
              y2="220"
              className={`optical-tether optical-tether--ul ${activeCardId === 'role-1' ? 'optical-tether--active' : ''}`}
            />
            {/* Beam to Upper Right */}
            <line
              x1="500"
              y1="500"
              x2="780"
              y2="220"
              className={`optical-tether optical-tether--ur ${activeCardId === 'role-2' ? 'optical-tether--active' : ''}`}
            />
            {/* Beam to Lower Left */}
            <line
              x1="500"
              y1="500"
              x2="220"
              y2="780"
              className={`optical-tether optical-tether--ll ${activeCardId === 'role-3' ? 'optical-tether--active' : ''}`}
            />
            {/* Beam to Lower Right */}
            <line
              x1="500"
              y1="500"
              x2="780"
              y2="780"
              className={`optical-tether optical-tether--lr ${activeCardId === 'role-4' ? 'optical-tether--active' : ''}`}
            />
          </svg>

          {/* Card 1: Upper Left (Software Engineering Student) */}
          <div className="roles-matrix-cell cell--upper-left">
            {rolesData[0] && (
              <RoleCard
                role={rolesData[0]}
                positionClass={cardPositions[0].posClass}
                isTargeted={activeCardId === rolesData[0].id}
                onHover={handleCardHover}
                onSelect={handleCardSelect}
                onLeave={handleCardLeave}
                index={0}
                isExpanded={isExpandedAll}
                onToggleExpand={handleToggleExpand}
              />
            )}
          </div>

          {/* Central 3D Interactive Cute Anime Bot */}
          <div className="roles-matrix-cell cell--center">
            <CuteAnimeBot
              targetGaze={targetGaze}
              activeCard={activeCardId}
              onBotClick={handleBotClick}
            />
          </div>

          {/* Card 2: Upper Right (Project Contributor & Builder) */}
          <div className="roles-matrix-cell cell--upper-right">
            {rolesData[1] && (
              <RoleCard
                role={rolesData[1]}
                positionClass={cardPositions[1].posClass}
                isTargeted={activeCardId === rolesData[1].id}
                onHover={handleCardHover}
                onSelect={handleCardSelect}
                onLeave={handleCardLeave}
                index={1}
                isExpanded={isExpandedAll}
                onToggleExpand={handleToggleExpand}
              />
            )}
          </div>

          {/* Card 3: Lower Left (Research Enthusiast) */}
          <div className="roles-matrix-cell cell--lower-left">
            {rolesData[2] && (
              <RoleCard
                role={rolesData[2]}
                positionClass={cardPositions[2].posClass}
                isTargeted={activeCardId === rolesData[2].id}
                onHover={handleCardHover}
                onSelect={handleCardSelect}
                onLeave={handleCardLeave}
                index={2}
                isExpanded={isExpandedAll}
                onToggleExpand={handleToggleExpand}
              />
            )}
          </div>

          {/* Card 4: Lower Right (AI Technology Explorer) */}
          <div className="roles-matrix-cell cell--lower-right">
            {rolesData[3] && (
              <RoleCard
                role={rolesData[3]}
                positionClass={cardPositions[3].posClass}
                isTargeted={activeCardId === rolesData[3].id}
                onHover={handleCardHover}
                onSelect={handleCardSelect}
                onLeave={handleCardLeave}
                index={3}
                isExpanded={isExpandedAll}
                onToggleExpand={handleToggleExpand}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
