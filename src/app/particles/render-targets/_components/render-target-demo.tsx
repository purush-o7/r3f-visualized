"use client";

import { Canvas, useFrame, createPortal } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

function PortalScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.5;
      meshRef.current.rotation.y = t * 0.7;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.3;
      torusRef.current.rotation.z = t * 0.6;
    }
  });

  return (
    <>
      <color attach="background" args={["#1a0a2e"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 2]} intensity={8} color="#a78bfa" />
      <pointLight position={[-2, -1, 1]} intensity={5} color="#f472b6" />

      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color="#6366f1"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh ref={torusRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.3, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#f472b6"
          emissiveIntensity={0.3}
        />
      </mesh>
    </>
  );
}

function TVScreen({
  renderTarget,
  showPortal,
}: {
  renderTarget: THREE.WebGLRenderTarget;
  showPortal: boolean;
}) {
  const tvRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (tvRef.current) {
      tvRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={tvRef}>
      {/* TV frame */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.6, 1.8, 0.15]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>

      {/* Screen face */}
      <mesh position={[0, 0.8, 0.08]}>
        <planeGeometry args={[2.3, 1.5]} />
        {showPortal ? (
          <meshBasicMaterial map={renderTarget.texture} />
        ) : (
          <meshBasicMaterial color="#111111" />
        )}
      </mesh>

      {/* Stand */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[1.2, 0.06, 0.6]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>
    </group>
  );
}

function MainScene() {
  const { resolution, showPortal } = useControls({
    resolution: {
      value: 512,
      min: 64,
      max: 1024,
      step: 64,
      label: "Resolution",
    },
    showPortal: { value: true, label: "Show Portal" },
  });

  const portalCamera = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(50, 2.3 / 1.5, 0.1, 100);
    cam.position.set(0, 0, 3);
    return cam;
  }, []);

  const portalScene = useMemo(() => new THREE.Scene(), []);

  const renderTarget = useMemo(() => {
    return new THREE.WebGLRenderTarget(resolution, resolution, {
      format: THREE.RGBAFormat,
      stencilBuffer: false,
    });
  }, [resolution]);

  useFrame(({ gl }) => {
    if (showPortal) {
      gl.setRenderTarget(renderTarget);
      gl.render(portalScene, portalCamera);
      gl.setRenderTarget(null);
    }
  });

  return (
    <>
      {/* The portal scene content lives in a separate scene graph */}
      {createPortal(<PortalScene />, portalScene)}

      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 6, 4]} intensity={1.2} />

      <TVScreen renderTarget={renderTarget} showPortal={showPortal} />

      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.38}
        receiveShadow
      >
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#111118" />
      </mesh>

      <OrbitControls enableDamping />
    </>
  );
}

export function RenderTargetDemo() {
  return (
    <SceneContainer caption="A mini scene rendered to a texture, displayed on a TV screen. Toggle the portal on/off and change the render resolution.">
      <Leva collapsed titleBar={{ title: "Render Target Controls" }} />
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
        <MainScene />
      </Canvas>
    </SceneContainer>
  );
}
