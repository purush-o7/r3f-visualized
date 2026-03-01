"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function FogController() {
  const { scene } = useThree();

  const { fogType, fogColor, near, far, density } = useControls("Fog", {
    fogType: {
      value: "linear",
      options: ["none", "linear", "exponential"],
      label: "Fog Type",
    },
    fogColor: { value: "#1a1a2e", label: "Fog Color" },
    near: { value: 2, min: 0, max: 15, step: 0.5, label: "Near (linear)" },
    far: { value: 15, min: 5, max: 30, step: 0.5, label: "Far (linear)" },
    density: { value: 0.08, min: 0.01, max: 0.3, step: 0.01, label: "Density (exp)" },
  });

  useEffect(() => {
    if (fogType === "none") {
      scene.fog = null;
    } else if (fogType === "linear") {
      scene.fog = new THREE.Fog(fogColor, near, far);
    } else {
      scene.fog = new THREE.FogExp2(fogColor, density);
    }
    scene.background = new THREE.Color(fogColor);

    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene, fogType, fogColor, near, far, density]);

  return null;
}

function DistantObjects() {
  const colors = ["#6366f1", "#ec4899", "#22c55e", "#f59e0b", "#3b82f6", "#a855f7", "#14b8a6", "#ef4444"];

  return (
    <>
      {colors.map((color, i) => (
        <mesh key={i} position={[((i % 4) - 1.5) * 2.5, 0.5, -i * 2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}

      {/* Tall pillars receding into distance */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`pillar-${i}`} position={[i % 2 === 0 ? -4 : 4, 1, -i * 3]}>
          <cylinderGeometry args={[0.3, 0.3, 2, 16]} />
          <meshStandardMaterial color="#888" roughness={0.5} />
        </mesh>
      ))}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -8]}>
        <planeGeometry args={[20, 30]} />
        <meshStandardMaterial color="#2a2a3e" roughness={0.8} />
      </mesh>
    </>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#6366f1" />

      <FogController />
      <DistantObjects />

      <OrbitControls enableDamping />
    </>
  );
}

export function FogDemo() {
  return (
    <SceneContainer caption="Switch between fog types and adjust distance -- watch distant objects fade into the mist">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <SceneContent />
      </Canvas>
    </SceneContainer>
  );
}
