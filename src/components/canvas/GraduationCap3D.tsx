import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GraduationCapProps {
  position?: [number, number, number];
  scale?: number;
  interactive?: boolean;
}

export const GraduationCap3D: React.FC<GraduationCapProps> = ({
  position = [0, 0.4, 0],
  scale = 1,
  interactive = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const tasselRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle floating and tilting
    groupRef.current.position.y = position[1] + Math.sin(time * 1.4) * 0.12;
    groupRef.current.rotation.y = time * 0.25;
    groupRef.current.rotation.z = Math.sin(time * 0.8) * 0.05 - 0.05;

    // Tassel gentle swing
    if (tasselRef.current) {
      tasselRef.current.rotation.z = Math.sin(time * 2.2) * 0.15;
      tasselRef.current.rotation.x = Math.cos(time * 1.8) * 0.1;
    }

    // Halo pulse & rotation
    if (haloRef.current) {
      haloRef.current.rotation.z = -time * 0.4;
      const s = 1 + Math.sin(time * 2) * 0.06;
      haloRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Halo energy ring under cap */}
      <mesh ref={haloRef} position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#00D2FF"
          emissive="#00D2FF"
          emissiveIntensity={2.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Skull Cap Base */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 0.4, 32]} />
        <meshStandardMaterial
          color="#0B1A48"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Cap Rim / Band with cyan glow */}
      <mesh position={[0, -0.32, 0]}>
        <torusGeometry args={[0.66, 0.025, 16, 32]} />
        <meshStandardMaterial
          color="#00D2FF"
          emissive="#00D2FF"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Mortarboard Diamond Board */}
      <mesh position={[0, 0.05, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.75, 0.05, 1.75]} />
        <meshStandardMaterial
          color="#0B1F54"
          roughness={0.25}
          metalness={0.4}
        />
      </mesh>

      {/* Mortarboard Top Trim (Glowing Cyan Edge) */}
      <mesh position={[0, 0.08, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.77, 0.015, 1.77]} />
        <meshStandardMaterial
          color="#00D2FF"
          emissive="#00D2FF"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Center Top Gold Button */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.06, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          roughness={0.1}
          metalness={0.9}
          emissive="#FF7A00"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Tassel Assembly */}
      <group ref={tasselRef} position={[0, 0.1, 0]}>
        {/* Tassel cord going to edge */}
        <mesh position={[-0.45, -0.04, 0.45]} rotation={[0.08, -Math.PI / 4, -0.1]}>
          <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
          <meshStandardMaterial
            color="#FF7A00"
            emissive="#FF7A00"
            emissiveIntensity={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Tassel bead & hanging fringe */}
        <group position={[-0.8, -0.15, 0.8]}>
          {/* Golden bead */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial
              color="#F59E0B"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Tassel fringe body */}
          <mesh position={[0, -0.18, 0]}>
            <coneGeometry args={[0.065, 0.32, 16]} />
            <meshStandardMaterial
              color="#FF7A00"
              emissive="#FF7A00"
              emissiveIntensity={0.8}
              roughness={0.5}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
