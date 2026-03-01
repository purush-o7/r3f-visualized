"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function RotatingObjects({ rotationSpeed }: { rotationSpeed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });
  return (
    <group ref={groupRef}>
      <mesh position={[-1.5, 0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#6366f1" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#f472b6" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[1.5, 0.5, 0]} castShadow>
        <torusKnotGeometry args={[0.35, 0.12, 64, 16]} />
        <meshStandardMaterial color="#22d3ee" roughness={0.3} />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
    </mesh>
  );
}

function AmbientLightLayer({ on, intensity }: { on: boolean; intensity: number }) {
  return on ? <ambientLight intensity={intensity} color="#fef3c7" /> : null;
}

function DirectionalLightLayer({ on, intensity }: { on: boolean; intensity: number }) {
  return on ? (
    <directionalLight
      position={[5, 8, 3]}
      intensity={intensity}
      color="#ffffff"
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-left={-5}
      shadow-camera-right={5}
      shadow-camera-top={5}
      shadow-camera-bottom={-5}
    />
  ) : null;
}

function SpotLightLayer({ on, angle }: { on: boolean; angle: number }) {
  return on ? (
    <spotLight
      position={[-3, 6, 2]}
      intensity={20}
      color="#a78bfa"
      angle={angle}
      penumbra={0.5}
      distance={15}
      decay={2}
      castShadow
      shadow-mapSize-width={512}
      shadow-mapSize-height={512}
      target-position={[0, 0, 0]}
    />
  ) : null;
}

function AnimatedPointLight({ on, intensity }: { on: boolean; intensity: number }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (on) {
      const x = Math.sin(clock.elapsedTime * 0.8) * 2;
      const z = Math.cos(clock.elapsedTime * 0.8) * 2;
      if (lightRef.current) {
        lightRef.current.position.set(x, 2, z);
      }
      if (sphereRef.current) {
        sphereRef.current.position.set(x, 2, z);
      }
    }
  });
  return on ? (
    <>
      <pointLight
        ref={lightRef}
        position={[2, 2, 0]}
        intensity={intensity}
        color="#ff8844"
        distance={10}
        decay={2}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <mesh ref={sphereRef} position={[2, 2, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ff8844" />
      </mesh>
    </>
  ) : null;
}

type LightKey = "ambient" | "directional" | "point" | "spot";

function Scene({ lights }: { lights: Record<LightKey, boolean> }) {
  const {
    ambientIntensity,
    directionalIntensity,
    pointIntensity,
    spotAngle,
    rotationSpeed,
  } = useControls({
    ambientIntensity: { value: 0.4, min: 0, max: 2, step: 0.05 },
    directionalIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    pointIntensity: { value: 8, min: 0, max: 30, step: 0.5 },
    spotAngle: { value: Math.PI / 7, min: 0.1, max: 1, step: 0.01 },
    rotationSpeed: { value: 0.15, min: 0, max: 3, step: 0.05 },
  });

  return (
    <>
      {/* Minimal base light so scene isn't pitch black */}
      <ambientLight intensity={0.03} />

      <AmbientLightLayer on={lights.ambient} intensity={ambientIntensity} />
      <DirectionalLightLayer on={lights.directional} intensity={directionalIntensity} />
      <AnimatedPointLight on={lights.point} intensity={pointIntensity} />
      <SpotLightLayer on={lights.spot} angle={spotAngle} />

      <RotatingObjects rotationSpeed={rotationSpeed} />
      <Ground />
      <OrbitControls
        enableDamping
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
    </>
  );
}

const lightConfig: { key: LightKey; label: string; color: string }[] = [
  { key: "ambient", label: "Ambient", color: "bg-amber-400" },
  { key: "directional", label: "Directional", color: "bg-white" },
  { key: "point", label: "Point", color: "bg-orange-400" },
  { key: "spot", label: "Spot", color: "bg-violet-400" },
];

export function LightsShowcase() {
  const [lights, setLights] = useState<Record<LightKey, boolean>>({
    ambient: false,
    directional: true,
    point: false,
    spot: false,
  });

  const toggle = (key: LightKey) =>
    setLights((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SceneContainer caption="Toggle each light type to see how it affects the scene. Point light orbits automatically when active.">
      <LevaPanel title="Controls" />
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
        {lightConfig.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              lights[key]
                ? "bg-white text-black shadow-md"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                lights[key] ? color : "bg-white/30"
              }`}
            />
            {label}
          </button>
        ))}
      </div>
      <Canvas camera={{ position: [4, 3, 4], fov: 45 }} shadows>
        <Scene lights={lights} />
      </Canvas>
    </SceneContainer>
  );
}
