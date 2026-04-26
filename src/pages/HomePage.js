import React, { Suspense, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, OrbitControls } from '@react-three/drei';

import MatrixPlane from '../components/3D/MatrixPlane';
import WireframeMan from '../components/3D/WireframeMan';
import ScrollIndicator from '../components/UI/ScrollIndicator';

const SceneContent = () => {
  const { viewport } = useThree();
  const controlsRef = useRef();
  const scroll = useScroll();

  const matrixRef = useRef();
  const manRef = useRef();
  const indicatorRef = useRef();

  useFrame((state) => {
    const offset = scroll.offset;

    state.camera.position.y = -offset * viewport.height;
    if (controlsRef.current) {
      controlsRef.current.target.y = state.camera.position.y;
      controlsRef.current.update();
    }
    
    const fadeOutOpacity = 1 - scroll.range(0, 1 / 3);
    if (matrixRef.current) {
      matrixRef.current.material.opacity = fadeOutOpacity;
    }
    if (indicatorRef.current) {
      indicatorRef.current.traverse(child => {
        if(child.material) child.material.opacity = fadeOutOpacity;
      });
    }

    const fadeInOpacity = scroll.range(0.33, 0.66);
    if (manRef.current) {
      manRef.current.traverse(child => {
        if(child.isMesh) {
          child.material.opacity = fadeInOpacity;
          child.material.transparent = true;
        }
      });
    }
  });

  return (
    <>
      <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} enableRotate={false} />

      {/* --- Section 1: Top of the Page --- */}
      <MatrixPlane
        ref={matrixRef}
        width={viewport.width}
        height={viewport.height}
      />
      
      <group ref={indicatorRef}>
        <ScrollIndicator />
      </group>
      
      {/* --- Section 2: Scrolled-to Content --- */}
      <Suspense fallback={null}>
        <group position={[0, -viewport.height, 0]}>
          <WireframeMan ref={manRef} scale={1} position={[0, -1, 0]} />
        </group>
      </Suspense>
    </>
  );
};

const HomePage = () => {
  return (
    <ScrollControls pages={2} damping={0.3}>
      <SceneContent />
    </ScrollControls>
  );
};

export default HomePage;