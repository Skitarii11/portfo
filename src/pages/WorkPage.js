import React, { Suspense } from 'react';
import CyberdeckComputer from '../components/3D/CyberdeckComputer';

const WorkPage = () => {
  return (
    <>
      <Suspense fallback={null}>
        <CyberdeckComputer scale={3} position={[0, -0.55, 3.5]} rotation={[0, 0, 0]} /> //0, -0.35, 4.5 zoom in position
      </Suspense>
    </>
  );
};

export default WorkPage;