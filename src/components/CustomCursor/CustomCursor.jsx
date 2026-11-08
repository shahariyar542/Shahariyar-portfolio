import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  /* ── Motion values for dot (direct) ── */
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  /* ── Springy motion values for ring (lagging) ── */
  const ringX = useSpring(dotX, springConfig);
  const ringY = useSpring(dotY, springConfig);

  /* ── Detect touch devices ── */
  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    setIsTouch(isTouchDevice);

    if (!isTouchDevice) {
      document.body.classList.add('custom-cursor-active');
    }

    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  /* ── Mouse move handler ── */
  const handleMouseMove = useCallback(
    (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [dotX, dotY, isVisible]
  );

  /* ── Mouse leave / enter ── */
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);

  /* ── Hover detection for interactive elements ── */
  const handleHoverIn = useCallback(() => setIsHovering(true), []);
  const handleHoverOut = useCallback(() => setIsHovering(false), []);

  useEffect(() => {
    if (isTouch) return;

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    /* Observe interactive elements */
    const interactiveSelectors = 'a, button, [role="button"], input[type="submit"], .cursor-hover';
    const interactiveEls = document.querySelectorAll(interactiveSelectors);
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverIn);
      el.addEventListener('mouseleave', handleHoverOut);
    });

    /* MutationObserver to catch dynamically added elements */
    const observer = new MutationObserver(() => {
      const newEls = document.querySelectorAll(interactiveSelectors);
      newEls.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverIn);
        el.removeEventListener('mouseleave', handleHoverOut);
        el.addEventListener('mouseenter', handleHoverIn);
        el.addEventListener('mouseleave', handleHoverOut);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      interactiveEls.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverIn);
        el.removeEventListener('mouseleave', handleHoverOut);
      });
      observer.disconnect();
    };
  }, [isTouch, handleMouseMove, handleMouseLeave, handleMouseEnter, handleHoverIn, handleHoverOut]);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{
          x: dotX,
          y: dotY,
          opacity: isVisible ? 1 : 0,
        }}
        aria-hidden="true"
      />
      <motion.div
        className={`cursor-ring${isHovering ? ' cursor-ring--hover' : ''}`}
        style={{
          x: ringX,
          y: ringY,
          opacity: isVisible ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </>
  );
}
