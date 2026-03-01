"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls, button } from "leva";
import { Physics, RigidBody } from "@react-three/rapier";

const BALL_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899", "#14b8a6", "#f97316"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface BallData {
  id: number;
  position: [number, number, number];
  color: string;
  radius: number;
}

function Ball({
  position,
  color,
  radius,
  restitution,
}: {
  position: [number, number, number];
  color: string;
  radius: number;
  restitution: number;
}) {
  return (
    <RigidBody
      position={position}
      restitution={restitution}
      colliders="ball"
      friction={0.5}
    >
      <mesh castShadow>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
    </RigidBody>
  );
}

function Box({
  position,
  size,
  color,
  restitution,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  restitution: number;
}) {
  return (
    <RigidBody position={position} restitution={restitution} friction={0.6}>
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
    </RigidBody>
  );
}

function Floor() {
  return (
    <RigidBody type="fixed" friction={0.8}>
      <mesh receiveShadow position={[0, -0.25, 0]}>
        <boxGeometry args={[12, 0.5, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
    </RigidBody>
  );
}

function Walls() {
  return (
    <>
      {/* Back wall */}
      <RigidBody type="fixed">
        <mesh position={[0, 2, -6]} receiveShadow>
          <boxGeometry args={[12, 5, 0.5]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.9}
            transparent
            opacity={0.3}
          />
        </mesh>
      </RigidBody>
      {/* Left wall */}
      <RigidBody type="fixed">
        <mesh position={[-6, 2, 0]} receiveShadow>
          <boxGeometry args={[0.5, 5, 12]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.9}
            transparent
            opacity={0.3}
          />
        </mesh>
      </RigidBody>
      {/* Right wall */}
      <RigidBody type="fixed">
        <mesh position={[6, 2, 0]} receiveShadow>
          <boxGeometry args={[0.5, 5, 12]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.9}
            transparent
            opacity={0.3}
          />
        </mesh>
      </RigidBody>
    </>
  );
}

function PhysicsScene() {
  const [balls, setBalls] = useState<BallData[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const ballCountRef = useRef(5);

  const { gravity, restitution, ballCount } = useControls({
    gravity: { value: -9.81, min: -20, max: -1, step: 0.5 },
    restitution: {
      value: 0.5,
      min: 0,
      max: 1.2,
      step: 0.05,
      label: "bounciness",
    },
    ballCount: { value: 5, min: 1, max: 15, step: 1, label: "balls to drop" },
    "Drop Balls": button(() => {
      const count = ballCountRef.current;
      const newBalls: BallData[] = [];
      for (let i = 0; i < count; i++) {
        newBalls.push({
          id: Date.now() + i,
          position: [
            randomBetween(-3, 3),
            randomBetween(4, 8),
            randomBetween(-3, 3),
          ],
          color: BALL_COLORS[i % BALL_COLORS.length],
          radius: randomBetween(0.2, 0.5),
        });
      }
      setBalls((prev) => [...prev, ...newBalls]);
    }),
    "Reset Scene": button(() => {
      setBalls([]);
      setResetKey((k) => k + 1);
    }),
  });

  // Keep ballCount in sync for button callbacks
  ballCountRef.current = ballCount;

  // Initial stacked boxes
  const stackedBoxes = useMemo(
    () => [
      {
        position: [0, 0.35, 0] as [number, number, number],
        size: [1.2, 0.6, 1.2] as [number, number, number],
        color: "#6366f1",
      },
      {
        position: [0, 1, 0] as [number, number, number],
        size: [1, 0.5, 1] as [number, number, number],
        color: "#8b5cf6",
      },
      {
        position: [0, 1.55, 0] as [number, number, number],
        size: [0.8, 0.4, 0.8] as [number, number, number],
        color: "#a78bfa",
      },
      {
        position: [2.5, 0.35, -1] as [number, number, number],
        size: [0.8, 0.6, 0.8] as [number, number, number],
        color: "#0ea5e9",
      },
      {
        position: [-2.5, 0.35, 1] as [number, number, number],
        size: [1, 0.6, 0.6] as [number, number, number],
        color: "#10b981",
      },
    ],
    []
  );

  return (
    <Physics gravity={[0, gravity, 0]} key={resetKey}>
      <Floor />
      <Walls />
      {stackedBoxes.map((box, i) => (
        <Box
          key={`box-${resetKey}-${i}`}
          position={box.position}
          size={box.size}
          color={box.color}
          restitution={restitution}
        />
      ))}
      {balls.map((ball) => (
        <Ball
          key={ball.id}
          position={ball.position}
          color={ball.color}
          radius={ball.radius}
          restitution={restitution}
        />
      ))}
    </Physics>
  );
}

export function PhysicsDemo() {
  return (
    <SceneContainer caption="Click 'Drop Balls' to spawn physics objects -- adjust gravity and bounciness with the controls">
      <Leva collapsed titleBar={{ title: "Physics Controls" }} />
      <Canvas
        camera={{ position: [6, 5, 8], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[8, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <PhysicsScene />
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
