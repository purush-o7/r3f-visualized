"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function TransformableMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const {
    posX, posY, posZ,
    rotX, rotY, rotZ,
    scaleX, scaleY, scaleZ,
    animate,
    color,
  } = useControls("Transform", {
    posX: { value: 0, min: -3, max: 3, step: 0.1, label: "Position X" },
    posY: { value: 0, min: -3, max: 3, step: 0.1, label: "Position Y" },
    posZ: { value: 0, min: -3, max: 3, step: 0.1, label: "Position Z" },
    rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: "Rotation X" },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: "Rotation Y" },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: "Rotation Z" },
    scaleX: { value: 1, min: 0.1, max: 3, step: 0.1, label: "Scale X" },
    scaleY: { value: 1, min: 0.1, max: 3, step: 0.1, label: "Scale Y" },
    scaleZ: { value: 1, min: 0.1, max: 3, step: 0.1, label: "Scale Z" },
    animate: { value: false, label: "Auto Rotate" },
    color: { value: "#6366f1", label: "Color" },
  });

  useFrame((_, delta) => {
    if (meshRef.current && animate) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[posX, posY, posZ]}
      rotation={[rotX, rotY, rotZ]}
      scale={[scaleX, scaleY, scaleZ]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

function Ghost() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.08}
        wireframe
      />
    </mesh>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />

      <Ghost />
      <TransformableMesh />

      <gridHelper args={[8, 8, "#555", "#333"]} position={[0, -1.5, 0]} />
      <axesHelper args={[3]} />

      <OrbitControls enableDamping />
    </>
  );
}

export function TransformDemo() {
  return (
    <SceneContainer caption="Drag the sliders to move, rotate, and scale the cube -- the ghost shows the original position">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <SceneContent />
      </Canvas>
    </SceneContainer>
  );
}
