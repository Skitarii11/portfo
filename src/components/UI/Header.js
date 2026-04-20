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
            <span className="japanese-text">フリーランス</span>
            <AnimatedText text="Hire/me" stagger={0.4} />
        </button>
      </div>
      <nav className="main-nav">
        <a href="#home"><AnimatedText text="\home" stagger={0.4} /></a>
        <a href="#about"><AnimatedText text="\about" stagger={0.4} /></a>
        <a href="#work"><AnimatedText text="\work" stagger={0.4} /></a>
        <a href="#info"><AnimatedText text="\info" stagger={0.4} /></a>
      </nav>
    </header>
  );
};

export default Header;