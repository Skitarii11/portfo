import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MatrixPlane = React.forwardRef(({ width, height, ...props }, ref) => {
  const { canvas, context, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 1024;
    const texture = new THREE.CanvasTexture(canvas);
    return { canvas, context, texture };
  }, []);

  const { drops, characters, fontSize, columns } = useMemo(() => {
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥク0123456789';
    const fontSize = 15;
    const columns = canvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }
    context.font = `${fontSize}px monospace`;
    return { drops, characters, fontSize, columns };
  }, [canvas, context]);

  useFrame(() => {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgb(255, 0, 55)';

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      context.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
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