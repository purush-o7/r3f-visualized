"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function WavePlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { waveSpeed, waveHeight, waveFrequency, wireframe, color } =
    useControls("Wave Controls", {
      waveSpeed: { value: 1.5, min: 0, max: 5, step: 0.1 },
      waveHeight: { value: 0.3, min: 0, max: 2, step: 0.05 },
      waveFrequency: { value: 0.5, min: 0.1, max: 1, step: 0.05 },
      wireframe: false,
      color: "#3b82f6",
    });

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(6, 6, 64, 64);
  }, []);

  // Store original positions for reference
  const originalPositions = useMemo(() => {
    return new Float32Array(geometry.attributes.position.array);
  }, [geometry]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const posAttr = geometry.attributes.position;
    const freq = waveFrequency * 2.4;

    for (let i = 0; i < posAttr.count; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];

      // Create a wave pattern using the original x,y (which are plane local coords)
      const wave =
        Math.sin(ox * freq + time * waveSpeed) * waveHeight +
        Math.cos(oy * freq * 0.83 + time * waveSpeed * 0.8) * waveHeight * 0.67 +
        Math.sin((ox + oy) * freq * 0.67 + time * waveSpeed * 0.53) * waveHeight * 0.5;

      posAttr.setZ(i, wave);
    }

    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.5, 0, 0]}>
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.2}
        side={THREE.DoubleSide}
        wireframe={wireframe}
      />
    </mesh>
  );
}

export function WaveDemo() {
  return (
    <SceneContainer caption="Buffer geometry with vertices animated every frame using needsUpdate -- drag to orbit">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} />
        <WavePlane />
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
