import { motion, AnimatePresence } from 'framer-motion';
import './Loader.css';

const title = 'SHAHARIYAR.EXE';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const barVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.6 },
  },
};

const screenExit = {
  y: '-100%',
  transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
};

export default function Loader({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loader-screen"
          exit={screenExit}
          key="loader"
        >
          {/* Staggered title */}
          <motion.div
            className="loader-title"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label={title}
          >
            {title.split('').map((char, i) => (
              <motion.span
                key={i}
                className="loader-letter"
                variants={letterVariants}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>

          {/* Loading bar */}
          <div className="loader-bar-track">
            <motion.div
              className="loader-bar-fill"
              variants={barVariants}
              initial="hidden"
              animate="visible"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
