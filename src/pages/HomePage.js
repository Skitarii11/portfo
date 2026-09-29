import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, OrbitControls, Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

import WireframeMan from '../components/3D/WireframeMan';
import ScrollIndicator from '../components/UI/Scrollindicator.js';

const GlitchBackground = () => {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      // Pass elapsed time into the shader for animation
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;

    // 2D Random generator
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      
      // Quantize time to create a "steppy" digital feel instead of smooth motion
      float t = floor(uTime * 15.0); 

      // 1. GLOBAL GLITCH TRIGGER
      // This makes the glitch happen sporadically, not constantly (active ~15% of the time)
      float isGlitching = step(0.85, random(vec2(t * 0.05, 0.0))); 
      
      // 2. HORIZONTAL TEARING (BANDS)
      // Break the Y-axis into chunky bands
      float bandY = floor(uv.y * 40.0);
      // Generate a random horizontal offset for each band
      float bandOffset = (random(vec2(bandY, t)) - 0.5) * 0.15;
      
      // Apply the X offset only when glitching is active
      uv.x += bandOffset * isGlitching;

      // 3. CHROMATIC ABERRATION (RGB SPLIT)
      // Determine how far to pull apart the red and blue channels
      float rgbShift = 0.02 * random(vec2(bandY, t * 2.0)) * isGlitching;
      
      // 4. GENERATE DIGITAL DATA BLOCKS
      // Base background color (very dark grey-cyan)
      vec3 baseColor = vec3(0.02, 0.03, 0.03); 
      
      // Create random blocks of data
      vec2 grid = floor(uv * vec2(50.0, 80.0));
      
      // Sample blocks with RGB offsets for the chromatic glitch effect
      float rBlock = step(0.95, random(floor(vec2(uv.x + rgbShift, uv.y) * vec2(50.0, 80.0)) + t));
      float gBlock = step(0.95, random(grid + t)); // Green stays in the center
      float bBlock = step(0.95, random(floor(vec2(uv.x - rgbShift, uv.y) * vec2(50.0, 80.0)) + t));
      
      // Combine the blocks and tint them to your theme (#64ffda / cyan)
      vec3 blockColor = vec3(rBlock, gBlock, bBlock);
      blockColor *= vec3(0.39, 1.0, 0.85); // Cyan tint

      // 5. SCANLINES
      // Add subtle CRT scanlines across the whole screen
      float scanline = sin(vUv.y * 1000.0) * 0.03;
      
      // 6. COMPILE FINAL COLOR
      vec3 finalColor = baseColor + (blockColor * 0.8 * isGlitching) - scanline;
      
      // Add occasional full-band bright flashes
      float flash = step(0.98, random(vec2(bandY, t))) * isGlitching;
      finalColor += vec3(0.39, 1.0, 0.85) * flash * 0.6; 
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh>
      {/* Same large cylinder setup to enclose the scrolling camera */}
      <cylinderGeometry args={[20, 20, 100, 32, 1, true]} />
      <shaderMaterial
        ref={materialRef}
        side={THREE.BackSide}
        transparent={false}
        depthWrite={false}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};
// ----------------------------------------------------

const SceneContent = () => {
  const { viewport, camera } = useThree();
  const controlsRef = useRef();
  const scroll = useScroll();
  const navigate = useNavigate();

  const manRef = useRef();
  const indicatorRef = useRef();
  const textRef1 = useRef();
  const textRef2 = useRef();

  useEffect(() => {
    return () => {
      camera.position.set(0, 0, 5);
      camera.rotation.set(0, 0, 0);
      
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    };
  }, [camera]);

  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 5),
      new THREE.Vector3(0, -viewport.height * 0.1, 5),
      new THREE.Vector3(0, -viewport.height, 5),
      new THREE.Vector3(3, -viewport.height, 3),
      new THREE.Vector3(0, -viewport.height, -3),
      new THREE.Vector3(-3, -viewport.height, 3),
      new THREE.Vector3(0, -viewport.height+2, 4),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, [viewport.height]);

  const tempTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!scroll || !curve) return;

    curve.getPointAt(scroll.offset, state.camera.position);

    const lookAtProgress = scroll.range(0, 1 / 3);
    const targetY = THREE.MathUtils.lerp(0, -viewport.height, lookAtProgress);
    tempTarget.set(0, targetY, 0);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(tempTarget, 0.1);
      controlsRef.current.update();
    }
    
    if (indicatorRef.current) {
      indicatorRef.current.traverse(child => {
        if(child.material) child.material.opacity = 1 - scroll.range(0.05, 1 / 3);
      });
    }

    const fadeInOpacity = scroll.range(1 / 10, 1 / 2);
    if (manRef.current) {
      manRef.current.traverse(child => {
        if(child.isMesh) {
          child.material.opacity = fadeInOpacity;
          child.material.transparent = true;
        }
      });
    }

    const textOpacity1 = scroll.curve(0.4, 0.2);
    if (textRef1.current) {
      textRef1.current.fillOpacity = textOpacity1;
    }

    const textOpacity2 = scroll.curve(0.73, 0.2);
    if (textRef2.current) {
      textRef2.current.fillOpacity = textOpacity2;
    }

    const buttonOpacity = scroll.range(0.9, 0.1);
    window.dispatchEvent(new CustomEvent('explore-button-opacity', { detail: buttonOpacity }));
  });

  if (!curve) return null;

  return (
    <>
      <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} enableRotate={false} />

      <GlitchBackground />

      <group ref={indicatorRef} position={[0, 0, 2]}>
        <ScrollIndicator />
      </group>
      
      <Suspense fallback={null}>
        <group position={[0, -viewport.height, 0]}>
          <WireframeMan ref={manRef} scale={1} position={[0, -6, 2]} />
          <Text
            ref={textRef1}
            position={[0, 0, 1]}
            rotation={[0,45,0]}
            fontSize={0.3}
            color="#64ffda"
            anchorX="left"
            anchorY="middle"
            fillOpacity={0}
          >
            {`Hi, i'm Javkhlan.\nIndependent, creative\nsoftware engineer.`}
          </Text>

           <Text
            ref={textRef2}
            position={[-2, 0, -2]}
            rotation={[0, -45, 0]}
            fontSize={0.3}
            color="#64ffda"
            anchorX="left"
            anchorY="middle"
            fillOpacity={0}
          >
            {`You are welcome\nto explore my digital space.`}
          </Text>
        </group>
      </Suspense>
    </>
  );
};

const HomePage = () => {
  return (
    <ScrollControls pages={10} damping={0.3}>
      <SceneContent />
    </ScrollControls>
  );
};

export default HomePage;