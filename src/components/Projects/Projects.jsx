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

export default function Projects() {
  const sectionRef = useRef(null);
  const roadSvgRef = useRef(null);
  const roadPathRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: '-80px' });

  const [activeProject, setActiveProject] = useState(null);
  const [carPos, setCarPos] = useState({ x: 500, y: 80, angle: 90 });
  const [isSectionHovered, setIsSectionHovered] = useState(false);

  // Winding SVG path definition across 1000 x 1700 coordinate box
  // Waypoints aligned with cards:
  // Card 0 (Left): Y ~ 240, Waypoint at (460, 240)
  // Card 1 (Right): Y ~ 640, Waypoint at (540, 640)
  // Card 2 (Left): Y ~ 1040, Waypoint at (460, 1040)
  // Card 3 (Right): Y ~ 1440, Waypoint at (540, 1440)
  const pathD = `M 500 0 
    C 490 80, 450 150, 450 240 
    C 450 380, 550 480, 550 640 
    C 550 800, 450 900, 450 1040 
    C 450 1200, 550 1300, 550 1440 
    C 550 1550, 510 1620, 500 1700`;

  // Waypoints for each project station
  const waypoints = [
    { id: 0, x: 450, y: 240, side: 'left' },
    { id: 1, x: 550, y: 640, side: 'right' },
    { id: 2, x: 450, y: 1040, side: 'left' },
    { id: 3, x: 550, y: 1440, side: 'right' },
  ];

  // Smooth car animation following scroll progress
  useEffect(() => {
    let animId;
    let targetProgress = 0;
    let currentProgress = 0;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Progress: 0 when top of section enters, 1 when bottom leaves
      const totalDist = rect.height + windowH;
      const scrolled = windowH - rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolled / totalDist));
      targetProgress = rawProgress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Lerp loop for fluid, physical car motion
    const updateCar = () => {
      if (roadPathRef.current) {
        currentProgress += (targetProgress - currentProgress) * 0.08;
        const pathLen = roadPathRef.current.getTotalLength();
        const dist = Math.max(2, Math.min(pathLen - 4, currentProgress * pathLen));

        const pt = roadPathRef.current.getPointAtLength(dist);
        const ptNext = roadPathRef.current.getPointAtLength(Math.min(dist + 4, pathLen));

        const dx = ptNext.x - pt.x;
        const dy = ptNext.y - pt.y;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // car points forward along tangent

        setCarPos({ x: pt.x, y: pt.y, angle });
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
          <p className="projects-intro-text">
            A continuous architectural roadway traversing my software systems and predictive models. Scroll through the landscape to guide the personal vehicle along the journey.
          </p>
        </motion.header>

        {/* ── 3D Roadway Journey Container ── */}
        <div className={`roadway-container ${isSectionHovered || isInView ? 'roadway-container--active' : ''}`}>
          {/* Background SVG Roadway */}
          <div className="roadway-svg-wrap" aria-hidden="true">
            <svg
              ref={roadSvgRef}
              className="roadway-svg"
              viewBox="0 0 1000 1700"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Road surface gradient */}
                <linearGradient id="roadAsphalt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B132B" />
                  <stop offset="50%" stopColor="#0A1124" />
                  <stop offset="100%" stopColor="#0B132B" />
                </linearGradient>

                {/* Headlight cone gradient */}
                <radialGradient id="headlightBeam" cx="50%" cy="100%" r="90%">
                  <stop offset="0%" stopColor="rgba(34, 211, 238, 0.7)" />
                  <stop offset="40%" stopColor="rgba(59, 130, 246, 0.3)" />
                  <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
                </radialGradient>

                {/* Glow filter */}
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
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
                stroke="rgba(0, 0, 0, 0.6)"
                strokeWidth="110"
                strokeLinecap="round"
              />

              {/* Road Asphalt Bed */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#roadAsphalt)"
                strokeWidth="78"
                strokeLinecap="round"
              />

              {/* Glowing Road Shoulders */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(59, 130, 246, 0.35)"
                strokeWidth="80"
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

              {/* Connecting Conduits from Road Waypoints to Project Cards */}
              {waypoints.map((wp, idx) => {
                const isSelected = activeProject === idx;
                // Draw connecting horizontal energy beam from waypoint towards the card
                const targetX = wp.side === 'left' ? 320 : 680;
                return (
                  <g key={`conduit-${idx}`} className={`road-conduit-group ${isSelected ? 'road-conduit--active' : ''}`}>
                    {/* Conduit Line */}
                    <line
                      x1={wp.x}
                      y1={wp.y}
                      x2={targetX}
                      y2={wp.y}
                      stroke={isSelected ? '#22D3EE' : 'rgba(96, 165, 250, 0.3)'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeDasharray="6 6"
                      className="road-conduit-line"
                    />

                    {/* Milestone Waypoint Ring */}
                    <circle
                      cx={wp.x}
                      cy={wp.y}
                      r="16"
                      fill="#070B18"
                      stroke={isSelected ? '#22D3EE' : '#3B82F6'}
                      strokeWidth="2"
                      filter="url(#neonGlow)"
                    />
                    <circle
                      cx={wp.x}
                      cy={wp.y}
                      r="7"
                      fill={isSelected ? '#22D3EE' : '#60A5FA'}
                      className="road-waypoint-pulse"
                    />
                    <text
                      x={wp.x}
                      y={wp.y + 4}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontFamily="Space Grotesk, sans-serif"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}

              {/* ── Personal Vehicle: "SHAHARIYAR" ── */}
              <g
                className="road-car-group"
                transform={`translate(${carPos.x}, ${carPos.y}) rotate(${carPos.angle})`}
              >
                {/* Projected Headlight Beams */}
                <polygon
                  points="-18,-15 18,-15 45,-120 -45,-120"
                  fill="url(#headlightBeam)"
                  opacity="0.75"
                />

                {/* Underglow Halo */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx="26"
                  ry="38"
                  fill="rgba(34, 211, 238, 0.35)"
                  filter="url(#neonGlow)"
                />

                {/* Vehicle Chassis Body */}
                <rect
                  x="-16"
                  y="-26"
                  width="32"
                  height="52"
                  rx="7"
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth="1.8"
                />

                {/* Aerodynamic Carbon Roof / Cockpit */}
                <rect
                  x="-11"
                  y="-16"
                  width="22"
                  height="30"
                  rx="4"
                  fill="#1E293B"
                  stroke="#22D3EE"
                  strokeWidth="1"
                />

                {/* Cockpit Glass */}
                <polygon
                  points="-8,-12 8,-12 10,-4 -10,-4"
                  fill="rgba(34, 211, 238, 0.6)"
                />

                {/* Twin Cyan Headlights */}
                <circle cx="-11" cy="-25" r="3" fill="#FFFFFF" filter="url(#neonGlow)" />
                <circle cx="11" cy="-25" r="3" fill="#FFFFFF" filter="url(#neonGlow)" />

                {/* Twin Red Taillights */}
                <circle cx="-11" cy="24" r="2.5" fill="#EF4444" />
                <circle cx="11" cy="24" r="2.5" fill="#EF4444" />

                {/* Elegant Owner Tag */}
                <rect
                  x="-25"
                  y="-42"
                  width="50"
                  height="13"
                  rx="3"
                  fill="rgba(7, 11, 24, 0.9)"
                  stroke="#22D3EE"
                  strokeWidth="0.8"
                />
                <text
                  x="0"
                  y="-33"
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

          {/* ── Alternating Project Cards Layout ── */}
          <div className="roadway-cards-flow">
            {projects.map((project, index) => {
              const isEven = index % 2 === 0;
              const isSelected = activeProject === index;
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
                        statusClass={statusClass}
                      />
                    )}
                  </div>

                  {/* Center Roadway Node Beacon Marker */}
                  <div className="station-node-anchor" aria-hidden="true">
                    <div className={`station-pulse-beacon ${isSelected ? 'station-pulse-beacon--active' : ''}`}>
                      <span className="beacon-number">{formatNumber(index + 1)}</span>
                    </div>
                  </div>

                  {/* Right Column Spacer or Card */}
                  <div className="station-column station-column--right">
                    {!isEven && (
                      <ProjectCardRoadway
                        project={project}
                        index={index}
                        isSelected={isSelected}
                        statusClass={statusClass}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Interactive 3D Project Card along the Road ── */
function ProjectCardRoadway({ project, index, isSelected, statusClass }) {
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

  return (
    <article
      ref={cardRef}
      className={`roadway-project-card ${isSelected ? 'roadway-project-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Specular Sheen */}
      <div
        className="project-road-sheen"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(34, 211, 238, 0.16) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 75%)`,
          opacity: isSelected ? 1 : 0,
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
  );
}
