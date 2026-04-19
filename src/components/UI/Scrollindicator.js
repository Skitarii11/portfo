import { Text } from '@react-three/drei';
import Arrow from './Arrow';

function ScrollIndicator() {
  return (
    <group>
      <Text
        position={[0, 0, 0]}
        fontSize={1}
        color="#FF0000"
        anchorX="center"
        anchorY="middle"
      >
        SCROLL
      </Text>

      <Arrow position={[0, -1.2, 0]} delay={0} />
      <Arrow position={[0, -2.0, 0]} delay={0.5} />
      <Arrow position={[0, -2.8, 0]} delay={1.0} />
    </group>
  );
}

export default ScrollIndicator;