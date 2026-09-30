import React, { Suspense } from 'react';
import { useSpring, animated } from '@react-spring/three';
import CyberdeckComputer from '../components/3D/CyberdeckComputer';
import GlitchBackground from '../components/3D/GlitchBG.js';


const AnimatedCyberdeck = () => {
  const springs = useSpring({
    from: {
      position: [0, -0.2, 3.5],
      rotation: [0.5, 0, 0],
    },
    to: {
      position: [0, -0.35, 4.5],
      rotation: [0, 0, 0],
    },
    delay: 2000,
    config: { duration: 1000 },
    onRest: () => {
      const work = document.getElementsByClassName('work-section')[0];
      work.style.display = 'flex';
    }
  });

  return (
    <animated.group
      scale={3}
      position={springs.position}
      rotation={springs.rotation}
    >
      <CyberdeckComputer />
    </animated.group>
  );
};

const WorkPage = () => {
  return (
    <>
      <GlitchBackground />
      <Suspense fallback={null}>
        <AnimatedCyberdeck />
      </Suspense>
    </>
  );
};

export default WorkPage;