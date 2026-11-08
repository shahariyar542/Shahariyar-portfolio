import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { researchInterests } from '../../data/portfolio';
import './Research.css';

/* ── Single Research Card ── */
function ResearchCard({ interest, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });

  return (
    <motion.article
      ref={cardRef}
      className="research-card"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <span className="research-card-icon" aria-hidden="true">
        {interest.icon}
      </span>
      <h3 className="research-card-title">{interest.title}</h3>
      <p className="research-card-description">{interest.description}</p>
    </motion.article>
  );
}

/* ── Research Section ── */
export default function Research() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const noteRef = useRef(null);
  const noteInView = useInView(noteRef, { once: true, margin: '-40px' });

  return (
    <section id="research" className="section section-dark research-section" ref={sectionRef}>
      <div className="research-container">
        {/* Section Header */}
        <motion.header
          className="research-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">04 — Research</p>
          <h2 className="section-title">
            Research & <em>Exploration</em>
          </h2>
        </motion.header>

        {/* Research Interests Grid */}
        <div className="research-grid">
          {researchInterests.map((interest, index) => (
            <ResearchCard
              key={interest.title}
              interest={interest}
              index={index}
            />
          ))}
        </div>

        {/* Future Research Note */}
        <motion.aside
          ref={noteRef}
          className="research-note"
          initial={{ opacity: 0, x: -20 }}
          animate={noteInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Future research note"
        >
          <p className="research-note-text">
            <span className="research-note-icon" aria-hidden="true">✦</span>
            This section will grow with publications, research papers, and collaborative projects as my academic journey progresses.
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
