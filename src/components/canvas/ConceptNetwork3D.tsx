import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConceptNode {
  position: [number, number, number];
  color: string;
  size: number;
}

export const ConceptNetwork3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseGroupRef = useRef<THREE.Group>(null);

  // Nodes positioned in 3D space surrounding the center
  const nodes: ConceptNode[] = useMemo(() => [
    { position: [-2.8, 1.8, -1.2], color: '#00D2FF', size: 0.12 },
    { position: [-1.4, 2.2, -0.6], color: '#FF7A00', size: 0.14 },
    { position: [1.6, 2.1, -0.8], color: '#00D2FF', size: 0.13 },
    { position: [3.1, 1.6, -1.5], color: '#FF9E0D', size: 0.12 },
    { position: [3.2, -0.4, -0.9], color: '#00D2FF', size: 0.14 },
    { position: [2.0, -1.9, -0.7], color: '#FF7A00', size: 0.13 },
    { position: [-0.3, -2.1, -0.5], color: '#00D2FF', size: 0.15 },
    { position: [-2.5, -1.8, -1.1], color: '#FF9E0D', size: 0.12 },
    { position: [-3.3, 0.1, -0.8], color: '#00D2FF', size: 0.13 },
  ], []);

  // Interconnecting edges (pairs of node indices)
  const edges = useMemo(() => [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0],
    [1, 6], [2, 5], [0, 8], [3, 5], [8, 6], [1, 7],
  ], []);

  // Generate buffer geometry for lines
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    edges.forEach(([i, j]) => {
      points.push(new THREE.Vector3(...nodes[i].position));
      points.push(new THREE.Vector3(...nodes[j].position));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes, edges]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Subtle breathing rotation
    groupRef.current.rotation.y = time * 0.08;
    groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.04;

    // Pulse nodes
    if (pulseGroupRef.current) {
      pulseGroupRef.current.children.forEach((child, idx) => {
        const t = time * 2 + idx;
        const scale = 1 + Math.sin(t) * 0.25;
        child.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Network Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#00D2FF"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Concept Node Spheres */}
      <group ref={pulseGroupRef}>
        {nodes.map((node, index) => (
          <group key={index} position={node.position}>
            {/* Core Sphere */}
            <mesh>
              <sphereGeometry args={[node.size, 16, 16]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={2.5}
                roughness={0.2}
              />
            </mesh>

            {/* Glowing Aura Shell */}
            <mesh>
              <sphereGeometry args={[node.size * 1.8, 12, 12]} />
              <meshStandardMaterial
                color={node.color}
                transparent
                opacity={0.18}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
