"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function SimpleHouse() {
  const groupRef = useRef<THREE.Group>(null);

  const { rotationSpeed, wallColor, roofColor, showChimney } = useControls({
    rotationSpeed: { value: 0.3, min: 0, max: 3, step: 0.1 },
    wallColor: { value: "#e2e8f0" },
    roofColor: { value: "#dc2626" },
    showChimney: { value: true },
  });

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * rotationSpeed) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base / walls */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 1, 1.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.35, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.2, 0.7, 4]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.35, 0.61]}>
        <boxGeometry args={[0.3, 0.6, 0.02]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>

      {/* Window left */}
      <mesh position={[-0.45, 0.6, 0.61]}>
        <boxGeometry args={[0.25, 0.25, 0.02]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.3} />
      </mesh>

      {/* Window right */}
      <mesh position={[0.45, 0.6, 0.61]}>
        <boxGeometry args={[0.25, 0.25, 0.02]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.3} />
      </mesh>

      {/* Chimney */}
      {showChimney && (
        <mesh position={[0.5, 1.4, -0.2]}>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
      )}

      {/* Ground */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-3, 3, 2]} color="#fbbf24" intensity={0.5} />
      <SimpleHouse />
      <OrbitControls enableDamping />
    </>
  );
}

export function ModelDemo() {
  return (
    <SceneContainer caption="A house built from primitive shapes -- representing how GLTF models are composed of meshes, materials, and a scene hierarchy.">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [2, 2, 3], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
