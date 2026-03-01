"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function RobotArm() {
  const baseRef = useRef<THREE.Group>(null);
  const upperArmRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);

  const { baseRotation, shoulderAngle, elbowAngle, speed } = useControls({
    baseRotation: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    shoulderAngle: { value: 0, min: -1, max: 1, step: 0.01 },
    elbowAngle: { value: 0, min: -1, max: 1, step: 0.01 },
    speed: { value: 1, min: 0, max: 3, step: 0.1 },
  });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (speed > 0) {
      if (baseRef.current) baseRef.current.rotation.y = Math.sin(t * 0.6 * speed) * 0.8;
      if (upperArmRef.current)
        upperArmRef.current.rotation.z = Math.sin(t * 0.8 * speed) * 0.4 - 0.4;
      if (forearmRef.current)
        forearmRef.current.rotation.z = Math.sin(t * 1.2 * speed) * 0.5 - 0.2;
    } else {
      if (baseRef.current) baseRef.current.rotation.y = baseRotation;
      if (upperArmRef.current) upperArmRef.current.rotation.z = shoulderAngle;
      if (forearmRef.current) forearmRef.current.rotation.z = elbowAngle;
    }
  });

  return (
    <group ref={baseRef} position={[0, -0.5, 0]}>
      {/* Base platform */}
      <mesh>
        <cylinderGeometry args={[0.6, 0.7, 0.3, 24]} />
        <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Joint sphere */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Upper arm */}
      <group ref={upperArmRef} position={[0, 0.2, 0]}>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.22, 1.3, 0.22]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>

        {/* Joint sphere */}
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>

        {/* Forearm */}
        <group ref={forearmRef} position={[0, 1.3, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.16, 1, 0.16]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.4} />
          </mesh>

          {/* End effector / hand */}
          <mesh position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={0.3}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function RobotArmDemo() {
  return (
    <SceneContainer caption="Each joint is a nested <group> -- rotating a parent moves all children">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 3, 0]} color="#818cf8" intensity={0.5} />
        <RobotArm />
        <Grid
          infiniteGrid
          fadeDistance={8}
          cellColor="#333"
          sectionColor="#555"
          position={[0, -0.65, 0]}
        />
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
