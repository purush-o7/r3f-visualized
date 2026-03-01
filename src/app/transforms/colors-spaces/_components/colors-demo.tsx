"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function ColorSphere() {
  const { color, colorSpace, roughness, metalness } = useControls("Color", {
    color: { value: "#6366f1", label: "Color Picker" },
    colorSpace: {
      value: "srgb",
      options: ["srgb", "srgb-linear"],
      label: "Color Space",
    },
    roughness: { value: 0.3, min: 0, max: 1, step: 0.01, label: "Roughness" },
    metalness: { value: 0.1, min: 0, max: 1, step: 0.01, label: "Metalness" },
  });

  const threeColor = new THREE.Color(color);

  return (
    <group>
      {/* Main sphere with selected color space */}
      <mesh position={[-1.2, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={threeColor}
          roughness={roughness}
          metalness={metalness}
          toneMapped={colorSpace === "srgb"}
        />
      </mesh>

      {/* Comparison sphere showing the other color space */}
      <mesh position={[1.2, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={threeColor}
          roughness={roughness}
          metalness={metalness}
          toneMapped={colorSpace !== "srgb"}
        />
      </mesh>
    </group>
  );
}

function ColorSwatches() {
  const namedColors = [
    "coral", "royalblue", "gold", "mediumseagreen",
    "hotpink", "tomato", "dodgerblue", "limegreen",
  ];

  return (
    <group position={[0, -1.8, 0]}>
      {namedColors.map((name, i) => {
        const col = Math.floor(i % 4);
        const row = Math.floor(i / 4);
        return (
          <mesh
            key={name}
            position={[(col - 1.5) * 0.6, -row * 0.6, 0]}
          >
            <boxGeometry args={[0.45, 0.45, 0.45]} />
            <meshStandardMaterial color={name} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />

      <ColorSphere />
      <ColorSwatches />

      <OrbitControls enableDamping />
    </>
  );
}

export function ColorsDemo() {
  return (
    <SceneContainer caption="Left sphere uses your selected color space, right uses the opposite -- notice the brightness difference">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <SceneContent />
      </Canvas>
    </SceneContainer>
  );
}
