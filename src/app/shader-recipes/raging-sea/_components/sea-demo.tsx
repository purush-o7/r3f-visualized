"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Leva, useControls } from "leva";
import { SceneContainer } from "@/components/scene-container";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform float uWaveHeight;
  uniform float uWaveFrequency;
  uniform float uWaveSpeed;
  uniform float uBigWaveFrequency;

  varying float vElevation;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Big rolling waves
    float bigWave = sin(pos.x * uBigWaveFrequency + uTime * uWaveSpeed * 0.6)
                  * sin(pos.z * uBigWaveFrequency * 0.8 + uTime * uWaveSpeed * 0.4)
                  * uWaveHeight;

    // Medium waves
    float medWave = sin(pos.x * uWaveFrequency * 1.5 + uTime * uWaveSpeed * 1.2)
                  * sin(pos.z * uWaveFrequency + uTime * uWaveSpeed * 0.9)
                  * uWaveHeight * 0.35;

    // Small choppy waves
    float smallWave = sin(pos.x * uWaveFrequency * 3.0 + uTime * uWaveSpeed * 2.0)
                    * cos(pos.z * uWaveFrequency * 2.5 + uTime * uWaveSpeed * 1.8)
                    * uWaveHeight * 0.15;

    // Diagonal cross-wave
    float crossWave = sin((pos.x + pos.z) * uWaveFrequency * 2.0 + uTime * uWaveSpeed * 1.5)
                    * uWaveHeight * 0.2;

    float elevation = bigWave + medWave + smallWave + crossWave;
    pos.y += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uDepthColor;
  uniform vec3 uSurfaceColor;
  uniform vec3 uFoamColor;
  uniform float uWaveHeight;

  varying float vElevation;
  varying vec2 vUv;

  void main() {
    // Normalize elevation to 0..1 range based on wave height
    float mixStrength = (vElevation + uWaveHeight) / (uWaveHeight * 2.0);
    mixStrength = clamp(mixStrength, 0.0, 1.0);

    // Base water color: deep in troughs, surface color on mid-heights
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Add foam on the peaks
    float foamThreshold = 0.7;
    float foam = smoothstep(foamThreshold, 1.0, mixStrength);
    color = mix(color, uFoamColor, foam * 0.8);

    // Subtle dark in the very deepest troughs
    float depth = smoothstep(0.3, 0.0, mixStrength);
    color = mix(color, uDepthColor * 0.5, depth * 0.4);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function Sea() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const {
    waveSpeed,
    waveHeight,
    waveFrequency,
    bigWaveFrequency,
    surfaceColor,
    depthColor,
    foamColor,
  } = useControls({
    waveSpeed: { value: 1.0, min: 0.1, max: 3.0, step: 0.1, label: "Wave Speed" },
    waveHeight: { value: 0.25, min: 0.05, max: 0.8, step: 0.01, label: "Wave Height" },
    waveFrequency: { value: 3.0, min: 1.0, max: 8.0, step: 0.5, label: "Wave Frequency" },
    bigWaveFrequency: { value: 1.2, min: 0.3, max: 3.0, step: 0.1, label: "Big Wave Freq" },
    surfaceColor: { value: "#1a8faa", label: "Surface Color" },
    depthColor: { value: "#041830", label: "Depth Color" },
    foamColor: { value: "#c8e6f0", label: "Foam Color" },
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaveSpeed: { value: 1.0 },
      uWaveHeight: { value: 0.25 },
      uWaveFrequency: { value: 3.0 },
      uBigWaveFrequency: { value: 1.2 },
      uSurfaceColor: { value: new THREE.Color("#1a8faa") },
      uDepthColor: { value: new THREE.Color("#041830") },
      uFoamColor: { value: new THREE.Color("#c8e6f0") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uWaveSpeed.value = waveSpeed;
    u.uWaveHeight.value = waveHeight;
    u.uWaveFrequency.value = waveFrequency;
    u.uBigWaveFrequency.value = bigWaveFrequency;
    u.uSurfaceColor.value.set(surfaceColor);
    u.uDepthColor.value.set(depthColor);
    u.uFoamColor.value.set(foamColor);
  });

  return (
    <mesh rotation={[-Math.PI * 0.45, 0, 0]} position={[0, -0.2, 0]}>
      <planeGeometry args={[4, 4, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#020a18"]} />
      <ambientLight intensity={0.5} />
      <Sea />
      <OrbitControls
        enableDamping
        maxPolarAngle={Math.PI * 0.65}
        minDistance={2}
        maxDistance={8}
      />
    </>
  );
}

export function SeaDemo() {
  return (
    <SceneContainer caption="Animated ocean surface with layered sine wave vertex displacement. Adjust wave parameters and colors with the controls.">
      <Leva collapsed titleBar={{ title: "Sea Controls" }} />
      <Canvas camera={{ position: [2.5, 2, 3], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
