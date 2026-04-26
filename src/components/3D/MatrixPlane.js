import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WARMUP_DURATION = 2.0; 
const INACTIVE_Y = -1;

const MatrixPlane = React.forwardRef(({ width, height, ...props }, ref) => {
  const { canvas, context, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 1024;
    const texture = new THREE.CanvasTexture(canvas);
    return { canvas, context, texture };
  }, []);

  const { characters, fontSize, columns } = useMemo(() => {
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥク0123456789';
    const fontSize = 25;
    const columns = canvas.width / fontSize;
    context.font = `${fontSize}px monospace`;
    return { characters, fontSize, columns };
  }, [canvas, context]);

  const dropsRef = React.useRef([]);

  useEffect(() => {
    for (let i = 0; i < columns; i++) {
      dropsRef.current[i] = INACTIVE_Y;
    }
  }, [columns]);
  
  useFrame(({ clock }) => {
    const drops = dropsRef.current;
    const elapsedTime = clock.getElapsedTime();
    context.clearRect(0, 0, canvas.width, canvas.height);
    const activationProgress = Math.min(1.0, elapsedTime / WARMUP_DURATION);
    const activeColumns = Math.floor(activationProgress * columns);

    for (let i = 0; i < columns; i++) {
      if (drops[i] === INACTIVE_Y) {
        if (i < activeColumns) {
          drops[i] = 0;
        } else {
          continue;
        }
      }
      const leaderY = drops[i];
      const trailLength = 20;

      for (let j = 0; j < trailLength; j++) {
        const y = leaderY - j;
        if (y < 0) continue;

        const opacity = 1.0 - (j / trailLength) * 0.95;
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        if (j === 0) {
          context.fillStyle = `rgba(255, 77, 113, ${opacity})`;
        } else {
          context.fillStyle = `rgba(255, 0, 55, ${opacity})`;
        }
        
        context.fillText(text, i * fontSize, y * fontSize);
      }
      drops[i]++;
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
    }

    texture.needsUpdate = true;
  });

  return (
    <mesh ref={ref} {...props}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
});

export default MatrixPlane;