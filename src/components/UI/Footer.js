import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <div className="info-block">
          <span>DEVELOPED BY</span>
          <p>Javkhlan Tselmeg</p>
        </div>
        <div className="info-block">
          <span>LOCATION</span>
          <p>Ulaanbaatar, Mongolia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;