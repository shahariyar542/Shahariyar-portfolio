import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experienceData } from '../../data/portfolio.js';
import './Experience.css';

function ExperienceTimelineCard({ item, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const isEven = index % 2 === 1;

  return (
    <motion.div
      ref={cardRef}
      className={`exp-timeline-item ${isEven ? 'exp-timeline-item--right' : 'exp-timeline-item--left'}`}
      initial={{ opacity: 0, y: 35, x: isEven ? 25 : -25 }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 35, x: isEven ? 25 : -25 }}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Node Marker along the timeline spine */}
      <div className={`exp-timeline-node exp-timeline-node--${item.badgeType}`}>
        <div className="exp-node-core" />
        <div className="exp-node-halo" aria-hidden="true" />
      </div>

      {/* Interactive Card */}
      <article className={`exp-card exp-card--${item.badgeType}`}>
        <div className="exp-card-glow" aria-hidden="true" />

        {/* Top Meta Bar */}
        <div className="exp-card-header">
          <div className="exp-badge-group">
            <span className={`exp-badge exp-badge--${item.badgeType}`}>
              <span className="exp-badge-dot" />
              {item.badge}
            </span>
            <span className="exp-period">{item.period}</span>
          </div>
          <span className="exp-org-tag">{item.organization}</span>
        </div>

        {/* Card Body */}
        <div className="exp-card-content">
          <h3 className="exp-title">{item.title}</h3>
          <p className="exp-role">{item.role}</p>
          <p className="exp-desc">{item.description}</p>

          {/* Key Contributions */}
          {item.highlights && item.highlights.length > 0 && (
            <ul className="exp-highlights-list">
              {item.highlights.map((h, i) => (
                <li key={i} className="exp-highlight-item">
                  <span className="exp-highlight-bullet">▹</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Technology Badges */}
          {item.technologies && (
            <div className="exp-tech-tags">
              {item.technologies.map((tech) => (
                <span key={tech} className="exp-tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </motion.div>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="experience section" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <motion.header
          className="section-header experience-header"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">03 — Professional Journey</p>
          <h2 className="section-title">
            <em>Experience</em>
          </h2>
          <p className="section-subtitle">
            My Journey Through Technology, Development &amp; Innovation
          </p>
        </motion.header>

        {/* Timeline Spine Container */}
        <div className="exp-timeline-wrap">
          <div className="exp-timeline-spine" aria-hidden="true" />
          <div className="exp-timeline-list">
            {experienceData.map((item, index) => (
              <ExperienceTimelineCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
