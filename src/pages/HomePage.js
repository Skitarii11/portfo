import React, { Suspense, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, OrbitControls, Text, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

import WireframeMan from '../components/3D/WireframeMan';
import ScrollIndicator from '../components/UI/ScrollIndicator';

const SceneContent = () => {
  const { viewport } = useThree();
  const controlsRef = useRef();
  const scroll = useScroll();
  const navigate = useNavigate();

  const manRef = useRef();
  const indicatorRef = useRef();
  const textRef1 = useRef();
  const textRef2 = useRef();
  const htmlButtonRef = useRef();

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

  const goToAboutPage = () => {
    navigate('/about');
  };

  useFrame((state) => {
    if (!scroll || !curve) return;

    curve.getPointAt(scroll.offset, state.camera.position);

    const lookAtProgress = scroll.range(0, 1 / 3);
    const targetY = THREE.MathUtils.lerp(0, -viewport.height, lookAtProgress);
    tempTarget.set(0, targetY, 0);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(tempTarget, 0.1);
      controlsRef.current.update();
    }
    
    if (indicatorRef.current) {
      indicatorRef.current.traverse(child => {
        if(child.material) child.material.opacity = 1 - scroll.range(0.05, 1 / 3);
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

    const textOpacity1 = scroll.curve(0.4, 0.2);
    if (textRef1.current) {
      textRef1.current.fillOpacity = textOpacity1;
    }

    const textOpacity2 = scroll.curve(
        0.73,
        0.2
    );

    if (textRef2.current) {
      textRef2.current.fillOpacity = textOpacity2;
    }

    const buttonOpacity = scroll.range(0.9, 0.1);
    window.dispatchEvent(new CustomEvent('explore-button-opacity', { detail: buttonOpacity }));
  });

  if (!curve) {
    return null;
  }

  return (
    <>
      <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} enableRotate={false} />

      <group ref={indicatorRef}>
        <ScrollIndicator />
      </group>
      
      <Suspense fallback={null}>
        <group position={[0, -viewport.height, 0]}>
          <WireframeMan ref={manRef} scale={1} position={[0, -6, 2]} />
          <Text
            ref={textRef1}
            position={[0, 0, 1]}
            rotation={[0,45,0]}
            fontSize={0.3}
            color="#64ffda"
            anchorX="left"
            anchorY="middle"
            fillOpacity={0}
          >
            {`Hi, i'm Javkhlan.\nIndependent, creative\nsoftware engineer.`}
          </Text>

           <Text
            ref={textRef2}
            position={[-2, 0, -2]}
            rotation={[0, -45, 0]}
            fontSize={0.3}
            color="#64ffda"
            anchorX="left"
            anchorY="middle"
            fillOpacity={0}
          >
            {`You are welcome\nto explore my digital space.`}
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