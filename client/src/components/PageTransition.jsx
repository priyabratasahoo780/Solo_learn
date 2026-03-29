import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import TransitionOverlay from './TransitionOverlay';

const PageTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full relative"
    >
      <AnimatePresence>
        {isTransitioning && <TransitionOverlay key="overlay" />}
      </AnimatePresence>
      {children}
    </motion.div>
  );
};

export default PageTransition;
