import "./normalize.css";
import "./index.css";
import { OrbitControls } from "@react-three/drei";
import { Canvas, extend, type ThreeElement } from "@react-three/fiber";
import * as TSL from "three/tsl";
import * as THREE from "three/webgpu";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshBasicNodeMaterial: ThreeElement<typeof THREE.MeshBasicNodeMaterial>;
    meshStandardNodeMaterial: ThreeElement<
      typeof THREE.MeshStandardNodeMaterial
    >;
  }
}

extend({
  MeshBasicNodeMaterial: THREE.MeshBasicNodeMaterial,
  MeshStandardNodeMaterial: THREE.MeshStandardNodeMaterial,
});

export function Scene() {
  return (
    <div className="container">
      <Canvas
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(
            props as THREE.RendererParameters,
          );
          await renderer.init();
          return renderer;
        }}
      >
        <OrbitControls />
        <Lights />
        <Meshes />
      </Canvas>
    </div>
  );
}

function Lights() {
  return (
    <>
      <directionalLight
        color={0xffffff}
        intensity={4}
        position={[10, 10, 10]}
      />
      <ambientLight color={0xffffff} intensity={0.5} />
    </>
  );
}

const gradientNode = TSL.Fn(() => {
  const color1 = TSL.vec3(0.01, 0.22, 0.98);
  const color2 = TSL.vec3(0.36, 0.68, 1.0);
  const t = TSL.clamp(TSL.length(TSL.abs(TSL.uv().sub(0.5))), 0.0, 0.8);
  return TSL.mix(color1, color2, t);
});

const sphereColorNode = gradientNode();

function Meshes() {
  return (
    <>
      <mesh>
        <boxGeometry />
        <meshBasicNodeMaterial color={0xbb1111} />
      </mesh>
      <mesh>
        <sphereGeometry args={[50, 16, 16]} />
        <meshBasicNodeMaterial
          colorNode={sphereColorNode}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1, 256]} />
        <meshStandardNodeMaterial color="white" />
      </mesh>
    </>
  );
}
