import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BlurTextProps {
  text: string;
  className?: string;
}

export const BlurText: React.FC<BlurTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        rowGap: '0.1em',
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          style={{
            display: 'inline-block',
            marginRight: '0.28em',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 24 }
          }
          transition={{
            duration: 0.6,
            delay: index * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};
