import fragmentShader from "./stretch.fragment.glsl?raw";
import vertexShader from "./stretch.vertex.glsl?raw";

export const stretchShader = {
  uniforms: {
    tDiffuse: { value: null },
    amplitude: { value: 0.1 },
    seed: { value: 0.0 },
    steps: { value: 20 },
  },
  vertexShader,
  fragmentShader,
};
