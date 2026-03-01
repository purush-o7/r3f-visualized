"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

/* ── 1. Raw useFrame animation ── */
function RawBox({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const [toggled, setToggled] = useState(false);
  const phase = useRef(0);

  const { speed } = useControls("Raw useFrame", {
    speed: { value: 2, min: 0.5, max: 8, step: 0.25 },
  });

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Simple sine-wave bob -- like flipping through a flipbook
    phase.current += delta * speed;
    const targetY = toggled ? position[1] + 1.2 : position[1];
    ref.current.position.y =
      targetY + Math.sin(phase.current) * 0.08;
    ref.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        (e as any).stopPropagation();
        setToggled((t) => !t);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#ef4444" roughness={0.4} metalness={0.3} />
    </mesh>
  );
}

/* ── 2. Manual spring physics ── */
function SpringBox({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const [toggled, setToggled] = useState(false);
  const velocity = useRef(0);
  const current = useRef(position[1]);

  const { stiffness, damping, mass } = useControls("Spring Physics", {
    stiffness: { value: 120, min: 20, max: 400, step: 5 },
    damping: { value: 8, min: 1, max: 30, step: 0.5 },
    mass: { value: 1, min: 0.2, max: 5, step: 0.1 },
  });

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = toggled ? position[1] + 1.2 : position[1];
    // Spring equation: F = -k * x - d * v
    const displacement = current.current - target;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * velocity.current;
    const acceleration = (springForce + dampingForce) / mass;
    velocity.current += acceleration * delta;
    current.current += velocity.current * delta;
    ref.current.position.y = current.current;
    ref.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        (e as any).stopPropagation();
        setToggled((t) => !t);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.3} />
    </mesh>
  );
}

/* ── 3. Smooth lerp interpolation ── */
function LerpBox({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const [toggled, setToggled] = useState(false);

  const { smoothness } = useControls("Lerp (Smooth)", {
    smoothness: { value: 0.05, min: 0.01, max: 0.3, step: 0.005 },
  });

  useFrame(() => {
    if (!ref.current) return;
    const targetY = toggled ? position[1] + 1.2 : position[1];
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      targetY,
      smoothness
    );
    ref.current.rotation.y += 0.008;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        (e as any).stopPropagation();
        setToggled((t) => !t);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#22c55e" roughness={0.4} metalness={0.3} />
    </mesh>
  );
}

/* ── Labels ── */
function Label({
  position,
  text,
  color,
}: {
  position: [number, number, number];
  text: string;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[1.6, 0.35]} />
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.85} />
      </mesh>
      {/* Use a colored bar as a simple indicator */}
      <mesh position={[0, -0.25, 0]}>
        <planeGeometry args={[0.6, 0.04]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

export function SpringDemo() {
  return (
    <SceneContainer caption="Click each box to toggle -- watch how each animation style feels different">
      <Leva collapsed titleBar={{ title: "Animation Controls" }} />
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Raw useFrame */}
        <RawBox position={[-2.5, 0, 0]} />
        <Label position={[-2.5, -1, 0]} text="useFrame" color="#ef4444" />

        {/* Spring */}
        <SpringBox position={[0, 0, 0]} />
        <Label position={[0, -1, 0]} text="Spring" color="#3b82f6" />

        {/* Lerp */}
        <LerpBox position={[2.5, 0, 0]} />
        <Label position={[2.5, -1, 0]} text="Lerp" color="#22c55e" />

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
          <planeGeometry args={[10, 6]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.9}
            transparent
            opacity={0.5}
          />
        </mesh>

        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
