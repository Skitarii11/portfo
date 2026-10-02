import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PointerLockControls as PointerLockControlsImpl } from 'three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from 'three';

const INTERACTABLES = [
  {
    id: 1,
    position: [-80, 2, -80],
    title: "// WHO I AM",
    text: "Neural synchronization completed at 98.4%. Primary render matrix online and functioning within nominal cyber-parameters."
  },
  {
    id: 2,
    position: [80, 2, -80],
    title: "// EXPERIENCE",
    text: "Decentralized WebGL graphics pipeline initialized. Real-time procedural geometry streaming across sector 07."
  },
  {
    id: 3,
    position: [0, 2, -80],
    title: "// SKILLS",
    text: "React Three.js Python Git ReactNative TypeScript Node.js Express.js SQL NoSQL RestAPI CI/CD Tanstack Cybersecurity"
  },
  {
    id: 4,
    position: [-80, 2, 10],
    title: "// EDUCATION",
    text: "B.S. Computer Science & Software Engineering // Focus on WebGL, Cyber Systems & Computer Graphics Architecture."
  },
  {
    id: 5,
    position: [80, 2, 15],
    title: "// RESUME",
    text: "",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    position: [0, 5 , 80],
    title: "// GO TO WORKS",
    isPortal: true,
    navigateTo: "/work"
  }
];

