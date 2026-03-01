"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { count, size, color, speed, spread } = useControls({
    count: { value: 1500, min: 100, max: 5000, step: 100, label: "Count" },
    size: { value: 0.08, min: 0.01, max: 0.5, step: 0.01, label: "Size" },
    color: { value: "#88ccff", label: "Color" },
    speed: { value: 0.3, min: 0, max: 2, step: 0.05, label: "Speed" },
    spread: { value: 5, min: 1, max: 15, step: 0.5, label: "Spread" },
  });

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * spread;
      pos[i3 + 1] = (Math.random() - 0.5) * spread;
      pos[i3 + 2] = (Math.random() - 0.5) * spread;
      vel[i3] = (Math.random() - 0.5) * 0.02;
      vel[i3 + 1] = Math.random() * 0.01 + 0.005;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions: pos, velocities: vel };
  }, [count, spread]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += velocities[i3] * speed;
      arr[i3 + 1] += velocities[i3 + 1] * speed;
      arr[i3 + 2] += velocities[i3 + 2] * speed;

      // Wrap around when particles drift too far
      const halfSpread = spread / 2;
      if (arr[i3 + 1] > halfSpread) {
        arr[i3 + 1] = -halfSpread;
        arr[i3] = (Math.random() - 0.5) * spread;
        arr[i3 + 2] = (Math.random() - 0.5) * spread;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050510"]} />
      <Particles />
      <OrbitControls enableDamping autoRotate autoRotateSpeed={0.4} />
    </>
  );
}

export function ParticlesDemo() {
  return (
    <SceneContainer caption="Thousands of floating particles animated with useFrame. Tweak count, size, speed, and spread in the controls.">
      <LevaPanel title="Particle Controls" />
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
