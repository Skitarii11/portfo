import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';

import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import SideElements from './components/UI/SideElements';

import Experience from './components/Experience'; // Our new main component
import './styles/main.css';

function App() {
  return (
    <div className="app-container">
      {/* The UI remains outside the Canvas for crisp rendering */}
      <div className="ui-overlay">
        <Header />
        <Footer />
      </div>
      <SideElements />

      <Canvas>
        <Suspense fallback={null}>
          {/* 
            pages={2} means our scroll area is twice the height of the viewport.
            damping={0.3} makes the scroll feel smooth.
          */}
          <ScrollControls pages={2} damping={0.3}>
            <Experience />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;