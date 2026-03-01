"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function MaterialSphere({
  position,
  label,
  rotationSpeed,
  children,
}: {
  position: [number, number, number];
  label: string;
  rotationSpeed: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
    }
  });
  return (
    <group position={position}>
      <mesh ref={ref} position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        {children}
      </mesh>
      <Html
        position={[0, -0.15, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div className="text-[11px] font-medium text-white/90 whitespace-nowrap bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
          {label}
        </div>
      </Html>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[12, 6]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
    </mesh>
  );
}

function Scene() {
  const {
    rotationSpeed,
    lightIntensity,
    "lightPosition X": lightX,
    "lightPosition Y": lightY,
    "lightPosition Z": lightZ,
    showGround,
  } = useControls({
    rotationSpeed: { value: 0.4, min: 0, max: 3, step: 0.1 },
    lightIntensity: { value: 1.8, min: 0, max: 3, step: 0.1 },
    "lightPosition X": { value: 4, min: -10, max: 10, step: 0.5 },
    "lightPosition Y": { value: 6, min: -10, max: 10, step: 0.5 },
    "lightPosition Z": { value: 3, min: -10, max: 10, step: 0.5 },
    showGround: { value: true },
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[lightX, lightY, lightZ]}
        intensity={lightIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />

      <MaterialSphere position={[-3, 0, 0]} label="Basic" rotationSpeed={rotationSpeed}>
        <meshBasicMaterial color="#6366f1" />
      </MaterialSphere>

      <MaterialSphere position={[-1, 0, 0]} label="Normal" rotationSpeed={rotationSpeed}>
        <meshNormalMaterial />
      </MaterialSphere>

      <MaterialSphere position={[1, 0, 0]} label="Lambert" rotationSpeed={rotationSpeed}>
        <meshLambertMaterial color="#22d3ee" />
      </MaterialSphere>

      <MaterialSphere position={[3, 0, 0]} label="Phong" rotationSpeed={rotationSpeed}>
        <meshPhongMaterial color="#f472b6" specular="#ffffff" shininess={100} />
      </MaterialSphere>

      {showGround && <Ground />}
      <OrbitControls
        enableDamping
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />
    </>
  );
}

export function MaterialComparison() {
  return (
    <SceneContainer caption="Four material types side by side -- notice how Basic and Normal ignore the directional light, while Lambert and Phong respond to it. Drag to orbit.">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas
        camera={{ position: [0, 3, 6], fov: 45 }}
        shadows
      >
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
