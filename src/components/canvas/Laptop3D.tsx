import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Laptop3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const Laptop3D: React.FC<Laptop3DProps> = ({
  position = [1.8, -0.6, -0.2],
  rotation = [0.2, -0.6, 0.1],
  scale = 0.9,
}) => {
  const laptopRef = useRef<THREE.Group>(null);
  const screenLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!laptopRef.current) return;
    const time = state.clock.getElapsedTime();

    laptopRef.current.position.y = position[1] + Math.sin(time * 1.1 + 1) * 0.08;
    laptopRef.current.rotation.y = rotation[1] + Math.sin(time * 0.6) * 0.06;
    laptopRef.current.rotation.x = rotation[0] + Math.cos(time * 0.8) * 0.04;

    if (screenLightRef.current) {
      screenLightRef.current.intensity = 1.8 + Math.sin(time * 3) * 0.4;
    }
  });

  return (
    <group ref={laptopRef} position={position} rotation={rotation} scale={scale}>
      {/* BASE CHASSIS */}
      <group position={[0, 0, 0]}>
        {/* Main Base Plate */}
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[1.9, 0.06, 1.3]} />
          <meshStandardMaterial
            color="#081530"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>

        {/* Keyboard Depression */}
        <mesh position={[0, 0.002, -0.1]}>
          <boxGeometry args={[1.65, 0.005, 0.75]} />
          <meshStandardMaterial color="#040A18" roughness={0.7} />
        </mesh>

        {/* Key Rows Simulation */}
        {[-0.35, -0.23, -0.11, 0.01, 0.13].map((zPos, rowIdx) => (
          <mesh key={rowIdx} position={[0, 0.008, zPos]}>
            <boxGeometry args={[1.58, 0.006, 0.09]} />
            <meshStandardMaterial
              color="#0A1E42"
              roughness={0.5}
              metalness={0.4}
            />
          </mesh>
        ))}

        {/* Trackpad */}
        <mesh position={[0, 0.003, 0.4]}>
          <boxGeometry args={[0.65, 0.002, 0.38]} />
          <meshStandardMaterial
            color="#0B1C3A"
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* SCREEN ASSEMBLY (Hinged at back) */}
      <group position={[0, 0, -0.65]} rotation={[-1.9, 0, 0]}>
        {/* Screen Lid Back */}
        <mesh position={[0, 0.65, -0.02]}>
          <boxGeometry args={[1.9, 1.3, 0.04]} />
          <meshStandardMaterial
            color="#081530"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>

        {/* Outer Bezel */}
        <mesh position={[0, 0.65, 0.005]}>
          <boxGeometry args={[1.86, 1.26, 0.008]} />
          <meshStandardMaterial color="#02050E" roughness={0.8} />
        </mesh>

        {/* Glowing Screen Display */}
        <mesh position={[0, 0.65, 0.012]}>
          <planeGeometry args={[1.72, 1.12]} />
          <meshStandardMaterial
            color="#001833"
            emissive="#005A9C"
            emissiveIntensity={1.4}
            roughness={0.1}
          />
        </mesh>

        {/* Simulated Code Lines / Dashboard on Screen */}
        <group position={[-0.7, 1.05, 0.018]}>
          {/* Top header bar */}
          <mesh position={[0.7, 0.06, 0]}>
            <planeGeometry args={[1.45, 0.04]} />
            <meshStandardMaterial
              color="#00D2FF"
              emissive="#00D2FF"
              emissiveIntensity={2}
            />
          </mesh>

          {/* Code lines */}
          {[
            { w: 0.8, c: '#00D2FF', x: 0.4 },
            { w: 0.5, c: '#FF7A00', x: 0.25 },
            { w: 1.1, c: '#38BDF8', x: 0.55 },
            { w: 0.9, c: '#FBBF24', x: 0.45 },
            { w: 0.6, c: '#00D2FF', x: 0.3 },
            { w: 1.2, c: '#FF7A00', x: 0.6 },
            { w: 0.7, c: '#FFFFFF', x: 0.35 },
            { w: 0.4, c: '#38BDF8', x: 0.2 },
          ].map((line, idx) => (
            <mesh key={idx} position={[line.x, -idx * 0.09 - 0.08, 0]}>
              <planeGeometry args={[line.w, 0.028]} />
              <meshStandardMaterial
                color={line.c}
                emissive={line.c}
                emissiveIntensity={1.8}
              />
            </mesh>
          ))}
        </group>

        {/* Soft screen casting light forward */}
        <pointLight
          ref={screenLightRef}
          position={[0, 0.65, 0.4]}
          color="#00D2FF"
          intensity={1.8}
          distance={3.5}
        />
      </group>
    </group>
  );
};
