import type * as THREE from "three";
import fragmentShader from "./kinect.fragment.glsl?raw";
import vertexShader from "./kinect.vertex.glsl?raw";

export const kinectShader = {
  uniforms: {
    map: { value: null as THREE.Texture | null },
    width: { value: 640 },
    height: { value: 480 },
    nearClipping: { value: 350 },
    farClipping: { value: 1280 },
    pointSize: { value: 2 },
    zOffset: { value: 1000 },
  },
  vertexShader,
  fragmentShader,
};
