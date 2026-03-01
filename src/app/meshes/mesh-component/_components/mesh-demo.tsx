"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

const shapes = [
  {
    position: [-2.5, 0, 0] as [number, number, number],
    color: "#ef4444",
    geometry: "box",
    label: "Box + Standard",
  },
  {
    position: [-0.8, 0, 0] as [number, number, number],
    color: "#22c55e",
    geometry: "sphere",
    label: "Sphere + Lambert",
  },
  {
    position: [0.8, 0, 0] as [number, number, number],
    color: "#3b82f6",
    geometry: "torus",
    label: "Torus + Phong",
  },
  {
    position: [2.5, 0, 0] as [number, number, number],
    color: "#f59e0b",
    geometry: "torusKnot",
    label: "Knot + Physical",
  },
];

function ShapeMesh({
  position,
  color,
  geometry,
}: {
  position: [number, number, number];
  color: string;
  geometry: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { wireframe, rotationSpeed, metalness, roughness } = useControls({
    wireframe: false,
    rotationSpeed: { value: 0.5, min: 0, max: 3, step: 0.1 },
    metalness: { value: 0.6, min: 0, max: 1, step: 0.05 },
    roughness: { value: 0.4, min: 0, max: 1, step: 0.05 },
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
      const targetScale = hovered ? 1.2 : 1;
      ref.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  const activeColor = clicked ? "#a855f7" : color;

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        setClicked(!clicked);
      }}
    >
      {geometry === "box" && <boxGeometry args={[0.9, 0.9, 0.9]} />}
      {geometry === "sphere" && <sphereGeometry args={[0.55, 32, 32]} />}
      {geometry === "torus" && <torusGeometry args={[0.4, 0.18, 16, 32]} />}
      {geometry === "torusKnot" && (
        <torusKnotGeometry args={[0.35, 0.12, 64, 8]} />
      )}

      {geometry === "box" && (
        <meshStandardMaterial color={activeColor} roughness={roughness} metalness={metalness} wireframe={wireframe} />
      )}
      {geometry === "sphere" && (
        <meshLambertMaterial color={activeColor} wireframe={wireframe} />
      )}
      {geometry === "torus" && (
        <meshPhongMaterial color={activeColor} shininess={80} wireframe={wireframe} />
      )}
      {geometry === "torusKnot" && (
        <meshPhysicalMaterial
          color={activeColor}
          roughness={roughness}
          metalness={metalness}
          clearcoat={1}
          wireframe={wireframe}
        />
      )}
    </mesh>
  );
}

export function MeshDemo() {
  return (
    <SceneContainer caption="Mesh = Geometry + Material -- click any shape to highlight it">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 2, -2]} color="#ec4899" intensity={0.5} />
        {shapes.map((shape) => (
          <ShapeMesh
            key={shape.geometry}
            position={shape.position}
            color={shape.color}
            geometry={shape.geometry}
          />
        ))}
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
