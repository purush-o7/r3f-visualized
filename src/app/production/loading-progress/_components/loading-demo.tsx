"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useProgress,
  useTexture,
} from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

/* ── Custom Loading Screen ── */
function LoadingScreen() {
  const { progress, item, loaded, total } = useProgress();

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-scene-bg">
      <div className="text-center space-y-4 px-6 max-w-xs w-full">
        <div className="text-sm text-muted-foreground font-mono">
          Loading assets...
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress text */}
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>
            {loaded} / {total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>

        {/* Current item */}
        {item && (
          <p className="text-[11px] text-muted-foreground/60 truncate">
            {item.split("/").pop()}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Scene objects that trigger loading ── */
function TexturedBox({ position }: { position: [number, number, number] }) {
  const texture = useTexture({
    map: "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
  });

  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial {...texture} roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

function MetallicSphere({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.7, 64, 64]} />
      <meshStandardMaterial color="#4f46e5" metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[15, 15]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
    </mesh>
  );
}

function SceneContent() {
  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <TexturedBox position={[-1.5, 0, 0]} />
      <MetallicSphere position={[1.5, -0.1, 0]} />
      <Floor />

      <Environment preset="city" />
      <OrbitControls enableDamping />
    </>
  );
}

/* ── Main Demo Export ── */
export function LoadingDemo() {
  const [sceneKey, setSceneKey] = useState(0);
  const [showScene, setShowScene] = useState(true);

  const handleReload = () => {
    setShowScene(false);
    setTimeout(() => {
      setSceneKey((k) => k + 1);
      setShowScene(true);
    }, 100);
  };

  return (
    <div className="space-y-2">
      <SceneContainer caption="A custom loading screen using useProgress. Click 'Reload Scene' to see the loading animation replay.">
        <LevaPanel title="Loading Demo" />
        {showScene && (
          <Canvas
            key={sceneKey}
            camera={{ position: [3, 2, 4], fov: 50 }}
            shadows
            gl={{
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
            }}
          >
            <Suspense fallback={null}>
              <SceneContent />
            </Suspense>
          </Canvas>
        )}
        {showScene && (
          <Suspense fallback={<LoadingScreen />}>
            <SceneAwait />
          </Suspense>
        )}
      </SceneContainer>
      <div className="flex justify-center">
        <button
          onClick={handleReload}
          className="text-xs px-4 py-1.5 rounded-md border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
        >
          Reload Scene
        </button>
      </div>
    </div>
  );
}

/* ── Helper to show loading while Canvas loads ── */
function SceneAwait() {
  const { progress } = useProgress();

  if (progress < 100) {
    return <LoadingScreen />;
  }

  return null;
}
