import React, { Suspense } from 'react';
import SciFiComputer from '../components/3D/Sci-fi_computer';

const AboutPage = () => {
  return (
    <>
      <Suspense fallback={null}>
        <SciFiComputer scale={1.5} position={[0, -1.5, 0]} />
      </Suspense>
    </>
  );
};

export default AboutPage;