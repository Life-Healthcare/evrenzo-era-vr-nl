import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import canvasConfig from "@/config/canvas-config";
import useMounted from "@/hooks/use-mounted";
import config from "@/config/config";

type Props = {
  src: string;
  children?: React.ReactNode;
  loop?: boolean;
  onVideoEnded?: () => void;
};

export default function Sphere({
  src,
  children,
  loop = true,
  onVideoEnded,
}: Props) {
  const { camera } = useThree();

  const radius = React.useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const fovInRadians = (cam.fov * Math.PI) / 180;
    const height = Math.abs(
      canvasConfig.camera.position.z * Math.tan(fovInRadians / 2) * 2
    );
    const width = height * cam.aspect;
    return Math.max(width, height) * 2;
  }, [camera]);

  const video = React.useMemo(() => {
    const video = document.querySelector<HTMLVideoElement>("#sphere-video");
    video.src = src;
    return video;
  }, [src]);

  React.useEffect(() => {
    video.loop = loop;
    if (config.env === "development") {
      video.playbackRate = 4;
    }
  }, [video, loop]);

  React.useEffect(() => {
    video.addEventListener("ended", onVideoEnded);
    video.play().catch((err) => {
      console.error(err);
    });
    return () => {
      video.removeEventListener("ended", onVideoEnded);
    };
  }, [video, onVideoEnded]);

  const mounted = useMounted();

  if (!mounted) return <></>;

  return (
    <group>
      <group rotation={[0, THREE.MathUtils.degToRad(-90), 0]}>
        <mesh
          scale={[-1, 1, 1]}
          position={canvasConfig.camera.position.clone()}
        >
          <sphereBufferGeometry args={[radius, 64, 64]} />
          <meshBasicMaterial side={THREE.BackSide}>
            <videoTexture attach="map" args={[video]} />
          </meshBasicMaterial>
        </mesh>
      </group>
      <group>{children}</group>
    </group>
  );
}
