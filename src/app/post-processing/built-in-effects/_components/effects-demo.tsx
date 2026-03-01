"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function GlowingSphere({
  position,
  color,
  speed,
  size = 0.35,
  emissiveIntensity,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  size?: number;
  emissiveIntensity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * speed + position[0]) * 0.25;
      const scale = 1 + Math.sin(clock.elapsedTime * speed * 0.7) * 0.1;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        toneMapped={false}
      />
    </mesh>
  );
}

function Floor({ reflectivity }: { reflectivity: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#111" metalness={reflectivity} roughness={1 - reflectivity} />
    </mesh>
  );
}

function CenterPiece({ pulseSpeed }: { pulseSpeed: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.4;
      const scale = 1 + Math.sin(clock.elapsedTime * pulseSpeed) * 0.05;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.3, 0]}>
      <torusGeometry args={[0.6, 0.2, 24, 48]} />
      <meshStandardMaterial color="#fff" metalness={0.95} roughness={0.05} />
    </mesh>
  );
}

function SceneContent() {
  const { pulseSpeed, emissiveIntensity, floorReflectivity } = useControls({
    pulseSpeed: { value: 1, min: 0, max: 3, step: 0.1 },
    emissiveIntensity: { value: 2.5, min: 0, max: 10, step: 0.1 },
    floorReflectivity: { value: 0.8, min: 0, max: 1, step: 0.01 },
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <CenterPiece pulseSpeed={pulseSpeed} />
      <GlowingSphere position={[-1.2, 0.3, 0.5]} color="#06b6d4" speed={1.8} emissiveIntensity={emissiveIntensity} />
      <GlowingSphere position={[1.2, 0.3, -0.5]} color="#e879f9" speed={1.4} emissiveIntensity={emissiveIntensity} />
      <GlowingSphere position={[0, 0.3, -1.2]} color="#4ade80" speed={2.0} size={0.25} emissiveIntensity={emissiveIntensity} />
      <GlowingSphere position={[-0.8, 0.3, -1]} color="#fbbf24" speed={1.6} size={0.2} emissiveIntensity={emissiveIntensity} />
      <GlowingSphere position={[0.8, 0.3, 1]} color="#f87171" speed={1.3} size={0.2} emissiveIntensity={emissiveIntensity} />
      <Floor reflectivity={floorReflectivity} />
      <OrbitControls enableDamping />
    </>
  );
}

export function EffectsDemo() {
  return (
    <SceneContainer caption="Emissive spheres pulsing around a metallic torus -- add Bloom, Vignette, or Noise to see each effect's impact.">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
        <SceneContent />
      </Canvas>
    </SceneContainer>
  );
}
