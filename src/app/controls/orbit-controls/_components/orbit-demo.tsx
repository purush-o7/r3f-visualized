"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function Showcase() {
  const torusRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.3;
      torusRef.current.rotation.z = t * 0.2;
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = 0.8 + Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <group>
      <mesh ref={torusRef} position={[-1.5, 0.8, 0]}>
        <torusGeometry args={[0.5, 0.2, 32, 64]} />
        <meshStandardMaterial color="#f472b6" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh ref={sphereRef} position={[0, 0.8, 0]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[1.5, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#4ade80" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <gridHelper args={[12, 12, "#333", "#222"]} position-y={0.01} />
    </group>
  );
}

function Scene({
  damping,
  autoRotate,
  constrain,
}: {
  damping: boolean;
  autoRotate: boolean;
  constrain: boolean;
}) {
  const { enableDamping, autoRotateLeva, autoRotateSpeed, minDistance, maxDistance } = useControls({
    enableDamping: { value: true, label: "Enable Damping" },
    autoRotateLeva: { value: false, label: "Auto Rotate" },
    autoRotateSpeed: { value: 1.5, min: 0.5, max: 10, step: 0.5, label: "Rotate Speed" },
    minDistance: { value: 3, min: 1, max: 5, step: 0.5, label: "Min Distance" },
    maxDistance: { value: 10, min: 10, max: 50, step: 1, label: "Max Distance" },
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[-3, 3, -3]} intensity={0.4} color="#f472b6" />
      <Showcase />
      <OrbitControls
        makeDefault
        enableDamping={damping && enableDamping}
        dampingFactor={0.05}
        autoRotate={autoRotate || autoRotateLeva}
        autoRotateSpeed={autoRotateSpeed}
        minPolarAngle={constrain ? Math.PI / 6 : 0}
        maxPolarAngle={constrain ? Math.PI / 2.2 : Math.PI}
        minDistance={minDistance}
        maxDistance={maxDistance}
      />
    </>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
        active
          ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
          : "bg-transparent border-border/50 text-muted-foreground hover:border-border"
      }`}
    >
      {children}
    </button>
  );
}

export function OrbitDemo() {
  const [damping, setDamping] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [constrain, setConstrain] = useState(false);

  return (
    <div className="space-y-3">
      <SceneContainer caption="Drag to orbit, scroll to zoom, right-click to pan. Toggle features below.">
        <LevaPanel title="Controls" />
        <Canvas camera={{ position: [3, 3, 5], fov: 45 }}>
          <Scene damping={damping} autoRotate={autoRotate} constrain={constrain} />
        </Canvas>
      </SceneContainer>
      <div className="flex items-center justify-center gap-2 flex-wrap px-4">
        <ToggleButton active={damping} onClick={() => setDamping((d) => !d)}>
          Damping {damping ? "ON" : "OFF"}
        </ToggleButton>
        <ToggleButton active={autoRotate} onClick={() => setAutoRotate((a) => !a)}>
          Auto-Rotate {autoRotate ? "ON" : "OFF"}
        </ToggleButton>
        <ToggleButton active={constrain} onClick={() => setConstrain((c) => !c)}>
          Constrained {constrain ? "ON" : "OFF"}
        </ToggleButton>
      </div>
    </div>
  );
}
