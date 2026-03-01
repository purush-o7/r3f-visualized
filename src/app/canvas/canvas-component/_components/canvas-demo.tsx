"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function SpinningTorusKnot() {
  const ref = useRef<THREE.Mesh>(null);
  const { color, rotationSpeed, wireframe, scale } = useControls({
    color: "#6366f1",
    rotationSpeed: { value: 0.4, min: 0, max: 3, step: 0.1 },
    wireframe: false,
    scale: { value: 1, min: 0.2, max: 3, step: 0.1 },
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
      ref.current.rotation.x += delta * (rotationSpeed * 0.5);
    }
  });

  return (
    <mesh ref={ref} scale={scale}>
      <torusKnotGeometry args={[1, 0.35, 128, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.6}
        wireframe={wireframe}
      />
    </mesh>
  );
}

export function CanvasDemo() {
  return (
    <SceneContainer caption='This entire 3D scene is just a <Canvas> component'>
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-3, 2, -2]} color="#ec4899" intensity={0.8} />
        <SpinningTorusKnot />
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
