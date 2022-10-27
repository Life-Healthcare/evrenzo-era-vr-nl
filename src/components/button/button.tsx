import React from "react";
import { GroupProps } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import useImageTexture from "@/hooks/use-image-texture";
import Interact from "@/components/interact/interact";
import useMounted from "@/hooks/use-mounted";
import spring from "@/config/spring";

type Props = GroupProps & {
  image?: string;
  height?: number;
  onSelect?: () => void;
};

export default function Button({ image, height, onSelect, ...props }: Props) {
  const texture = useImageTexture(image, height);

  const mounted = useMounted();

  const materialProps = useSpring({
    opacity: mounted ? 1 : 0,
    config: { ...spring },
  });

  return (
    <Interact onSelect={onSelect}>
      <group {...props}>
        <mesh frustumCulled={false}>
          <planeBufferGeometry args={texture.args} />
          <a.meshBasicMaterial
            transparent
            map={texture.map}
            {...materialProps}
          />
        </mesh>
      </group>
    </Interact>
  );
}
