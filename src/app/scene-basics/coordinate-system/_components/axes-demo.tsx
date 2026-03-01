"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function AxisArrow({
  direction,
  color,
  label,
}: {
  direction: [number, number, number];
  color: string;
  label: string;
}) {
  const length = 2.5;
  const end: [number, number, number] = [
    direction[0] * length,
    direction[1] * length,
    direction[2] * length,
  ];
  const labelPos: [number, number, number] = [
    direction[0] * (length + 0.3),
    direction[1] * (length + 0.3),
    direction[2] * (length + 0.3),
  ];

  return (
    <group>
      <Line
        points={[[0, 0, 0], end]}
        color={color}
        lineWidth={3}
      />
      {/* Arrowhead */}
      <mesh position={end}>
        <coneGeometry args={[0.06, 0.2, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={labelPos}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {label}
      </Text>
    </group>
  );
}

function SceneContent() {
  const ref = useRef<THREE.Mesh>(null);

  const { positionX, positionY, positionZ, rotationSpeed, showAxes, showGrid } =
    useControls("Axes Controls", {
      positionX: { value: 0, min: -3, max: 3, step: 0.1 },
      positionY: { value: 0.5, min: -3, max: 3, step: 0.1 },
      positionZ: { value: 0, min: -3, max: 3, step: 0.1 },
      rotationSpeed: { value: 0.4, min: 0, max: 5, step: 0.1 },
      showAxes: true,
      showGrid: true,
    });

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.rotation.y = t * rotationSpeed;
      ref.current.position.set(
        positionX,
        positionY + Math.sin(t * 1.5) * 0.3,
        positionZ
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Axes */}
      {showAxes && (
        <>
          <AxisArrow direction={[1, 0, 0]} color="#ef4444" label="X" />
          <AxisArrow direction={[0, 1, 0]} color="#22c55e" label="Y" />
          <AxisArrow direction={[0, 0, 1]} color="#3b82f6" label="Z" />
        </>
      )}

      {/* Grid on XZ plane */}
      {showGrid && <gridHelper args={[6, 6, "#444", "#2a2a2a"]} />}

      {/* Floating cube */}
      <mesh ref={ref} position={[positionX, positionY, positionZ]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>

      <OrbitControls enableDamping />
    </>
  );
}

export function AxesDemo() {
  return (
    <SceneContainer caption="RGB = XYZ axes -- Red is X (right), Green is Y (up), Blue is Z (toward you)">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [3, 2.5, 3], fov: 50 }}>
        <SceneContent />
      </Canvas>
    </SceneContainer>
  );
}
