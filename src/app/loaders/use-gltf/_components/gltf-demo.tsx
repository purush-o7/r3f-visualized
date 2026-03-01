"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function RobotPart({
  position,
  color,
  args,
  geometryType = "box",
}: {
  position: [number, number, number];
  color: string;
  args: [number, number, number] | [number, number, number, number];
  geometryType?: "box" | "sphere" | "cylinder";
}) {
  return (
    <mesh position={position}>
      {geometryType === "box" && <boxGeometry args={args as [number, number, number]} />}
      {geometryType === "sphere" && (
        <sphereGeometry args={[args[0], 16, 16]} />
      )}
      {geometryType === "cylinder" && (
        <cylinderGeometry args={args as [number, number, number, number]} />
      )}
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
    </mesh>
  );
}

function Robot() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  const { headSpeed, bodyColor, eyeColor, showAntenna } = useControls({
    headSpeed: { value: 1.2, min: 0, max: 5, step: 0.1 },
    bodyColor: { value: "#64748b" },
    eyeColor: { value: "#22d3ee" },
    showAntenna: { value: true },
  });

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.4;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(clock.elapsedTime * headSpeed) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Body */}
      <RobotPart position={[0, 0.6, 0]} color={bodyColor} args={[0.8, 1, 0.5]} />

      {/* Head */}
      <mesh ref={headRef} position={[0, 1.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.45]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.12, 1.55, 0.23]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.12, 1.55, 0.23]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2} />
      </mesh>

      {/* Arms */}
      <RobotPart position={[-0.6, 0.6, 0]} color="#475569" args={[0.15, 0.8, 0.15]} />
      <RobotPart position={[0.6, 0.6, 0]} color="#475569" args={[0.15, 0.8, 0.15]} />

      {/* Legs */}
      <RobotPart position={[-0.2, -0.2, 0]} color="#475569" args={[0.18, 0.6, 0.18]} />
      <RobotPart position={[0.2, -0.2, 0]} color="#475569" args={[0.18, 0.6, 0.18]} />

      {/* Antenna */}
      {showAntenna && (
        <>
          <RobotPart
            position={[0, 1.95, 0]}
            color="#fbbf24"
            args={[0.03, 0.03, 0.3, 8]}
            geometryType="cylinder"
          />
          <mesh position={[0, 2.15, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
          </mesh>
        </>
      )}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, 2, 2]} color="#22d3ee" intensity={1} />
      <Robot />
      <gridHelper args={[6, 6, "#333", "#222"]} />
      <OrbitControls enableDamping />
    </>
  );
}

export function GltfDemo() {
  return (
    <SceneContainer caption="A robot composed from primitive nodes -- representing how useGLTF destructures a model into nodes and materials for per-part control.">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [1, 1, 3], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
