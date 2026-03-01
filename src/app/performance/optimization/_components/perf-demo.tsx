"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function IndividualMeshes({ count, rotationSpeed, spacing }: { count: number; rotationSpeed: number; spacing: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(
    () =>
      Array.from({ length: count }, () => [
        (Math.random() - 0.5) * spacing,
        (Math.random() - 0.5) * spacing,
        (Math.random() - 0.5) * spacing,
      ] as [number, number, number]),
    [count, spacing]
  );

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={[-3, 0, 0]}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      ))}
    </group>
  );
}

function InstancedMeshes({ count, rotationSpeed, spacing }: { count: number; rotationSpeed: number; spacing: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * spacing,
        (Math.random() - 0.5) * spacing,
        (Math.random() - 0.5) * spacing
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, spacing]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * rotationSpeed;
    }
  });

  return (
    <group position={[3, 0, 0]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color="#22c55e" />
      </instancedMesh>
    </group>
  );
}

function Label({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position}>
      <planeGeometry args={[2.5, 0.35]} />
      <meshBasicMaterial color={color} opacity={0.15} transparent />
    </mesh>
  );
}

function SceneContent({ mode }: { mode: "both" | "individual" | "instanced" }) {
  const { count, rotationSpeed, spacing } = useControls({
    count: { value: 200, min: 50, max: 500, step: 10 },
    rotationSpeed: { value: 0.2, min: 0, max: 3, step: 0.1 },
    spacing: { value: 4, min: 1, max: 10, step: 0.5 },
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {(mode === "both" || mode === "individual") && (
        <>
          <IndividualMeshes count={count} rotationSpeed={rotationSpeed} spacing={spacing} />
          <Label position={[-3, 2.8, 0]} color="#ef4444" />
        </>
      )}
      {(mode === "both" || mode === "instanced") && (
        <>
          <InstancedMeshes count={count} rotationSpeed={rotationSpeed} spacing={spacing} />
          <Label position={[3, 2.8, 0]} color="#22c55e" />
        </>
      )}
    </>
  );
}

export function PerfDemo() {
  const [mode, setMode] = useState<"both" | "individual" | "instanced">("both");

  return (
    <div className="space-y-2">
      <SceneContainer caption="Red: individual meshes (many draw calls). Green: 1 InstancedMesh (1 draw call). Same visual result, massive performance difference.">
        <Leva collapsed titleBar={{ title: "Controls" }} />
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <SceneContent mode={mode} />
        </Canvas>
      </SceneContainer>
      <div className="flex items-center justify-center gap-2 px-4">
        {(["both", "individual", "instanced"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-xs px-3 py-1 rounded-md border transition-colors ${
              mode === m
                ? "bg-white/10 border-white/20 text-white"
                : "border-white/5 text-muted-foreground hover:text-white hover:border-white/10"
            }`}
          >
            {m === "both" ? "Side by Side" : m === "individual" ? "Individual Only" : "Instanced Only"}
          </button>
        ))}
      </div>
    </div>
  );
}
