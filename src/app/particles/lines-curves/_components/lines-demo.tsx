"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function CurveWithTraveler() {
  const dotRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  const { tubeRadius, segments, showPoints, animationSpeed, curveColor } =
    useControls({
      tubeRadius: {
        value: 0.06,
        min: 0.01,
        max: 0.3,
        step: 0.01,
        label: "Tube Radius",
      },
      segments: {
        value: 64,
        min: 8,
        max: 128,
        step: 8,
        label: "Segments",
      },
      showPoints: { value: true, label: "Show Points" },
      animationSpeed: {
        value: 0.15,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Dot Speed",
      },
      curveColor: { value: "#6366f1", label: "Curve Color" },
    });

  const controlPoints: [number, number, number][] = useMemo(
    () => [
      [-3, 0, 0],
      [-1.5, 2, 1],
      [0, -1, -1],
      [1.5, 1.5, 2],
      [3, 0, 0],
    ],
    []
  );

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      controlPoints.map((p) => new THREE.Vector3(...p)),
      false,
      "catmullrom",
      0.5
    );
  }, [controlPoints]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, segments, tubeRadius, 12, false);
  }, [curve, segments, tubeRadius]);

  const linePoints = useMemo(() => {
    return curve.getPoints(100).map((p) => p.toArray() as [number, number, number]);
  }, [curve]);

  useFrame((_, delta) => {
    if (!dotRef.current) return;
    progressRef.current = (progressRef.current + delta * animationSpeed) % 1;
    const point = curve.getPointAt(progressRef.current);
    dotRef.current.position.copy(point);
  });

  return (
    <group>
      {/* Glowing line representation */}
      <Line
        points={linePoints}
        color={curveColor}
        lineWidth={1.5}
        transparent
        opacity={0.3}
      />

      {/* Tube representation */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={curveColor}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Control points */}
      {showPoints &&
        controlPoints.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color="#f472b6"
              emissive="#f472b6"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}

      {/* Traveling dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 3]} intensity={1.2} />
      <CurveWithTraveler />
      <mesh rotation-x={-Math.PI / 2} position-y={-1.5} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#111118" />
      </mesh>
      <OrbitControls enableDamping />
    </>
  );
}

export function LinesDemo() {
  return (
    <SceneContainer caption="A CatmullRomCurve3 shown as both a line and a tube. The cyan dot travels along the curve. Toggle control points and adjust tube thickness.">
      <Leva collapsed titleBar={{ title: "Curve Controls" }} />
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
