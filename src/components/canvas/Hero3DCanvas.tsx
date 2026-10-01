import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GraduationCap3D } from './GraduationCap3D';
import { FloatingBook3D } from './FloatingBook3D';
import { Laptop3D } from './Laptop3D';
import { EducationIcons3D } from './EducationIcons3D';
import { ConceptNetwork3D } from './ConceptNetwork3D';
import { FloatingParticles3D } from './FloatingParticles3D';

interface SceneContentProps {
  isMobile: boolean;
}

const SceneContent: React.FC<SceneContentProps> = ({ isMobile }) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Scroll offset state ref
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      scrollRef.current = Math.min(scrollY / (window.innerHeight || 800), 1.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!masterGroupRef.current) return;

    // Mouse parallax (smooth lerping)
    const targetX = state.pointer.x * (isMobile ? 0.25 : 0.65);
    const targetY = state.pointer.y * (isMobile ? 0.15 : 0.45);

    masterGroupRef.current.rotation.y = THREE.MathUtils.damp(
      masterGroupRef.current.rotation.y,
      targetX * 0.4,
      4,
      delta
    );
    masterGroupRef.current.rotation.x = THREE.MathUtils.damp(
      masterGroupRef.current.rotation.x,
      -targetY * 0.35,
      4,
      delta
    );

    // Scroll animation effect: gently push group back and rotate as user scrolls down
    const scrollEffect = scrollRef.current;
    masterGroupRef.current.position.y = -scrollEffect * 1.2;
    masterGroupRef.current.position.z = -scrollEffect * 0.8;
  });

  return (
    <group ref={masterGroupRef} position={[isMobile ? 0 : 0.4, 0, 0]} scale={isMobile ? 0.72 : 1}>
      {/* 1. Center Focal: 3D Graduation Cap with Floating Ring */}
      <GraduationCap3D position={[0, 0.45, 0]} scale={isMobile ? 1 : 1.15} />

      {/* 2. Floating Books */}
      {/* Primary Blue/Cyan Book (Left side) */}
      <FloatingBook3D
        position={[-1.9, 0.2, 0.2]}
        rotation={[0.3, 0.4, -0.15]}
        coverColor="#0A2D74"
        accentColor="#00D2FF"
        scale={0.82}
        floatSpeed={1.3}
        floatOffset={0.5}
      />

      {/* Secondary Orange/Gold Book (Lower Left) */}
      <FloatingBook3D
        position={[-1.2, -1.25, 0.5]}
        rotation={[-0.2, 0.8, 0.3]}
        coverColor="#B44200"
        accentColor="#FFAE00"
        scale={0.7}
        floatSpeed={1.1}
        floatOffset={2.2}
      />

      {/* 3. 3D Sleek Laptop with Glowing Display (Right side) */}
      <Laptop3D
        position={[2.0, -0.4, 0.1]}
        rotation={[0.25, -0.65, 0.12]}
        scale={isMobile ? 0.72 : 0.88}
      />

      {/* 4. Floating Education Icons (Atom, Code Brackets, Star Badge, Scroll) */}
      <EducationIcons3D />

      {/* 5. 3D Concept Network Connecting Concepts */}
      <ConceptNetwork3D />

      {/* 6. Floating Ambient Particle Dust */}
      <FloatingParticles3D count={isMobile ? 90 : 260} />
    </group>
  );
};

export const Hero3DCanvas: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Check mobile screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // WebGL capability probe
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#0A1128] to-[#050A1A]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.15)_0%,transparent_70%)]" />
        <div className="text-center p-6 max-w-md z-10">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-500/10 border border-[#00D2FF]/40 flex items-center justify-center glow-cyan">
            <span className="text-3xl">🎓</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">HKSURYA 3D Learning Arena</h3>
          <p className="text-sm text-slate-400">Interactive WebGL requires hardware acceleration enabled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: isMobile ? 52 : 44 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        {/* ================= LIGHTING SETUP ================= */}
        {/* Soft Navy Fill Light */}
        <ambientLight color="#0A1E4D" intensity={1.4} />

        {/* Warm Orange Key Light (Upper Right) */}
        <directionalLight
          position={[5, 6, 4]}
          color="#FF8A00"
          intensity={2.8}
        />

        {/* Electric Cyan Rim Light (Lower Left Behind) */}
        <directionalLight
          position={[-6, -4, 2]}
          color="#00D2FF"
          intensity={3.2}
        />

        {/* Top Center Cool White Highlight */}
        <directionalLight
          position={[0, 8, 3]}
          color="#E0F2FE"
          intensity={1.2}
        />

        {/* Floating Point Light: Cyan (Center Left) */}
        <pointLight
          position={[-2.5, 1.5, 2]}
          color="#00D2FF"
          intensity={2.5}
          distance={8}
        />

        {/* Floating Point Light: Orange (Center Right) */}
        <pointLight
          position={[2.5, -1, 2]}
          color="#FF7A00"
          intensity={2.2}
          distance={7}
        />

        {/* ================= 3D SCENE CONTENT ================= */}
        <Suspense fallback={null}>
          <SceneContent isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
};
