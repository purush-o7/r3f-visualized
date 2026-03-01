"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Billboard, Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function FloatingLabel({
  position,
  text,
  color,
  spriteScale,
  opacity,
}: {
  position: [number, number, number];
  text: string;
  color: string;
  spriteScale: number;
  opacity: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 1.2 + position[0]) * 0.15;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* The mesh below the billboard */}
      <mesh castShadow>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Billboard label above the mesh */}
      <Billboard position={[0, 0.7, 0]}>
        <mesh scale={[spriteScale * 1.6, spriteScale * 0.6, 1]}>
          <planeGeometry />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={opacity * 0.7}
            depthWrite={false}
          />
        </mesh>
        <Text
          fontSize={0.18 * spriteScale}
          color="white"
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0.01]}
        >
          {text}
        </Text>
      </Billboard>
    </group>
  );
}

function SpriteParticle({
  position,
  color,
  spriteScale,
  opacity,
}: {
  position: [number, number, number];
  color: string;
  spriteScale: number;
  opacity: number;
}) {
  const spriteRef = useRef<THREE.Sprite>(null);

  useFrame(({ clock }) => {
    if (!spriteRef.current) return;
    spriteRef.current.position.y =
      position[1] +
      Math.sin(clock.elapsedTime * 0.8 + position[0] * 3) * 0.3;
  });

  return (
    <sprite ref={spriteRef} position={position} scale={[spriteScale * 0.4, spriteScale * 0.4, 1]}>
      <spriteMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

const items = [
  { pos: [-2, 0.5, 0] as [number, number, number], text: "Health: 80", color: "#22c55e" },
  { pos: [0, 0.5, -1] as [number, number, number], text: "Mana: 50", color: "#6366f1" },
  { pos: [2, 0.5, 0.5] as [number, number, number], text: "Shield", color: "#f59e0b" },
];

const sparklePositions: [number, number, number][] = [
  [-1, 1.8, 0.5],
  [1, 2.2, -0.5],
  [0.5, 1.5, 1],
  [-0.5, 2, -1],
  [1.5, 1.2, 0.3],
  [-1.5, 1.6, -0.3],
];

function Scene() {
  const { spriteScale, opacity, showSprites } = useControls({
    spriteScale: {
      value: 1,
      min: 0.3,
      max: 2,
      step: 0.1,
      label: "Sprite Scale",
    },
    opacity: {
      value: 0.85,
      min: 0.1,
      max: 1,
      step: 0.05,
      label: "Opacity",
    },
    showSprites: { value: true, label: "Show Sparkles" },
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 8, 4]} intensity={1.5} />

      {/* Billboard labels on meshes */}
      {items.map((item, i) => (
        <FloatingLabel
          key={i}
          position={item.pos}
          text={item.text}
          color={item.color}
          spriteScale={spriteScale}
          opacity={opacity}
        />
      ))}

      {/* Floating sprite particles */}
      {showSprites &&
        sparklePositions.map((pos, i) => (
          <SpriteParticle
            key={i}
            position={pos}
            color={i % 2 === 0 ? "#fbbf24" : "#a78bfa"}
            spriteScale={spriteScale}
            opacity={opacity * 0.6}
          />
        ))}

      {/* Ground plane */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#111118" />
      </mesh>

      <OrbitControls enableDamping />
    </>
  );
}

export function SpritesDemo() {
  return (
    <SceneContainer caption="Billboard labels always face the camera. Orbit around to see them rotate. Toggle sparkle sprites and adjust scale and opacity.">
      <Leva collapsed titleBar={{ title: "Sprite Controls" }} />
      <Canvas camera={{ position: [3, 2, 5], fov: 45 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
