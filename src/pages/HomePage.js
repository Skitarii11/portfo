import React, { Suspense } from 'react';
import { useThree } from '@react-three/fiber';
import WireframeMan from '../components/3D/WireframeMan';
import ScrollIndicator from '../components/UI/ScrollIndicator';

const HomePage = () => {
  const { viewport } = useThree();
  return (
    <>
      <Suspense fallback={null}>
        <WireframeMan scale={1} position={[0, -5, 0]} />
        <group position={[0, -viewport.height / 2 + 1.5, 0]}>
          <ScrollIndicator />
        </group>
      </Suspense>
    </>
  );
};

export default HomePage;