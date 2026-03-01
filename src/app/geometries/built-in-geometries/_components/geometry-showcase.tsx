"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

const geometries = [
  { name: "Box", create: () => new THREE.BoxGeometry(1, 1, 1) },
  { name: "Sphere", create: () => new THREE.SphereGeometry(0.7, 32, 32) },
  {
    name: "Cylinder",
    create: () => new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32),
  },
  { name: "Cone", create: () => new THREE.ConeGeometry(0.6, 1.2, 32) },
  { name: "Torus", create: () => new THREE.TorusGeometry(0.6, 0.25, 16, 48) },
  {
    name: "TorusKnot",
    create: () => new THREE.TorusKnotGeometry(0.5, 0.18, 100, 16),
  },
  {
    name: "Dodecahedron",
    create: () => new THREE.DodecahedronGeometry(0.7),
  },
  {
    name: "Icosahedron",
    create: () => new THREE.IcosahedronGeometry(0.7),
  },
  {
    name: "Octahedron",
    create: () => new THREE.OctahedronGeometry(0.7),
  },
];

const defaultColors = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#14b8a6",
  "#f97316",
  "#ef4444",
];

function RotatingMesh({
  geometry,
  defaultColor,
}: {
  geometry: THREE.BufferGeometry;
  defaultColor: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const { wireframe, color, rotationSpeed, scale, metalness, roughness } =
    useControls("Geometry Controls", {
      wireframe: false,
      color: defaultColor,
      rotationSpeed: { value: 0.6, min: 0, max: 3, step: 0.1 },
      scale: { value: 1, min: 0.5, max: 2, step: 0.1 },
      metalness: { value: 0.1, min: 0, max: 1, step: 0.01 },
      roughness: { value: 0.35, min: 0, max: 1, step: 0.01 },
    });

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
      ref.current.rotation.x += delta * rotationSpeed * 0.5;
    }
  });

  return (
    <mesh ref={ref} geometry={geometry} scale={scale}>
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        wireframe={wireframe}
      />
    </mesh>
  );
}

function Scene({ selected }: { selected: number }) {
  const geo = geometries[selected].create();

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />
      <RotatingMesh geometry={geo} defaultColor={defaultColors[selected]} />
      <gridHelper args={[6, 6, "#333", "#222"]} position={[0, -1, 0]} />
      <OrbitControls enableDamping />
    </>
  );
}

export function GeometryShowcase() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <SceneContainer
        caption={`${geometries[selected].name}Geometry -- click the buttons below to switch`}
      >
        <LevaPanel title="Controls" />
        <Canvas camera={{ position: [2, 1.5, 2], fov: 50 }}>
          <Scene selected={selected} />
        </Canvas>
      </SceneContainer>
      <div className="flex flex-wrap justify-center gap-1.5 px-2">
        {geometries.map((g, i) => (
          <button
            key={g.name}
            onClick={() => setSelected(i)}
            className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
              i === selected
                ? "bg-white/10 border-white/30 text-white"
                : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>
    </div>
  );
}
