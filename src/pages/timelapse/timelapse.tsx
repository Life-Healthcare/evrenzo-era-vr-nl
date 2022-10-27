import React from "react";
import { useNavigate } from "react-router-dom";
import Sphere from "@/components/sphere/sphere";
import assets from "@/config/assets";
import Image from "@/components/image/image";
import Button from "@/components/button/button";
import Video from "@/components/video/video";
import useAudio from "@/hooks/use-audio";
import Interact from "@/components/interact/interact";

enum State {
  video1,
  video2,
}

export default function Timelapse() {
  const navigate = useNavigate();

  const [sphereVideoEnded, setSphereVideoEnded] = React.useState(false);
  const [showVideo1, setShowVideo1] = React.useState(false);
  const [showVideo2, setShowVideo2] = React.useState(false);
  const [video1Skip, setVideo1Skip] = React.useState(false);
  const [video2Ended, setVideo2Ended] = React.useState(false);
  const [video2Playing, setVideo2Playing] = React.useState(false);

  const [state, setState] = React.useState<State>(State.video1);

  const audioSrc = React.useMemo(() => {
    if (video2Playing) return assets.timelapseVoiceover3;
    if (!sphereVideoEnded) return assets.timelapseVoiceover1;
    if (state === State.video1) return assets.timelapseVoiceover2;
    return "";
  }, [sphereVideoEnded, state, video2Playing]);

  const audio = useAudio(audioSrc);

  React.useEffect(() => {
    return () => audio.pause();
  }, []);

  const onVideoEnded = React.useCallback(() => {
    setSphereVideoEnded(true);
  }, []);

  return (
    <Sphere
      src={assets.timelapseSphere}
      loop={false}
      onVideoEnded={onVideoEnded}
    >
      {sphereVideoEnded && (
        <group position={[0, 0.5, 0]}>
          {state === State.video1 && (
            <>
              {!showVideo1 && (
                <Interact onSelect={() => setShowVideo1(true)}>
                  <Image src={assets.timelapseVideo1Poster} height={3} />
                </Interact>
              )}
              {showVideo1 && (
                <>
                  <Video
                    src={assets.timelapseVideo1}
                    height={3}
                    onPlay={() => audio.pause()}
                    onTimeUpdate={(currentTime) => {
                      if (currentTime >= 31) {
                        setVideo1Skip(true);
                      }
                    }}
                  />
                  {video1Skip && (
                    <Button
                      image={assets.buttonContinue}
                      height={0.5}
                      position={[0, -2, 0]}
                      onSelect={() => setState(State.video2)}
                    />
                  )}
                </>
              )}
            </>
          )}
          {state === State.video2 && (
            <>
              {!showVideo2 && (
                <Interact onSelect={() => setShowVideo2(true)}>
                  <Image src={assets.timelapseVideo2Poster} height={3} />
                  <Image
                    src={assets.buttonPlay}
                    height={0.7}
                    position={[0, 0, 0.001]}
                  />
                </Interact>
              )}
              {showVideo2 && (
                <>
                  <Video
                    src={assets.timelapseVideo2}
                    height={3}
                    onPlay={() => {
                      setVideo2Playing(true);
                    }}
                    onEnded={() => {
                      setVideo2Ended(true);
                      setVideo2Playing(false);
                      audio.pause();
                    }}
                  />
                  {video2Ended && (
                    <Button
                      image={assets.buttonContinue}
                      height={0.5}
                      position={[0, -2, 0]}
                      onSelect={() => navigate("/end")}
                    />
                  )}
                </>
              )}
            </>
          )}
        </group>
      )}
    </Sphere>
  );
}
