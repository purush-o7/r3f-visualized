"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const CATEGORY_CONFIG: Record<
  string,
  { geometry: string; color: string; args?: number[] }
> = {
  "scene-basics": { geometry: "box", color: "#3b82f6", args: [1.2, 1.2, 1.2] },
  geometries: { geometry: "icosahedron", color: "#14b8a6", args: [1.3, 1] },
  materials: { geometry: "sphere", color: "#a855f7", args: [1.2, 16, 16] },
  lights: { geometry: "torus", color: "#f59e0b", args: [1, 0.4, 16, 32] },
  canvas: { geometry: "box", color: "#22c55e", args: [1.4, 1, 0.6] },
  meshes: { geometry: "dodecahedron", color: "#22c55e", args: [1.2, 0] },
  "r3f-hooks": { geometry: "octahedron", color: "#22c55e", args: [1.2] },
  events: { geometry: "cone", color: "#22c55e", args: [1, 1.5, 8] },
  controls: { geometry: "torusKnot", color: "#06b6d4", args: [0.9, 0.35, 64, 8] },
  staging: { geometry: "sphere", color: "#22c55e", args: [1.2, 12, 12] },
  "text-html": { geometry: "box", color: "#8b5cf6", args: [1.6, 0.8, 0.4] },
  loaders: { geometry: "cylinder", color: "#f97316", args: [0.8, 0.8, 1.4, 8] },
  debug: { geometry: "tetrahedron", color: "#f43f5e", args: [1.3] },
  transforms: { geometry: "icosahedron", color: "#8b5cf6", args: [1.2, 0] },
  particles: { geometry: "octahedron", color: "#06b6d4", args: [1.2, 0] },
  interaction: { geometry: "torus", color: "#8b5cf6", args: [1, 0.35, 16, 32] },
  "shader-recipes": { geometry: "octahedron", color: "#8b5cf6", args: [1.3, 1] },
  shaders: { geometry: "dodecahedron", color: "#ec4899", args: [1.2, 1] },
  "post-processing": { geometry: "torus", color: "#a855f7", args: [1, 0.3, 16, 32] },
  performance: { geometry: "sphere", color: "#ef4444", args: [1.2, 8, 8] },
  production: { geometry: "box", color: "#f97316", args: [1.2, 1.2, 1.2] },
};

function createGeometry(type: string, args: number[]): THREE.BufferGeometry {
  switch (type) {
    case "box":
      return new THREE.BoxGeometry(...(args as [number, number, number]));
    case "sphere":
      return new THREE.SphereGeometry(...(args as [number, number, number]));
    case "icosahedron":
      return new THREE.IcosahedronGeometry(...(args as [number, number]));
    case "dodecahedron":
      return new THREE.DodecahedronGeometry(...(args as [number, number]));
    case "octahedron":
      return new THREE.OctahedronGeometry(...(args as [number, number]));
    case "tetrahedron":
      return new THREE.TetrahedronGeometry(...(args as [number]));
    case "torus":
      return new THREE.TorusGeometry(
        ...(args as [number, number, number, number])
      );
    case "torusKnot":
      return new THREE.TorusKnotGeometry(
        ...(args as [number, number, number, number])
      );
    case "cone":
      return new THREE.ConeGeometry(...(args as [number, number, number]));
    case "cylinder":
      return new THREE.CylinderGeometry(
        ...(args as [number, number, number, number])
      );
    default:
      return new THREE.IcosahedronGeometry(1.2, 1);
  }
}

function FloatingShape({
  category,
}: {
  category: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG["geometries"];

  const geometry = useMemo(
    () => createGeometry(config.geometry, config.args ?? [1.2]),
    [config.geometry, config.args]
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.12;
    meshRef.current.rotation.x += delta * 0.08;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        color={config.color}
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

function ParticleRing({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const radius = 2.2 + (Math.random() - 0.5) * 0.8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
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
        color={color}
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

export function CategoryBackground({ category }: { category: string }) {
  const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG["geometries"];

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <FloatingShape category={category} />
      <ParticleRing color={config.color} />
    </Canvas>
  );
}
