import React, { Suspense } from 'react';
import CyberdeckComputer from '../components/3D/CyberdeckComputer';

const WorkPage = () => {
  return (
    <>
      <Suspense fallback={null}>
        <CyberdeckComputer scale={0.8} position={[0, -1, 0]} rotation={[0.1, 0.3, -0.1]} />
      </Suspense>
    </>
  );
};

export default WorkPage;