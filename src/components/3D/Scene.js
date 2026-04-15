import React from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

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
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} color="#f52d6a" intensity={2} />

      {/* Controls */}
      <OrbitControls enableZoom={false} enablePan={false} />

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

// To load your own model (e.g., a .glb file):
// 1. Put your model in the `public` folder.
// 2. Install `gltf-pipeline` to convert it to a component: npx gltf-pipeline -i model.glb -o model.js --draco.compressionLevel 10
// 3. Import and use it in your scene.