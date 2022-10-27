import React from "react";
import { Interactive } from "@react-three/xr";
import useAppState from "@/hooks/use-app-state";

type Props = {
  children?: React.ReactNode;
  onSelect?: () => void;
};

export default function Interact({ children, onSelect }: Props) {
  const setHovering = useAppState((state) => state.setHovering);

  const onSelectRef = React.useRef(onSelect);
  React.useMemo(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const handleSelect = React.useCallback(() => {
    if (onSelectRef.current === undefined) return;
    onSelectRef.current();
  }, []);

  return (
    <Interactive
      onHover={() => setHovering(true)}
      onSelect={handleSelect}
      onBlur={() => setHovering(false)}
    >
      {children}
    </Interactive>
  );
}
