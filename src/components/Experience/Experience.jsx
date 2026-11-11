import { useState, useRef, useEffect, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { experienceData } from '../../data/portfolio.js';
import SectionHeader from '../SectionHeader/SectionHeader';
import ExperienceTreeCanvas from './ExperienceTreeCanvas';
import ExperienceCardHanging from './ExperienceCardHanging';
import './Experience.css';

const REVEAL_THRESHOLDS = [0.12, 0.38, 0.64, 0.86];

export default function Experience() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Derive revealed states directly from current progress
  const revealedStates = [
    progress >= REVEAL_THRESHOLDS[0],
    progress >= REVEAL_THRESHOLDS[1],
    progress >= REVEAL_THRESHOLDS[2],
    progress >= REVEAL_THRESHOLDS[3],
  ];

  // Sequential Storytelling Auto-Progression when in viewport
  useEffect(() => {
    if (!isInView || !isPlaying) return;

    let animId;
    let startTime = null;
    const duration = 7500; // 7.5s complete journey down the tree

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(1, elapsed / duration);

      setProgress(t);

      if (t < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [isInView, isPlaying]);

  // Scroll Progress Synchronization
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how far section has scrolled through viewport
    const totalDist = rect.height + windowHeight;
    const currentDist = windowHeight - rect.top;
    const scrollRatio = Math.max(0, Math.min(1, currentDist / totalDist));

    // If user is actively scrolling, update progress accordingly
    if (scrollRatio > 0.05 && scrollRatio < 0.95) {
      setProgress((prev) => Math.max(prev, scrollRatio));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Replay Explorer Journey
  const handleReplay = () => {
    setProgress(0);
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true);
    }, 50);
  };

  return (
    <section id="experience" className="experience section" ref={sectionRef}>
      <div className="container" ref={containerRef}>
        {/* Section Header */}
        <SectionHeader
          theme="experience"
          badgeText="Professional Journey"
          highlightWord="Experience"
          subtitle="An interactive journey through my digital tree of growth, knowledge, and experience."
          align="center"
        />

        {/* ── Interactive 3D Tree Environment Stage ── */}
        <div className="exp-tree-stage">
          {/* 3D WebGL Canvas (Tree Trunk, Winding Path & Walking Explorer) */}
          <ExperienceTreeCanvas progress={progress} isVisible={isInView} />

          {/* Central Corridor Guide Marker (for assistive devices / visual anchor) */}
          <div className="exp-pathway-guide" aria-hidden="true">
            <span className="exp-pathway-label">WINDING PATHWAY</span>
          </div>

          {/* ── 4 Alternating Hanging Card Slots ── */}
          <div className="exp-hanging-slots-grid">
            {experienceData.map((item, index) => {
              const side = index % 2 === 0 ? 'left' : 'right';
              const isRevealed = revealedStates[index];

              return (
                <div
                  key={item.id}
                  className={`exp-tree-tier exp-tree-tier--${index} exp-tree-tier--${side}`}
                >
                  <ExperienceCardHanging
                    item={item}
                    index={index}
                    isRevealed={isRevealed}
                    side={side}
                  />
                </div>
              );
            })}
          </div>

          {/* ── Storytelling Explorer HUD Controls ── */}
          <div className="exp-story-hud" aria-label="Experience tree controls">
            <button
              type="button"
              className="exp-hud-btn exp-hud-btn--replay"
              onClick={handleReplay}
              aria-label="Replay Walking Explorer Journey"
              title="Replay Explorer Journey"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
              <span>Replay Journey</span>
            </button>

            {/* Journey Progress Indicators */}
            <div className="exp-hud-milestones">
              {experienceData.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className={`exp-hud-dot ${revealedStates[idx] ? 'exp-hud-dot--active' : ''}`}
                  onClick={() => setProgress(REVEAL_THRESHOLDS[idx] + 0.05)}
                  aria-label={`Jump to ${item.title}`}
                  title={item.title}
                >
                  <span className="exp-hud-dot-fill" />
                </button>
              ))}
            </div>

            <div className="exp-hud-status">
              <span className="exp-hud-pulse" />
              <span className="exp-hud-status-text">
                {progress < 0.2
                  ? 'Explorer Descending...'
                  : progress < 0.95
                  ? `Branch ${revealedStates.filter(Boolean).length} / 4 Discovered`
                  : 'Journey Complete'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
