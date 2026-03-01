"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function DeltaTimeCube({
  speed,
  useDelta,
  color,
}: {
  speed: number;
  useDelta: boolean;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      if (useDelta) {
        ref.current.rotation.y += speed * delta;
      } else {
        ref.current.rotation.y += speed * 0.016;
      }
      ref.current.position.y =
        0.6 + Math.sin(ref.current.rotation.y) * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={[-1.5, 0.6, 0]}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function FixedStepCube({
  speed,
  useDelta,
  color,
}: {
  speed: number;
  useDelta: boolean;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      if (useDelta) {
        ref.current.rotation.y += speed * delta;
      } else {
        // Fixed increment -- speed varies with frame rate!
        ref.current.rotation.y += speed * 0.016;
      }
      ref.current.position.y =
        0.6 + Math.sin(ref.current.rotation.y) * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={[1.5, 0.6, 0]}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Labels() {
  return (
    <group>
      {/* Simple labels using small planes */}
      <mesh position={[-1.5, 1.6, 0]}>
        <planeGeometry args={[1.6, 0.3]} />
        <meshBasicMaterial color="#22c55e" opacity={0.2} transparent />
      </mesh>
      <mesh position={[1.5, 1.6, 0]}>
        <planeGeometry args={[1.4, 0.3]} />
        <meshBasicMaterial color="#ef4444" opacity={0.2} transparent />
      </mesh>
    </group>
  );
}

function Scene({ speed }: { speed: number }) {
  const { useDelta, colorLeft, colorRight, showLabels } = useControls(
    "Animation Controls",
    {
      useDelta: { value: true, label: "Use Delta Time" },
      colorLeft: { value: "#22c55e", label: "Left Cube Color" },
      colorRight: { value: "#ef4444", label: "Right Cube Color" },
      showLabels: { value: true, label: "Show Labels" },
    }
  );

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <DeltaTimeCube speed={speed} useDelta={useDelta} color={colorLeft} />
      <FixedStepCube speed={speed} useDelta={!useDelta} color={colorRight} />
      {showLabels && <Labels />}
      <gridHelper args={[8, 8, "#333", "#222"]} />
      <OrbitControls enableDamping />
    </>
  );
}

export function AnimationDemo() {
  const [speed, setSpeed] = useState(2);

  return (
    <div className="space-y-2">
      <SceneContainer caption="Green (left) uses delta time -- smooth at any framerate. Red (right) uses fixed step -- would drift on different monitors.">
        <LevaPanel title="Controls" />
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
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
          max={6}
          step={0.5}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-40 accent-blue-500"
        />
        <span className="text-xs text-muted-foreground font-mono w-8">
          {speed.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
