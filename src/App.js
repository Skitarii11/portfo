import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';

import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import SideElements from './components/UI/SideElements';
import Experience from './components/Experience';
import './styles/main.css';

const handleCanvasCreated = ({ gl }) => {
  gl.setClearColor(0x000000, 0);
};

function App() {
  return (
    <div className="app-container">
      <div className="ui-overlay">
        <Header />
        <Footer />
      </div>
      <SideElements />

      <Canvas style={{ background: 'transparent' }} gl={{ alpha: true }} onCreated={handleCanvasCreated}>
        <Suspense fallback={null}>
          <ScrollControls pages={2} damping={0.3}>
            <Experience />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;