const ProjectileTrail = ({ projectile }) => {
  const groupRef = useRef();
  const trailCount = 6;

  useFrame((state) => {
    if (!groupRef.current) return;
    const now = state.clock.elapsedTime;
    const progress = Math.min(1, (now - projectile.startTime) / projectile.duration);

    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const delayOffset = i * 0.03;
      const clampedProgress = Math.max(0, Math.min(1, progress - delayOffset));

      const currentPos = new THREE.Vector3().lerpVectors(
        projectile.origin,
        projectile.target,
        clampedProgress
      );

      children[i].position.copy(currentPos);
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: trailCount }).map((_, i) => {
        const isLead = i === 0;
        const opacity = Math.max(0.05, 1 - i * 0.16);
        const scale = 0.1 * (1 - i * 0.12);

        return (
          <mesh key={i}>
            <boxGeometry args={[scale, scale, scale]} />
            <meshBasicMaterial
              color={projectile.isPortal ? '#ff0055' : '#00f0ff'}
              transparent
              opacity={opacity}
              wireframe={!isLead}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const DataStreamProjectiles = () => {
  const { camera } = useThree();
  const [projectiles, setProjectiles] = useState([]);
  const lastSpawnTime = useRef(0);

  useFrame((state) => {
    const now = state.clock.elapsedTime;

    if (now - lastSpawnTime.current >= 3.0) {
      lastSpawnTime.current = now;

      const origin = camera.position.clone();
      origin.y -= 0.5;

      const newBatch = INTERACTABLES.map((item) => ({
        id: `${now}-${item.id}`,
        origin: origin.clone(),
        target: new THREE.Vector3(...item.position),
        startTime: now,
        duration: 2,
        isPortal: item.isPortal,
      }));

      setProjectiles((prev) => [
        ...prev.filter((p) => now - p.startTime < p.duration),
        ...newBatch,
      ]);
    }
  });

  return (
    <group>
      {projectiles.map((p) => (
        <ProjectileTrail key={p.id} projectile={p} />
      ))}
    </group>
  );
};

const RedGalaxyPortal = () => {
  const count = 1800;
  const arms = 4;
  const radius = 5.5;
  const spin = 1.4;
  const randomnessPower = 3;

  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { particles, colors } = useMemo(() => {
    const temp = [];
    const colorArray = new Float32Array(count * 3);
    const coreColor = new THREE.Color('#ffffff');
    const innerColor = new THREE.Color('#ff0055');
    const outerColor = new THREE.Color('#880022');

    for (let i = 0; i < count; i++) {
      // denser core
      const r = Math.pow(Math.random(), 2) * radius;
      
      const spinAngle = r * spin;
      const branchAngle = ((i % arms) / arms) * Math.PI * 2;

      // Random offset dispersion along arms
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * (r * 0.25 + 0.1);
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * (r * 0.15 + 0.05);
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * (r * 0.25 + 0.1);

      // Cube scale
      const scale = (1.0 - r / (radius * 1.3)) * 0.07 + 0.025;

      // Differential Orbit Speed: Inner particles orbit exponentially faster than outer ones
      const orbitSpeed = 0.25 + (1.8 / (r + 0.35));

      // Individual random cube rotation speeds
      const rotSpeedX = (Math.random() - 0.5) * 1.2;
      const rotSpeedY = (Math.random() - 0.5) * 1.2;
      const rotSpeedZ = (Math.random() - 0.5) * 1.2;

      temp.push({ r, spinAngle, branchAngle, randomX, randomY, randomZ, scale, orbitSpeed, rotSpeedX, rotSpeedY, rotSpeedZ });

      // Core-to-Arm Color Gradient Interpolation
      const mixedColor = innerColor.clone().lerp(outerColor, r / radius);
      if (r < 0.9) {
        mixedColor.lerp(coreColor, 1.0 - r / 0.9); // Hot core glow
      }
      mixedColor.toArray(colorArray, i * 3);
    }

    return { particles: temp, colors: colorArray };
  }, [count, arms, radius, spin, randomnessPower]);

  // Differential Galactic Swirl & Individual Cube Rotations
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
      particles.forEach((p, i) => {
        // Calculate orbital angle where inner radius orbits faster
        const currentAngle = p.branchAngle + p.spinAngle + t * p.orbitSpeed;

        const x = Math.cos(currentAngle) * p.r + p.randomX;
        const z = Math.sin(currentAngle) * p.r + p.randomZ;
        const y = p.randomY;

        dummy.position.set(x, y, z);
        dummy.rotation.set(
          t * p.rotSpeedX,
          t * p.rotSpeedY,
          t * p.rotSpeedZ
        );
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();

        meshRef.current.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <Html position={[0, 4.2, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(30, 5, 10, 0.92)',
          border: '1px solid #ff0055',
          padding: '6px 14px',
          borderRadius: '4px',
          color: '#ff0055',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          letterSpacing: '1px',
          boxShadow: '0 0 15px rgba(255, 0, 85, 0.5)',
          whiteSpace: 'nowrap'
        }}>
          // WORK_PORTAL
        </div>
      </Html>

      <group rotation={[Math.PI / 2, 0, 0]}>
        <instancedMesh ref={meshRef} args={[null, null, count]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial toneMapped={false} />
          <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
        </instancedMesh>
      </group>
    </group>
  );
};

const GlitchBlockMaterial = () => {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const shader = useMemo(() => {
    return {
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          vec2 uv = vUv;
          float t = floor(uTime * 15.0); 
          float isGlitching = step(0.85, random(vec2(t * 0.05, 0.0))); 
          float bandY = floor(uv.y * 40.0);
          float bandOffset = (random(vec2(bandY, t)) - 0.5) * 0.15;
          uv.x += bandOffset * isGlitching;

          float rgbShift = 0.02 * random(vec2(bandY, t * 2.0)) * isGlitching;
          vec3 baseColor = vec3(0.02, 0.03, 0.03); 
          vec2 grid = floor(uv * vec2(50.0, 80.0));
          
          float rBlock = step(0.95, random(floor(vec2(uv.x + rgbShift, uv.y) * vec2(50.0, 80.0)) + t));
          float gBlock = step(0.95, random(grid + t));
          float bBlock = step(0.95, random(floor(vec2(uv.x - rgbShift, uv.y) * vec2(50.0, 80.0)) + t));
          
          vec3 blockColor = vec3(rBlock, gBlock, bBlock) * vec3(0.39, 1.0, 0.85);
          float scanline = sin(vUv.y * 1000.0) * 0.03;
          vec3 finalColor = baseColor + (blockColor * 0.8 * isGlitching) - scanline;
          float flash = step(0.98, random(vec2(bandY, t))) * isGlitching;
          finalColor += vec3(0.39, 1.0, 0.85) * flash * 0.6; 
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    };
  }, []);

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={shader.uniforms}
      vertexShader={shader.vertexShader}
      fragmentShader={shader.fragmentShader}
    />
  );
};

const SkillsNodeGraph = ({ text }) => {
  const linesRef = useRef();
  const nodeRefs = useRef([]);

  const { nodes, connections, initialLinePositions } = useMemo(() => {
    const skills = text.split(' ');
    const count = skills.length;
    const phi = Math.PI * (3 - Math.sqrt(5));

    const nodeList = skills.map((skill, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y) * 4.5;
      const theta = phi * i;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      return {
        id: i,
        label: skill,
        basePos: new THREE.Vector3(x, y * 2.5, z),
        currentPos: new THREE.Vector3(x, y * 2.5, z),
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.6
      };
    });

    const edgeList = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = nodeList[i].basePos.distanceTo(nodeList[j].basePos);
        if (dist < 4.2) {
          edgeList.push([i, j]);
        }
      }
    }

    const lineArray = new Float32Array(edgeList.length * 2 * 3);

    return { nodes: nodeList, connections: edgeList, initialLinePositions: lineArray };
  }, [text]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    nodes.forEach((node, idx) => {
      node.currentPos.x = node.basePos.x + Math.sin(t * node.speed + node.phase) * 0.35;
      node.currentPos.y = node.basePos.y + Math.cos(t * node.speed * 0.8 + node.phase) * 0.35;
      node.currentPos.z = node.basePos.z + Math.sin(t * node.speed * 0.5 + node.phase) * 0.35;

      if (nodeRefs.current[idx]) {
        nodeRefs.current[idx].position.copy(node.currentPos);
      }
    });

    if (linesRef.current) {
      const posAttr = linesRef.current.geometry.attributes.position;
      let ptr = 0;

      connections.forEach(([i, j]) => {
        const p1 = nodes[i].currentPos;
        const p2 = nodes[j].currentPos;

        posAttr.array[ptr++] = p1.x;
        posAttr.array[ptr++] = p1.y;
        posAttr.array[ptr++] = p1.z;
        posAttr.array[ptr++] = p2.x;
        posAttr.array[ptr++] = p2.y;
        posAttr.array[ptr++] = p2.z;
      });

      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      <Html position={[0, 4.2, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(3, 20, 28, 0.9)',
          border: '1px solid #00f0ff',
          padding: '6px 14px',
          borderRadius: '4px',
          color: '#ffffff',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          letterSpacing: '1px',
          boxShadow: '0 0 15px rgba(0,240,255,0.4)',
          whiteSpace: 'nowrap'
        }}>
          // SKILLS_MATRIX
        </div>
      </Html>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length * 2}
            array={initialLinePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.5} />
      </lineSegments>

      {nodes.map((node, idx) => (
        <group
          key={node.id}
          ref={(el) => (nodeRefs.current[idx] = el)}
          position={node.basePos.toArray()}
        >
          <mesh>
            <boxGeometry args={[0.35, 0.35, 0.35]} />
            <meshBasicMaterial wireframe color="#00f0ff" />
          </mesh>

          <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'rgba(5, 15, 25, 0.95)',
              border: '1px solid #00f0ff',
              color: '#00f0ff',
              padding: '4px 8px',
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.35)',
              backdropFilter: 'blur(4px)'
            }}>
              {node.label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

const EducationSchoolBuilding = ({ title, text }) => {
  const meshRef = useRef();
  const progressRef = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const targetPositions = useMemo(() => {
    const points = [];
    const step = 0.5;

    for (let x = -2.5; x <= 2.5; x += step) {
      for (let y = -2.0; y <= -0.5; y += step) {
        for (let z = -1.0; z <= 1.0; z += step) {
          points.push(new THREE.Vector3(x, y, z));
        }
      }
    }

    for (let y = 0.0; y <= 1.5; y += step) {
      for (let x = -0.8; x <= 0.8; x += step) {
        for (let z = -0.8; z <= 0.8; z += step) {
          points.push(new THREE.Vector3(x, y, z));
        }
      }
    }

    points.push(new THREE.Vector3(0, 2.0, 0));
    points.push(new THREE.Vector3(0, 2.5, 0));
    points.push(new THREE.Vector3(-0.6, -2.0, 1.4));
    points.push(new THREE.Vector3(0.6, -2.0, 1.4));

    return points;
  }, []);

  const scatterPositions = useMemo(() => {
    return targetPositions.map(() => {
      return new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 18
      );
    });
  }, [targetPositions]);

  useFrame((state, delta) => {
    if (progressRef.current < 1) {
      progressRef.current = Math.min(1, progressRef.current + delta * 1.2);
    }

    const ease = 1 - Math.pow(1 - progressRef.current, 3);

    targetPositions.forEach((target, i) => {
      const start = scatterPositions[i];
      dummy.position.lerpVectors(start, target, ease);
      dummy.rotation.set((1 - ease) * Math.PI, (1 - ease) * Math.PI, 0);
      dummy.scale.setScalar(0.42 * ease);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <Html
        transform
        distanceFactor={6}
        position={[0, 4.2, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            width: '340px',
            maxHeight: '130px',
            padding: '12px 16px',
            background: 'rgba(3, 20, 28, 0.92)',
            border: '1px solid #00f0ff',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
            borderRadius: '4px',
            color: '#00f0ff',
            fontFamily: 'monospace',
            backdropFilter: 'blur(6px)',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 'bold',
              borderBottom: '1px dashed rgba(0, 240, 255, 0.5)',
              paddingBottom: '4px',
              marginBottom: '6px',
              color: '#ffffff'
            }}
          >
            {title}
          </div>
          <p style={{ fontSize: '0.75rem', lineHeight: '1.3', margin: 0, color: '#cceeff' }}>
            {text}
          </p>
          <div style={{ fontSize: '0.65rem', color: '#f52d6a', marginTop: '6px', textAlign: 'right' }}>
            [ PRESS E TO CLOSE ]
          </div>
        </div>
      </Html>

      <instancedMesh ref={meshRef} args={[null, null, targetPositions.length]}>
        <boxGeometry />
        <meshBasicMaterial wireframe color="#00f0ff" toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

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

const InteractableObjects = ({ onNearChange }) => {
  const navigate = useNavigate();
  const { camera } = useThree();
  const [activeNodes, setActiveNodes] = useState({});
  const nearestRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyE' && nearestRef.current !== null) {
        const currentItem = INTERACTABLES.find((item) => item.id === nearestRef.current);

        if (currentItem?.isPortal) {
          if (document.pointerLockElement) {
            document.exitPointerLock();
          }
          navigate(currentItem.navigateTo);
        } else if (currentItem) {
          setActiveNodes((prev) => ({ ...prev, [currentItem.id]: !prev[currentItem.id] }));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useFrame(() => {
    let closestId = null;
    let minDistance = 7;

    INTERACTABLES.forEach((item) => {
      const itemPos = new THREE.Vector3(...item.position);
      const dist = camera.position.distanceTo(itemPos);

      if (dist < minDistance) {
        minDistance = dist;
        closestId = item.id;
      }
    });

    if (nearestRef.current !== closestId) {
      nearestRef.current = closestId;
      onNearChange(closestId);
    }
  });

  return (
    <group>
      {INTERACTABLES.map((item) => {
        const isOpen = activeNodes[item.id];
        const isSkillsNode = item.id === 3 || item.title.includes('SKILLS');
        const isEducationNode = item.id === 4 || item.title.includes('EDUCATION');
        const isPortalNode = item.isPortal;

        return (
          <group key={item.id} position={item.position}>
            {isPortalNode && <RedGalaxyPortal />}

            {!isOpen && !isPortalNode && (
              <group>
                <mesh>
                  <boxGeometry args={[4, 10, 4]} />
                  <meshBasicMaterial wireframe color="#ffffff" />
                </mesh>
                <mesh>
                  <boxGeometry args={[3.95, 9.95, 3.95]} />
                  <GlitchBlockMaterial />
                </mesh>
              </group>
            )}

            {isOpen && isSkillsNode && (
              <SkillsNodeGraph text={item.text} />
            )}

            {isOpen && isEducationNode && (
              <EducationSchoolBuilding title={item.title} text={item.text} />
            )}

            {isOpen && !isSkillsNode && !isEducationNode && !isPortalNode && (
              <Html
                transform
                distanceFactor={6}
                position={[0, 0, 0]}
                style={{ pointerEvents: 'none' }}
              >
                <div
                  style={{
                    width: '340px',
                    height: '500px',
                    padding: '16px',
                    background: 'rgba(3, 20, 28, 0.92)',
                    border: '1px solid #00f0ff',
                    boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                    borderRadius: '4px',
                    color: '#00f0ff',
                    fontFamily: 'monospace',
                    backdropFilter: 'blur(6px)',
                    boxSizing: 'border-box',
                    overflowY: 'auto'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      borderBottom: '1px dashed rgba(0, 240, 255, 0.5)',
                      paddingBottom: '6px',
                      marginBottom: '10px',
                      color: '#ffffff'
                    }}
                  >
                    {item.title}
                  </div>

                  {item.image && (
                    <div
                      style={{
                        marginBottom: '10px',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 240, 255, 0.4)',
                        boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '400px',
                          objectFit: 'fill',
                          display: 'block',
                          filter: 'contrast(1.1) brightness(0.9) saturate(1.2)'
                        }}
                      />
                    </div>
                  )}

                  {item.text && (
                    <p style={{ fontSize: '0.8rem', lineHeight: '1.4', margin: 0, color: '#cceeff' }}>
                      {item.text}
                    </p>
                  )}

                  <div style={{ fontSize: '0.65rem', color: '#f52d6a', marginTop: '10px', textAlign: 'right' }}>
                    [ PRESS E TO CLOSE ]
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};

const FpsController = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const [isLocked, setIsLocked] = useState(false);
  const [nearNodeId, setNearNodeId] = useState(null);

  const { forward, backward, left, right } = usePlayerControls();
  const direction = new THREE.Vector3();
  const speed = 15;

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

      camera.position.copy(initialPosition);
      camera.rotation.copy(initialRotation);
    };
  }, [camera, gl.domElement]);

  useEffect(() => {
    if (isLocked) {
      if (!nearNodeId) return;

      const currentItem = INTERACTABLES.find((item) => item.id === nearNodeId);
      const isPortal = currentItem?.isPortal;

      const promptDiv = document.createElement('div');
      promptDiv.style.cssText = `
        position: fixed;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(5, 5, 10, 0.85);
        padding: 10px 20px;
        border-radius: 4px;
        border: 1px solid ${isPortal ? '#ff0055' : '#00f0ff'};
        color: ${isPortal ? '#ff0055' : '#00f0ff'};
        font-family: monospace;
        font-weight: bold;
        pointer-events: none;
        z-index: 999999;
        box-shadow: 0 0 15px ${isPortal ? 'rgba(255, 0, 85, 0.4)' : 'rgba(0, 240, 255, 0.3)'};
      `;
      promptDiv.innerText = isPortal ? '[ E ] WARP TO WORK PAGE' : '[ E ] INTERACT WITH TERMINAL';
      document.body.appendChild(promptDiv);

      return () => {
        if (document.body.contains(promptDiv)) {
          document.body.removeChild(promptDiv);
        }
      };
    }

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
  }, [isLocked, nearNodeId]);

  useFrame((state, delta) => {
    if (!isLocked) return;

    direction.z = Number(forward) - Number(backward);
    direction.x = Number(right) - Number(left);
    direction.normalize();

    if (forward || backward) camera.translateZ(-direction.z * speed * delta);
    if (left || right) camera.translateX(direction.x * speed * delta);

    camera.position.y = 2; 
  });

  return <InteractableObjects onNearChange={setNearNodeId} />;
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
        <meshBasicMaterial wireframe toneMapped={false} />
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
        <DataStreamProjectiles />
        <DynamicBlocks />
      </Suspense>
    </>
  );
};

export default SimPage;