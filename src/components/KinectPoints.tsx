import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useConst } from "./hooks/useConst";
import { kinectShader } from "./shaders/kinect-shader";

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;

function createPointCloudGeometry() {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(VIDEO_WIDTH * VIDEO_HEIGHT * 3);

  for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
    vertices[i] = j % VIDEO_WIDTH;
    vertices[i + 1] = Math.floor(j / VIDEO_WIDTH);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  return geometry;
}

function useKinectVideoTexture(src: string, isStatic: boolean) {
  const video = useConst(() => {
    const v = document.createElement("video");
    v.loop = true;
    v.muted = true;
    v.crossOrigin = "anonymous";
    v.playsInline = true;
    v.src = src;
    v.playbackRate = 0.5;
    v.currentTime = 0.5;
    return v;
  });

  const texture = useConst(() => {
    const t = new THREE.VideoTexture(video);
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    return t;
  });

  useEffect(() => {
    if (!isStatic) {
      video.play();
    }

    return () => {
      video.pause();
      texture.dispose();
    };
  }, [isStatic, video, texture]);

  return texture;
}

type KinectPointsProps = {
  isStatic: boolean;
};

export function KinectPoints({ isStatic }: KinectPointsProps) {
  const texture = useKinectVideoTexture("/assets/video.mp4", isStatic);
  const geometry = useConst(createPointCloudGeometry);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useConst(() => ({
    ...THREE.UniformsUtils.clone(kinectShader.uniforms),
    map: { value: texture },
  }));

  const { nearClipping, farClipping, pointSize, zOffset } = useControls(
    "kinect",
    {
      nearClipping: { value: 350, min: 1, max: 10000, step: 1 },
      farClipping: { value: 1280, min: 1, max: 10000, step: 1 },
      pointSize: { value: 2, min: 1, max: 10, step: 1 },
      zOffset: { value: 1000, min: 0, max: 4000, step: 1 },
    },
  );

  useFrame(() => {
    if (!materialRef.current) return;
    const uniforms = materialRef.current.uniforms;
    uniforms.nearClipping.value = nearClipping;
    uniforms.farClipping.value = farClipping;
    uniforms.pointSize.value = pointSize;
    uniforms.zOffset.value = zOffset;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={kinectShader.vertexShader}
        fragmentShader={kinectShader.fragmentShader}
        blending={THREE.AdditiveBlending}
        depthTest={true}
        depthWrite={true}
        transparent={true}
      />
    </points>
  );
}
