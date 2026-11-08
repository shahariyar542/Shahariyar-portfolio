import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { projects } from '../../data/portfolio';
import './Projects.css';

const statusClassMap = {
  'Active': 'projects-status--active',
  'In Development': 'projects-status--in-development',
  'Concept': 'projects-status--concept',
};

const formatNumber = (num) => String(num).padStart(2, '0');

/* ── Premium Interactive 3D Project Card ── */
function ProjectCard3D({ project, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  /* Mouse-responsive 3D tilt */
  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    setMousePos({ x: xPct, y: yPct });

    const tiltX = ((y / rect.height) - 0.5) * -14;
    const tiltY = ((x / rect.width) - 0.5) * 14;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const statusClass = statusClassMap[project.status] || '';

  return (
    <motion.article
      ref={cardRef}
      className={`project-3d-card ${isHovered ? 'project-3d-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Dynamic Specular Light Flare */}
      <div
        className="project-3d-sheen"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(96, 165, 250, 0.18) 0%, rgba(34, 211, 238, 0.04) 40%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Layer 1: Ambient Lighting Border */}
      <div className="project-3d-glow-border" aria-hidden="true" />

      {/* Layer 2: Elevated 3D Content Surface */}
      <div className="project-3d-inner">
        {/* Top Header: Number & Status */}
        <div className="project-3d-header">
          <div className="project-3d-meta">
            <span className="project-3d-number" aria-hidden="true">
              {formatNumber(index + 1)}
            </span>
            <span className="project-3d-category">{project.category}</span>
          </div>

          <div className="project-3d-status-wrap">
            <span className={`project-3d-status ${statusClass}`}>
              <span className="project-3d-status-dot" />
              {project.status}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="project-3d-title">{project.title}</h3>

        {/* Description */}
        <p className="project-3d-desc">{project.description}</p>

        {/* Technology Badges */}
        <div className="project-3d-tags" aria-label="Technologies used">
          {project.tags.map((tag) => (
            <span key={tag} className="project-3d-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Interactive Action Buttons */}
        <div className="project-3d-actions">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn project-btn--github"
              aria-label={`View ${project.title} on GitHub`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span>GitHub</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              className="project-btn project-btn--live"
              onClick={(e) => {
                if (project.liveUrl.startsWith('#')) {
                  e.preventDefault();
                  // Trigger IRIS if it's #iris
                  const irisBtn = document.querySelector('.iris-mascot');
                  if (irisBtn) irisBtn.click();
                }
              }}
              aria-label={`Interact with ${project.title}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Interactive Preview</span>
            </a>
          )}

          {project.metrics && (
            <span className="project-3d-metric">
              <span className="project-3d-metric-icon">◈</span>
              {project.metrics}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ── Projects Section ── */
export default function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="projects" className="section projects-section" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <motion.header
          className="projects-header"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">04 — Software Projects</p>
          <h2 className="section-title">
            Engineered <em>Software Solutions</em>
          </h2>
          <p className="projects-subtitle">
            Actual software applications, artificial intelligence models, and IoT security systems developed by Shahariyar Khan Rashad.
          </p>
        </motion.header>

        {/* 3D Projects Grid */}
        <div className="projects-3d-grid" role="list">
          {projects.map((project, index) => (
            <ProjectCard3D
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
