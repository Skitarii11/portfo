import { Text } from '@react-three/drei';
import Arrow from './Arrow';

function ScrollIndicator() {
  const cyan = "#64ffda";
  const pink = "#f52d6a";

  return (
    <group scale={0.8}>
      {/* Shorter decorative line on the far left */}
      <mesh position={[-0.45, 1.6, 0]}>
        <planeGeometry args={[0.02, 0.8]} />
        <meshBasicMaterial color={pink} />
      </mesh>
      
      {/* Longer decorative line closer to the text */}
      <mesh position={[-0.35, 0.5, 0]}>
        <planeGeometry args={[0.02, 3.0]} />
        <meshBasicMaterial color={pink} />
      </mesh>

      <Text
        position={[0, 0.5, 0]}
        fontSize={0.5}
        color={cyan}
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, -Math.PI / 2]}
      >
        SCROLL
      </Text>

      <Arrow position={[0, -1.2, 0]} delay={0} color={pink} />
      <Arrow position={[0, -2.0, 0]} delay={0.5} color={pink} />
      <Arrow position={[0, -2.8, 0]} delay={1.0} color={pink} />
    </group>
  );
}

export default ScrollIndicator;