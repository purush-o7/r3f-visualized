"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Instances, Instance, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

interface ParticleData {
  position: [number, number, number];
  color: string;
  speed: number;
  offset: number;
}

function WaveInstances() {
  const groupRef = useRef<THREE.Group>(null);

  const { count, waveSpeed, waveHeight, cubeSize } = useControls({
    count: { value: 400, min: 100, max: 1000, step: 10 },
    waveSpeed: { value: 1, min: 0, max: 5, step: 0.1 },
    waveHeight: { value: 0.8, min: 0, max: 3, step: 0.1 },
    cubeSize: { value: 0.2, min: 0.05, max: 0.5, step: 0.01 },
  });

  const grid = Math.ceil(Math.sqrt(count));

  const particles = useMemo<ParticleData[]>(() => {
    const items: ParticleData[] = [];
    const colors = ["#22d3ee", "#a78bfa", "#f472b6", "#4ade80", "#fbbf24"];

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / grid);
      const col = i % grid;
      const x = (col - grid / 2) * 0.35;
      const z = (row - grid / 2) * 0.35;

      items.push({
        position: [x, 0, z],
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.8 + Math.random() * 0.6,
        offset: (x + z) * 0.5,
      });
    }
    return items;
  }, [count, grid]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <Instances limit={count} range={count}>
        <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
        <meshStandardMaterial metalness={0.5} roughness={0.3} />

        {particles.map((p, i) => (
          <WaveInstance key={i} data={p} waveSpeed={waveSpeed} waveHeight={waveHeight} />
        ))}
      </Instances>
    </group>
  );
}

function WaveInstance({ data, waveSpeed, waveHeight }: { data: ParticleData; waveSpeed: number; waveHeight: number }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    const instance = ref.current as unknown as THREE.Object3D | null;
    if (instance) {
      const t = clock.elapsedTime;
      const y = Math.sin(t * data.speed * waveSpeed + data.offset) * waveHeight;
      instance.position.y = y;
      const scaleY = 0.5 + (y + waveHeight) * (0.5 / Math.max(waveHeight, 0.01));
      instance.scale.set(1, scaleY, 1);
    }
  });

  return (
    <Instance
      ref={ref}
      position={data.position}
      color={data.color}
    />
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <pointLight position={[-5, 3, 0]} color="#a78bfa" intensity={1} />
      <WaveInstances />
      <OrbitControls enableDamping />
    </>
  );
}

export function DreiPerfDemo() {
  return (
    <SceneContainer caption="Instances rendered in a single draw call using drei's Instances component. Each cube animates independently in a wave pattern.">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [4, 5, 8], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
