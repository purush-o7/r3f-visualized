"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function EmissiveOrb({
  position,
  color,
  speed,
  emissiveIntensity,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  emissiveIntensity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * speed) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        toneMapped={false}
      />
    </mesh>
  );
}

function CenterKnot({ rotationSpeed, color }: { rotationSpeed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * rotationSpeed;
      ref.current.rotation.x = clock.elapsedTime * rotationSpeed * 0.5;
    }
  });

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

function SceneContent() {
  const { rotationSpeed, emissiveIntensity, orbSpeed, color } = useControls({
    rotationSpeed: { value: 0.3, min: 0, max: 3, step: 0.1 },
    emissiveIntensity: { value: 2, min: 0, max: 5, step: 0.1 },
    orbSpeed: { value: 1.5, min: 0, max: 5, step: 0.1 },
    color: { value: "#e2e8f0" },
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <CenterKnot rotationSpeed={rotationSpeed} color={color} />
      <EmissiveOrb position={[-1.5, 0, 0]} color="#22d3ee" speed={orbSpeed} emissiveIntensity={emissiveIntensity} />
      <EmissiveOrb position={[1.5, 0, 0]} color="#f472b6" speed={orbSpeed * 1.33} emissiveIntensity={emissiveIntensity} />
      <EmissiveOrb position={[0, 0, -1.5]} color="#a3e635" speed={orbSpeed * 0.8} emissiveIntensity={emissiveIntensity} />
      <gridHelper args={[8, 8, "#222", "#1a1a1a"]} />
      <OrbitControls enableDamping />
    </>
  );
}

export function ComposerDemo() {
  return (
    <SceneContainer caption="A scene with emissive orbs and a metallic torus knot -- ready for post-processing effects like Bloom and Vignette.">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
        <SceneContent />
      </Canvas>
    </SceneContainer>
  );
}
