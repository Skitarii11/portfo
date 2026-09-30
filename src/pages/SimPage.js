import React,{Suspense} from 'react';
import GlitchBackground from '../components/3D/GlitchBG.js';
import { OrbitControls, TorusKnot } from '@react-three/drei';

const SimPage =()=> {
    return (
    <>
      <GlitchBackground />
      <Suspense fallback={null}>
        <OrbitControls enableZoom={true} enablePan={true} />
        <TorusKnot args={[7, 1.5, 128, 16]}>
            <meshStandardMaterial
                color="#FF0000"
                metalness={0.3}
                roughness={0.5}
                wireframe
            />
      </TorusKnot>
      </Suspense>
    </>
  );
}

export default SimPage