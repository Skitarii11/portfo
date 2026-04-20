import React from 'react';
import './AnimatedText.css';

/**
 * A component that animates text by revealing one letter at a time.
 * @param {object} props - The component props.
 * @param {string} props.text - The text to animate.
 * @param {number} [props.stagger=0.05] - The delay in seconds between each letter's animation.
 * @param {string} [props.className] - Optional additional class names for styling.
 */
const AnimatedText = ({ text, stagger = 0.05, className = '' }) => {
  const letters = text.split('');

  return (
    <span className={`animated-text-container ${className}`}>
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