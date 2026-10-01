import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
}

export const FloatingParticles3D: React.FC<FloatingParticlesProps> = ({ count = 280 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sca = new Float32Array(count);

    const cyan = new THREE.Color('#00D2FF');
    const orange = new THREE.Color('#FF7A00');
    const yellow = new THREE.Color('#FBBF24');
    const blue = new THREE.Color('#2563EB');

    for (let i = 0; i < count; i++) {
      // Distribute in a spherical/ellipsoid cloud
      const radius = 2.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (radius * Math.sin(phi) * Math.sin(theta)) * 0.75;
      pos[i * 3 + 2] = radius * Math.cos(phi) * 0.85;

      // Color distribution: 50% cyan/blue, 45% orange/yellow, 5% white
      const r = Math.random();
      let chosenColor: THREE.Color;
      if (r < 0.45) chosenColor = cyan;
      else if (r < 0.75) chosenColor = orange;
      else if (r < 0.92) chosenColor = yellow;
      else chosenColor = blue;

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;

      sca[i] = Math.random() * 0.08 + 0.03;
    }

    return [pos, col, sca];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    // Slow drifting rotation
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = Math.sin(time * 0.03) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};
