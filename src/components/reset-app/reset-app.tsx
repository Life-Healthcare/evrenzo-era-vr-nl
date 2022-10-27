import React from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import Interact from "@/components/interact/interact";

export default function ResetApp() {
  const navigate = useNavigate();

  return (
    <Interact onSelect={() => navigate("/")}>
      <group position={[0, Math.PI * -1.5, 0]}>
        <mesh rotation={[Math.PI * -0.5, 0, 0]}>
          <circleGeometry args={[Math.PI * 0.5, 32, 32]} />
          <meshBasicMaterial
            color="crimson"
            transparent
            side={THREE.DoubleSide}
            opacity={0}
          />
        </mesh>
      </group>
    </Interact>
  );
}
