import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { personalInfo } from '../../data/portfolio.js';
import './Education.css';

export default function Education() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="education" className="education section" ref={sectionRef}>
      <div className="container">
        {/* Section Label */}
        <motion.div
          className="section-label"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Academic Foundation
        </motion.div>

        {/* Section Title */}
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Formal <em>Education</em>
        </motion.h2>

        {/* Experimental Editorial Academic Timeline */}
        <div className="education-editorial-container">
          <motion.div
            className="education-card"
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="education-indicator-col">
              <span className="education-glyph">◈</span>
              <div className="education-rule-line" aria-hidden="true" />
            </div>

            <div className="education-body">
              <div className="education-meta-strip">
                <span className="education-batch-pill">Batch {personalInfo.batch}</span>
                <span className="education-status-tag">Undergraduate Studies</span>
              </div>

              <h3 className="education-institution">{personalInfo.university}</h3>
              <p className="education-department">Department of {personalInfo.department}</p>

              <div className="education-editorial-quote">
                "Cultivating a rigorous foundation in software architecture, algorithms, and computational theory to engineer next-generation intelligent systems."
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
