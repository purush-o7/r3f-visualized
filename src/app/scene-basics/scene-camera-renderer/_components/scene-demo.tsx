"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function SpinningBox() {
  const ref = useRef<THREE.Mesh>(null);

  const { color, rotationSpeed, wireframe, showGrid, boxSize } = useControls(
    "Scene Controls",
    {
      color: "#6366f1",
      rotationSpeed: { value: 0.5, min: 0, max: 5, step: 0.1 },
      wireframe: false,
      showGrid: true,
      boxSize: { value: 1, min: 0.5, max: 3, step: 0.1 },
    }
  );

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
      ref.current.rotation.x += delta * rotationSpeed * 0.6;
    }
  });

  return (
    <>
      <mesh ref={ref} position={[0, 0.5, 0]} scale={boxSize}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} wireframe={wireframe} />
      </mesh>
      {showGrid && (
        <Grid
          infiniteGrid
          fadeDistance={10}
          cellColor="#333"
          sectionColor="#555"
        />
      )}
    </>
  );
}

export function SceneDemo() {
  return (
    <SceneContainer caption="A basic Three.js scene -- drag to orbit, scroll to zoom">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <SpinningBox />
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
