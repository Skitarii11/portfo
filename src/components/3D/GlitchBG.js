import { useRef} from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GlitchBackground = () => {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
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
      
      float t = floor(uTime * 15.0); 

      float isGlitching = step(0.85, random(vec2(t * 0.05, 0.0))); 
      
      float bandY = floor(uv.y * 40.0);
      float bandOffset = (random(vec2(bandY, t)) - 0.5) * 0.15;
      
      uv.x += bandOffset * isGlitching;

      float rgbShift = 0.02 * random(vec2(bandY, t * 2.0)) * isGlitching;
      

      vec3 baseColor = vec3(0.02, 0.03, 0.03); 
      
      vec2 grid = floor(uv * vec2(50.0, 80.0));
      
      float rBlock = step(0.95, random(floor(vec2(uv.x + rgbShift, uv.y) * vec2(50.0, 80.0)) + t));
      float gBlock = step(0.95, random(grid + t)); // Green stays in the center
      float bBlock = step(0.95, random(floor(vec2(uv.x - rgbShift, uv.y) * vec2(50.0, 80.0)) + t));
      
      vec3 blockColor = vec3(rBlock, gBlock, bBlock);
      blockColor *= vec3(0.39, 1.0, 0.85); // Cyan tint

      float scanline = sin(vUv.y * 1000.0) * 0.03;
      
      vec3 finalColor = baseColor + (blockColor * 0.8 * isGlitching) - scanline;
      
      float flash = step(0.98, random(vec2(bandY, t))) * isGlitching;
      finalColor += vec3(0.39, 1.0, 0.85) * flash * 0.6; 
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh>
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
}; // ['#4deeea', '#f52d6a', '#64ffda']

export default GlitchBackground;