"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stage, OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

const PRESETS = ["rembrandt", "portrait", "upfront", "soft"] as const;
type PresetType = typeof PRESETS[number];

function ShowcaseShape() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[0.8, 0.3, 200, 40]} />
      <meshStandardMaterial
        color="#6366f1"
        metalness={0.7}
        roughness={0.15}
      />
    </mesh>
  );
}

function Scene({ preset }: { preset: PresetType }) {
  const { shadows, adjustCamera, intensity } = useControls({
    shadows: { value: true, label: "Shadows" },
    adjustCamera: { value: true, label: "Adjust Camera" },
    intensity: { value: 0.8, min: 0, max: 3, step: 0.05, label: "Intensity" },
  });

  return (
    <>
      <OrbitControls
        makeDefault
        enableDamping
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
      <Stage
        preset={preset}
        intensity={intensity}
        adjustCamera={adjustCamera}
        shadows={shadows ? {
          type: "contact",
          opacity: 0.4,
          blur: 2.5,
        } : false}
      >
        <ShowcaseShape />
      </Stage>
    </>
  );
}

export function StageDemo() {
  const [preset, setPreset] = useState<PresetType>("rembrandt");

  return (
    <div className="space-y-3">
      <SceneContainer caption="Stage handles lighting, shadows, and centering. Switch presets to see different photography-inspired lighting setups.">
        <LevaPanel title="Controls" />
        <Canvas shadows camera={{ position: [3, 2, 4], fov: 45 }}>
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
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400"
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
