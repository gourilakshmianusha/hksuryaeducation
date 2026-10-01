import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingBookProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  coverColor?: string;
  accentColor?: string;
  scale?: number;
  floatSpeed?: number;
  floatOffset?: number;
  title?: string;
}

export const FloatingBook3D: React.FC<FloatingBookProps> = ({
  position,
  rotation = [0.2, 0.4, -0.1],
  coverColor = '#0F3F94',
  accentColor = '#00D2FF',
  scale = 1,
  floatSpeed = 1.2,
  floatOffset = 0,
}) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() + floatOffset;

    meshRef.current.position.y = position[1] + Math.sin(time * floatSpeed) * 0.12;
    meshRef.current.rotation.x = rotation[0] + Math.sin(time * 0.9) * 0.08;
    meshRef.current.rotation.y = rotation[1] + Math.cos(time * 0.7) * 0.1;
    meshRef.current.rotation.z = rotation[2] + Math.sin(time * 1.1) * 0.05;
  });

  // Book dimensions
  const width = 0.9;
  const height = 1.2;
  const thickness = 0.22;
  const coverThick = 0.02;

  return (
    <group ref={meshRef} position={position} scale={scale} rotation={rotation}>
      {/* Back Cover */}
      <mesh position={[0, 0, -thickness / 2 + coverThick / 2]}>
        <boxGeometry args={[width, height, coverThick]} />
        <meshStandardMaterial color={coverColor} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Front Cover */}
      <mesh position={[0, 0, thickness / 2 - coverThick / 2]}>
        <boxGeometry args={[width, height, coverThick]} />
        <meshStandardMaterial color={coverColor} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Front Cover Glowing Accent Stripe */}
      <mesh position={[0.1, 0, thickness / 2 + 0.005]}>
        <boxGeometry args={[0.08, height * 0.85, 0.005]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.5}
          roughness={0.2}
        />
      </mesh>

      {/* Front Cover Logo Accent Emblem */}
      <mesh position={[0.1, 0.2, thickness / 2 + 0.005]}>
        <cylinderGeometry args={[0.12, 0.12, 0.008, 16]} />
        <meshStandardMaterial
          color="#FF7A00"
          emissive="#FF7A00"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Spine (Left side) */}
      <mesh position={[-width / 2 + coverThick / 2, 0, 0]}>
        <boxGeometry args={[coverThick, height, thickness]} />
        <meshStandardMaterial color={coverColor} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Pages Block */}
      <mesh position={[0.02, 0, 0]}>
        <boxGeometry args={[width - coverThick * 2 - 0.02, height - 0.05, thickness - coverThick * 2]} />
        <meshStandardMaterial color="#FAF5EE" roughness={0.9} />
      </mesh>

      {/* Bookmark Ribbon */}
      <mesh position={[0.15, -height / 2 - 0.12, 0]} rotation={[0.1, 0, 0.2]}>
        <boxGeometry args={[0.08, 0.28, 0.01]} />
        <meshStandardMaterial
          color="#FF7A00"
          emissive="#FF7A00"
          emissiveIntensity={0.8}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};
