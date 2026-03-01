"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

const TONE_MAPPING_OPTIONS: Record<string, THREE.ToneMapping> = {
  ACESFilmic: THREE.ACESFilmicToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  Linear: THREE.LinearToneMapping,
  None: THREE.NoToneMapping,
};

function GlassSphere({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.6, 64, 64]} />
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0}
        roughness={0}
        transmission={1}
        thickness={1.2}
        ior={1.5}
        envMapIntensity={1}
      />
    </mesh>
  );
}

function MetallicTorus({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={ref} position={position} rotation={[Math.PI / 4, 0, 0]}>
      <torusKnotGeometry args={[0.5, 0.18, 128, 32]} />
      <meshStandardMaterial
        color="#c0c0c0"
        metalness={1}
        roughness={0.05}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

function ChromeSphere({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshStandardMaterial
        color="#ff6b35"
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.2} />
    </mesh>
  );
}

function SceneContent() {
  const {
    toneMapping,
    exposure,
    srgb,
    shadows,
    antialias,
    envIntensity,
  } = useControls({
    toneMapping: {
      value: "ACESFilmic",
      options: Object.keys(TONE_MAPPING_OPTIONS),
    },
    exposure: { value: 1.0, min: 0, max: 3, step: 0.05 },
    srgb: { value: true, label: "sRGB Color Space" },
    shadows: { value: true },
    antialias: { value: true },
    envIntensity: { value: 1.0, min: 0, max: 3, step: 0.1, label: "Env Intensity" },
  });

  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />

      <ambientLight intensity={0.15} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow={shadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.001}
      />
      <pointLight position={[-3, 3, -3]} intensity={0.5} color="#6366f1" />

      <MetallicTorus position={[0, 0.3, 0]} />
      <GlassSphere position={[-2, 0, 0.5]} />
      <ChromeSphere position={[2, -0.3, 0.3]} />
      <Floor />

      <Environment
        preset="studio"
        environmentIntensity={envIntensity}
      />

      <OrbitControls
        enableDamping
        minDistance={3}
        maxDistance={12}
      />
    </>
  );
}

export function RealisticDemo() {
  const {
    toneMapping,
    exposure,
    srgb,
    shadows,
    antialias,
  } = useControls({
    toneMapping: {
      value: "ACESFilmic",
      options: Object.keys(TONE_MAPPING_OPTIONS),
    },
    exposure: { value: 1.0, min: 0, max: 3, step: 0.05 },
    srgb: { value: true, label: "sRGB Color Space" },
    shadows: { value: true },
    antialias: { value: true },
    envIntensity: { value: 1.0, min: 0, max: 3, step: 0.1, label: "Env Intensity" },
  });

  return (
    <SceneContainer caption="Toggle tone mapping, exposure, color space, and shadows. Notice how ACESFilmic vs Linear dramatically changes the mood.">
      <Leva collapsed titleBar={{ title: "Render Settings" }} />
      <Canvas
        camera={{ position: [4, 3, 5], fov: 45 }}
        shadows={shadows}
        gl={{
          antialias,
          toneMapping: TONE_MAPPING_OPTIONS[toneMapping],
          toneMappingExposure: exposure,
          outputColorSpace: srgb
            ? THREE.SRGBColorSpace
            : THREE.LinearSRGBColorSpace,
        }}
      >
        <SceneContent />
      </Canvas>
    </SceneContainer>
  );
}
