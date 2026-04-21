import React from 'react';
import './Header.css';
import AnimatedText from './AnimatedText';

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-left">
        <div className="logo">
          <svg width="100" height="40" viewBox="0 0 60 40">
             <text x="0" y="30" fill="var(--accent-pink)" fontSize="30" fontWeight="bold">./src</text>
          </svg>
          <div className="logo-text">
            <span><AnimatedText text="JAVKHLAN" stagger={0.4} /></span>
            <div className="dots-container">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          </div>
        </div>
        <button className="hire-me-btn">
            <span><AnimatedText text="Hire/me" stagger={0.4} /></span>
        </button>
      </div>
      <nav className="main-nav">
        <a href="#home"><span><AnimatedText text="\home" stagger={0.4} /></span></a>
        <a href="#about"><span><AnimatedText text="\about" stagger={0.4} /></span></a>
        <a href="#work"><span><AnimatedText text="\work" stagger={0.4} /></span></a>
        <a href="#info"><span><AnimatedText text="\info" stagger={0.4} /></span></a>
      </nav>
    </header>
  );
};

export default Header;