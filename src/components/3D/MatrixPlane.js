import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BrokenMirror = React.forwardRef(({ width, height, opacity = 1, isTransition = false, ...props }, ref) => {
  const { canvas, context, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 2048;
    canvas.height = 2048;
    const texture = new THREE.CanvasTexture(canvas);
    return { canvas, context, texture };
  }, []);

  // Generate a jittered grid of points
  const points = useMemo(() => {
    const pts = [];
    const rows = 30;
    const cols = 30;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    for (let i = 0; i <= rows; i++) {
      for (let j = 0; j <= cols; j++) {
        pts.push({
          baseX: j * cellW,
          baseY: i * cellH,
          x: j * cellW + (Math.random() - 0.5) * cellW * 0.8,
          y: i * cellH + (Math.random() - 0.5) * cellH * 0.8,
          phase: Math.random() * Math.PI * 2,
          // Sort value for TL to BR progression
          sortVal: (j / cols) + (i / rows) 
        });
      }
    }
    return pts;
  }, [canvas.width, canvas.height]);

  const startTime = useRef(null);

  useFrame(({ clock }) => {
    if (startTime.current === null) startTime.current = clock.getElapsedTime();
    const elapsed = clock.getElapsedTime() - startTime.current;
    
    // Sweep progress from 0 to 2 (to cover the whole screen TL to BR)
    const sweepDuration = isTransition ? 1.0 : 2.0;
    const progress = Math.min(2, (elapsed / sweepDuration) * 1.5);

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lines and shards
    context.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
    context.lineWidth = 1.0; // Increased due to higher canvas resolution

    const activePoints = points.filter(p => p.sortVal < progress);

    // Simple triangulation: connect points that are close to each other in the grid
    // For a "Broken Mirror" look, we'll draw lines between points and fill the space
    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        if (p1.sortVal > progress) continue;

        // Find neighbors to connect
        for (let j = i + 1; j < points.length; j++) {
            const p2 = points[j];
            if (p2.sortVal > progress) continue;

            const dist = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
            if (dist < 120) { // Scaled for higher resolution
                // Connection (Neural Network)
                context.beginPath();
                context.moveTo(p1.x, p1.y);
                context.lineTo(p2.x, p2.y);
                context.stroke();

                // Shard fill (Mirror piece)
                // Find a third point to form a triangle
                for(let k = j + 1; k < points.length; k++) {
                    const p3 = points[k];
                    if (p3.sortVal > progress) continue;
                    
                    const dist2 = Math.sqrt((p2.x - p3.x)**2 + (p2.y - p3.y)**2);
                    const dist3 = Math.sqrt((p1.x - p3.x)**2 + (p1.y - p3.y)**2);
                    
                    if (dist2 < 120 && dist3 < 120) {
                        context.fillStyle = `rgba(201, 227, 243, ${opacity * 0.1})`; // var(--text-color)
                        context.beginPath();
                        context.moveTo(p1.x, p1.y);
                        context.lineTo(p2.x, p2.y);
                        context.lineTo(p3.x, p3.y);
                        context.fill();
                        break; // Just one triangle per edge for performance
                    }
                }
            }
        }

        // Draw Dot (Neural point)
        context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        context.beginPath();
        context.arc(p1.x, p1.y, 2, 0, Math.PI * 2); // Slightly larger for better clarity
        context.fill();
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
        opacity={opacity}
      />
    </mesh>
  );
});

export default BrokenMirror;