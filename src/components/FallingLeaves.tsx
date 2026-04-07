'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type LeafOptions = {
  id: number;
  xOffset: number;
  size: number;
  duration: number;
  delay: number;
  rotationStart: number;
  rotationEnd: number;
  xSway1: number;
  xSway2: number;
};

// A simple SVG leaf path we can reuse
const leafSvg = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-60">
    <path d="M17.5 4.5c-2.3 0-4.5.9-6.1 2.5-1.1 1.1-1.9 2.5-2.2 4.1-.3 1.5-.1 3.1.6 4.5.7 1.4 1.8 2.5 3.1 3.2 1.4.7 3 .9 4.5.6 1.6-.3 3-.1 4.1-1.2 1.6-1.6 2.5-3.8 2.5-6.1 0-4.2-3.4-7.6-7.6-7.6zM15 17c-1.3 0-2.6-.5-3.5-1.5-.9-1-1.4-2.2-1.4-3.5 0-1.3.5-2.6 1.4-3.5.9-1 2.2-1.5 3.5-1.5 1.3 0 2.6.5 3.5 1.5.9 1 1.4 2.2 1.4 3.5 0 1.3-.5 2.6-1.4 3.5-.9 1-2.2 1.5-3.5 1.5z" />
  </svg>
);

export default function FallingLeaves() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);
  const [leaves, setLeaves] = useState<LeafOptions[]>([]);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWindowSize({ width, height });
    
    // Emil Kowalski performance principle: Reduce density on mobile (12 -> 6)
    const leafCount = isMobile ? 6 : 12;
    
    // Generate leaves once when mounted
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeaves(
      Array.from({ length: leafCount }).map((_, i) => ({
        id: i,
        xOffset: Math.random() * width,
        size: Math.random() * (isMobile ? 15 : 20) + 15, // Slightly smaller on mobile
        duration: Math.random() * 8 + 10,
        delay: Math.random() * 5,
        rotationStart: Math.random() * 360,
        rotationEnd: Math.random() * 360 + 360,
        xSway1: Math.random() * 100 - 50,
        xSway2: Math.random() * -100 + 50,
      }))
    );
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted || leaves.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute top-[-100px] text-brand-700/40"
          style={{
            left: leaf.xOffset,
            width: leaf.size,
            height: leaf.size,
            willChange: 'transform, opacity' // Hardware acceleration hint
          }}
          initial={{ y: -100, rotate: leaf.rotationStart, opacity: 0 }}
          animate={{
            y: windowSize.height + 100,
            rotate: leaf.rotationEnd,
            opacity: [0, 1, 1, 0],
            x: [0, leaf.xSway1, leaf.xSway2, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.2, 0.8, 1], // Timing mapping for opacity array
          }}
        >
          {leafSvg}
        </motion.div>
      ))}
    </div>
  );
}
