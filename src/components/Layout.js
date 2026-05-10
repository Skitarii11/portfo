import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import Header from './UI/Header';
import Footer from './UI/Footer';
import SideElements from './UI/SideElements';
import MatrixPlane from './3D/MatrixPlane';

const TransitionOverlay = () => {
  const { viewport } = useThree();
  const location = useLocation();
  const [opacity, setOpacity] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevLocation = useRef(location.pathname);
  const meshRef = useRef();

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      setIsTransitioning(true);
      setOpacity(1);
      
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        prevLocation.current = location.pathname;
      }, 1500); // Duration of the transition

      return () => clearTimeout(timer);
    }
  }, [location]);

  useFrame((state, delta) => {
    if (isTransitioning || opacity > 0) {
      if (!isTransitioning) {
        setOpacity(Math.max(0, opacity - delta * 1.5));
      }
      
      if (meshRef.current) {
        // Position it at a fixed distance in front of the camera
        const distance = 1.0; // Move it further back to avoid pixelation
        const cameraDir = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion);
        meshRef.current.position.copy(state.camera.position).add(cameraDir.multiplyScalar(distance));
        meshRef.current.quaternion.copy(state.camera.quaternion);

        // Scale to fill viewport at this distance
        const fov = state.camera.fov * (Math.PI / 180);
        const planeHeight = 2 * Math.tan(fov / 2) * distance;
        const planeWidth = planeHeight * (viewport.width / viewport.height);
        meshRef.current.scale.set(planeWidth, planeHeight, 1);
      }
    }
  });

  if (opacity <= 0 && !isTransitioning) return null;

  return (
    <MatrixPlane 
      ref={meshRef}
      width={1} 
      height={1} 
      transparent
      opacity={opacity}
      isTransition={true}
    />
  );
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
        
        <TransitionOverlay />

        {/* Page-specific 3D content will be rendered here by the router */}
        <Outlet />
      </Canvas>
    </div>
  );
};

export default Layout;