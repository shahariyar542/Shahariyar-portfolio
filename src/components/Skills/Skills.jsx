import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { skills } from '../../data/portfolio.js';
import './Skills.css';

const categoryKeys = Object.keys(skills);

const proficiencyColors = {
  'Daily Driver': 'var(--color-accent-cyan)',
  'Comfortable': 'var(--color-accent-cyan)',
  'Working Knowledge': 'var(--color-accent-blue)',
  'Learning & Building': '#93C5FD',
  'Academic Foundation': 'var(--color-text-secondary)',
  'Exploring & Learning': 'var(--color-accent-cyan)',
};

/* Decorative background dots */
const bgDots = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: i % 3 === 0 ? 4 : 2,
  delay: i * 0.1,
}));

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(categoryKeys[0]);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const activeSkills = skills[activeCategory];

  return (
    <section
      id="skills"
      className="skills section section-dark"
      ref={sectionRef}
    >
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-label"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          02 — Technical Matrix
        </motion.div>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Skills & <em>Competencies</em>
        </motion.h2>

        {/* Main Layout: Tabs + Display */}
        <motion.div
          className="skills-layout"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Category Tabs */}
          <nav className="skills-tabs" aria-label="Skill categories">
            {categoryKeys.map((key) => {
              const category = skills[key];
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  className={`skills-tab ${isActive ? 'skills-tab--active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                  aria-pressed={isActive}
                >
                  <span className="skills-tab-icon" aria-hidden="true">
                    {category.icon}
                  </span>
                  <span className="skills-tab-label">{category.label}</span>
                  {isActive && (
                    <motion.span
                      className="skills-tab-glow"
                      layoutId="activeTabGlow"
                      transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Skill Display Area */}
          <div className="skills-display">
            {/* Cyber Grid & Constellation Points */}
            <div className="skills-constellation" aria-hidden="true">
              {bgDots.map((dot) => (
                <motion.span
                  key={dot.id}
                  className="skills-bg-dot"
                  style={{
                    left: dot.left,
                    top: dot.top,
                    width: dot.size,
                    height: dot.size,
                  }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.4 } : {}}
                  transition={{ duration: 1, delay: dot.delay }}
                />
              ))}
            </div>

            {/* Category Header */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="skills-display-header"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="skills-category-badge">
                  <span className="skills-display-icon" aria-hidden="true">
                    {activeSkills.icon}
                  </span>
                  <h3 className="skills-display-title">{activeSkills.label}</h3>
                </div>
                <span className="skills-count-pill">
                  {activeSkills.items.length} {activeSkills.items.length === 1 ? 'Skill' : 'Skills'}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Skill Nodes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="skills-nodes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {activeSkills.items.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className="skills-node"
                    layoutId={skill.name}
                    initial={{ opacity: 0, scale: 0.88, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88, y: -10 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <div className="skills-node-inner">
                      <div className="skills-node-icon-wrapper">
                        <span className="skills-node-glyph">✦</span>
                      </div>
                      <div className="skills-node-info">
                        <span className="skills-node-name">{skill.name}</span>
                        <span
                          className="skills-node-level"
                          style={{
                            color:
                              proficiencyColors[skill.level] ||
                              'var(--color-accent-cyan)',
                          }}
                        >
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
