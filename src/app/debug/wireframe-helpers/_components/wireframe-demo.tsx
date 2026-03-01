"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function HelperScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const boxHelperRef = useRef<THREE.BoxHelper>(null);

  const {
    wireframe,
    showAxes,
    axesSize,
    showGrid,
    gridSize,
    showBoxHelper,
    rotationSpeed,
    color,
  } = useControls("Helpers", {
    wireframe: { value: false, label: "Wireframe" },
    showAxes: { value: true, label: "AxesHelper" },
    axesSize: { value: 2, min: 0.5, max: 5, step: 0.5, label: "Axes Size" },
    showGrid: { value: true, label: "GridHelper" },
    gridSize: { value: 8, min: 2, max: 16, step: 2, label: "Grid Size" },
    showBoxHelper: { value: true, label: "BoxHelper" },
    rotationSpeed: { value: 0.4, min: 0, max: 2, step: 0.1, label: "Rotation" },
    color: { value: "#6366f1", label: "Color" },
  });

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
      meshRef.current.rotation.x += delta * rotationSpeed * 0.3;
    }
    if (boxHelperRef.current && meshRef.current) {
      boxHelperRef.current.update();
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />

      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.7, 0.25, 100, 16]} />
        <meshStandardMaterial
          color={color}
          wireframe={wireframe}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {showBoxHelper && meshRef.current && (
        <boxHelper ref={boxHelperRef} args={[meshRef.current, "#facc15"]} />
      )}

      {showAxes && <axesHelper args={[axesSize]} />}

      {showGrid && (
        <gridHelper
          args={[gridSize, gridSize, "#555", "#333"]}
          position={[0, -1.5, 0]}
        />
      )}

      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport />
      </GizmoHelper>

      <OrbitControls enableDamping />
    </>
  );
}

export function WireframeDemo() {
  return (
    <SceneContainer caption="Toggle wireframe, axes, grid, and box helpers to see the scene skeleton">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [2.5, 2, 2.5], fov: 50 }}>
        <HelperScene />
      </Canvas>
    </SceneContainer>
  );
}
