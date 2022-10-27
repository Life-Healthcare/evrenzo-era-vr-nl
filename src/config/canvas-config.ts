import * as THREE from "three";

type CanvasConfig = {
  camera: {
    position: THREE.Vector3;
  };
  scene: {
    offset: THREE.Vector3;
  };
  artwork: {
    height: number;
  };
};

const canvasConfig: CanvasConfig = {
  camera: {
    position: new THREE.Vector3(0, 0, 5),
  },
  scene: {
    offset: new THREE.Vector3(0, 1.65, 0),
  },
  artwork: {
    height: 1080,
  },
};

export default canvasConfig;
