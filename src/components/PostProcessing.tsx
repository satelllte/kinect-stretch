import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { Vector2 } from "three";
import type {
  EffectComposer,
  ShaderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import { useConst } from "./hooks/useConst";
import { stretchShader } from "./shaders/stretch-shader";

// Details: https://r3f.docs.pmnd.rs/api/hooks#taking-over-the-render-loop
const RENDER_PRIORITY = 1;

export function PostProcessing() {
  const { gl, scene, camera, size } = useThree();
  const sizeInitial = useConst(() => new Vector2(size.width, size.height));

  const composerRef = useRef<EffectComposer>(null);
  const bloomPassRef = useRef<UnrealBloomPass>(null);
  const stretchPassRef = useRef<ShaderPass>(null);

  const bloom = useControls("bloom", {
    strength: { value: 1.5, min: 0, max: 3, step: 0.01 },
    radius: { value: 0.6, min: 0, max: 1, step: 0.01 },
    threshold: { value: 0.0, min: 0, max: 1, step: 0.01 },
  });

  const stretch = useControls("stretch", {
    stretchX: { value: 1.0, min: 0, max: 1, step: 0.01 },
    yMin: { value: 0.35, min: 0, max: 1, step: 0.01 },
    yMax: { value: 0.65, min: 0, max: 1, step: 0.01 },
  });

  useEffect(() => {
    composerRef.current?.setSize(size.width, size.height);
    bloomPassRef.current?.setSize(size.width, size.height);
  }, [size]);

  useEffect(() => {
    const bloomPass = bloomPassRef.current;
    if (!bloomPass) return;

    bloomPass.strength = bloom.strength;
    bloomPass.radius = bloom.radius;
    bloomPass.threshold = bloom.threshold;
  }, [bloom]);

  useEffect(() => {
    const stretchPass = stretchPassRef.current;
    if (!stretchPass) return;

    stretchPass.uniforms.stretchX.value = stretch.stretchX;
    stretchPass.uniforms.yMin.value = stretch.yMin;
    stretchPass.uniforms.yMax.value = stretch.yMax;
  }, [stretch]);

  useFrame((_, timeDelta) => {
    composerRef.current?.render(timeDelta);
  }, RENDER_PRIORITY);

  return (
    <effectComposer ref={composerRef} args={[gl]}>
      <renderPass attach="passes-0" args={[scene, camera]} />
      <unrealBloomPass
        ref={bloomPassRef}
        attach="passes-1"
        args={[sizeInitial, bloom.strength, bloom.radius, bloom.threshold]}
      />
      <shaderPass
        ref={stretchPassRef}
        attach="passes-2"
        args={[stretchShader]}
      />
    </effectComposer>
  );
}
