"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function CornerSphere({ corner, visible }: { corner: "tl" | "tr" | "bl" | "br"; visible: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const viewport = useThree((s) => s.viewport);

  const hw = viewport.width / 2 - 0.4;
  const hh = viewport.height / 2 - 0.4;

  const positions: Record<string, [number, number, number]> = {
    tl: [-hw, hh, 0],
    tr: [hw, hh, 0],
    bl: [-hw, -hh, 0],
    br: [hw, -hh, 0],
  };

  const colors: Record<string, string> = {
    tl: "#f472b6",
    tr: "#60a5fa",
    bl: "#facc15",
    br: "#4ade80",
  };

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.5;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={ref} position={positions[corner]}>
      <octahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial color={colors[corner]} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

function CenterInfo({ centerScale, color }: { centerScale: number; color: string }) {
  const viewport = useThree((s) => s.viewport);
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.4;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  const scale = Math.min(viewport.width, viewport.height) * 0.18;

  return (
    <group scale={centerScale}>
      <mesh ref={ref}>
        <torusKnotGeometry args={[scale, scale * 0.35, 128, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Viewport boundary ring */}
      <mesh>
        <ringGeometry args={[
          Math.min(viewport.width, viewport.height) * 0.45,
          Math.min(viewport.width, viewport.height) * 0.46,
          64
        ]} />
        <meshBasicMaterial color="#ffffff" opacity={0.08} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene() {
  const { showCorners, centerScale, color } = useControls({
    showCorners: { value: true, label: "Show Corners" },
    centerScale: { value: 1, min: 0.5, max: 3, step: 0.1, label: "Center Scale" },
    color: { value: "#a78bfa", label: "Center Color" },
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-3, 3, -3]} intensity={0.5} color="#a78bfa" />
      <CornerSphere corner="tl" visible={showCorners} />
      <CornerSphere corner="tr" visible={showCorners} />
      <CornerSphere corner="bl" visible={showCorners} />
      <CornerSphere corner="br" visible={showCorners} />
      <CenterInfo centerScale={centerScale} color={color} />
    </>
  );
}

export function ViewportDemo() {
  return (
    <SceneContainer caption="Resize the browser window -- objects stay pinned to corners using viewport dimensions.">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
