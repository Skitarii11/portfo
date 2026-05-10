import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useTexture } from '@react-three/drei';

function Arrow({ position, delay, color="#f52d6a"}) {
  const meshRef = useRef();
  const texture = useTexture('/arrow.png');

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const opacity = (Math.sin(time * 2 + delay) + 1) / 2;

    if (meshRef.current) {
      meshRef.current.material.opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>

      <planeGeometry args={[1, 1]} />

      <meshBasicMaterial
        map={texture}
        transparent={true}
        color={color}
        alphaTest={0.5}
      />
    </mesh>
  );
}

export default Arrow;