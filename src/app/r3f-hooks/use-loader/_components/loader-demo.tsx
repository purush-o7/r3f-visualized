"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function ProceduralSphere({ roughness, metalness }: { roughness: number; metalness: number }) {
  const ref = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Create a procedural checkerboard-like pattern
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cx = x / size - 0.5;
        const cy = y / size - 0.5;
        const dist = Math.sqrt(cx * cx + cy * cy);
        const wave = Math.sin(dist * 30) * 0.5 + 0.5;
        const checker = ((Math.floor(x / 16) + Math.floor(y / 16)) % 2) * 0.15;
        const v = Math.floor((wave * 0.6 + checker + 0.2) * 255);
        ctx.fillStyle = `rgb(${v * 0.6}, ${v * 0.7}, ${v})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  const normalMap = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = Math.sin(x * 0.2) * 127 + 128;
        const ny = Math.cos(y * 0.2) * 127 + 128;
        ctx.fillStyle = `rgb(${nx}, ${ny}, 255)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.3, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.3, 0.3)}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  );
}

function SmallOrbitCube({ orbitSpeed }: { orbitSpeed: number }) {
  const ref = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Simple gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, "#4f46e5");
    gradient.addColorStop(1, "#06b6d4");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= size; i += 8) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.x = Math.cos(t * orbitSpeed) * 2.2;
      ref.current.position.z = Math.sin(t * orbitSpeed) * 2.2;
      ref.current.position.y = Math.sin(t * 1.2) * 0.5;
      ref.current.rotation.y += 0.02;
      ref.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function Scene() {
  const { roughness, metalness, orbitSpeed } = useControls({
    roughness: { value: 0.5, min: 0, max: 1, step: 0.01, label: "Roughness" },
    metalness: { value: 0.2, min: 0, max: 1, step: 0.01, label: "Metalness" },
    orbitSpeed: { value: 0.8, min: 0, max: 5, step: 0.1, label: "Orbit Speed" },
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#818cf8" />
      <ProceduralSphere roughness={roughness} metalness={metalness} />
      <SmallOrbitCube orbitSpeed={orbitSpeed} />
      <OrbitControls makeDefault enableDamping />
    </>
  );
}

export function LoaderDemo() {
  return (
    <SceneContainer caption="Procedural textures applied to geometry -- in real apps, useLoader loads these from files with caching + Suspense.">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [0, 0.5, 4], fov: 45 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
