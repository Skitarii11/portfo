import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-left">
        <div className="logo">
          {/* For complex logos, an SVG is best */}
          <svg width="100" height="40" viewBox="0 0 60 40">
             <text x="0" y="30" fill="var(--accent-pink)" fontSize="30" fontWeight="bold">./src</text>
          </svg>
          <div className="logo-text">
            <span>JAVKHLAN</span>
            <span>...</span>
          </div>
        </div>
        <button className="hire-me-btn">
            <span className="japanese-text">フリーランス</span>
            Hire/me
        </button>
      </div>
      <nav className="main-nav">
        <a href="#home">\home</a>
        <a href="#about">\about</a>
        <a href="#work">\work</a>
        <a href="#info">\info</a>
      </nav>
    </header>
  );
};

export default Header;