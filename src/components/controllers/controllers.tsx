import React from "react";
import * as THREE from "three";
import { useXR } from "@react-three/xr";
import { a, useSpring } from "@react-spring/three";
import useAppState from "@/hooks/use-app-state";

const RAY_LENGTH = Math.PI * 1.5;
const RAY_THICKNESS = 0.005;

type Props = {
  rayLength?: number;
  rayThickness?: number;
};

export default function Controllers({
  rayLength = RAY_LENGTH,
  rayThickness = RAY_THICKNESS,
}: Props) {
  const hovering = useAppState((state) => state.hovering);

  const { controllers } = useXR();

  const groupsRef = React.useRef<THREE.Group[]>([]);

  React.useEffect(() => {
    controllers.forEach((controller, index) => {
      controller.controller.add(groupsRef.current[index]);
    });
    return () => {
      controllers.forEach((controller, index) => {
        controller.grip.remove(groupsRef.current[index]);
        controller.controller.remove(groupsRef.current[index]);
      });
    };
  }, [controllers, rayLength]);

  const materialProps = useSpring({
    color: hovering ? "#ffffff" : "#aaaaaa",
  });

  return (
    <>
      {controllers.map((controller, index) => {
        return (
          <group
            key={index}
            rotation={[Math.PI * 0.5, 0, 0]}
            ref={(group) => {
              groupsRef.current[index] = group;
            }}
            renderOrder={1}
          >
            <group position={[0, 0.002, 0]}>
              <group position={[0, rayLength * -0.5, 0]}>
                <group position={[0, rayLength * -0.5, 0]}>
                  <mesh
                    renderOrder={2}
                    rotation={[Math.PI * 0.5, 0, 0]}
                    visible={hovering}
                  >
                    <circleGeometry args={[0.025, 32, 32]} />
                    <a.meshBasicMaterial
                      {...materialProps}
                      side={THREE.DoubleSide}
                      transparent
                      opacity={1}
                      depthWrite={false}
                    />
                  </mesh>
                </group>
                <mesh renderOrder={3}>
                  <cylinderBufferGeometry
                    args={[rayThickness, rayThickness, rayLength, 32, 32]}
                  />
                  <a.meshBasicMaterial
                    {...materialProps}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={1}
                    depthWrite={false}
                  />
                </mesh>
              </group>
            </group>
          </group>
        );
      })}
    </>
  );
}
