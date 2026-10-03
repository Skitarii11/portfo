import React from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot } from '@react-three/drei';

const Scene = () => {
  const meshRef = React.useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7.5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} color="#f52d6a" intensity={4} />

      <OrbitControls enableZoom={true} enablePan={true} />

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