import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PointerLockControls as PointerLockControlsImpl } from 'three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from 'three';

const INTERACTABLES = [
  {
    id: 1,
    position: [-15, 2, -15],
    title: "// SYSTEM_LOG_01",
    text: "Neural synchronization completed at 98.4%. Primary render matrix online and functioning within nominal cyber-parameters."
  },
  {
    id: 2,
    position: [15, 2, -20],
    title: "// PROJECT_NEXUS",
    text: "Decentralized WebGL graphics pipeline initialized. Real-time procedural geometry streaming across sector 07."
  },
  {
    id: 3,
    position: [0, 2, -35],
    title: "// ARCHIVE_DATA",
    text: "Simulated reality framework executed inside React Three Fiber. Dynamic instantiation handling 12,800 active nodes."
  },
  {
    id: 4,
    position: [-22, 2, 10],
    title: "// TELEMETRY_04",
    text: "Quantum state vectors stable. Shaders compiling across grid coordinates with minimal fragment distortion."
  },
  {
    id: 5,
    position: [20, 2, 15],
    title: "// TERMINAL_OVERRIDE",
    text: "",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop"
  }
];

const GlitchBlockMaterial = () => {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const shader = useMemo(() => {
    return {
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

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
          float gBlock = step(0.95, random(grid + t));
          float bBlock = step(0.95, random(floor(vec2(uv.x - rgbShift, uv.y) * vec2(50.0, 80.0)) + t));
          
          vec3 blockColor = vec3(rBlock, gBlock, bBlock);
          blockColor *= vec3(0.39, 1.0, 0.85); // Cyan tint

          float scanline = sin(vUv.y * 1000.0) * 0.05;
          
          vec3 finalColor = baseColor + (blockColor * 0.8 * isGlitching) - scanline;
          
          float flash = step(0.98, random(vec2(bandY, t))) * isGlitching;
          finalColor += vec3(0.988, 0.176, 0.369) * flash * 0.6; 
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    };
  }, []);

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={shader.uniforms}
      vertexShader={shader.vertexShader}
      fragmentShader={shader.fragmentShader}
    />
  );
};

const usePlayerControls = () => {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': setMovement((m) => ({ ...m, forward: true })); break;
        case 'KeyS': setMovement((m) => ({ ...m, backward: true })); break;
        case 'KeyA': setMovement((m) => ({ ...m, left: true })); break;
        case 'KeyD': setMovement((m) => ({ ...m, right: true })); break;
        default: break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': setMovement((m) => ({ ...m, forward: false })); break;
        case 'KeyS': setMovement((m) => ({ ...m, backward: false })); break;
        case 'KeyA': setMovement((m) => ({ ...m, left: false })); break;
        case 'KeyD': setMovement((m) => ({ ...m, right: false })); break;
        default: break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return movement;
};

