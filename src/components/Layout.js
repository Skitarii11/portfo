import React from 'react';
import { Outlet } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';

import Header from './UI/Header';
import Footer from './UI/Footer';
import SideElements from './UI/SideElements';

const Layout = () => {
  return (
    <div className="app-container">
      {/* Persistent HTML UI */}
      <div className="ui-overlay">
        <Header />
        <Footer />
      </div>
      <SideElements />

      {/* Persistent 3D Canvas */}
      <Canvas gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        
        {/* Page-specific 3D content will be rendered here by the router */}
        <Outlet />
      </Canvas>
    </div>
  );
};

export default Layout;