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
  glowMinDelay = 0.5,
  glowMaxDelay = 2.0,
}) => {
  const letters = text.split('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (!glow || !containerRef.current) return;

    let glowTimeoutId;

    const startGlowLoop = () => {
      const letterElements = containerRef.current.children;
      if (letterElements.length === 0) return;

      const randomIndex = Math.floor(Math.random() * letterElements.length);
      const randomLetter = letterElements[randomIndex];

      randomLetter.classList.add('glowing');

      setTimeout(() => {
        randomLetter.classList.remove('glowing');
      }, 1000);

      const randomDelay = (Math.random() * (glowMaxDelay - glowMinDelay) + glowMinDelay) * 1000;
      glowTimeoutId = setTimeout(startGlowLoop, randomDelay);
    };

    const initialAnimationDuration = (letters.length * stagger) * 1000;
    const initialTimeoutId = setTimeout(startGlowLoop, initialAnimationDuration + 500);

    return () => {
      clearTimeout(initialTimeoutId);
      clearTimeout(glowTimeoutId);
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