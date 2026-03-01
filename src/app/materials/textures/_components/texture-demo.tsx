"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

type WrapMode = "repeat" | "mirrored" | "clamp";

function useCheckerTexture(
  wrapMode: WrapMode,
  repeatCount: number
) {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const tileSize = size / 8;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#e0e0e0" : "#3b3b5c";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const wrapMap: Record<WrapMode, THREE.Wrapping> = {
      repeat: THREE.RepeatWrapping,
      mirrored: THREE.MirroredRepeatWrapping,
      clamp: THREE.ClampToEdgeWrapping,
    };
    texture.wrapS = wrapMap[wrapMode];
    texture.wrapT = wrapMap[wrapMode];
    texture.repeat.set(repeatCount, repeatCount);

    return texture;
  }, [wrapMode, repeatCount]);
}

function TexturedCube({
  wrapMode,
  repeatCount,
  rotationSpeed,
  colorTint,
}: {
  wrapMode: WrapMode;
  repeatCount: number;
  rotationSpeed: number;
  colorTint: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useCheckerTexture(wrapMode, repeatCount);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
      ref.current.rotation.x += delta * (rotationSpeed * 0.43);
    }
  });

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial map={texture} color={colorTint} roughness={0.5} />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#111118" roughness={0.9} />
    </mesh>
  );
}

function SceneContent({
  wrapMode,
  repeatCount,
}: {
  wrapMode: WrapMode;
  repeatCount: number;
}) {
  const { rotationSpeed, tileCount, "color tint": colorTint } = useControls({
    rotationSpeed: { value: 0.35, min: 0, max: 3, step: 0.05 },
    tileCount: { value: repeatCount, min: 1, max: 8, step: 1 },
    "color tint": { value: "#ffffff" },
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <TexturedCube
        wrapMode={wrapMode}
        repeatCount={tileCount}
        rotationSpeed={rotationSpeed}
        colorTint={colorTint}
      />
      <Ground />
      <OrbitControls enableDamping />
    </>
  );
}

export function TextureDemo() {
  const [wrapMode, setWrapMode] = useState<WrapMode>("repeat");
  const [repeatCount, setRepeatCount] = useState(2);

  return (
    <SceneContainer caption="Procedural checkerboard texture -- change wrapping mode and repeat count to see the difference.">
      <LevaPanel title="Controls" />
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <div className="flex gap-1.5">
          {(["repeat", "mirrored", "clamp"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setWrapMode(mode)}
              className={`text-[10px] px-2 py-1 rounded-full font-medium transition-colors ${
                wrapMode === mode
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setRepeatCount(n)}
              className={`text-[10px] px-2 py-1 rounded-full font-medium transition-colors ${
                repeatCount === n
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {n}x
            </button>
          ))}
        </div>
      </div>
      <Canvas camera={{ position: [3, 2.5, 3], fov: 45 }} shadows>
        <SceneContent wrapMode={wrapMode} repeatCount={repeatCount} />
      </Canvas>
    </SceneContainer>
  );
}
