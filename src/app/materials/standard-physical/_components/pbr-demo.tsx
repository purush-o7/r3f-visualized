"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function PBRSphere({
  position,
  roughness,
  metalness,
  label,
  baseColor,
  rotationSpeed,
  showLabels,
}: {
  position: [number, number, number];
  roughness: number;
  metalness: number;
  label: string;
  baseColor: string;
  rotationSpeed: number;
  showLabels: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
    }
  });
  return (
    <group position={position}>
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshStandardMaterial
          color={metalness > 0 ? "#c0c0c0" : baseColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {showLabels && (
        <Html
          position={[0, -0.65, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <div className="text-[10px] font-mono text-white/80 whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

function RowLabel({
  position,
  text,
  visible,
}: {
  position: [number, number, number];
  text: string;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      style={{ pointerEvents: "none" }}
    >
      <div className="text-[11px] font-semibold text-white/90 whitespace-nowrap bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
        {text}
      </div>
    </Html>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
      <planeGeometry args={[14, 8]} />
      <meshStandardMaterial color="#111118" roughness={0.9} />
    </mesh>
  );
}

const roughnessSteps = [0, 0.25, 0.5, 0.75, 1.0];
const metalnessSteps = [0, 0.25, 0.5, 0.75, 1.0];

function Scene() {
  const { envPreset, baseColor, showLabels, rotationSpeed } = useControls({
    envPreset: { value: "city", options: ["city", "sunset", "warehouse", "studio"] },
    baseColor: { value: "#c0c0c0" },
    showLabels: { value: true },
    rotationSpeed: { value: 0.3, min: 0, max: 3, step: 0.1 },
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment preset={envPreset as "city" | "sunset" | "warehouse" | "studio"} />

      {/* Roughness row */}
      <RowLabel position={[-3.6, 0.6, 0]} text="Roughness" visible={showLabels} />
      {roughnessSteps.map((r, i) => (
        <PBRSphere
          key={`r-${i}`}
          position={[-2 + i * 1.2, 0.6, 0]}
          roughness={r}
          metalness={0}
          label={`R: ${r}`}
          baseColor={baseColor}
          rotationSpeed={rotationSpeed}
          showLabels={showLabels}
        />
      ))}

      {/* Metalness row */}
      <RowLabel position={[-3.6, -0.6, 0]} text="Metalness" visible={showLabels} />
      {metalnessSteps.map((m, i) => (
        <PBRSphere
          key={`m-${i}`}
          position={[-2 + i * 1.2, -0.6, 0]}
          roughness={0.2}
          metalness={m}
          label={`M: ${m}`}
          baseColor={baseColor}
          rotationSpeed={rotationSpeed}
          showLabels={showLabels}
        />
      ))}

      <Ground />
      <OrbitControls
        enableDamping
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
    </>
  );
}

export function PBRDemo() {
  return (
    <SceneContainer caption="PBR roughness (top row) and metalness (bottom row) -- orbit to see how reflections change with each parameter.">
      <LevaPanel title="Controls" />
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 42 }}
        shadows
      >
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
