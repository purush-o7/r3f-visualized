"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";
import { SceneContainer } from "@/components/scene-container";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  attribute float aScale;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uSize;

  varying vec3 vColor;

  void main() {
    vColor = aColor;

    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);

    // Size attenuation: particles farther away are smaller
    gl_PointSize = uSize * aScale * (200.0 / -mvPos.z);
    gl_PointSize = max(gl_PointSize, 1.0);

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    // Create a circular particle with soft edges
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Soft glow falloff
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= 0.85;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

function generateGalaxy(
  count: number,
  arms: number,
  spin: number,
  randomness: number,
  innerColor: string,
  outerColor: string
) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const colorInner = new THREE.Color(innerColor);
  const colorOuter = new THREE.Color(outerColor);
  const tempColor = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Radius: bias toward center with square root distribution
    const radius = Math.random() * 5;
    const radiusNorm = radius / 5;

    // Which arm this particle belongs to
    const armAngle = ((i % arms) / arms) * Math.PI * 2;

    // Spin: particles farther from center are more rotated
    const spinAngle = radius * spin;

    const angle = armAngle + spinAngle;

    // Random offset from the arm centerline
    const randomX =
      Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius * 0.3;
    const randomY =
      Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * 0.3;
    const randomZ =
      Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius * 0.3;

    positions[i3] = Math.cos(angle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(angle) * radius + randomZ;

    // Color: inner color near center, outer color at edges
    tempColor.copy(colorInner).lerp(colorOuter, radiusNorm);
    colors[i3] = tempColor.r;
    colors[i3 + 1] = tempColor.g;
    colors[i3 + 2] = tempColor.b;

    // Random scale per particle
    scales[i] = Math.random() * 0.8 + 0.2;
  }

  return { positions, colors, scales };
}

function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const {
    armCount,
    spin,
    randomness,
    particleCount,
    innerColor,
    outerColor,
    size,
  } = useControls({
    particleCount: { value: 5000, min: 1000, max: 10000, step: 500, label: "Particles" },
    armCount: { value: 3, min: 2, max: 8, step: 1, label: "Arms" },
    spin: { value: 1.2, min: 0, max: 3, step: 0.1, label: "Spin" },
    randomness: { value: 0.5, min: 0, max: 2, step: 0.1, label: "Randomness" },
    innerColor: { value: "#ff6030", label: "Inner Color" },
    outerColor: { value: "#1b3984", label: "Outer Color" },
    size: { value: 25.0, min: 5, max: 60, step: 1, label: "Particle Size" },
  });

  const { positions, colors, scales } = useMemo(
    () => generateGalaxy(particleCount, armCount, spin, randomness, innerColor, outerColor),
    [particleCount, armCount, spin, randomness, innerColor, outerColor]
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 25.0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current || !materialRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.05;
    materialRef.current.uniforms.uSize.value = size;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#020208"]} />
      <Galaxy />
      <OrbitControls enableDamping minDistance={2} maxDistance={12} />
    </>
  );
}

export function GalaxyDemo() {
  return (
    <SceneContainer caption="Procedural spiral galaxy with per-particle coloring. Adjust arm count, spin, randomness, and colors in the controls.">
      <LevaPanel title="Galaxy Controls" />
      <Canvas camera={{ position: [0, 3, 6], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
