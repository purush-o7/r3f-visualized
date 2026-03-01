"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

const vertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;

  varying vec2 vUv;
  varying float vDisplacement;

  void main() {
    vUv = uv;

    float displacement = sin(position.x * uFrequency + uTime) *
                         sin(position.y * uFrequency + uTime * 0.7) *
                         sin(position.z * uFrequency + uTime * 0.5) *
                         uAmplitude;

    vec3 newPosition = position + normal * displacement;
    vDisplacement = displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec2 vUv;
  varying float vDisplacement;

  void main() {
    vec3 colorC = vec3(0.1, 0.9, 0.6);

    float t = sin(uTime * 0.5) * 0.5 + 0.5;
    vec3 baseColor = mix(uColorA, uColorB, vUv.x);
    baseColor = mix(baseColor, colorC, t * 0.5);

    float highlight = smoothstep(-0.1, 0.15, vDisplacement);
    vec3 finalColor = mix(baseColor * 0.6, baseColor * 1.5, highlight);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function ShaderSphere() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { speed, amplitude, frequency, colorA, colorB } = useControls({
    speed: { value: 1, min: 0, max: 3, step: 0.1 },
    amplitude: { value: 0.15, min: 0, max: 1, step: 0.01 },
    frequency: { value: 3, min: 0.5, max: 5, step: 0.1 },
    colorA: { value: "#1a66e6" },
    colorB: { value: "#e63380" },
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0.15 },
      uFrequency: { value: 3.0 },
      uColorA: { value: new THREE.Color("#1a66e6") },
      uColorB: { value: new THREE.Color("#e63380") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime * speed;
      materialRef.current.uniforms.uAmplitude.value = amplitude;
      materialRef.current.uniforms.uFrequency.value = frequency;
      materialRef.current.uniforms.uColorA.value.set(colorA);
      materialRef.current.uniforms.uColorB.value.set(colorB);
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1.2, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ShaderSphere />
      <OrbitControls enableDamping enableZoom={false} />
    </>
  );
}

export function ShaderDemo() {
  return (
    <SceneContainer caption="Custom GLSL shader with vertex displacement and animated gradient colors. The sphere morphs using sine waves.">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
