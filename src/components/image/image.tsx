import React from "react";
import { GroupProps } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import useImageTexture from "@/hooks/use-image-texture";
import useMounted from "@/hooks/use-mounted";
import spring from "@/config/spring";

type Props = GroupProps & {
  src?: string;
  height?: number;
};

export default function Image({ src, height, ...props }: Props) {
  const texture = useImageTexture(src, height);
  const mounted = useMounted();

  const materialProps = useSpring({
    opacity: mounted ? 1 : 0,
    config: { ...spring },
  });

  return (
    <group {...props}>
      <mesh frustumCulled={false}>
        <planeBufferGeometry args={texture.args} />
        <a.meshBasicMaterial
          transparent
          map={texture.map}
          depthWrite={false}
          {...materialProps}
        />
      </mesh>
    </group>
  );
}
