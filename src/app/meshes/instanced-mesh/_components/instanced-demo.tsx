"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function WaveCubes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const { count, waveSpeed, waveHeight, cubeSize, spread } = useControls({
    count: { value: 600, min: 100, max: 1000, step: 50 },
    waveSpeed: { value: 2, min: 0, max: 5, step: 0.1 },
    waveHeight: { value: 0.4, min: 0, max: 2, step: 0.1 },
    cubeSize: { value: 0.18, min: 0.1, max: 0.5, step: 0.02 },
    spread: { value: 0.5, min: 0.2, max: 1.5, step: 0.05 },
  });

  const GRID_SIZE = 25;

  // Generate grid positions
  const particles = useMemo(() => {
    const items = [];
    const cols = GRID_SIZE;
    for (let i = 0; i < count; i++) {
      const x = (i % cols) - cols / 2;
      const z = Math.floor(i / cols) - Math.floor(count / cols) / 2;
      items.push({ x: x * spread, z: z * spread });
    }
    return items;
  }, [count, spread]);

  // Set initial colors
  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const { x, z } = particles[i];
      const dist = Math.sqrt(x * x + z * z);
      colorObj.setHSL((dist * 0.08) % 1, 0.7, 0.55);
      meshRef.current.setColorAt(i, colorObj);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [particles, colorObj, count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const { x, z } = particles[i];
      const dist = Math.sqrt(x * x + z * z);
      const y = Math.sin(dist * 0.8 - t * waveSpeed) * waveHeight;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(cubeSize + Math.abs(Math.sin(dist - t * waveSpeed)) * (cubeSize * 0.44));
      dummy.rotation.y = t * 0.3 + dist * 0.1;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.4} metalness={0.5} />
    </instancedMesh>
  );
}

function Stats() {
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  const lastTime = useRef(performance.now());
  const { count } = useControls({
    count: { value: 600, min: 100, max: 1000, step: 50 },
  });

  useEffect(() => {
    let animId: number;
    const tick = () => {
      frames.current++;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        lastTime.current = now;
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] text-white/80 backdrop-blur-sm">
      <div>{count} cubes</div>
      <div>1 draw call</div>
      <div>{fps} FPS</div>
    </div>
  );
}

export function InstancedDemo() {
  return (
    <SceneContainer caption="600+ cubes rendered in a single draw call with a wave animation">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [0, 4, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1} />
        <WaveCubes />
        <OrbitControls enableDamping />
      </Canvas>
      <Stats />
    </SceneContainer>
  );
}
