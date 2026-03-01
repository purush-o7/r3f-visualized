"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { Leva, useControls } from "leva";

type ShadowType = "Basic" | "PCF" | "PCFSoft" | "VSM";

const shadowTypeMap: Record<ShadowType, THREE.ShadowMapType> = {
  Basic: THREE.BasicShadowMap,
  PCF: THREE.PCFShadowMap,
  PCFSoft: THREE.PCFSoftShadowMap,
  VSM: THREE.VSMShadowMap,
};

function FloatingSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 1.5 + Math.sin(clock.elapsedTime * 1.2) * 0.4;
      ref.current.rotation.x = clock.elapsedTime * 0.3;
      ref.current.rotation.z = clock.elapsedTime * 0.2;
    }
  });
  return (
    <mesh ref={ref} position={[0, 1.5, 0]} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

function RotatingCube() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });
  return (
    <mesh ref={ref} position={[-1.8, 0.4, -0.5]} castShadow receiveShadow>
      <boxGeometry args={[0.7, 0.7, 0.7]} />
      <meshStandardMaterial color="#f472b6" roughness={0.4} />
    </mesh>
  );
}

function TorusKnot() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={[1.8, 0.6, -0.3]} castShadow receiveShadow>
      <torusKnotGeometry args={[0.35, 0.12, 64, 16]} />
      <meshStandardMaterial color="#22d3ee" roughness={0.3} />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial color="#1e1e30" roughness={0.85} />
    </mesh>
  );
}

function ShadowCameraHelper({ light }: { light: THREE.DirectionalLight | null }) {
  const { scene } = useThree();
  const helperRef = useRef<THREE.CameraHelper | null>(null);

  useEffect(() => {
    if (light) {
      const helper = new THREE.CameraHelper(light.shadow.camera);
      helperRef.current = helper;
      scene.add(helper);
      return () => {
        scene.remove(helper);
        helper.dispose();
      };
    }
  }, [light, scene]);

  return null;
}

function Scene() {
  const {
    shadowMapSize,
    bias,
    "lightPosition Y": lightY,
    showHelper,
  } = useControls({
    shadowMapSize: { value: "2048", options: ["256", "512", "1024", "2048"] },
    bias: { value: -0.0004, min: -0.01, max: 0.01, step: 0.0001 },
    "lightPosition Y": { value: 8, min: 2, max: 10, step: 0.5 },
    showHelper: { value: false },
  });

  const lightRef = useRef<THREE.DirectionalLight>(null);
  const mapSize = parseInt(shadowMapSize);

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight
        ref={lightRef}
        position={[5, lightY, 4]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={mapSize}
        shadow-mapSize-height={mapSize}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-bias={bias}
        shadow-normalBias={0.02}
      />
      {showHelper && <ShadowCameraHelper light={lightRef.current} />}
      <FloatingSphere />
      <RotatingCube />
      <TorusKnot />
      <Ground />
      <OrbitControls
        enableDamping
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
    </>
  );
}

export function ShadowDemo() {
  const [shadowType, setShadowType] = useState<ShadowType>("PCFSoft");

  return (
    <SceneContainer caption="Objects casting and receiving shadows -- toggle shadow map types to compare quality. The sphere bobs up and down to show dynamic shadow response.">
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <div className="absolute top-3 left-3 z-10 flex gap-1.5 flex-wrap">
        {(Object.keys(shadowTypeMap) as ShadowType[]).map((type) => (
          <button
            key={type}
            onClick={() => setShadowType(type)}
            className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${
              shadowType === type
                ? "bg-white text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <Canvas
        camera={{ position: [4, 4, 5], fov: 42 }}
        shadows={{ type: shadowTypeMap[shadowType] }}
        key={shadowType}
      >
        <Scene />
      </Canvas>
    </SceneContainer>
  );
}
