import { useState, useEffect, useRef } from 'react';
import './Portrait3D.css';

/**
 * CyberTerminalPortrait (Portrait3D)
 * Renders the authentic cyber holographic neon monitor terminal matching the user's reference.
 * The character's face, eyes, and terminal physically and dramatically turn in 3D perspective
 * directly toward whichever surrounding card the user hovers or approaches.
 */
export default function Portrait3D({
  targetGaze = { x: 0, y: 0 },
  activeCard = null,
  onResetGaze,
}) {
  const containerRef = useRef(null);
  const [currentGaze, setCurrentGaze] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const animFrameRef = useRef(null);
  const currentGazeRef = useRef({ x: 0, y: 0 });
  const targetGazeRef = useRef({ x: 0, y: 0 });

  // Keep target ref synced
  useEffect(() => {
    targetGazeRef.current = targetGaze;
  }, [targetGaze]);

  // Smooth lerp loop with responsive spring physics
  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      const cur = currentGazeRef.current;
      const tgt = targetGazeRef.current;

      // Snappy yet smooth lerp factor
      const nextX = lerp(cur.x, tgt.x, 0.16);
      const nextY = lerp(cur.y, tgt.y, 0.16);

      currentGazeRef.current = { x: nextX, y: nextY };
      setCurrentGaze({ x: nextX, y: nextY });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Periodic natural micro-blink
  useEffect(() => {
    let blinkTimeout;
    const scheduleNextBlink = () => {
      const delay = Math.random() * 2500 + 3500;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 150);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Quick focus pulse on target switch
  const prevCardRef = useRef(null);
  useEffect(() => {
    if (activeCard && activeCard !== prevCardRef.current) {
      prevCardRef.current = activeCard;
      setIsBlinking(true);
      const timer = setTimeout(() => setIsBlinking(false), 120);
      return () => clearTimeout(timer);
    }
  }, [activeCard]);

  // Direct face mouse move
  const handleFaceMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    targetGazeRef.current = {
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, ny)),
    };
  };

  const handleFaceMouseLeave = () => {
    setIsHovered(false);
    if (onResetGaze) onResetGaze();
  };

  // DRAMATIC 3D ROTATION:
  // When hovering a card, the head and terminal clearly turn up to +/- 28 degrees horizontally (yaw)
  // and up to +/- 18 degrees vertically (pitch)
  const headRotateY = currentGaze.x * 28;
  const headRotateX = -currentGaze.y * 18;
  const translateZ = Math.min(45, (Math.abs(currentGaze.x) + Math.abs(currentGaze.y)) * 25);
  const parallaxX = currentGaze.x * 18;
  const parallaxY = currentGaze.y * 14;

  // Directional lighting highlight angles
  const lightX = 50 + currentGaze.x * 35;
  const lightY = 50 + currentGaze.y * 35;

  // Active target label
  const getGazeStatus = () => {
    if (!activeCard) return 'NEURAL GAZE: CALIBRATED (CENTER)';
    switch (activeCard) {
      case 'role-1':
        return 'TARGET LOCKED: ↖ SOFTWARE ENGINEERING';
      case 'role-2':
        return 'TARGET LOCKED: ↗ PROJECT BUILDER & ARCHITECT';
      case 'role-3':
        return 'TARGET LOCKED: ↙ RESEARCH ENTHUSIAST';
      case 'role-4':
        return 'TARGET LOCKED: ↘ AI TECHNOLOGY EXPLORER';
      default:
        return 'TARGET LOCKED: SYNCHRONIZED';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`cyber-terminal-wrapper ${isHovered ? 'cyber-terminal-wrapper--hovered' : ''} ${activeCard ? 'cyber-terminal-wrapper--locked' : ''}`}
      onMouseMove={handleFaceMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleFaceMouseLeave}
    >
      {/* Background Cyber Ambient Glow & Overhead Beam Lights */}
      <div className="cyber-ambient-backdrop" aria-hidden="true">
        <div className="cyber-light-beam cyber-light-beam--left" />
        <div className="cyber-light-beam cyber-light-beam--right" />
        <div
          className="cyber-radial-glow"
          style={{
            transform: `translate(${currentGaze.x * -24}px, ${currentGaze.y * -20}px)`,
          }}
        />
      </div>

      {/* 3D Perspective Stage */}
      <div className="cyber-3d-stage">
        {/* The 3D Pivoting Cyber Monitor Terminal */}
        <div
          className="cyber-terminal-monitor"
          style={{
            transform: `perspective(700px) rotateX(${headRotateX}deg) rotateY(${headRotateY}deg) translateZ(${translateZ}px)`,
          }}
        >
          {/* External Left Metallic Grab Handle */}
          <div className="cyber-handle cyber-handle--left" aria-hidden="true" />

          {/* External Right Metallic Grab Handle */}
          <div className="cyber-handle cyber-handle--right" aria-hidden="true" />

          {/* Glowing Outer Neon Cyan Tube Rim */}
          <div className="cyber-neon-bezel">
            <div className="cyber-neon-tube" />
          </div>

          {/* Display Screen Content Area */}
          <div className="cyber-screen-viewport">
            {/* The Stylized Cyber Portrait Image (with internal parallax shift) */}
            <div
              className="cyber-portrait-layer"
              style={{
                transform: `scale(1.08) translate(${parallaxX}px, ${parallaxY}px)`,
              }}
            >
              <img
                src="/images/cyber_portrait.jpg"
                alt="Shahariyar Khan Rashad - Cyber 3D Holographic Portrait"
                className="cyber-portrait-img"
                draggable={false}
              />
            </div>

            {/* Neural Circuit Energy Lightning Overlay */}
            <div
              className={`cyber-lightning-overlay ${activeCard ? 'cyber-lightning--boosted' : ''}`}
              aria-hidden="true"
            />

            {/* Dynamic Directional Shadow & Specular Glare */}
            <div
              className="cyber-directional-glare"
              style={{
                background: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(0, 240, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 25%, transparent 65%)`,
              }}
              aria-hidden="true"
            />

            {/* Eyelid Blink Shadow (Natural micro-blink) */}
            <div className={`cyber-screen-blink ${isBlinking ? 'cyber-screen-blink--active' : ''}`} />

            {/* Futuristic Corner Brackets inside screen */}
            <div className="cyber-corner cyber-corner--tl" aria-hidden="true" />
            <div className="cyber-corner cyber-corner--tr" aria-hidden="true" />
            <div className="cyber-corner cyber-corner--bl" aria-hidden="true" />
            <div className="cyber-corner cyber-corner--br" aria-hidden="true" />

            {/* Realtime Gaze Vector HUD Banner */}
            <div className="cyber-hud-banner">
              <div className="cyber-hud-indicator">
                <span className={`cyber-hud-dot ${activeCard ? 'cyber-hud-dot--active' : ''}`} />
                <span className="cyber-hud-text">{getGazeStatus()}</span>
              </div>
              <div className="cyber-hud-metrics">
                <span>YAW: {headRotateY > 0 ? `+${headRotateY.toFixed(0)}°` : `${headRotateY.toFixed(0)}°`}</span>
                <span>PITCH: {headRotateX > 0 ? `+${headRotateX.toFixed(0)}°` : `${headRotateX.toFixed(0)}°`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Industrial Tiered Pedestal Base */}
        <div className="cyber-pedestal-stand" aria-hidden="true">
          <div className="cyber-pedestal-neck" />
          <div className="cyber-pedestal-plate-upper" />
          <div className="cyber-pedestal-plate-lower" />
          <div className="cyber-pedestal-cables" />
          <div className="cyber-pedestal-glow" />
        </div>
      </div>

      {/* Cyber Tag Label Under Terminal */}
      <div className="cyber-identity-tag">
        <span className="cyber-tag-name">MD. SHAHARIYAR KHAN RASHAD</span>
        <span className="cyber-tag-role">AI ENGINEER &amp; SOFTWARE ARCHITECT • 3D NEURAL PORTRAIT</span>
      </div>
    </div>
  );
}
