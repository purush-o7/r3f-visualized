"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useFrame(({ pointer }, delta) => {
    if (!meshRef.current) return;
    mouseRef.current.x += (pointer.x * 0.5 - mouseRef.current.x) * 2 * delta;
    mouseRef.current.y += (pointer.y * 0.3 - mouseRef.current.y) * 2 * delta;

    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.position.x = mouseRef.current.x * viewport.width * 0.1;
    meshRef.current.position.y = mouseRef.current.y * viewport.height * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial
        color="#60a5fa"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#60a5fa"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      gl={{ antialias: true, alpha: true }}
    >
      <FloatingIcosahedron />
      <ParticleField />
    </Canvas>
  );
}
