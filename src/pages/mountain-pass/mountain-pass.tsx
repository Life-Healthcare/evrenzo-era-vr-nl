import React from "react";
import { useNavigate } from "react-router-dom";
import Sphere from "@/components/sphere/sphere";
import useAudio from "@/hooks/use-audio";
import assets from "@/config/assets";

export default function MountainPass() {
  const navigate = useNavigate();

  const audio = useAudio(assets.mountainVoiceover);

  React.useEffect(() => {
    return () => audio.pause();
  }, []);

  const onVideoEnded = React.useCallback(() => {
    navigate("/timelapse");
  }, []);

  return (
    <Sphere
      src={assets.mountainPassSphere}
      loop={false}
      onVideoEnded={onVideoEnded}
    />
  );
}
