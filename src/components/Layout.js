import React from 'react';
import { Outlet } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';

import Header from './UI/Header';
import Footer from './UI/Footer';
import SideElements from './UI/SideElements';
import MatrixPlane from './3D/MatrixPlane';

const SceneBackground = () => {
    const { viewport } = useThree();
    return <MatrixPlane width={viewport.width} height={viewport.height} />;
};

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
        
        {/* Background Effect */}
        <SceneBackground />
        
        {/* Page-specific 3D content will be rendered here by the router */}
        <Outlet />
      </Canvas>
    </div>
  );
};

export default Layout;