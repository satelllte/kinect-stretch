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

type PostProcessingProps = {
  isStatic: boolean;
};

export function PostProcessing({ isStatic }: PostProcessingProps) {
  const { gl, scene, camera, size } = useThree();
  const sizeInitial = useConst(() => new Vector2(size.width, size.height));

  const composerRef = useRef<EffectComposer>(null);
  const bloomPassRef = useRef<UnrealBloomPass>(null);

  const bloom = useControls("bloom", {
    strength: { value: 1.5, min: 0, max: 3, step: 0.01 },
    radius: { value: 0.6, min: 0, max: 1, step: 0.01 },
    threshold: { value: 0.0, min: 0, max: 1, step: 0.01 },
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
      <StretchPass isStatic={isStatic} attach="passes-2" />
    </effectComposer>
  );
}

type StretchPassProps = {
  isStatic: boolean;
  attach: React.ComponentProps<"shaderPass">["attach"];
};

function StretchPass({ isStatic, attach }: StretchPassProps) {
  const stretchPassRef = useRef<ShaderPass>(null);

  const stretch = useControls("stretch", {
    amplitudeMin: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
    amplitudeMax: { value: 0.3, min: 0, max: 0.5, step: 0.01 },
    stepsMin: { value: 2, min: 1, max: 100, step: 1 },
    stepsMax: { value: 20, min: 1, max: 100, step: 1 },
  });

  useEffect(() => {
    if (!isStatic) return;

    const stretchPass = stretchPassRef.current;
    if (!stretchPass) return;

    const { uniforms } = stretchPass;
    const { amplitudeMin, amplitudeMax, stepsMin, stepsMax } = stretch;
    uniforms.amplitude.value = (amplitudeMax + amplitudeMin) / 2;
    uniforms.seed.value = 100.0;
    uniforms.steps.value = (stepsMax + stepsMin) / 2;
  }, [isStatic, stretch]);

  useInterval(() => {
    if (isStatic) return;

    const stretchPass = stretchPassRef.current;
    if (!stretchPass) return;

    const { uniforms } = stretchPass;
    const { amplitudeMin, amplitudeMax, stepsMin, stepsMax } = stretch;
    uniforms.amplitude.value = randFloat(amplitudeMin, amplitudeMax);
    uniforms.seed.value = randFloat(0.0, 100000.0);
    uniforms.steps.value = randFloat(stepsMin, stepsMax);
  }, 400);

  return (
    <shaderPass ref={stretchPassRef} attach={attach} args={[stretchShader]} />
  );
}
