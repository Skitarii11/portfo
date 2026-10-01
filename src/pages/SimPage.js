import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PointerLockControls as PointerLockControlsImpl } from 'three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from 'three';

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

// --- First Person Camera Controller ---
const FpsController = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const [isLocked, setIsLocked] = useState(false);

  const { forward, backward, left, right } = usePlayerControls();
  const direction = new THREE.Vector3();
  const speed = 15;

  // Setup PointerLock & Camera Memory
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

      // Restore camera when leaving SimPage
      camera.position.copy(initialPosition);
      camera.rotation.copy(initialRotation);
    };
  }, [camera, gl.domElement]);

  // 2D DOM Overlay on document.body
  useEffect(() => {
    if (isLocked) return;

    // Outer full-screen overlay
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

    // Prompt Box Container
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
  }, [isLocked]);

  useFrame((state, delta) => {
    if (!isLocked) return;

    direction.z = Number(forward) - Number(backward);
    direction.x = Number(right) - Number(left);
    direction.normalize();

    if (forward || backward) camera.translateZ(-direction.z * speed * delta);
    if (left || right) camera.translateX(direction.x * speed * delta);

    camera.position.y = 2; 
  });

  return null;
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
        <meshBasicMaterial 
          wireframe={true} 
          toneMapped={false} 
        />
        <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
      </instancedMesh>
    </group>
  );
};

const SimPage = () => {
  return (
    <>
      <color attach="background" args={['#031A1F']} />
      <fogExp2 attach="fog" args={['#0a0315', 0.03]} />
      
      <Suspense fallback={null}>
        <FpsController />
        <DynamicBlocks />
      </Suspense>
    </>
  );
};

export default SimPage;