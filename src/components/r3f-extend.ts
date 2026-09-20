import { extend, type ThreeElement } from "@react-three/fiber";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

declare module "@react-three/fiber" {
  interface ThreeElements {
    effectComposer: ThreeElement<typeof EffectComposer>;
    renderPass: ThreeElement<typeof RenderPass>;
    shaderPass: ThreeElement<typeof ShaderPass>;
    unrealBloomPass: ThreeElement<typeof UnrealBloomPass>;
  }
}

extend({
  EffectComposer,
  RenderPass,
  ShaderPass,
  UnrealBloomPass,
});
