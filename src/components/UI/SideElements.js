import React from 'react';
import './SideElements.css';
import AnimatedText from './AnimatedText';

const SideElements = () => {
  return (
    <>
      {/* Left Side Elements (Social Links) */}
      <div className="side-element left">
        <ul className="social-links">
          <li><a href="https://github.com/Skitarii11" target="_blank" rel="noopener noreferrer"><AnimatedText text="github" stagger={0.2} /></a></li>
        </ul>
      </div>

      {/* Right Side Elements (Email) */}
      <div className="side-element right">
        <div className="email-link">
          <a href="mailto:jawhaairon1@gmail.com"><AnimatedText text="jawhaairon1@gmail.com" stagger={0.2} /></a>
        </div>
      </div>
    </>
  );
};

export default SideElements;