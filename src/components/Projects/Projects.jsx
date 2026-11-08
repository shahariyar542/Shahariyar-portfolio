import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { projects } from '../../data/portfolio';
import './Projects.css';

const statusClassMap = {
  'Active': 'projects-status--active',
  'In Development': 'projects-status--in-development',
  'Concept': 'projects-status--concept',
};

const formatNumber = (num) => String(num).padStart(2, '0');

/* ── Single Project Card with 3D Tilt ── */
function ProjectCard({ project, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-60px' });

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded((prev) => !prev);
    }
  }, []);

  /* 3D Tilt Mouse Interaction */
  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 8, y: x * 8 });
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
      className={`projects-card${isExpanded ? ' projects-card--expanded' : ''}`}
      onClick={toggleExpand}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-label={`${project.title} — ${project.status}. Click to ${isExpanded ? 'collapse' : 'expand'} details.`}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Specular glass reflection sheen */}
      <div
        className="projects-card-sheen"
        style={{
          opacity: isHovered ? 0.8 : 0,
          background: `radial-gradient(circle at ${(tilt.y + 4) * 12 + 50}% ${(-tilt.x + 4) * 12 + 50}%, rgba(34, 211, 238, 0.12), transparent 60%)`,
        }}
        aria-hidden="true"
      />

      <div className="projects-card-row">
        {/* Large futuristic number */}
        <span className="projects-number" aria-hidden="true">
          {formatNumber(index + 1)}
        </span>

        {/* Title area */}
        <div className="projects-title-area">
          <div className="projects-meta-bar">
            <span className="projects-number--mobile" aria-hidden="true">
              {formatNumber(index + 1)}
            </span>
            <span className="projects-category">{project.category}</span>
          </div>
          <h3 className="projects-title">{project.title}</h3>
        </div>

        {/* Status badge */}
        <div className="projects-status-container">
          <span className={`projects-status ${statusClass}`}>
            <span className="projects-status-indicator" />
            {project.status}
          </span>
          <span className="projects-expand-icon" aria-hidden="true">
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </div>

      {/* Expandable details */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="projects-expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="projects-expand-inner">
              <p className="projects-description">{project.description}</p>
              <div className="projects-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="projects-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile persistent summary */}
      <div className="projects-expand-mobile">
        <div className="projects-expand-inner">
          <p className="projects-description">{project.description}</p>
          <div className="projects-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="projects-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Projects Section ── */
export default function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="section projects-section" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <motion.header
          className="projects-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">03 — Projects</p>
          <h2 className="section-title">
            Featured <em>Engineering Works</em>
          </h2>
          <p className="projects-subtitle">
            A curated showcase of artificial intelligence, security, and systems engineering projects.
          </p>
        </motion.header>

        {/* Project Cards List */}
        <div className="projects-list" role="list">
          {projects.map((project, index) => (
            <ProjectCard
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
