import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import AnimatedText from './AnimatedText';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [exploreOpacity, setExploreOpacity] = useState(0);

  useEffect(() => {
    const handleOpacity = (e) => {
      setExploreOpacity(e.detail);
    };

    window.addEventListener('explore-button-opacity', handleOpacity);
    return () => window.removeEventListener('explore-button-opacity', handleOpacity);
  }, []);

  const goToAboutPage = () => {
    navigate('/about');
  };

  const isHome = location.pathname === '/';

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

      {isHome && (
        <div 
          className="explore-button-container" 
          style={{ 
            pointerEvents: exploreOpacity > 0.5 ? 'auto' : 'none',
            position: 'absolute',
            left: '50%',
            top: '50vh',
            transform: 'translate(-50%, -50%) scale(2)',
            visibility: exploreOpacity > 0.5 ? 'visible' : 'hidden'
          }}
        >
          {exploreOpacity > 0.5 && (
            <button className="hire-me-btn" onClick={goToAboutPage}>
              <span><AnimatedText text="EXPLORE" stagger={0.4} /></span>
            </button>
          )}
        </div>
      )}

      <nav className="main-nav">
        <Link to="/">
          <span><AnimatedText text="\home" stagger={0.4} /></span>
        </Link>
        <Link to="/about">
          <span><AnimatedText text="\about" stagger={0.4} /></span>
        </Link>
        <Link to="/work">
          <span><AnimatedText text="\work" stagger={0.4} /></span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;