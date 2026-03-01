"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uFresnelPower;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    // Varying-based: position drives gradient
    float positionMix = (vPosition.y + 1.0) * 0.5;

    // Uniform-based: time animates the blend
    float timeMix = sin(uTime * 0.8 + vUv.x * 6.28) * 0.5 + 0.5;

    vec3 color = mix(uColorA, uColorB, positionMix * 0.6 + timeMix * 0.4);

    // Simple lighting from varying normal
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    color *= 0.4 + diffuse * 0.6;

    // Fresnel-like edge glow from vNormal
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), uFresnelPower);
    color += fresnel * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function InteractiveSphere() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { speed, colorA, colorB, fresnelPower, wireframe } = useControls({
    speed: { value: 1, min: 0, max: 3, step: 0.1 },
    colorA: { value: "#3b82f6" },
    colorB: { value: "#f97316" },
    fresnelPower: { value: 2, min: 1, max: 5, step: 0.1 },
    wireframe: { value: false },
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#3b82f6") },
      uColorB: { value: new THREE.Color("#f97316") },
      uFresnelPower: { value: 2.0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime * speed;
      materialRef.current.uniforms.uColorA.value.set(colorA);
      materialRef.current.uniforms.uColorB.value.set(colorB);
      materialRef.current.uniforms.uFresnelPower.value = fresnelPower;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1.2, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={wireframe}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <InteractiveSphere />
      <OrbitControls enableDamping enableZoom={false} />
    </>
  );
}

export function UniformsDemo() {
  return (
    <SceneContainer caption="Uniforms (colors, time) are sent from JavaScript. Varyings (position, normal) are interpolated per-pixel by the GPU.">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
