"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function FloatingText() {
  const groupRef = useRef<THREE.Group>(null);

  const { text, fontSize, color, metalness, rotationSpeed } = useControls({
    text: { value: "Hello R3F" },
    fontSize: { value: 0.8, min: 0.5, max: 3, step: 0.1 },
    color: { value: "#a78bfa" },
    metalness: { value: 0.8, min: 0, max: 1, step: 0.01 },
    rotationSpeed: { value: 0.3, min: 0, max: 3, step: 0.1 },
  });

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          fontSize={fontSize}
          font="/fonts/Inter-Bold.woff"
          color={color}
          anchorX="center"
          anchorY="middle"
          maxWidth={10}
        >
          {text}
          <meshStandardMaterial
            color={color}
            emissive="#7c3aed"
            emissiveIntensity={0.4}
            metalness={metalness}
            roughness={0.2}
          />
        </Text>
      </Float>

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3} floatingRange={[-0.1, 0.1]}>
        <Text
          fontSize={0.35}
          font="/fonts/Inter-Bold.woff"
          position={[0, -0.8, 0]}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          3D Text with Drei
          <meshStandardMaterial
            color="#94a3b8"
            emissive="#64748b"
            emissiveIntensity={0.2}
            metalness={0.6}
            roughness={0.3}
          />
        </Text>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, 2, -2]} color="#a78bfa" intensity={2} />
      <FloatingText />
      <OrbitControls enableDamping enableZoom={false} />
    </>
  );
}

export function TextDemo() {
  return (
    <SceneContainer caption="3D text floating and rotating with metallic materials. Drag to orbit.">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
