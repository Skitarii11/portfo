import React, { useRef, useEffect } from 'react';
import './AnimatedText.css';

/**
 * A component that animates text by revealing one letter at a time.
 * @param {object} props - The component props.
 * @param {string} props.text - The text to animate.
 * @param {number} [props.stagger=0.05] - The delay in seconds between each letter's animation.
 * @param {string} [props.className] - Optional additional class names for styling.
 */
const AnimatedText = ({
  text,
  stagger = 0.05,
  className = '',
  glow = true,
  glowMinDelay = 2.0,
  glowMaxDelay = 5.0,
}) => {
  const letters = text.split('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (!glow || !containerRef.current) return;

    let scanLoopTimeoutId;
    let removeClassTimeoutId;

    const startScanLoop = () => {
      const container = containerRef.current;
      if (!container) return;

      // 1. ADD THE TRIGGER CLASS
      container.classList.add('scanning');

      // 2. CALCULATE WHEN THE SCAN WILL BE FINISHED
      const letterGlowDuration = 0.5; // Must match the duration in CSS
      const totalScanDuration = (letters.length * stagger + letterGlowDuration) * 1000;

      // 3. SCHEDULE THE REMOVAL OF THE TRIGGER CLASS
      removeClassTimeoutId = setTimeout(() => {
        if (containerRef.current) { // Check if component still exists
          containerRef.current.classList.remove('scanning');
        }
      }, totalScanDuration);

      // 4. SCHEDULE THE NEXT SCAN AT A RANDOM INTERVAL
      const randomDelay = (Math.random() * (glowMaxDelay - glowMinDelay) + glowMinDelay) * 1000;
      scanLoopTimeoutId = setTimeout(startScanLoop, randomDelay + totalScanDuration);
    };

    // Wait for the initial typewriter animation to finish before starting the loop
    const initialAnimationDuration = (letters.length * stagger) * 1000;
    const initialTimeoutId = setTimeout(startScanLoop, initialAnimationDuration + 1000); // 1s buffer

    return () => {
      clearTimeout(initialTimeoutId);
      clearTimeout(scanLoopTimeoutId);
      clearTimeout(removeClassTimeoutId);
    };

  }, [text, stagger, glow, glowMinDelay, glowMaxDelay]);

  return (
    <span ref={containerRef} className={`animated-text-container ${className}`}>
      {letters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className="animated-letter"
          style={{ animationDelay: `${index * stagger}s` }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;