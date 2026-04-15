import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/3D/Scene';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import SideElements from './components/UI/SideElements';
import ScrollIndicator from './components/UI/Scrollindicator';
import './styles/main.css';

function App() {
  return (
    <div className="app-container">
      {/* 3D Canvas */}
      <Canvas>
        <Scene />
      </Canvas>

      {/* UI Overlay */}
      <div className="ui-overlay">
        <Header />
        <Footer />
      </div>
      
      {/* Other absolutely positioned UI elements */}
      <SideElements />
      <ScrollIndicator />
    </div>
  );
}

export default App;