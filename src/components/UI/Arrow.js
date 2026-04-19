import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
// --- CHANGE 1: Import useTexture from drei ---
import { useTexture } from '@react-three/drei';

function Arrow({ position, delay }) {
  const meshRef = useRef();

  // --- CHANGE 2: Load the texture ---
  // The path '/arrow.png' correctly points to the public folder.
  const texture = useTexture('/arrow.png');

  // The animation logic remains EXACTLY THE SAME.
  // It will now animate the opacity of our new image material.
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const opacity = (Math.sin(time * 2 + delay) + 1) / 2;

    if (meshRef.current) {
      meshRef.current.material.opacity = opacity;
    }
  });

  return (
    // We remove the old rotation because the plane is 2D
    <mesh ref={meshRef} position={position}>

      {/* --- CHANGE 3: Replace the 3D cone with a 2D plane --- */}
      {/* The args are [width, height]. You can adjust these to change the size. */}
      <planeGeometry args={[1, 1]} />

      {/* --- CHANGE 4: Use a material that can display our texture --- */}
      <meshBasicMaterial
        map={texture}           // Apply the arrow.png texture
        transparent={true}      // Allow transparency from both the PNG and the opacity animation
        color="#FF0000"         // Tint the texture red. (This works best with a white PNG)
      />
    </mesh>
  );
}

export default Arrow;