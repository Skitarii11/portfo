import React from 'react';
import './SideElements.css';

const SideElements = () => {
  return (
    <>
      {/* Left Side Elements (Social Links) */}
      <div className="side-element left">
        <ul className="social-links">
          <li><a href="https://github.com/Skitarii11" target="_blank" rel="noopener noreferrer">github</a></li>
          <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">linkedin</a></li>
          <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">twitter</a></li>
        </ul>
      </div>

      {/* Right Side Elements (Email) */}
      <div className="side-element right">
        <div className="email-link">
          <a href="mailto:jawhaairon1@gmail.com">jawhaairon1@gmail.com</a>
        </div>
      </div>
    </>
  );
};

export default SideElements;