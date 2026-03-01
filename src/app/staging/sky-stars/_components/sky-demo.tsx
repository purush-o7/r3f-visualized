"use client";

import { Canvas } from "@react-three/fiber";
import { Sky, Stars, OrbitControls } from "@react-three/drei";
import { useState, useMemo } from "react";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function Terrain() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.5} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Simple silhouette shapes */}
      <mesh position={[-4, 0.3, -6]}>
        <coneGeometry args={[1.2, 2.5, 6]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[-2.5, 0.5, -5]}>
        <coneGeometry args={[0.8, 2, 6]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[3, 0.2, -7]}>
        <coneGeometry args={[1.5, 3, 6]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[5, 0.1, -5.5]}>
        <coneGeometry args={[1, 2.2, 6]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}

function Scene({ sunAngle }: { sunAngle: number }) {
  const { rayleigh, turbidity, mieCoefficient, starCount, starDepth } = useControls({
    rayleigh: { value: 2, min: 0, max: 10, step: 0.1, label: "Rayleigh" },
    turbidity: { value: 3, min: 0, max: 20, step: 0.5, label: "Turbidity" },
    mieCoefficient: { value: 0.005, min: 0, max: 0.1, step: 0.001, label: "Mie Coefficient" },
    starCount: { value: 4000, min: 0, max: 10000, step: 100, label: "Star Count" },
    starDepth: { value: 50, min: 0, max: 100, step: 1, label: "Star Depth" },
  });

  // Convert angle (0 to 1) to sun position
  // 0 = dawn (right horizon), 0.5 = noon, 1 = dusk (left horizon)
  const sunPosition = useMemo((): [number, number, number] => {
    const angle = sunAngle * Math.PI; // 0 to PI
    const x = Math.cos(angle) * 10;
    const y = Math.sin(angle) * 10;
    return [x, y, -2];
  }, [sunAngle]);

  const isNight = sunPosition[1] < 0.5;
  const sunIntensity = Math.max(0, Math.min(1, sunPosition[1] / 3));

  // Warm light color at low sun angles
  const sunColor = sunAngle < 0.15 || sunAngle > 0.85
    ? "#ff8844"
    : sunAngle < 0.3 || sunAngle > 0.7
    ? "#ffaa66"
    : "#ffffff";

  return (
    <>
      {!isNight && (
        <Sky
          sunPosition={sunPosition}
          turbidity={turbidity}
          rayleigh={rayleigh}
          mieCoefficient={mieCoefficient}
          mieDirectionalG={0.8}
        />
      )}
      {isNight && <color attach="background" args={["#020210"]} />}
      <Stars
        radius={80}
        depth={starDepth}
        count={starCount}
        factor={4}
        fade
        speed={0.3}
        saturation={0}
      />
      <directionalLight
        position={sunPosition}
        intensity={sunIntensity * 2}
        color={sunColor}
        castShadow
      />
      <ambientLight intensity={isNight ? 0.05 : 0.15 + sunIntensity * 0.3} color={isNight ? "#4444aa" : "#ffffff"} />
      <Terrain />
      <OrbitControls
        makeDefault
        enableDamping
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={15}
      />
    </>
  );
}

export function SkyDemo() {
  const [sunAngle, setSunAngle] = useState(0.15);

  const timeLabel = sunAngle < 0.1
    ? "Dawn"
    : sunAngle < 0.3
    ? "Morning"
    : sunAngle < 0.7
    ? "Midday"
    : sunAngle < 0.9
    ? "Evening"
    : "Dusk";

  return (
    <div className="space-y-3">
      <SceneContainer caption="Drag the slider to move the sun from dawn to dusk. Stars fade in as the sky darkens.">
        <LevaPanel title="Controls" />
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }} shadows>
          <Scene sunAngle={sunAngle} />
        </Canvas>
      </SceneContainer>
      <div className="flex items-center justify-center gap-3 px-4">
        <span className="text-xs text-muted-foreground font-mono w-14">Dawn</span>
        <input
          type="range"
          min={0.02}
          max={0.98}
          step={0.01}
          value={sunAngle}
          onChange={(e) => setSunAngle(Number(e.target.value))}
          className="w-48 accent-amber-500"
        />
        <span className="text-xs text-muted-foreground font-mono w-14 text-right">Dusk</span>
      </div>
      <p className="text-center text-xs text-muted-foreground font-medium">{timeLabel}</p>
    </div>
  );
}
