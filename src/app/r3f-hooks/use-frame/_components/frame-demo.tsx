"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function DeltaCube({ speed, color }: { speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += speed * delta;
      ref.current.position.y = 0.6 + Math.sin(ref.current.rotation.y * 2) * 0.15;
    }
  });
  return (
    <mesh ref={ref} position={[-1.4, 0.6, 0]}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

function FixedCube({ speed, color, useDelta }: { speed: number; color: string; useDelta: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += useDelta ? speed * delta : speed * 0.016;
      ref.current.position.y = 0.6 + Math.sin(ref.current.rotation.y * 2) * 0.15;
    }
  });
  return (
    <mesh ref={ref} position={[1.4, 0.6, 0]}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
  );
}

function Scene({ speed }: { speed: number }) {
  const { useDelta, colorA, colorB } = useControls({
    useDelta: { value: true, label: "Use Delta" },
    colorA: { value: "#4ade80", label: "Green Cube" },
    colorB: { value: "#f87171", label: "Red Cube" },
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <DeltaCube speed={speed} color={colorA} />
      <FixedCube speed={speed} color={colorB} useDelta={useDelta} />
      <Floor />
      <gridHelper args={[10, 10, "#333", "#222"]} position-y={0.01} />
      <OrbitControls
        makeDefault
        enableDamping
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

export function FrameDemo() {
  const [speed, setSpeed] = useState(2);

  return (
    <div className="space-y-3">
      <SceneContainer caption="Left uses delta (smooth at any framerate). Right uses fixed value (framerate-dependent).">
        <Leva collapsed titleBar={{ title: "Controls" }} />
        <Canvas camera={{ position: [0, 2.5, 5], fov: 50 }}>
          <Scene speed={speed} />
        </Canvas>
      </SceneContainer>
      <div className="flex items-center justify-center gap-3 px-4">
        <label className="text-xs text-muted-foreground whitespace-nowrap">
          Speed
        </label>
        <input
          type="range"
          min={0.5}
          max={8}
          step={0.5}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-48 accent-blue-500"
        />
        <span className="text-xs text-muted-foreground font-mono w-8">
          {speed.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
