"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function RayLine() {
  const lineRef = useRef<THREE.Line>(null);
  const { camera, pointer, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const { rayColor, showRay } = useControls({
    rayColor: { value: "#ef4444", options: { red: "#ef4444", green: "#22c55e", blue: "#3b82f6" } },
    showRay: true,
    targetSize: { value: 1, min: 0.5, max: 2, step: 0.1 },
  });

  useFrame(() => {
    if (!lineRef.current) return;

    lineRef.current.visible = showRay;
    if (!showRay) return;

    raycaster.current.setFromCamera(pointer, camera);
    const intersections = raycaster.current.intersectObjects(
      scene.children,
      true
    );

    // Filter out the ray line itself and non-mesh objects
    const hits = intersections.filter(
      (i) =>
        i.object !== lineRef.current &&
        i.object.type === "Mesh" &&
        (i.object as THREE.Mesh).geometry?.type !== "BufferGeometry"
    );

    const origin = camera.position.clone();
    const end = hits.length > 0
      ? hits[0].point
      : raycaster.current.ray.at(15, new THREE.Vector3());

    const points = [origin, end];
    lineRef.current.geometry.dispose();
    lineRef.current.geometry = new THREE.BufferGeometry().setFromPoints(points);
  });

  return (
    <line ref={lineRef as any}>
      <bufferGeometry />
      <lineBasicMaterial color={rayColor} linewidth={2} transparent opacity={0.6} />
    </line>
  );
}

function TargetObject({
  position,
  color,
  geometry,
}: {
  position: [number, number, number];
  color: string;
  geometry: "box" | "sphere" | "torus";
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hit, setHit] = useState(false);
  const { targetSize } = useControls({
    targetSize: { value: 1, min: 0.5, max: 2, step: 0.1 },
  });

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      scale={targetSize}
      onPointerOver={(e) => {
        (e as any).stopPropagation();
        setHit(true);
      }}
      onPointerOut={() => setHit(false)}
    >
      {geometry === "box" && <boxGeometry args={[0.9, 0.9, 0.9]} />}
      {geometry === "sphere" && <sphereGeometry args={[0.55, 32, 32]} />}
      {geometry === "torus" && <torusGeometry args={[0.45, 0.18, 16, 32]} />}
      <meshStandardMaterial
        color={hit ? "#fbbf24" : color}
        emissive={hit ? "#fbbf24" : "#000000"}
        emissiveIntensity={hit ? 0.5 : 0}
        roughness={0.4}
        metalness={0.5}
      />
    </mesh>
  );
}

function HitMarker() {
  const markerRef = useRef<THREE.Mesh>(null);
  const { camera, pointer, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const { showRay, rayColor } = useControls({
    showRay: true,
    rayColor: { value: "#ef4444", options: { red: "#ef4444", green: "#22c55e", blue: "#3b82f6" } },
  });

  useFrame(() => {
    if (!markerRef.current) return;

    if (!showRay) {
      markerRef.current.visible = false;
      return;
    }

    raycaster.current.setFromCamera(pointer, camera);
    const intersections = raycaster.current.intersectObjects(
      scene.children,
      true
    );
    const hits = intersections.filter(
      (i) =>
        i.object.type === "Mesh" &&
        i.object !== markerRef.current &&
        (i.object as THREE.Mesh).geometry?.type !== "BufferGeometry"
    );

    if (hits.length > 0) {
      markerRef.current.visible = true;
      markerRef.current.position.copy(hits[0].point);
    } else {
      markerRef.current.visible = false;
    }
  });

  return (
    <mesh ref={markerRef} visible={false}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshBasicMaterial color={rayColor} />
    </mesh>
  );
}

export function RaycastDemo() {
  return (
    <SceneContainer caption="Move your mouse to see the raycast -- objects highlight when the ray hits them">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <TargetObject position={[-2, 0, 0]} color="#6366f1" geometry="box" />
        <TargetObject position={[0, 0.3, -1]} color="#ec4899" geometry="sphere" />
        <TargetObject position={[2, 0, 0.5]} color="#14b8a6" geometry="torus" />
        <RayLine />
        <HitMarker />
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
