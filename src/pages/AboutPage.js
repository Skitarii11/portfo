import React, { Suspense, useState } from 'react';
import SciFiComputer from '../components/3D/Sci-fi_computer';
import GlitchBackground from '../components/3D/GlitchBG.js';
import { useSpring, animated } from '@react-spring/three';

const AnimatedSciFiComputer = () => {
  const [showContent, setShowContent] = useState(false);

  const springs = useSpring({
    from: {
      position: [-3, 0, 0],
      rotation: [0.4, 0, 0],
    },
    to: {
      position: [0, -0.6, 3.5],
      rotation: [0.3, 0, 0],
    },
    delay: 2000,
    config: { duration: 3000 },
    onRest: () => {
      setShowContent(true);
    },
  });

  return (
    <animated.group
      scale={3}
      position={springs.position}
      rotation={springs.rotation}
    >
      <SciFiComputer showContent={showContent} />
    </animated.group>
  );
};

const AboutPage = () => {
  return (
    <>
      <GlitchBackground />
      <Suspense fallback={null}>
        <AnimatedSciFiComputer />
      </Suspense>
    </>
  );
};

export default AboutPage;