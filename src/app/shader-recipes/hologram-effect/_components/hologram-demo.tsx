"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";
import { SceneContainer } from "@/components/scene-container";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);

    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uFresnelPower;
  uniform float uScanlineSpeed;
  uniform float uScanlineCount;
  uniform float uGlitchIntensity;
  uniform float uOpacity;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  // Simple pseudo-random for glitch
  float random(float seed) {
    return fract(sin(seed * 12.9898) * 43758.5453);
  }

  void main() {
    // View direction for fresnel
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);

    // Fresnel: bright at edges where view is perpendicular to surface
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uFresnelPower);

    // Scan lines moving upward
    float scanline = step(0.5,
      sin(vPosition.y * uScanlineCount + uTime * uScanlineSpeed) * 0.5 + 0.5
    );

    // Glitch effect: random horizontal slicing
    float glitchBlock = floor(vPosition.y * 20.0 + uTime * 3.0);
    float glitch = step(1.0 - uGlitchIntensity * 0.15, random(glitchBlock));

    // Flicker: subtle overall brightness oscillation
    float flicker = 0.85 + 0.15 * sin(uTime * 15.0) * sin(uTime * 7.3);

    // Combine: fresnel glow + scanline pattern + glitch
    float alpha = fresnel * 0.6 + 0.15; // base from fresnel
    alpha += scanline * 0.2;             // scanlines add brightness
    alpha *= flicker;                    // flicker modulates everything
    alpha += glitch * 0.5;              // glitch adds bright flashes
    alpha *= uOpacity;

    // Color with bright edges
    vec3 color = uColor;
    color += fresnel * uColor * 0.8; // brighter at edges
    color += glitch * vec3(0.3);     // white flash on glitch

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

function Hologram() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const {
    color,
    fresnelPower,
    scanlineSpeed,
    scanlineCount,
    glitchIntensity,
    opacity,
  } = useControls({
    color: { value: "#00e5ff", label: "Holo Color" },
    fresnelPower: { value: 2.0, min: 1, max: 5, step: 0.1, label: "Fresnel Power" },
    scanlineSpeed: { value: 3.0, min: 0.5, max: 10, step: 0.5, label: "Scanline Speed" },
    scanlineCount: { value: 25, min: 5, max: 50, step: 1, label: "Scanline Count" },
    glitchIntensity: { value: 1.5, min: 0, max: 5, step: 0.1, label: "Glitch Intensity" },
    opacity: { value: 0.85, min: 0.1, max: 1.0, step: 0.05, label: "Opacity" },
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#00e5ff") },
      uFresnelPower: { value: 2.0 },
      uScanlineSpeed: { value: 3.0 },
      uScanlineCount: { value: 25.0 },
      uGlitchIntensity: { value: 1.5 },
      uOpacity: { value: 0.85 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uColor.value.set(color);
    u.uFresnelPower.value = fresnelPower;
    u.uScanlineSpeed.value = scanlineSpeed;
    u.uScanlineCount.value = scanlineCount;
    u.uGlitchIntensity.value = glitchIntensity;
    u.uOpacity.value = opacity;
  });

  return (
    <mesh>
      <torusKnotGeometry args={[0.8, 0.3, 128, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050510"]} />
      <Hologram />
      <OrbitControls enableDamping autoRotate autoRotateSpeed={1.5} />
    </>
  );
}

export function HologramDemo() {
  return (
    <SceneContainer caption="Holographic torus knot with fresnel glow, animated scan lines, and glitch flickering. All effects computed in the fragment shader.">
      <LevaPanel title="Hologram Controls" />
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
