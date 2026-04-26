import React from 'react';
import { Outlet } from 'react-router-dom';
import '../pages/PageStyles.css';

const HtmlLayout = () => {
  return (
    // This div will sit on top of the canvas and hold the page's HTML.
    <div className="html-overlay">
      <Outlet />
    </div>
  );
};

export default HtmlLayout;