import React, { Suspense, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

import MatrixPlane from '../components/3D/MatrixPlane';
import WireframeMan from '../components/3D/WireframeMan';
import ScrollIndicator from '../components/UI/ScrollIndicator';

const SceneContent = () => {
  const { viewport } = useThree();
  const controlsRef = useRef();
  const scroll = useScroll();

  const manRef = useRef();
  const matrixRef = useRef();
  const indicatorRef = useRef();
  const textRef = useRef();

  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 5),                        // 1. Start in front of MatrixPlane
      new THREE.Vector3(0, -viewport.height * 0.1, 5),   // 2. ANCHOR POINT
      new THREE.Vector3(0, -viewport.height, 5),         // 3. Arrive directly in front of the man's chest
      new THREE.Vector3(3, -viewport.height, 3),     // 4. Orbit to the right side
      new THREE.Vector3(0, -viewport.height, -3),    // 5. Orbit to the back
      new THREE.Vector3(-3, -viewport.height, 3),     // 6. Orbit to the left
      new THREE.Vector3(0, -viewport.height+2, 4),    // 7. go to head
    ];
    return new THREE.CatmullRomCurve3(points);
  }, [viewport.height]);

  const tempTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    curve.getPointAt(scroll.offset, state.camera.position);

    const lookAtProgress = scroll.range(0, 1 / 3);
    const targetY = THREE.MathUtils.lerp(0, -viewport.height, lookAtProgress);
    tempTarget.set(0, targetY, 0);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(tempTarget, 0.1);
      controlsRef.current.update();
    }
    
    const fadeOutOpacity = 1 - scroll.range(0.05, 1 / 3);
    if (matrixRef.current) matrixRef.current.material.opacity = fadeOutOpacity;
    if (indicatorRef.current) {
      indicatorRef.current.traverse(child => {
        if(child.material) child.material.opacity = fadeOutOpacity;
      });
    }

    const fadeInOpacity = scroll.range(1 / 10, 1 / 2);
    if (manRef.current) {
      manRef.current.traverse(child => {
        if(child.isMesh) {
          child.material.opacity = fadeInOpacity;
          child.material.transparent = true;
        }
      });
    }

    const textOpacity = scroll.curve(
        0.4, // Start fading in at 40% of the scroll
        0.2  // The total length of the fade in/out is 20% of the scroll
    );

    if (textRef.current) {
      textRef.current.fillOpacity = textOpacity;
    }

  });

  return (
    <>
      <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} enableRotate={false} />

      <MatrixPlane
        ref={matrixRef}
        width={viewport.width}
        height={viewport.height}
        position={[0, 0, 0]}
      />
      
      <group ref={indicatorRef}>
        <ScrollIndicator />
      </group>
      
      <Suspense fallback={null}>
        <group position={[0, -viewport.height, 0]}>
          <WireframeMan ref={manRef} scale={1} position={[0, -6, 2]} />
          <Text
            ref={textRef}
            position={[0, 0, 0]}
            rotation={[0,45,0]}
            fontSize={0.3}
            color="#64ffda"
            anchorX="left"
            anchorY="middle"
            fillOpacity={0}
          >
            {`I build immersive\nand interactive\nweb experiences.`}
          </Text>
        </group>
      </Suspense>
    </>
  );
};


const HomePage = () => {
  return (
    <ScrollControls pages={10} damping={0.3}>
      <SceneContent />
    </ScrollControls>
  );
};

export default HomePage;