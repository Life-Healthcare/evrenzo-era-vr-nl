import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

export default function useSceneSize() {
  const { camera } = useThree();

  return React.useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const fovInRadians = (cam.fov * Math.PI) / 180;
    const height = Math.abs(cam.position.z * Math.tan(fovInRadians / 2) * 2);
    const width = height * cam.aspect;
    return { width, height };
  }, [camera]);
}
