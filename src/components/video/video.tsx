import React from "react";
import { GroupProps } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import useVideoTexture from "@/hooks/use-video-texture";
import useVideo from "@/hooks/use-video";
import Image from "@/components/image/image";
import Interact from "@/components/interact/interact";
import assets from "@/config/assets";
import useMounted from "@/hooks/use-mounted";
import spring from "@/config/spring";
import config from "@/config/config";

type Props = GroupProps & {
  src?: string;
  height?: number;
  onPlay?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
};

export default function Video({
  src,
  height,
  onPlay,
  onEnded,
  onTimeUpdate,
  ...props
}: Props) {
  const [state, video] = useVideo(src, { onPlay, onEnded, onTimeUpdate });
  const texture = useVideoTexture([state, video], height);

  const mounted = useMounted();

  const materialProps = useSpring({
    opacity: mounted ? 1 : 0,
    config: { ...spring },
  });

  React.useEffect(() => {
    function onEnded() {
      video.pause();
      video.currentTime = 0;
    }

    if (config.env === "development") {
      video.playbackRate = 4;
    }

    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("ended", onEnded);
      video.pause();
    };
  }, [video]);

  return (
    <group {...props}>
      <Interact
        onSelect={() => {
          if (state.playing) {
            video.pause();
          } else {
            video.play().catch((err) => {
              console.error(err);
            });
          }
        }}
      >
        <mesh frustumCulled={false}>
          <planeBufferGeometry args={texture.args} />
          <a.meshBasicMaterial
            transparent
            depthWrite={false}
            {...materialProps}
          >
            <videoTexture attach="map" args={[texture.video]} />
          </a.meshBasicMaterial>
        </mesh>
        {!state.playing && (
          <Image
            src={assets.buttonPlay}
            height={0.7}
            position={[0, 0, 0.001]}
          />
        )}
      </Interact>
    </group>
  );
}
