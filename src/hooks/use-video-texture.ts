import React from "react";
import { PlaneBufferGeometryProps } from "@react-three/fiber";
import { UseVideo } from "@/types";

type UseVideoTexture = {
  video: HTMLVideoElement;
  args: PlaneBufferGeometryProps["args"];
};

export default function useVideoTexture(
  [videoState, video]: UseVideo,
  height: number
): UseVideoTexture {
  const width = React.useMemo(() => {
    const aspect = video.videoWidth / video.videoHeight;
    const width = height * aspect;
    if (isNaN(width)) return 0;
    return width;
  }, [videoState.loaded]);

  return { video, args: [width, height] };
}
