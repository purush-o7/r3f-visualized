"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";
import { SceneContainer } from "@/components/scene-container";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uOctaves;
  uniform float uLacunarity;
  uniform float uGain;
  uniform float uElevation;
  uniform float uTime;

  varying float vHeight;
  varying vec3 vPosition;

  // Simple value noise
  // Hash function for pseudo-random values
  vec2 hash2(vec2 p) {
    p = vec2(
      dot(p, vec2(127.1, 311.7)),
      dot(p, vec2(269.5, 183.3))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  // Gradient noise (similar to Perlin noise)
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
    float b = dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // Fractal Brownian Motion: stack noise layers
  float fbm(vec2 p, float octaves, float lacunarity, float gain) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 8; i++) {
      if (float(i) >= octaves) break;
      value += amplitude * noise(p * frequency);
      frequency *= lacunarity;
      amplitude *= gain;
    }

    return value;
  }

  void main() {
    vPosition = position;

    vec2 noiseCoord = position.xz * 0.5 + uTime * 0.02;
    float height = fbm(noiseCoord, uOctaves, uLacunarity, uGain);

    // Scale and shape the terrain
    height = height * uElevation;

    // Make valleys flatter (abs gives sharp ridges)
    height = abs(height);

    vHeight = height;

    vec3 pos = position;
    pos.y += height;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uSnowLine;
  uniform float uElevation;

  varying float vHeight;
  varying vec3 vPosition;

  void main() {
    float h = vHeight / uElevation;

    // Terrain color bands
    vec3 water   = vec3(0.1, 0.3, 0.5);
    vec3 sand    = vec3(0.76, 0.70, 0.50);
    vec3 grass   = vec3(0.2, 0.45, 0.15);
    vec3 rock    = vec3(0.4, 0.35, 0.3);
    vec3 snow    = vec3(0.95, 0.95, 0.97);

    // Color based on height
    vec3 color = water;
    color = mix(color, sand,  smoothstep(0.0,  0.08, h));
    color = mix(color, grass, smoothstep(0.08, 0.2,  h));
    color = mix(color, rock,  smoothstep(0.3,  0.5,  h));
    color = mix(color, snow,  smoothstep(uSnowLine - 0.1, uSnowLine, h));

    // Simple lighting from above-right
    vec3 lightDir = normalize(vec3(1.0, 2.0, 1.0));
    // Approximate normal from height gradient (finite differences via dFdx/dFdy)
    vec3 dx = dFdx(vec3(vPosition.x, vHeight, vPosition.z));
    vec3 dz = dFdy(vec3(vPosition.x, vHeight, vPosition.z));
    vec3 normal = normalize(cross(dx, dz));
    float diffuse = max(dot(normal, lightDir), 0.0) * 0.6 + 0.4;

    color *= diffuse;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function Terrain() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const {
    octaves,
    lacunarity,
    gain,
    elevation,
    wireframe,
    snowLine,
  } = useControls({
    octaves: { value: 5, min: 1, max: 8, step: 1, label: "Octaves" },
    lacunarity: { value: 2.0, min: 1, max: 4, step: 0.1, label: "Lacunarity" },
    gain: { value: 0.5, min: 0.0, max: 1.0, step: 0.05, label: "Gain" },
    elevation: { value: 1.8, min: 0.2, max: 4, step: 0.1, label: "Elevation" },
    snowLine: { value: 0.6, min: 0.2, max: 1.0, step: 0.05, label: "Snow Line" },
    wireframe: { value: false, label: "Wireframe" },
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOctaves: { value: 5.0 },
      uLacunarity: { value: 2.0 },
      uGain: { value: 0.5 },
      uElevation: { value: 1.8 },
      uSnowLine: { value: 0.6 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uOctaves.value = octaves;
    u.uLacunarity.value = lacunarity;
    u.uGain.value = gain;
    u.uElevation.value = elevation;
    u.uSnowLine.value = snowLine;
  });

  return (
    <mesh rotation={[-Math.PI * 0.45, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[6, 6, 200, 200]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        wireframe={wireframe}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#0a0e14"]} />
      <Terrain />
      <OrbitControls
        enableDamping
        maxPolarAngle={Math.PI * 0.6}
        minDistance={2}
        maxDistance={10}
      />
    </>
  );
}

export function TerrainDemo() {
  return (
    <SceneContainer caption="Procedural terrain with layered noise (FBM) vertex displacement. Adjust octaves, lacunarity, gain, and snow line.">
      <LevaPanel title="Terrain Controls" />
      <Canvas camera={{ position: [3, 3, 4], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
