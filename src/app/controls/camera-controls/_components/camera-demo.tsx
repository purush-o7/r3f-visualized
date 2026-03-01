"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import type { CameraControls as CameraControlsImpl } from "@react-three/drei";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function FloatingShape({
  position,
  color,
  geometry,
}: {
  position: [number, number, number];
  color: string;
  geometry: "torus" | "icosahedron" | "box";
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.y = t * 0.5;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.15;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      {geometry === "torus" && <torusGeometry args={[0.5, 0.2, 32, 48]} />}
      {geometry === "icosahedron" && <icosahedronGeometry args={[0.5, 0]} />}
      {geometry === "box" && <boxGeometry args={[0.7, 0.7, 0.7]} />}
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
    </mesh>
  );
}

function Scene({ controlsRef }: { controlsRef: React.RefObject<CameraControlsImpl | null> }) {
  const { smoothTime, transitionSpeed } = useControls({
    smoothTime: { value: 0.5, min: 0.1, max: 2, step: 0.05, label: "Smooth Time" },
    transitionSpeed: { value: 1, min: 0.1, max: 5, step: 0.1, label: "Transition Speed" },
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[-4, 3, -2]} intensity={0.5} color="#a78bfa" />
      <FloatingShape position={[-2.5, 0.8, 0]} color="#f472b6" geometry="torus" />
      <FloatingShape position={[0, 0.8, -1]} color="#60a5fa" geometry="icosahedron" />
      <FloatingShape position={[2.5, 0.8, 0.5]} color="#4ade80" geometry="box" />
      <mesh rotation-x={-Math.PI / 2} position-y={0}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <gridHelper args={[14, 14, "#333", "#222"]} position-y={0.01} />
      <CameraControls
        ref={controlsRef}
        makeDefault
        smoothTime={smoothTime}
        dollySpeed={transitionSpeed}
        truckSpeed={transitionSpeed}
      />
    </>
  );
}

function ViewButton({
  onClick,
  children,
  accent,
}: {
  onClick: () => void;
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors hover:bg-accent/10`}
      style={{ borderColor: accent + "60", color: accent }}
    >
      {children}
    </button>
  );
}

export function CameraDemo() {
  const controlsRef = useRef<CameraControlsImpl>(null);

  const flyTo = (
    px: number, py: number, pz: number,
    tx: number, ty: number, tz: number
  ) => {
    controlsRef.current?.setLookAt(px, py, pz, tx, ty, tz, true);
  };

  return (
    <div className="space-y-3">
      <SceneContainer caption="Click buttons to smoothly fly the camera to each object. Drag to orbit freely.">
        <Leva collapsed titleBar={{ title: "Controls" }} />
        <Canvas camera={{ position: [5, 4, 6], fov: 45 }}>
          <Scene controlsRef={controlsRef} />
        </Canvas>
      </SceneContainer>
      <div className="flex items-center justify-center gap-2 flex-wrap px-4">
        <ViewButton accent="#f472b6" onClick={() => flyTo(-1, 2, 3, -2.5, 0.8, 0)}>
          Pink Torus
        </ViewButton>
        <ViewButton accent="#60a5fa" onClick={() => flyTo(1.5, 2, 2, 0, 0.8, -1)}>
          Blue Icosahedron
        </ViewButton>
        <ViewButton accent="#4ade80" onClick={() => flyTo(4, 2, 3.5, 2.5, 0.8, 0.5)}>
          Green Box
        </ViewButton>
        <ViewButton accent="#a78bfa" onClick={() => flyTo(5, 4, 6, 0, 0.5, 0)}>
          Overview
        </ViewButton>
      </div>
    </div>
  );
}
