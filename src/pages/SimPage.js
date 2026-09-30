import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Html } from '@react-three/drei';
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
  const { camera } = useThree();
  const { forward, backward, left, right } = usePlayerControls();
  const direction = new THREE.Vector3();
  const speed = 15;

  useFrame((state, delta) => {
    direction.z = Number(forward) - Number(backward);
    direction.x = Number(right) - Number(left);
    direction.normalize();

    if (forward || backward) camera.translateZ(-direction.z * speed * delta);
    if (left || right) camera.translateX(direction.x * speed * delta);

    camera.position.y = 2; 
  });

  return (
    <>
      <PointerLockControls />
      <Html center wrapperClass="crosshair-ui" style={{ pointerEvents: 'none', color: '#00f0ff', fontFamily: 'monospace' }}>
        <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px' }}>
          [ CLICK TO ENTER CYBERSPACE ] <br/>
          W A S D to Move
        </div>
      </Html>
    </>
  );
};

const DynamicBlocks = () => {
  const gridSize = 40;
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
      {/* Black solid core for the blocks */}
      <instancedMesh ref={meshSolidRef} args={[null, null, count]}>
        <boxGeometry />
        <meshBasicMaterial color="#05050a" />
      </instancedMesh>
      
      {/* Glowing colored wireframe edges wrapping the cores */}
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
      <fogExp2 attach="fog" args={['#0a0315', 0.035]} />
      
      <Suspense fallback={null}>
        <FpsController />
        <DynamicBlocks />
      </Suspense>
    </>
  );
};

export default SimPage;