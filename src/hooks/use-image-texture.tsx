import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { PlaneBufferGeometryProps, useThree } from "@react-three/fiber";

type UseImageTexture = {
  map: THREE.Texture;
  args: PlaneBufferGeometryProps["args"];
};

export default function useImageTexture(
  src: string,
  height: number
): UseImageTexture {
  const texture = useTexture(src);
  const { gl } = useThree();

  React.useMemo(() => {
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }, [texture, gl]);

  const width = React.useMemo(() => {
    const aspect = texture.image.width / texture.image.height;
    return height * aspect;
  }, [texture, height]);

  return { map: texture, args: [width, height] };
}
