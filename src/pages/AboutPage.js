import React, { Suspense } from 'react';
import SciFiComputer from '../components/3D/Sci-fi_computer';

const AboutPage = () => {
  return (
    <>
      <Suspense fallback={null}>
        <SciFiComputer scale={2} position={[-3, 0, 0]} rotation={[0.4, 0, 0]}/>
      </Suspense>
    </>
  );
};

export default AboutPage;