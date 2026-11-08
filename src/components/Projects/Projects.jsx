import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import { projects } from '../../data/portfolio';
import './Projects.css';

/* ── Status badge class mapper ── */
const statusClassMap = {
  'Active': 'projects-status--active',
  'In Development': 'projects-status--in-development',
  'Concept': 'projects-status--concept',
};

/* ── Format number with leading zero ── */
const formatNumber = (num) => String(num).padStart(2, '0');

/* ── Single Project Card ── */
function ProjectCard({ project, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const statusClass = statusClassMap[project.status] || '';

  return (
    <motion.article
      ref={cardRef}
      className={`projects-card${isExpanded ? ' projects-card--expanded' : ''}`}
      onClick={toggleExpand}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-label={`${project.title} — ${project.status}. Click to ${isExpanded ? 'collapse' : 'expand'} details.`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="projects-card-row">
        {/* Large number — desktop */}
        <motion.span
          className="projects-number"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.3, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.7, delay: index * 0.1 + 0.15, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          {formatNumber(index + 1)}
        </motion.span>

        {/* Title area */}
        <motion.div
          className="projects-title-area"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Small number for mobile */}
          <span className="projects-number--mobile" aria-hidden="true">
            {formatNumber(index + 1)}
          </span>
          <h3 className="projects-title">{project.title}</h3>
          <span className="projects-category">{project.category}</span>
        </motion.div>

        {/* Status badge */}
        <motion.span
          className={`projects-status ${statusClass}`}
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {project.status}
        </motion.span>
      </div>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="projects-expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="projects-expand-inner">
              <p className="projects-description">{project.description}</p>
              <div className="projects-tags">
                {project.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    className="projects-tag"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: always show description */}
      <div className="projects-expand-mobile">
        <div className="projects-expand-inner">
          <p className="projects-description">{project.description}</p>
          <div className="projects-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="projects-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="projects-divider" aria-hidden="true" />
    </motion.article>
  );
}

/* ── Projects Section ── */
export default function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="section projects-section" ref={sectionRef}>
      <div className="projects-container">
        {/* Section Header */}
        <motion.header
          className="projects-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">03 — Projects</p>
          <h2 className="section-title">
            Selected <em>Works</em>
          </h2>
        </motion.header>

        {/* Project Cards */}
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
