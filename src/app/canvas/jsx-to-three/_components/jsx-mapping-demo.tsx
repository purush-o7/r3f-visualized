"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function RotatingMesh() {
  const ref = useRef<THREE.Mesh>(null);
  const { color, wireframe, flatShading, rotationSpeed } = useControls({
    color: "#f59e0b",
    wireframe: false,
    flatShading: true,
    rotationSpeed: { value: 0.5, min: 0, max: 3, step: 0.1 },
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={color}
        flatShading={flatShading}
        wireframe={wireframe}
        metalness={0.3}
        roughness={0.6}
      />
    </mesh>
  );
}

export function JsxMappingDemo() {
  return (
    <SceneContainer caption="JSX on the left maps directly to the 3D scene on the right">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <div className="flex h-full">
        {/* JSX code card */}
        <div className="w-[45%] p-3 sm:p-4 flex items-center">
          <div className="w-full rounded-lg border border-border/30 bg-black/40 p-3 sm:p-4 font-mono text-[10px] sm:text-xs leading-relaxed">
            <div className="text-purple-400">{"<mesh>"}</div>
            <div className="pl-3 sm:pl-4 text-sky-400">
              {"<icosahedronGeometry"}
            </div>
            <div className="pl-6 sm:pl-8 text-emerald-400">
              {'args={[1, 1]}'}
            </div>
            <div className="pl-3 sm:pl-4 text-sky-400">{"/>"}</div>
            <div className="pl-3 sm:pl-4 text-sky-400">
              {"<meshStandardMaterial"}
            </div>
            <div className="pl-6 sm:pl-8 text-emerald-400">
              {'color="#f59e0b"'}
            </div>
            <div className="pl-6 sm:pl-8 text-emerald-400">{"flatShading"}</div>
            <div className="pl-3 sm:pl-4 text-sky-400">{"/>"}</div>
            <div className="text-purple-400">{"</mesh>"}</div>
          </div>
        </div>

        {/* 3D scene */}
        <div className="w-[55%] h-full">
          <Canvas camera={{ position: [0, 1, 3.5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <RotatingMesh />
            <OrbitControls enableDamping />
          </Canvas>
        </div>
      </div>
    </SceneContainer>
  );
}
