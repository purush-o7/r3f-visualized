"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function LabeledSphere({
  position,
  color,
  label,
  showLabels,
  bobSpeed,
  bobHeight,
  sphereSize,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  showLabels: boolean;
  bobSpeed: number;
  bobHeight: number;
  sphereSize: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * bobSpeed + position[0]) * bobHeight;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[sphereSize, 32, 32]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      {showLabels && (
        <Html
          position={[0, sphereSize + 0.25, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.75)",
              color: "white",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              border: `1px solid ${color}`,
              backdropFilter: "blur(4px)",
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function SceneContent() {
  const { showLabels, bobSpeed, bobHeight, sphereSize } = useControls({
    showLabels: { value: true },
    bobSpeed: { value: 1.5, min: 0, max: 3, step: 0.1 },
    bobHeight: { value: 0.2, min: 0, max: 1, step: 0.05 },
    sphereSize: { value: 0.4, min: 0.3, max: 1, step: 0.05 },
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <LabeledSphere
        position={[-1.8, 0, 0]}
        color="#ef4444"
        label="Sphere A"
        showLabels={showLabels}
        bobSpeed={bobSpeed}
        bobHeight={bobHeight}
        sphereSize={sphereSize}
      />
      <LabeledSphere
        position={[0, 0, 0]}
        color="#22c55e"
        label="Sphere B"
        showLabels={showLabels}
        bobSpeed={bobSpeed}
        bobHeight={bobHeight}
        sphereSize={sphereSize}
      />
      <LabeledSphere
        position={[1.8, 0, 0]}
        color="#3b82f6"
        label="Sphere C"
        showLabels={showLabels}
        bobSpeed={bobSpeed}
        bobHeight={bobHeight}
        sphereSize={sphereSize}
      />
      <gridHelper args={[6, 6, "#333", "#222"]} />
      <OrbitControls enableDamping />
    </>
  );
}

export function HtmlDemo() {
  return (
    <SceneContainer caption="HTML labels follow 3D objects as they bob up and down. Orbit to see them track in 3D space.">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <SceneContent />
      </Canvas>
    </SceneContainer>
  );
}
