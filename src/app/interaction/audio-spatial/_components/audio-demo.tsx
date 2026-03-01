"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

/* ── Pulsing ring that emanates from a sound source ── */
function PulseRing({
  color,
  delay,
  maxRadius,
  speed,
}: {
  color: string;
  delay: number;
  maxRadius: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.getElapsedTime() * speed + delay) % 1);
    const scale = THREE.MathUtils.lerp(0.1, maxRadius, t);
    ref.current.scale.set(scale, scale, scale);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      THREE.MathUtils.lerp(0.6, 0, t);
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ── Sound source sphere with pulse rings ── */
function SoundSource({
  position,
  color,
  label,
  listenerPos,
  falloffDistance,
  showRange,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  listenerPos: [number, number, number];
  falloffDistance: number;
  showRange: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Calculate distance-based intensity
  const posVec = useMemo(() => new THREE.Vector3(...position), [position]);
  const listenerVec = useMemo(
    () => new THREE.Vector3(...listenerPos),
    [listenerPos]
  );

  useFrame(() => {
    if (!glowRef.current) return;
    const dist = posVec.distanceTo(listenerVec);
    // Inverse-distance falloff: louder when closer
    const intensity = Math.max(0, 1 - dist / falloffDistance);
    const emissiveIntensity = intensity * 0.8;
    (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      emissiveIntensity;
  });

  const dist = posVec.distanceTo(listenerVec);
  const intensity = Math.max(0, 1 - dist / falloffDistance);
  // Pulse speed and ring size scale with proximity
  const pulseSpeed = 0.3 + intensity * 0.8;
  const ringSize = 0.5 + intensity * 2;

  return (
    <group position={position} ref={groupRef}>
      {/* Core sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Pulse rings emanating outward */}
      <PulseRing
        color={color}
        delay={0}
        maxRadius={ringSize}
        speed={pulseSpeed}
      />
      <PulseRing
        color={color}
        delay={0.33}
        maxRadius={ringSize}
        speed={pulseSpeed}
      />
      <PulseRing
        color={color}
        delay={0.66}
        maxRadius={ringSize}
        speed={pulseSpeed}
      />

      {/* Range indicator sphere */}
      {showRange && (
        <mesh>
          <sphereGeometry args={[falloffDistance, 24, 24]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.04}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

/* ── Listener marker (the "ear") ── */
function Listener({
  position,
}: {
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.5;
  });

  return (
    <group position={position}>
      {/* Head */}
      <mesh ref={ref}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Left ear */}
      <mesh position={[-0.25, 0, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {/* Right ear */}
      <mesh position={[0.25, 0, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {/* Direction indicator */}
      <mesh position={[0, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
}

/* ── Connecting lines from listener to sources ── */
function DistanceLine({
  from,
  to,
  color,
  falloff,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  falloff: number;
}) {
  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    if (!lineRef.current) return;
    const dist = new THREE.Vector3(...from).distanceTo(
      new THREE.Vector3(...to)
    );
    const intensity = Math.max(0, 1 - dist / falloff);
    (lineRef.current.material as THREE.LineBasicMaterial).opacity =
      intensity * 0.5;
  });

  const lineObj = useMemo(() => {
    const pts = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.3,
    });
    return new THREE.Line(geo, mat);
  }, [from, to, color]);

  return <primitive ref={lineRef} object={lineObj} />;
}

/* ── Floor grid ── */
function FloorGrid() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial
        color="#0f172a"
        roughness={0.95}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export function AudioDemo() {
  const { listenerX, listenerZ, falloffDistance, showRange } = useControls({
    listenerX: { value: 0, min: -4, max: 4, step: 0.1, label: "listener X" },
    listenerZ: { value: 0, min: -4, max: 4, step: 0.1, label: "listener Z" },
    falloffDistance: {
      value: 5,
      min: 1,
      max: 10,
      step: 0.25,
      label: "falloff distance",
    },
    showRange: { value: true, label: "show range" },
  });

  const listenerPos: [number, number, number] = [listenerX, 0, listenerZ];

  const sources: {
    position: [number, number, number];
    color: string;
    label: string;
  }[] = [
    { position: [-3, 0, -2], color: "#ef4444", label: "Drums" },
    { position: [3, 0, -1], color: "#3b82f6", label: "Guitar" },
    { position: [0, 0, 3], color: "#22c55e", label: "Vocals" },
    { position: [-2, 0, 2.5], color: "#f59e0b", label: "Bass" },
  ];

  return (
    <SceneContainer caption="Drag the listener position with Leva controls -- closer sources pulse faster and brighter">
      <Leva collapsed titleBar={{ title: "Audio Controls" }} />
      <Canvas camera={{ position: [0, 6, 8], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />
        <pointLight position={[0, 4, 0]} intensity={0.3} />

        <FloorGrid />
        <Listener position={listenerPos} />

        {sources.map((src) => (
          <SoundSource
            key={src.label}
            position={src.position}
            color={src.color}
            label={src.label}
            listenerPos={listenerPos}
            falloffDistance={falloffDistance}
            showRange={showRange}
          />
        ))}

        {sources.map((src) => (
          <DistanceLine
            key={`line-${src.label}`}
            from={listenerPos}
            to={src.position}
            color={src.color}
            falloff={falloffDistance}
          />
        ))}

        <gridHelper args={[14, 14, "#1e293b", "#1e293b"]} position={[0, -0.49, 0]} />
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
