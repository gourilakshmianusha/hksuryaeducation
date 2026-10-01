import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const EducationIcons3D: React.FC = () => {
  const atomRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const electron1Ref = useRef<THREE.Mesh>(null);

  const starRef = useRef<THREE.Group>(null);
  const codeRef = useRef<THREE.Group>(null);
  const certRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. ATOM ANIMATION
    if (atomRef.current) {
      atomRef.current.position.y = 1.3 + Math.sin(time * 1.3) * 0.1;
      atomRef.current.rotation.y = time * 0.3;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.x = time * 1.2;
    if (ring2Ref.current) ring2Ref.current.rotation.y = time * 1.4;
    if (ring3Ref.current) ring3Ref.current.rotation.z = time * 1.1;
    if (electron1Ref.current) {
      electron1Ref.current.position.x = Math.cos(time * 3) * 0.65;
      electron1Ref.current.position.y = Math.sin(time * 3) * 0.65;
    }

    // 2. STAR / BADGE ANIMATION
    if (starRef.current) {
      starRef.current.position.y = -1.1 + Math.cos(time * 1.2) * 0.08;
      starRef.current.rotation.y = time * 0.45;
      starRef.current.rotation.x = Math.sin(time * 0.7) * 0.15;
    }

    // 3. CODE BRACKETS ANIMATION
    if (codeRef.current) {
      codeRef.current.position.y = 1.2 + Math.sin(time * 1.5 + 2) * 0.1;
      codeRef.current.rotation.y = -0.3 + Math.sin(time * 0.5) * 0.2;
    }

    // 4. CERTIFICATE / SCROLL
    if (certRef.current) {
      certRef.current.position.y = -1.3 + Math.sin(time * 1.4 + 1) * 0.09;
      certRef.current.rotation.z = 0.4 + Math.sin(time * 0.8) * 0.1;
      certRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <>
      {/* 1. FLOATING 3D ATOM (Top Right) */}
      <group ref={atomRef} position={[2.5, 1.3, -0.5]} scale={0.65}>
        {/* Glowing Nucleus */}
        <mesh>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial
            color="#FF7A00"
            emissive="#FF7A00"
            emissiveIntensity={2.5}
            roughness={0.2}
          />
        </mesh>

        {/* Orbit Ring 1 */}
        <mesh ref={ring1Ref} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.65, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={1.8}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Orbit Ring 2 */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, -Math.PI / 6]}>
          <torusGeometry args={[0.65, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={1.8}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Orbit Ring 3 */}
        <mesh ref={ring3Ref} rotation={[-Math.PI / 4, 0, Math.PI / 3]}>
          <torusGeometry args={[0.65, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#FF9E0D"
            emissive="#FF9E0D"
            emissiveIntensity={1.8}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Orbiting Electron */}
        <mesh ref={electron1Ref}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#00D2FF"
            emissiveIntensity={3}
          />
        </mesh>
      </group>

      {/* 2. FLOATING 3D STAR / ACHIEVEMENT BADGE (Bottom Center-Left) */}
      <group ref={starRef} position={[-2.4, -1.1, 0.2]} scale={0.55}>
        {/* Outer Circular Medallion */}
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
          <meshStandardMaterial
            color="#0B1A48"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Medallion Rim */}
        <mesh position={[0, 0.04, 0]}>
          <torusGeometry args={[0.65, 0.04, 16, 32]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#FF7A00"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* 4-Point Star Relief (like in the HKSURYA logo) */}
        <group position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <boxGeometry args={[0.18, 0.7, 0.06]} />
            <meshStandardMaterial
              color="#FF7A00"
              emissive="#FF7A00"
              emissiveIntensity={1.6}
              metalness={0.6}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.18, 0.7, 0.06]} />
            <meshStandardMaterial
              color="#FF7A00"
              emissive="#FF7A00"
              emissiveIntensity={1.6}
              metalness={0.6}
            />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFD700"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      </group>

      {/* 3. FLOATING 3D CODE BRACKETS { } (Top Left) */}
      <group ref={codeRef} position={[-2.6, 1.2, -0.4]} scale={0.6}>
        {/* Left Bracket < */}
        <group position={[-0.45, 0, 0]}>
          <mesh position={[-0.15, 0.25, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.08, 0.55, 0.08]} />
            <meshStandardMaterial
              color="#00D2FF"
              emissive="#00D2FF"
              emissiveIntensity={2}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[-0.15, -0.25, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.08, 0.55, 0.08]} />
            <meshStandardMaterial
              color="#00D2FF"
              emissive="#00D2FF"
              emissiveIntensity={2}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Slash / */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial
            color="#FF7A00"
            emissive="#FF7A00"
            emissiveIntensity={2}
            roughness={0.2}
          />
        </mesh>

        {/* Right Bracket > */}
        <group position={[0.45, 0, 0]}>
          <mesh position={[0.15, 0.25, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.08, 0.55, 0.08]} />
            <meshStandardMaterial
              color="#00D2FF"
              emissive="#00D2FF"
              emissiveIntensity={2}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0.15, -0.25, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.08, 0.55, 0.08]} />
            <meshStandardMaterial
              color="#00D2FF"
              emissive="#00D2FF"
              emissiveIntensity={2}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* 4. FLOATING DIPLOMA / SCROLL (Bottom Right) */}
      <group ref={certRef} position={[2.6, -1.2, 0.3]} scale={0.55}>
        {/* Rolled parchment cylinder */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 1.2, 24]} />
          <meshStandardMaterial
            color="#F1F5F9"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Ribbon Wrap in bright orange */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 0.2, 24]} />
          <meshStandardMaterial
            color="#FF7A00"
            emissive="#FF7A00"
            emissiveIntensity={1.2}
            roughness={0.4}
          />
        </mesh>

        {/* Golden seal badge on ribbon */}
        <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.03, 16]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#FF9E0D"
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </>
  );
};
