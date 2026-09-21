import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { Vector2 } from "three";
import type {
  EffectComposer,
  ShaderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import { randFloat } from "three/src/math/MathUtils.js";
import { useConst } from "./hooks/useConst";
import { useInterval } from "./hooks/useInterval";
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
    amplitudeMin: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
    amplitudeMax: { value: 0.3, min: 0, max: 0.5, step: 0.01 },
    seed: { value: 0, min: 0, max: 100000, step: 0.01 },
    stepsMin: { value: 10, min: 1, max: 100, step: 1 },
    stepsMax: { value: 40, min: 1, max: 100, step: 1 },
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

  useInterval(() => {
    const stretchPass = stretchPassRef.current;
    if (!stretchPass) return;

    stretchPass.uniforms.amplitude.value = randFloat(
      stretch.amplitudeMin,
      stretch.amplitudeMax,
    );
    stretchPass.uniforms.seed.value = randFloat(0.0, 100000.0);
    stretchPass.uniforms.steps.value = randFloat(
      stretch.stepsMin,
      stretch.stepsMax,
    );
  }, 400);

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
