import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { achievements } from '../../data/portfolio';
import './Achievements.css';

/* ── Achievements Section ── */
export default function Achievements() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: '-40px' });

  const futureRef = useRef(null);
  const futureInView = useInView(futureRef, { once: true, margin: '-40px' });

  const achievement = achievements[0];

  return (
    <section id="achievements" className="section achievements-section" ref={sectionRef}>
      <div className="achievements-container">
        {/* Section Header */}
        <motion.header
          className="achievements-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">05 — Achievements</p>
          <h2 className="section-title">
            <em>Recognition</em>
          </h2>
        </motion.header>

        {/* Main Achievement Card */}
        <div className="achievements-showcase" ref={cardRef}>
          <motion.article
            className="achievements-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={cardInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="achievements-icon" aria-hidden="true">✦</span>
            <h3 className="achievements-title">{achievement.title}</h3>
            <p className="achievements-award">{achievement.award}</p>
            <p className="achievements-description">{achievement.description}</p>
          </motion.article>
        </div>

        {/* Future Achievements */}
        <motion.div
          className="achievements-future"
          ref={futureRef}
          initial={{ opacity: 0, y: 20 }}
          animate={futureInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="achievements-future-text">More achievements to come.</p>
          <div className="achievements-placeholder-grid" aria-hidden="true">
            <div className="achievements-placeholder">
              <span className="achievements-placeholder-text">Coming Soon</span>
            </div>
            <div className="achievements-placeholder">
              <span className="achievements-placeholder-text">Coming Soon</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
