import React, { Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot } from '@react-three/drei';
import Model from './Sci-fi_computer';

const Scene = () => {
  const meshRef = React.useRef();

  // Simple animation to rotate the mesh
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7.5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} color="#f52d6a" intensity={4} />

      {/* Controls */}
      <OrbitControls enableZoom={true} enablePan={true} />

      {/* Your 3D Model */}
      <TorusKnot ref={meshRef} args={[7, 1.5, 128, 16]}>
        <meshStandardMaterial
          color="#FF0000"
          metalness={0.3}
          roughness={0.5}
          wireframe
        />
      </TorusKnot>
    </>
  );
};

export default Scene;