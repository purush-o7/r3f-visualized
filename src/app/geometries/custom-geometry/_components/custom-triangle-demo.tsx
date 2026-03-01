"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function CustomTriangle() {
  const meshRef = useRef<THREE.Group>(null);

  const { showNormals, showVertices, rotationSpeed, vertexColors, scale } =
    useControls("Triangle Controls", {
      showNormals: { value: true, label: "Show Normals" },
      showVertices: { value: true, label: "Show Vertices" },
      rotationSpeed: { value: 0.4, min: 0, max: 5, step: 0.1 },
      vertexColors: { value: true, label: "Vertex Colors" },
      scale: { value: 1, min: 0.5, max: 3, step: 0.1 },
    });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Triangle vertices (CCW winding)
    const positions = new Float32Array([
      -1.0, -0.7, 0.0, // bottom-left
       1.0, -0.7, 0.0, // bottom-right
       0.0,  0.9, 0.0, // top-center
    ]);

    const normals = new Float32Array([
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ]);

    const uvs = new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.5, 1.0,
    ]);

    // Vertex colors: R, G, B per vertex
    const colors = new Float32Array([
      1, 0, 0, // red
      0, 1, 0, // green
      0, 0, 1, // blue
    ]);

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeBoundingSphere();

    return geo;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  // Normal vectors for visualization
  const normalLines = useMemo(() => {
    const verts = [
      [-1.0, -0.7, 0.0],
      [1.0, -0.7, 0.0],
      [0.0, 0.9, 0.0],
    ];
    return verts.map((v) => ({
      start: v as [number, number, number],
      end: [v[0], v[1], v[2] + 0.6] as [number, number, number],
    }));
  }, []);

  return (
    <group ref={meshRef} scale={scale}>
      {/* The custom triangle with vertex colors */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors={vertexColors}
          color={vertexColors ? undefined : "#6366f1"}
          side={THREE.DoubleSide}
          roughness={0.5}
        />
      </mesh>

      {/* Vertex position markers */}
      {showVertices &&
        [
          { pos: [-1.0, -0.7, 0.0] as [number, number, number], color: "#ef4444" },
          { pos: [1.0, -0.7, 0.0] as [number, number, number], color: "#22c55e" },
          { pos: [0.0, 0.9, 0.0] as [number, number, number], color: "#3b82f6" },
        ].map((v, i) => (
          <mesh key={i} position={v.pos}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={v.color} emissive={v.color} emissiveIntensity={0.5} />
          </mesh>
        ))}

      {/* Normal direction arrows */}
      {showNormals &&
        normalLines.map((line, i) => (
          <Line
            key={i}
            points={[line.start, line.end]}
            color="#f59e0b"
            lineWidth={2}
          />
        ))}
    </group>
  );
}

export function CustomTriangleDemo() {
  return (
    <SceneContainer caption="Custom triangle from raw vertices -- dots show vertex positions, yellow lines show normals">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [0, 0.5, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} />
        <CustomTriangle />
        <gridHelper args={[6, 6, "#333", "#222"]} position={[0, -1, 0]} />
        <OrbitControls enableDamping />
      </Canvas>
    </SceneContainer>
  );
}
