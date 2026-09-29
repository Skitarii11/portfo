import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PixelTransition = React.forwardRef(({ width, height, opacity = 1, isTransition = false, ...props }, ref) => {
  const { canvas, context, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 1024;
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return { canvas, context, texture };
  }, []);

  const blocks = useMemo(() => {
    const blks = [];
    const cols = 48;
    const rows = 48;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        blks.push({
          x: j * cellW,
          y: i * cellH,
          w: cellW,
          h: cellH,
          sortVal: (j / cols) * 0.5 + (i / rows) * 0.5 + Math.random() * 0.3
        });
      }
    }
    return blks;
  }, [canvas.width, canvas.height]);

  const startTime = useRef(null);

  useFrame(({ clock }) => {
    if (startTime.current === null) startTime.current = clock.getElapsedTime();
    const elapsed = clock.getElapsedTime() - startTime.current;
    
    const sweepDuration = isTransition ? 1.0 : 2.0;
    const progress = (elapsed / sweepDuration) * 1.5;

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = `rgba(0, 0, 0, ${opacity})`;

    let activeBlocks = false;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      
      if (progress > block.sortVal) {
        context.fillRect(
            Math.floor(block.x), 
            Math.floor(block.y), 
            Math.ceil(block.w) + 1, 
            Math.ceil(block.h) + 1
        );
        activeBlocks = true;
      }
    }

    if (activeBlocks && progress <= 1.5) {
        texture.needsUpdate = true;
    }
  });

  return (
    <mesh ref={ref} {...props}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        blending={THREE.NormalBlending} 
        depthWrite={false}
        opacity={opacity}
      />
    </mesh>
  );
});

export default PixelTransition;