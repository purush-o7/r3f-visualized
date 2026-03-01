"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];

function InteractiveShape({
  position,
  geometry,
  initialColor,
}: {
  position: [number, number, number];
  geometry: "box" | "sphere" | "octahedron" | "torus" | "cone";
  initialColor: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [bounce, setBounce] = useState(0);

  const { hoverScale, bounceHeight, rotationSpeed } = useControls({
    hoverScale: { value: 1.3, min: 1, max: 2, step: 0.05 },
    bounceHeight: { value: 0.5, min: 0.1, max: 1, step: 0.05 },
    rotationSpeed: { value: 0.3, min: 0, max: 3, step: 0.1 },
  });

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * rotationSpeed;

    // Hover scale
    const targetScale = hovered ? hoverScale : 1;
    ref.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Bounce animation on click
    if (bounce > 0) {
      ref.current.position.y =
        position[1] + Math.sin(bounce * Math.PI) * bounceHeight;
      setBounce((prev) => Math.max(0, prev - delta * 3));
    } else {
      ref.current.position.y = position[1];
    }
  });

  const handleClick = (e: THREE.Event) => {
    (e as any).stopPropagation();
    // Cycle to next color
    const idx = COLORS.indexOf(color);
    setColor(COLORS[(idx + 1) % COLORS.length]);
    setBounce(1);
  };

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        (e as any).stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {geometry === "box" && <boxGeometry args={[0.7, 0.7, 0.7]} />}
      {geometry === "sphere" && <sphereGeometry args={[0.45, 32, 32]} />}
      {geometry === "octahedron" && <octahedronGeometry args={[0.5]} />}
      {geometry === "torus" && <torusGeometry args={[0.35, 0.15, 16, 32]} />}
      {geometry === "cone" && <coneGeometry args={[0.4, 0.8, 6]} />}
      <meshStandardMaterial
        color={color}
        emissive={hovered ? color : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
        roughness={0.4}
        metalness={0.5}
      />
    </mesh>
  );
}

export function ClickDemo() {
  return (
    <SceneContainer caption="Hover to glow and scale up, click to change color and bounce">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <InteractiveShape position={[-2.5, 0, 0]} geometry="box" initialColor="#ef4444" />
        <InteractiveShape position={[-1, 0, 0.5]} geometry="sphere" initialColor="#3b82f6" />
        <InteractiveShape position={[0.3, 0, -0.3]} geometry="octahedron" initialColor="#22c55e" />
        <InteractiveShape position={[1.6, 0, 0.5]} geometry="torus" initialColor="#f59e0b" />
        <InteractiveShape position={[2.8, 0, 0]} geometry="cone" initialColor="#a855f7" />
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
