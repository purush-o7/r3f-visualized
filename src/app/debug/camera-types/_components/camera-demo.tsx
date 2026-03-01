"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { SceneContainer } from "@/components/scene-container";
import { useControls } from "leva";
import { LevaPanel } from "@/components/leva-panel";

function SceneObjects() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const colors = ["#6366f1", "#ec4899", "#22c55e", "#f59e0b", "#3b82f6"];

  return (
    <group ref={groupRef}>
      {colors.map((color, i) => {
        const angle = (i / colors.length) * Math.PI * 2;
        const radius = 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius,
            ]}
          >
            <boxGeometry args={[0.6, 0.6 + i * 0.3, 0.6]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#a855f7" roughness={0.2} metalness={0.3} />
      </mesh>
    </group>
  );
}

function CameraController() {
  const { camera, size } = useThree();

  const { cameraType, fov, near, far, zoom } = useControls("Camera", {
    cameraType: {
      value: "perspective",
      options: ["perspective", "orthographic"],
      label: "Type",
    },
    fov: { value: 50, min: 10, max: 120, step: 1, label: "FOV" },
    near: { value: 0.1, min: 0.01, max: 5, step: 0.01, label: "Near Plane" },
    far: { value: 100, min: 5, max: 500, step: 5, label: "Far Plane" },
    zoom: { value: 1, min: 0.2, max: 5, step: 0.1, label: "Zoom" },
  });

  const { set } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;

    if (cameraType === "perspective") {
      const cam = new THREE.PerspectiveCamera(fov, aspect, near, far);
      cam.position.set(4, 3, 4);
      cam.lookAt(0, 0, 0);
      cam.updateProjectionMatrix();
      set({ camera: cam });
    } else {
      const frustumSize = 4;
      const cam = new THREE.OrthographicCamera(
        (-frustumSize * aspect) / 2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        -frustumSize / 2,
        near,
        far
      );
      cam.position.set(4, 3, 4);
      cam.zoom = zoom;
      cam.lookAt(0, 0, 0);
      cam.updateProjectionMatrix();
      set({ camera: cam });
    }
  }, [cameraType, fov, near, far, zoom, size, set]);

  return null;
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />

      <CameraController />
      <SceneObjects />

      <gridHelper args={[10, 10, "#444", "#333"]} position={[0, -0.5, 0]} />
      <axesHelper args={[3]} />

      <OrbitControls enableDamping />
    </>
  );
}

export function CameraDemo() {
  return (
    <SceneContainer caption="Switch between Perspective and Orthographic cameras -- notice how depth perception changes">
      <LevaPanel title="Controls" />
      <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
        <SceneContent />
      </Canvas>
    </SceneContainer>
  );
}