const InteractableObjects = ({ onNearChange }) => {
  const { camera } = useThree();
  const [activeNodes, setActiveNodes] = useState({});
  const nearestRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyE' && nearestRef.current !== null) {
        const id = nearestRef.current;
        setActiveNodes((prev) => ({ ...prev, [id]: !prev[id] }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useFrame(() => {
    let closestId = null;
    let minDistance = 7;

    INTERACTABLES.forEach((item) => {
      const itemPos = new THREE.Vector3(...item.position);
      const dist = camera.position.distanceTo(itemPos);

      if (dist < minDistance) {
        minDistance = dist;
        closestId = item.id;
      }
    });

    if (nearestRef.current !== closestId) {
      nearestRef.current = closestId;
      onNearChange(closestId);
    }
  });

  return (
    <group>
      {INTERACTABLES.map((item) => {
        const isOpen = activeNodes[item.id];

        return (
          <group key={item.id} position={item.position}>
            {!isOpen && (
              <group>
                <mesh>
                  <boxGeometry args={[4, 10, 4]} />
                  <meshBasicMaterial wireframe={true} color="#ffffff" />
                </mesh>

                <mesh>
                  <boxGeometry args={[3.95, 9.95, 3.95]} />
                  <GlitchBlockMaterial />
                </mesh>
              </group>
            )}

            {isOpen && (
              <Html
                transform
                distanceFactor={6}
                position={[0, 0, 0]}
                style={{ pointerEvents: 'none' }}
              >
                <div
                  style={{
                    width: '340px',
                    height: '500px',
                    padding: '16px',
                    background: 'rgba(3, 20, 28, 0.92)',
                    border: '1px solid #00f0ff',
                    boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                    borderRadius: '4px',
                    color: '#00f0ff',
                    fontFamily: 'monospace',
                    backdropFilter: 'blur(6px)',
                    boxSizing: 'border-box',
                    overflowY: 'auto'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      borderBottom: '1px dashed rgba(0, 240, 255, 0.5)',
                      paddingBottom: '6px',
                      marginBottom: '10px',
                      color: '#ffffff'
                    }}
                  >
                    {item.title}
                  </div>

                  {item.image && (
                    <div
                      style={{
                        marginBottom: '10px',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 240, 255, 0.4)',
                        boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '400px',
                          objectFit: 'fill',
                          display: 'block',
                          filter: 'contrast(1.1) brightness(0.9) saturate(1.2)'
                        }}
                      />
                    </div>
                  )}

                  <p style={{ fontSize: '0.8rem', lineHeight: '1.4', margin: 0, color: '#cceeff' }}>
                    {item.text}
                  </p>
                  <div style={{ fontSize: '0.65rem', color: '#f52d6a', marginTop: '10px', textAlign: 'right' }}>
                    [ PRESS E TO CLOSE ]
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};

const FpsController = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const [isLocked, setIsLocked] = useState(false);
  const [nearNodeId, setNearNodeId] = useState(null);

  const { forward, backward, left, right } = usePlayerControls();
  const direction = new THREE.Vector3();
  const speed = 15;

  useEffect(() => {
    const initialPosition = camera.position.clone();
    const initialRotation = camera.rotation.clone();

    const controls = new PointerLockControlsImpl(camera, gl.domElement);
    controlsRef.current = controls;

    const onLock = () => setIsLocked(true);
    const onUnlock = () => setIsLocked(false);

    controls.addEventListener('lock', onLock);
    controls.addEventListener('unlock', onUnlock);

    return () => {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }

      controls.removeEventListener('lock', onLock);
      controls.removeEventListener('unlock', onUnlock);
      controls.dispose();

      camera.position.copy(initialPosition);
      camera.rotation.copy(initialRotation);
    };
  }, [camera, gl.domElement]);

  useEffect(() => {
    if (isLocked) {
      if (!nearNodeId) return;

      const promptDiv = document.createElement('div');
      promptDiv.style.cssText = `
        position: fixed;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(5, 5, 10, 0.85);
        padding: 10px 20px;
        border-radius: 4px;
        border: 1px solid #00f0ff;
        color: #00f0ff;
        font-family: monospace;
        font-weight: bold;
        pointer-events: none;
        z-index: 999999;
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
      `;
      promptDiv.innerText = '[ E ] INTERACT WITH TERMINAL';
      document.body.appendChild(promptDiv);

      return () => {
        if (document.body.contains(promptDiv)) {
          document.body.removeChild(promptDiv);
        }
      };
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 999999;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
      text-align: center;
      background: rgba(5, 5, 10, 0.85);
      padding: 16px 28px;
      border-radius: 6px;
      border: 1px solid #00f0ff;
      color: #00f0ff;
      font-family: monospace;
      cursor: pointer;
      pointer-events: auto;
      user-select: none;
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.25);
      white-space: nowrap;
    `;

    box.innerHTML = `
      <div style="font-size: 1rem; font-weight: bold; margin-bottom: 6px;">
        [ CLICK TO ENTER CYBERSPACE ]
      </div>
      <div style="font-size: 0.8rem; color: #818589;">
        W A S D to Move | ESC to Exit
      </div>
    `;

    box.onclick = (e) => {
      e.stopPropagation();
      controlsRef.current?.lock();
    };

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    return () => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    };
  }, [isLocked, nearNodeId]);

  useFrame((state, delta) => {
    if (!isLocked) return;

    direction.z = Number(forward) - Number(backward);
    direction.x = Number(right) - Number(left);
    direction.normalize();

    if (forward || backward) camera.translateZ(-direction.z * speed * delta);
    if (left || right) camera.translateX(direction.x * speed * delta);

    camera.position.y = 2; 
  });

  return <InteractableObjects onNearChange={setNearNodeId} />;
};

const DynamicBlocks = () => {
  const gridSize = 80;
  const count = gridSize * gridSize * 2;
  const meshSolidRef = useRef();
  const meshWireRef = useRef();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const colors = useMemo(() => {
    const array = new Float32Array(count * 3);
    const color = new THREE.Color();
    const palette = ['#4deeea', '#f52d6a', '#64ffda'];
    
    for (let i = 0; i < count; i++) {
      color.set(palette[Math.floor(Math.random() * palette.length)]);
      color.toArray(array, i * 3);
    }
    return array;
  }, [count]);

  useFrame((state) => {
    let i = 0;
    const time = state.clock.elapsedTime * 1.5;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const posX = (x - gridSize / 2) * 3;
        const posZ = (z - gridSize / 2) * 3;

        const groundWave = Math.sin(posX * 0.2 + time) + Math.cos(posZ * 0.2 + time * 0.8);
        const hGround = Math.max(0.1, groundWave * 1 + 1);
        
        dummy.position.set(posX, -2 + hGround / 2, posZ);
        dummy.scale.set(2.8, hGround, 2.8);
        dummy.updateMatrix();
        meshSolidRef.current.setMatrixAt(i, dummy.matrix);
        meshWireRef.current.setMatrixAt(i, dummy.matrix);
        i++;

        const skyWave = Math.sin(posX * 0.3 - time * 0.5) * Math.cos(posZ * 0.3 - time * 0.5);
        const hSky = Math.max(0.1, skyWave * 3 + 3);
        
        dummy.position.set(posX, 20 - hSky / 2, posZ);
        dummy.scale.set(2.8, hSky, 2.8);
        dummy.updateMatrix();
        meshSolidRef.current.setMatrixAt(i, dummy.matrix);
        meshWireRef.current.setMatrixAt(i, dummy.matrix);
        i++;
      }
    }
    meshSolidRef.current.instanceMatrix.needsUpdate = true;
    meshWireRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshSolidRef} args={[null, null, count]}>
        <boxGeometry />
        <meshBasicMaterial color="#05050a" />
      </instancedMesh>
      
      <instancedMesh ref={meshWireRef} args={[null, null, count]}>
        <boxGeometry />
        <meshBasicMaterial wireframe={true} toneMapped={false} />
        <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
      </instancedMesh>
    </group>
  );
};

const SimPage = () => {
  return (
    <>
      <color attach="background" args={['#031A1F']} />
      <fogExp2 attach="fog" args={['#0a0315', 0.035]} />
      
      <Suspense fallback={null}>
        <FpsController />
        <DynamicBlocks />
      </Suspense>
    </>
  );
};

export default SimPage;