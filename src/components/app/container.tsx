import React from "react";
import { useXR } from "@react-three/xr";

type Props = {
  children?: React.ReactNode;
};

export default function Container({ children }: Props) {
  const { isPresenting } = useXR();

  React.useEffect(() => {
    const button = document.querySelector<HTMLButtonElement>("#VRButton");
    if (button === null) return;
    button.style.display = isPresenting ? "none" : "block";
  }, [isPresenting]);

  return <group visible={isPresenting}>{children}</group>;
}
