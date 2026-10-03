import React from 'react';
import { Outlet } from 'react-router-dom';
import '../pages/PageStyles.css';

const HtmlLayout = () => {
  return (
    <div className="html-overlay">
      <Outlet />
    </div>
  );
};

export default HtmlLayout;