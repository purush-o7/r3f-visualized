"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

type EnvPreset =
  | "sunset"
  | "dawn"
  | "night"
  | "warehouse"
  | "forest"
  | "apartment"
  | "studio"
  | "city"
  | "park"
  | "lobby";

const presets: EnvPreset[] = [
  "sunset",
  "dawn",
  "night",
  "warehouse",
  "forest",
  "apartment",
  "studio",
  "city",
  "park",
  "lobby",
];

function ReflectiveSphere({
  roughness,
  metalness,
  envIntensity,
  rotationSpeed,
}: {
  roughness: number;
  metalness: number;
  envIntensity: number;
  rotationSpeed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]} castShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#ffffff"
        roughness={roughness}
        metalness={metalness}
        envMapIntensity={envIntensity}
      />
    </mesh>
  );
}

function SmallSpheres({ rotationSpeed }: { rotationSpeed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (rotationSpeed * 0.5);
    }
  });

  const materials: { color: string; roughness: number; metalness: number; pos: [number, number, number] }[] = [
    { color: "#ff4444", roughness: 0.8, metalness: 0, pos: [-2, -0.2, 0.5] },
    { color: "#ffd700", roughness: 0.1, metalness: 1, pos: [2, 0, -0.5] },
    { color: "#44ff88", roughness: 0.4, metalness: 0.5, pos: [0.8, -0.3, 2] },
  ];

  return (
    <group ref={groupRef}>
      {materials.map((m, i) => (
        <mesh key={i} position={m.pos} castShadow>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color={m.color}
            roughness={m.roughness}
            metalness={m.metalness}
          />
        </mesh>
      ))}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial color="#111115" roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

function Scene({ preset }: { preset: EnvPreset }) {
  const { roughness, metalness, envIntensity, backgroundBlur, rotationSpeed } = useControls({
    roughness: { value: 0.05, min: 0, max: 1, step: 0.01 },
    metalness: { value: 1, min: 0, max: 1, step: 0.01 },
    envIntensity: { value: 1.2, min: 0, max: 3, step: 0.1 },
    backgroundBlur: { value: 0.6, min: 0, max: 1, step: 0.01 },
    rotationSpeed: { value: 0.2, min: 0, max: 3, step: 0.05 },
  });

  return (
    <>
      <ambientLight intensity={0.05} />
      <Environment preset={preset} background backgroundBlurriness={backgroundBlur} />
      <ReflectiveSphere
        roughness={roughness}
        metalness={metalness}
        envIntensity={envIntensity}
        rotationSpeed={rotationSpeed}
      />
      <SmallSpheres rotationSpeed={rotationSpeed} />
      <Ground />
      <OrbitControls
        enableDamping
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
    </>
  );
}

export function EnvMapDemo() {
  const [preset, setPreset] = useState<EnvPreset>("sunset");

  return (
    <SceneContainer caption="A reflective metallic sphere with environment-based lighting -- switch presets to see how the reflections and ambient light change.">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[280px]">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`text-[10px] px-2 py-1 rounded-full font-medium transition-colors capitalize ${
              preset === p
                ? "bg-white text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <Canvas camera={{ position: [3, 1.5, 3], fov: 45 }} shadows>
        <Scene preset={preset} />
      </Canvas>
    </SceneContainer>
  );
}
