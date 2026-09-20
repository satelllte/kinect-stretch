import fragmentShader from "./stretch.fragment.glsl?raw";
import vertexShader from "./stretch.vertex.glsl?raw";

export const stretchShader = {
  uniforms: {
    tDiffuse: { value: null },
    stretchX: { value: 1.0 },
    yMin: { value: 0.35 },
    yMax: { value: 0.65 },
  },
  vertexShader,
  fragmentShader,
};
