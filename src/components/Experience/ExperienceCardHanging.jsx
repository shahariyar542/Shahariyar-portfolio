import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * ExperienceCardHanging
 * Compact, refined glassmorphism card hanging from 3D tree branch
 * Features realistic hanging tether, pendulum swing entrance, and interactive depth.
 */
export default function ExperienceCardHanging({
  item,
  isRevealed,
  side = 'left', // 'left' | 'right'
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = (y / rect.height - 0.5) * -8;
    const tiltY = (x / rect.width - 0.5) * 8;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className={`exp-hanging-station exp-hanging-station--${side} ${
        isRevealed ? 'exp-hanging-station--revealed' : ''
      }`}
    >
      {/* ── Realistic Hanging String & Anchor Mount ── */}
      <div className="exp-hanging-tether-wrap" aria-hidden="true">
        <div className="exp-branch-anchor-knot" />
        <div className="exp-hanging-cable-line" />
        <div className="exp-tether-dual-split">
          <div className="exp-tether-split-left" />
          <div className="exp-tether-split-right" />
        </div>
      </div>

      {/* ── Compact Glass Experience Card with Pendulum Swing ── */}
      <motion.article
        ref={cardRef}
        className={`exp-compact-glass-card exp-compact-card--${item.badgeType} ${
          isHovered ? 'exp-compact-card--hovered' : ''
        }`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.85, y: -20, rotateZ: side === 'left' ? -6 : 6 }}
        animate={
          isRevealed
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
                rotateZ: 0,
                transition: {
                  type: 'spring',
                  stiffness: 120,
                  damping: 14,
                  mass: 1.1,
                  delay: 0.1,
                },
              }
            : {
                opacity: 0,
                scale: 0.85,
                y: -20,
                rotateZ: side === 'left' ? -6 : 6,
              }
        }
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Top Dual Grommet Rings */}
        <div className="exp-card-grommet exp-card-grommet--left" aria-hidden="true" />
        <div className="exp-card-grommet exp-card-grommet--right" aria-hidden="true" />

        {/* Ambient Specular Sheen */}
        <div className="exp-card-sheen" aria-hidden="true" />
        <div className="exp-card-glow-halo" aria-hidden="true" />

        <div className="exp-card-inner">
          {/* Top Header: Organization & Period */}
          <div className="exp-card-topbar">
            <div className="exp-org-box">
              <span className="exp-org-badge">{item.organization}</span>
            </div>
            <span className="exp-period-pill">{item.period}</span>
          </div>

          {/* Experience Title */}
          <h3 className="exp-compact-title">{item.title}</h3>

          {/* Role Badge */}
          <div className="exp-role-strip">
            <span className={`exp-role-pill exp-role-pill--${item.badgeType}`}>
              <span className="exp-role-dot" />
              {item.role}
            </span>
          </div>

          {/* Concise Description */}
          <p className="exp-compact-desc">{item.description}</p>

          {/* Compact Technology Pills */}
          {item.technologies && item.technologies.length > 0 && (
            <div className="exp-compact-tags">
              {item.technologies.slice(0, 4).map((tech) => (
                <span key={tech} className="exp-tag-pill">
                  {tech}
                </span>
              ))}
              {item.technologies.length > 4 && (
                <span className="exp-tag-more">+{item.technologies.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </motion.article>
    </div>
  );
}
