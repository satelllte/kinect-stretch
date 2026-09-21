import "./r3f-extend";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { KinectPoints } from "./KinectPoints";
import { PostProcessing } from "./PostProcessing";

type SceneProps = {
  debug?: boolean;
};

export function Scene({ debug = false }: SceneProps) {
  return (
    <div className="container">
      <Leva hidden={!debug} />
      <Canvas camera={{ position: [-5.0, 2.28, -1.88] }}>
        <OrbitControls enableZoom={false} enablePan={false} />
        <KinectPoints />
        <PostProcessing />
      </Canvas>
    </div>
  );
}
