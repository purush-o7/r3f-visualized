"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

const PRESETS = ["sunset", "dawn", "warehouse", "city", "forest", "night"] as const;
type PresetType = typeof PRESETS[number];

function MetallicSphere({ position, roughness, metalness }: { position: [number, number, number]; roughness: number; metalness: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.6, 64, 64]} />
      <meshStandardMaterial
        metalness={metalness}
        roughness={roughness}
        color="#ffffff"
      />
    </mesh>
  );
}

function GlassSphere({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.6, 64, 64]} />
      <meshPhysicalMaterial
        metalness={0}
        roughness={0}
        transmission={0.95}
        thickness={1.5}
        ior={1.5}
        color="#ffffff"
      />
    </mesh>
  );
}

function RoughSphere({ position, roughness, metalness }: { position: [number, number, number]; roughness: number; metalness: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <torusKnotGeometry args={[0.4, 0.15, 128, 32]} />
      <meshStandardMaterial
        metalness={metalness}
        roughness={roughness}
        color="#e0b0ff"
      />
    </mesh>
  );
}

function Scene({ preset }: { preset: PresetType }) {
  const { roughness, metalness, envIntensity, backgroundBlur } = useControls({
    roughness: { value: 0.05, min: 0, max: 1, step: 0.01, label: "Roughness" },
    metalness: { value: 1, min: 0, max: 1, step: 0.01, label: "Metalness" },
    envIntensity: { value: 1, min: 0, max: 5, step: 0.1, label: "Env Intensity" },
    backgroundBlur: { value: 0.5, min: 0, max: 1, step: 0.01, label: "BG Blur" },
  });

  return (
    <>
      <Environment
        preset={preset}
        background
        blur={backgroundBlur}
        environmentIntensity={envIntensity}
      />
      <MetallicSphere position={[-1.5, 0, 0]} roughness={roughness} metalness={metalness} />
      <GlassSphere position={[0, 0, 0]} />
      <RoughSphere position={[1.5, 0, 0]} roughness={roughness} metalness={metalness} />
      <OrbitControls
        makeDefault
        enableDamping
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
      />
    </>
  );
}

export function EnvDemo() {
  const [preset, setPreset] = useState<PresetType>("sunset");

  return (
    <div className="space-y-3">
      <SceneContainer caption="Toggle environment presets -- watch how reflections and lighting change on metallic and glass surfaces.">
        <Leva collapsed titleBar={{ title: "Controls" }} />
        <Canvas camera={{ position: [0, 0.5, 4], fov: 45 }}>
          <Scene preset={preset} />
        </Canvas>
      </SceneContainer>
      <div className="flex items-center justify-center gap-1.5 flex-wrap px-4">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors capitalize ${
              preset === p
                ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                : "bg-transparent border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
