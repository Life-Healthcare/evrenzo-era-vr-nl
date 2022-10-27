import React from "react";
import { UseVideo, VideoState } from "@/types";

type Options = {
  onLoaded?: () => void;
  onPlay?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
};

export default function useVideo(
  src: string,
  options?: Partial<Options>
): UseVideo {
  const [state, setState] = React.useState<VideoState>({
    loaded: false,
    playing: false,
    ended: false,
  });

  const optionsRef = React.useRef(options ?? {});
  React.useMemo(() => {
    optionsRef.current = options ?? {};
  }, [options]);

  const video = React.useMemo(() => {
    return document.querySelector<HTMLVideoElement>("#video");
  }, []);

  React.useEffect(() => {
    function onLoaded() {
      setState((state) => {
        return { ...state, loaded: true };
      });
      if (optionsRef.current.onLoaded) {
        optionsRef.current.onLoaded();
      }
    }

    function onEnded() {
      setState((state) => {
        return { ...state, ended: true, playing: false };
      });
      if (optionsRef.current.onEnded) {
        optionsRef.current.onEnded();
      }
    }

    function onPause() {
      setState((state) => {
        return { ...state, playing: false };
      });
    }

    function onTimeUpdate() {
      if (optionsRef.current.onTimeUpdate) {
        optionsRef.current.onTimeUpdate(video.currentTime);
      }
    }

    function onPlay() {
      setState((state) => {
        return { ...state, ended: false, playing: true };
      });
      if (optionsRef.current.onPlay) {
        optionsRef.current.onPlay();
      }
    }

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);
    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", onTimeUpdate);

    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.src = src;
    video.load();
    video.play().catch((err) => {
      console.error(err);
    });

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [video, src]);

  return [state, video];
}
