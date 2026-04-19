import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useScroll, Scroll, TorusKnot, Text } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

import SciFiComputer from './3D/Sci-fi_computer';
import ScrollIndicator from './UI/ScrollIndicator';


const Experience = () => {
  const scroll = useScroll();
  const controlsRef = useRef();
  const torusRef = useRef();
  const computerRef = useRef();

  const { camera, viewport } = useThree();
  const sceneHeight = viewport.height;

  useFrame((state, delta) => {
    const offset = scroll.offset;
    camera.position.y = -offset * sceneHeight;
    
    if (controlsRef.current) {
      controlsRef.current.target.y = camera.position.y;
      controlsRef.current.update();
    }

    const torusOpacity = 1 - scroll.range(0, 1 / 3);
    const computerOpacity = scroll.range(1 / 3, 1 / 3);

    if (torusRef.current && torusRef.current.material) {
        torusRef.current.material.opacity = torusOpacity;
        torusRef.current.material.transparent = true;
    }

    if (computerRef.current) {
        computerRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.opacity = computerOpacity;
                child.material.transparent = true;
            }
        });
        computerRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />

      {/* LIGHTS */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} color="#FF0000" intensity={4} />
      
      {/* HOME PAGE SECTION */}
      <TorusKnot ref={torusRef} args={[7, 1.5, 128, 16]}>
        <meshStandardMaterial
            color="#FF0000"
            metalness={0.3}
            roughness={0.5}
            wireframe
        />
      </TorusKnot>

       <Scroll>
          <group position={[0, 0, 0]}> {/* Position the entire indicator group */}
             <ScrollIndicator />
          </group>
      </Scroll>
      
      {/* ABOUT PAGE SECTION */}
      <group position={[0, -sceneHeight, 0]} ref={computerRef}>
        <SciFiComputer scale={1.5} />
      </group>


      {/* HTML OVERLAY CONTENT */}
      <Scroll html>
        <div style={{ height: '100vh' }}></div>
        <div className='about-section'>
            <h2>About Me</h2>
            <p>I am a passionate developer creating futuristic web experiences...</p>
            <p>This scene features a 3D model I find interesting. It's rendered using React Three Fiber.</p>
        </div>
      </Scroll>
    </>
  );
};

export default Experience;