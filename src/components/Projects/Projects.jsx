import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects } from '../../data/portfolio';
import './Projects.css';

const statusClassMap = {
  'Active': 'projects-status--active',
  'In Development': 'projects-status--in-development',
  'Concept': 'projects-status--concept',
};

const formatNumber = (num) => String(num).padStart(2, '0');

// Waypoints for each project station along the road
const waypoints = [
  { id: 0, x: 450, y: 240, side: 'left' },
  { id: 1, x: 550, y: 640, side: 'right' },
  { id: 2, x: 450, y: 1040, side: 'left' },
  { id: 3, x: 550, y: 1440, side: 'right' },
];

export default function Projects() {
  const sectionRef = useRef(null);
  const roadSvgRef = useRef(null);
  const roadPathRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: '-80px' });

  const [activeProject, setActiveProject] = useState(null);
  const [carPos, setCarPos] = useState({ x: 500, y: 60, angle: 90 });
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const [illuminations, setIlluminations] = useState([0, 0, 0, 0]);
  const [reveals, setReveals] = useState([0, 0, 0, 0]);
  const [comingSoonReveal, setComingSoonReveal] = useState(0);

  // Winding SVG path definition across 1000 x 2050 coordinate box
  const pathD = `M 500 0 
    C 490 80, 450 150, 450 240 
    C 450 380, 550 480, 550 640 
    C 550 800, 450 900, 450 1040 
    C 450 1200, 550 1300, 550 1440 
    C 550 1560, 500 1640, 500 1740
    C 500 1840, 560 1930, 500 1980
    C 440 1930, 440 1840, 480 1760`;

  // Physical vehicle controller with progressive reveal & warm illumination
  useEffect(() => {
    let animId;
    let targetProgress = 0;
    let currentProgress = 0;
    let currentAngle = 90;
    let lastProgress = 0;
    let scrollDirection = 'down';

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Progress: 0 when top enters, 1 when bottom leaves
      const totalDist = rect.height + windowH;
      const scrolled = windowH - rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolled / totalDist));
      targetProgress = rawProgress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 60fps Physical Lerp Loop
    const updateCar = () => {
      if (roadPathRef.current) {
        const pDiff = targetProgress - currentProgress;
        currentProgress += pDiff * 0.08;

        // Detect scroll direction with deadband
        if (targetProgress - lastProgress > 0.0008) {
          scrollDirection = 'down';
        } else if (targetProgress - lastProgress < -0.0008) {
          scrollDirection = 'up';
        }
        lastProgress = targetProgress;

        const pathLen = roadPathRef.current.getTotalLength();
        const dist = Math.max(2, Math.min(pathLen - 4, currentProgress * pathLen));

        const pt = roadPathRef.current.getPointAtLength(dist);
        const ptNext = roadPathRef.current.getPointAtLength(Math.min(dist + 4, pathLen));

        const dx = ptNext.x - pt.x;
        const dy = ptNext.y - pt.y;
        const forwardAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

        // Realistic heading: car faces forward when traveling down,
        // faces upward along the road when traveling back up,
        // and steers through the U-turn loop at the end (currentProgress > 0.92)
        let targetHeading = forwardAngle;
        if (scrollDirection === 'up' && currentProgress < 0.92) {
          targetHeading = forwardAngle + 180;
        }

        // Shortest angular distance to prevent any jumping or teleporting
        const angleDiff = ((targetHeading - currentAngle + 540) % 360) - 180;
        currentAngle += angleDiff * 0.12;

        setCarPos({ x: pt.x, y: pt.y, angle: currentAngle });

        // ── 1. One-by-one Progressive Card Reveal ──
        // Cards stay completely hidden until the vehicle approaches.
        // Once vehicle reaches/passes the waypoint, card remains visible.
        // On upward scroll, cards reverse smoothly as vehicle moves away.
        const approachWindow = 220;
        const newReveals = waypoints.map((wp) => {
          const startY = wp.y - approachWindow;
          if (pt.y >= wp.y) {
            return 1; // fully visible once reached or passed
          } else if (pt.y > startY) {
            return (pt.y - startY) / approachWindow; // gradual reveal
          }
          return 0; // completely hidden before vehicle approaches
        });
        setReveals(newReveals);

        // ── 2. Realistic Warm Golden Headlight Illumination ──
        // When vehicle is close to a card, headlights illuminate the card & surroundings
        const newIlluminations = waypoints.map((wp) => {
          const distY = Math.abs(pt.y - wp.y);
          if (distY > 240) return 0;
          const proximity = 1 - distY / 240;
          return Math.pow(proximity, 1.4); // smooth optical falloff
        });
        setIlluminations(newIlluminations);

        // ── 3. "COMING SOON" Reveal (after Project 4: Y > 1460) ──
        if (pt.y < 1460) {
          setComingSoonReveal(0);
        } else {
          const rev = Math.min(1, Math.max(0, (pt.y - 1460) / 220));
          setComingSoonReveal(rev);
        }
      }
      animId = requestAnimationFrame(updateCar);
    };

    animId = requestAnimationFrame(updateCar);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleCardHover = useCallback((index) => {
    setActiveProject(index);
  }, []);

  const handleCardLeave = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <section
      id="projects"
      className="projects-section section"
      ref={sectionRef}
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => setIsSectionHovered(false)}
    >
      <div className="container">
        {/* Section Header */}
        <motion.header
          className="projects-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label">01 — Interactive 3D Journey</div>
          <h2 className="section-title">
            Engineering <em>Showcase</em>
          </h2>
        </motion.header>

        {/* ── 3D Roadway Journey Container ── */}
        <div className={`roadway-container ${isSectionHovered || isInView ? 'roadway-container--active' : ''}`}>
          {/* Background SVG Roadway */}
          <div className="roadway-svg-wrap" aria-hidden="true">
            <svg
              ref={roadSvgRef}
              className="roadway-svg"
              viewBox="0 0 1000 2050"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Road surface gradient */}
                <linearGradient id="roadAsphalt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B132B" />
                  <stop offset="50%" stopColor="#0A1124" />
                  <stop offset="100%" stopColor="#0B132B" />
                </linearGradient>

                {/* Warm Golden/Amber Headlight Beam Gradient */}
                <radialGradient id="warmHeadlightBeam" cx="50%" cy="100%" r="90%">
                  <stop offset="0%" stopColor="rgba(254, 240, 138, 0.88)" />
                  <stop offset="35%" stopColor="rgba(251, 191, 36, 0.52)" />
                  <stop offset="70%" stopColor="rgba(245, 158, 11, 0.22)" />
                  <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
                </radialGradient>

                {/* Neon road glow filter */}
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Warm golden light glow filter */}
                <filter id="warmGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Road Ground Shadows */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(0, 0, 0, 0.65)"
                strokeWidth="105"
                strokeLinecap="round"
              />

              {/* Road Asphalt Bed */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#roadAsphalt)"
                strokeWidth="74"
                strokeLinecap="round"
              />

              {/* Glowing Road Shoulders */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(59, 130, 246, 0.32)"
                strokeWidth="76"
                strokeLinecap="round"
              />

              {/* Left & Right Cyber Guardrails */}
              <path
                d={pathD}
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2.5"
                strokeDasharray="16 12"
                className="road-guardrail"
                opacity="0.85"
                filter="url(#neonGlow)"
              />

              {/* Animated Center Dash Lane Line */}
              <path
                ref={roadPathRef}
                d={pathD}
                fill="none"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeDasharray="18 22"
                className="road-centerline"
                filter="url(#neonGlow)"
              />

              {/* ── Exactly ONE Road Waypoint Marker & Warm Conduit Per Project ── */}
              {waypoints.map((wp, idx) => {
                const isSelected = activeProject === idx;
                const illum = illuminations[idx] || 0;
                const reveal = reveals[idx] || 0;
                const targetX = wp.side === 'left' ? 320 : 680;

                // Warm golden conduit illumination when headlights hit
                const strokeColor =
                  illum > 0.1
                    ? `rgba(251, 191, 36, ${Math.max(0.3, illum * 0.95)})`
                    : `rgba(96, 165, 250, ${0.15 + reveal * 0.15})`;
                const strokeW = illum > 0.1 ? 1.5 + illum * 2 : 1.5;

                return (
                  <g
                    key={`conduit-${idx}`}
                    className="road-conduit-group"
                    style={{
                      opacity: Math.max(0.18, reveal),
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    {/* Conduit Line from Waypoint to Card */}
                    <line
                      x1={wp.x}
                      y1={wp.y}
                      x2={targetX}
                      y2={wp.y}
                      stroke={strokeColor}
                      strokeWidth={strokeW}
                      strokeDasharray="6 6"
                      className="road-conduit-line"
                    />

                    {/* Single Milestone Waypoint Ring with warm glow */}
                    <circle
                      cx={wp.x}
                      cy={wp.y}
                      r={15 + illum * 3}
                      fill="#070B18"
                      stroke={illum > 0.1 ? '#FBBF24' : isSelected ? '#22D3EE' : '#3B82F6'}
                      strokeWidth={1.8 + illum * 1.2}
                      filter={illum > 0.1 ? 'url(#warmGlow)' : 'url(#neonGlow)'}
                    />

                    {/* Milestone Center Dot */}
                    <circle
                      cx={wp.x}
                      cy={wp.y}
                      r={6 + illum * 2}
                      fill={illum > 0.1 ? '#FDE047' : '#60A5FA'}
                      className="road-waypoint-pulse"
                    />

                    {/* EXACTLY ONE NUMBER: 01, 02, 03, 04 on the road marker */}
                    <text
                      x={wp.x}
                      y={wp.y + 4}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontFamily="Space Grotesk, sans-serif"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {formatNumber(idx + 1)}
                    </text>
                  </g>
                );
              })}

              {/* ── Personal Vehicle: "SHAHARIYAR" with Warm Golden Headlights ── */}
              <g
                className="road-car-group"
                transform={`translate(${carPos.x}, ${carPos.y}) rotate(${carPos.angle})`}
              >
                {/* Projected Warm Headlight Beams */}
                <polygon
                  points="-18,-15 18,-15 48,-130 -48,-130"
                  fill="url(#warmHeadlightBeam)"
                  opacity="0.85"
                />

                {/* Underglow Halo */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx="26"
                  ry="38"
                  fill="rgba(34, 211, 238, 0.32)"
                  filter="url(#neonGlow)"
                />

                {/* Vehicle Chassis Body */}
                <rect
                  x="-15"
                  y="-25"
                  width="30"
                  height="50"
                  rx="7"
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth="1.8"
                />

                {/* Aerodynamic Carbon Roof / Cockpit */}
                <rect
                  x="-10"
                  y="-15"
                  width="20"
                  height="28"
                  rx="4"
                  fill="#1E293B"
                  stroke="#22D3EE"
                  strokeWidth="1"
                />

                {/* Cockpit Glass */}
                <polygon
                  points="-8,-11 8,-11 9,-4 -9,-4"
                  fill="rgba(34, 211, 238, 0.65)"
                />

                {/* Twin Warm Golden Headlights */}
                <circle cx="-10" cy="-24" r="3.2" fill="#FEF08A" filter="url(#warmGlow)" />
                <circle cx="10" cy="-24" r="3.2" fill="#FEF08A" filter="url(#warmGlow)" />

                {/* Twin Red Taillights */}
                <circle cx="-10" cy="23" r="2.5" fill="#EF4444" />
                <circle cx="10" cy="23" r="2.5" fill="#EF4444" />

                {/* Owner Tag */}
                <rect
                  x="-25"
                  y="-41"
                  width="50"
                  height="13"
                  rx="3"
                  fill="rgba(7, 11, 24, 0.9)"
                  stroke="#22D3EE"
                  strokeWidth="0.8"
                />
                <text
                  x="0"
                  y="-32"
                  fill="#22D3EE"
                  fontSize="7"
                  fontWeight="700"
                  fontFamily="Space Grotesk, sans-serif"
                  letterSpacing="0.08em"
                  textAnchor="middle"
                >
                  SHAHARIYAR
                </text>
              </g>
            </svg>
          </div>

          {/* ── Alternating Project Cards Layout (Progressive 1-by-1 Reveal) ── */}
          <div className="roadway-cards-flow">
            {projects.map((project, index) => {
              const isEven = index % 2 === 0;
              const isSelected = activeProject === index;
              const illum = illuminations[index] || 0;
              const reveal = reveals[index] || 0;
              const statusClass = statusClassMap[project.status] || '';

              return (
                <div
                  key={project.id}
                  className={`roadway-station-row roadway-station--${isEven ? 'left' : 'right'} ${
                    isSelected ? 'roadway-station--active' : ''
                  }`}
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={handleCardLeave}
                >
                  {/* Left Column Spacer or Card */}
                  <div className="station-column station-column--left">
                    {isEven && (
                      <ProjectCardRoadway
                        project={project}
                        index={index}
                        isSelected={isSelected}
                        reveal={reveal}
                        illumination={illum}
                        statusClass={statusClass}
                        side="left"
                      />
                    )}
                  </div>

                  {/* Center Roadway Node Anchor (Spacing only — no duplicate number) */}
                  <div className="station-node-anchor" aria-hidden="true" />

                  {/* Right Column Spacer or Card */}
                  <div className="station-column station-column--right">
                    {!isEven && (
                      <ProjectCardRoadway
                        project={project}
                        index={index}
                        isSelected={isSelected}
                        reveal={reveal}
                        illumination={illum}
                        statusClass={statusClass}
                        side="right"
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {/* ── Additional Road Segment: Subtle "COMING SOON" Light Reveal ── */}
            <div
              className="roadway-coming-soon-segment"
              style={{
                opacity: comingSoonReveal,
                filter: `blur(${(1 - comingSoonReveal) * 5}px)`,
                transform: `translateY(${(1 - comingSoonReveal) * 15}px)`,
              }}
              aria-label="Upcoming projects indicator"
            >
              <div className="coming-soon-portal">
                <span className="coming-soon-beacon-dot" />
                <span className="coming-soon-track">NEXT ARCHITECTURES IN DEVELOPMENT</span>
                <h4 className="coming-soon-title">COMING SOON</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Interactive 3D Project Card with Progressive Reveal & Warm Headlight Illumination ── */
function ProjectCardRoadway({ project, index, isSelected, reveal, illumination, statusClass, side }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });

    const tiltX = (y / rect.height - 0.5) * -12;
    const tiltY = (x / rect.width - 0.5) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Directional headlight glow origin: side of the card facing the center road
  const headlightFacingOrigin = side === 'left' ? '100% 50%' : '0% 50%';

  // If card is completely unrevealed, keep pointer events off and hidden
  const isCardVisible = reveal > 0.02;

  return (
    <div
      className="roadway-card-wrapper"
      style={{
        opacity: reveal,
        visibility: isCardVisible ? 'visible' : 'hidden',
        pointerEvents: reveal > 0.75 ? 'auto' : 'none',
        transform: `translateY(${(1 - reveal) * 24}px) scale(${0.95 + reveal * 0.05})`,
        filter: `blur(${(1 - reveal) * 6}px)`,
        transition: 'opacity 0.2s ease-out, transform 0.25s ease-out, filter 0.25s ease-out',
      }}
    >
      {/* ── Surrounding Warm Golden Headlight Ambient Pool ── */}
      <div
        className="card-warm-headlight-pool"
        style={{
          background: `radial-gradient(ellipse at ${headlightFacingOrigin}, rgba(251, 191, 36, ${illumination * 0.35}) 0%, rgba(245, 158, 11, ${illumination * 0.14}) 45%, transparent 75%)`,
          opacity: illumination > 0.05 ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <article
        ref={cardRef}
        className={`roadway-project-card ${isSelected ? 'roadway-project-card--hovered' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          borderColor:
            illumination > 0.1
              ? `rgba(251, 191, 36, ${0.18 + illumination * 0.6})`
              : undefined,
          boxShadow:
            illumination > 0.1
              ? `var(--shadow-3d-card), 0 0 ${illumination * 34}px rgba(251, 191, 36, ${illumination * 0.38}), 0 0 ${illumination * 14}px rgba(254, 240, 138, ${illumination * 0.25})`
              : undefined,
          filter: `brightness(${1 + illumination * 0.07})`,
        }}
      >
        {/* Dynamic Cursor Sheen */}
        <div
          className="project-road-sheen"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(34, 211, 238, 0.16) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 75%)`,
            opacity: isSelected ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {/* Warm Golden Headlight Surface Reflection */}
        <div
          className="project-road-warm-reflect"
          style={{
            background: `radial-gradient(ellipse at ${headlightFacingOrigin}, rgba(254, 240, 138, ${illumination * 0.22}) 0%, rgba(251, 191, 36, ${illumination * 0.12}) 40%, transparent 70%)`,
            opacity: illumination > 0.05 ? 1 : 0,
          }}
          aria-hidden="true"
        />

        <div className="project-road-glow" aria-hidden="true" />

        <div className="project-road-inner">
          {/* Top Header */}
          <div className="project-road-top">
            <div className="project-road-meta">
              <span className="project-road-index">STATION 0{index + 1}</span>
              <span className="project-road-category">{project.category}</span>
            </div>

            <span className={`project-road-status ${statusClass}`}>
              <span className="project-status-dot" />
              {project.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="project-road-title">{project.title}</h3>

          {/* Description */}
          <p className="project-road-description">{project.description}</p>

          {/* Technology Badges */}
          <div className="project-road-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-road-tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="project-road-actions">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="road-btn road-btn--github"
                aria-label={`View ${project.title} on GitHub`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <span>Repository</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                className="road-btn road-btn--live"
                aria-label={`Launch ${project.title} interactive demo`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Live System</span>
              </a>
            )}

            {project.metrics && (
              <span className="project-road-metric">
                <span className="metric-icon">⚡</span>
                {project.metrics}
              </span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
