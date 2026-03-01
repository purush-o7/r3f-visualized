"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function ViewportInfo() {
  const { size, viewport } = useThree();

  return (
    <Html position={[0, 2.2, 0]} center>
      <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-md font-mono whitespace-nowrap border border-white/10">
        {size.width}x{size.height}px | aspect: {(size.width / size.height).toFixed(2)} | viewport: {viewport.width.toFixed(1)}x{viewport.height.toFixed(1)}
      </div>
    </Html>
  );
}

function ResponsiveObjects() {
  const { viewport } = useThree();

  const { dpr, showInfo } = useControls("Responsive", {
    dpr: { value: 1, min: 0.5, max: 2, step: 0.25, label: "Device Pixel Ratio" },
    showInfo: { value: true, label: "Show Viewport Info" },
  });

  const scaleFactor = Math.min(viewport.width / 8, 1);
  const spacing = 1.8 * scaleFactor;

  return (
    <>
      {showInfo && <ViewportInfo />}

      {/* Objects that scale with viewport */}
      <mesh position={[-spacing * 2, 0, 0]} scale={scaleFactor}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6366f1" roughness={0.3} />
      </mesh>

      <mesh position={[-spacing, 0, 0]} scale={scaleFactor}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#ec4899" roughness={0.3} />
      </mesh>

      <mesh position={[0, 0, 0]} scale={scaleFactor}>
        <cylinderGeometry args={[0.4, 0.4, 1, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={0.3} />
      </mesh>

      <mesh position={[spacing, 0, 0]} scale={scaleFactor}>
        <coneGeometry args={[0.5, 1, 32]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>

      <mesh position={[spacing * 2, 0, 0]} scale={scaleFactor}>
        <torusGeometry args={[0.4, 0.15, 16, 32]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.3} />
      </mesh>
    </>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />

      <ResponsiveObjects />

      <gridHelper args={[10, 10, "#444", "#333"]} position={[0, -1, 0]} />

      <OrbitControls enableDamping />
    </>
  );
}

export function ResponsiveDemo() {
  return (
    <SceneContainer caption="Resize your browser window to see the objects adapt -- the viewport info updates in real-time">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }} dpr={[0.5, 2]}>
        <SceneContent />
      </Canvas>
    </SceneContainer>
  );
}
