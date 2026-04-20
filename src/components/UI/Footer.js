import React from 'react';
import './Footer.css';
import AnimatedText from './AnimatedText';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <div className="info-block">
          <span><AnimatedText text="DEVELOPED BY " stagger={0.1} /></span>
          <p><AnimatedText text=" Javkhlan Tselmeg" stagger={0.1} /></p>
        </div>
      </div>
      <div className="footer-right">
        <div className="info-block">
          <span><AnimatedText text="LOCATION " stagger={0.1} /></span>
          <p><AnimatedText text=" Ulaanbaatar, Mongolia" stagger={0.1} /></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;