"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#f97316"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

function EarthOrbit() {
  const orbitRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const { orbitSpeed, earthSize } = useControls({
    orbitSpeed: { value: 0.4, min: 0, max: 3, step: 0.1 },
    earthSize: { value: 0.3, min: 0.1, max: 0.8, step: 0.05 },
    moonSize: { value: 0.08, min: 0.02, max: 0.2, step: 0.01 },
    showOrbits: true,
  });

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += delta * orbitSpeed;
    if (earthRef.current) earthRef.current.rotation.y += delta * 1.5;
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={earthRef} position={[2.8, 0, 0]}>
        <sphereGeometry args={[earthSize, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.7} />
        {/* Moon orbits around Earth */}
        <MoonOrbit />
      </mesh>
    </group>
  );
}

function MoonOrbit() {
  const orbitRef = useRef<THREE.Group>(null);
  const { moonSize, orbitSpeed } = useControls({
    orbitSpeed: { value: 0.4, min: 0, max: 3, step: 0.1 },
    moonSize: { value: 0.08, min: 0.02, max: 0.2, step: 0.01 },
  });

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += delta * (orbitSpeed * 4.5);
  });

  return (
    <group ref={orbitRef}>
      <mesh position={[0.6, 0, 0]}>
        <sphereGeometry args={[moonSize, 16, 16]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  const { showOrbits } = useControls({
    showOrbits: true,
  });

  if (!showOrbits) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.01, radius + 0.01, 64]} />
      <meshBasicMaterial color="#ffffff" opacity={0.12} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

export function SolarSystemDemo() {
  return (
    <SceneContainer caption="Parent-child transforms: the Moon orbits Earth, which orbits the Sun">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [0, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#fbbf24" />
        <directionalLight position={[5, 3, 5]} intensity={0.5} />
        <Sun />
        <EarthOrbit />
        <OrbitRing radius={2.8} />
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
