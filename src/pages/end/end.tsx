import React from "react";
import { useNavigate } from "react-router-dom";
import Sphere from "@/components/sphere/sphere";
import Image from "@/components/image/image";
import useAudio from "@/hooks/use-audio";
import Interact from "@/components/interact/interact";
import assets from "@/config/assets";

export default function End() {
  const navigate = useNavigate();

  const audio = useAudio(assets.endVoiceover);

  React.useEffect(() => {
    return () => audio.pause();
  }, []);

  return (
    <Sphere src={assets.endSphere}>
      <Interact onSelect={() => navigate("/")}>
        <Image src={assets.endImage} height={4} />
      </Interact>
    </Sphere>
  );
}
