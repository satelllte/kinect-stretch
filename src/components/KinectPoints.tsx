import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;

const kinectVertexShader = /* glsl */ `
  uniform sampler2D map;
  uniform float width;
  uniform float height;
  uniform float nearClipping, farClipping;
  uniform float pointSize;
  uniform float zOffset;

  varying vec2 vUv;

  const float XtoZ = 1.11146;
  const float YtoZ = 0.83359;
  const float brightnessThreshold = 0.8;

  void main() {
    vUv = vec2(position.x / width, position.y / height);

    vec4 color = texture2D(map, vUv);
    float brightness = (color.r + color.g + color.b) / 3.0;
    if (brightness > brightnessThreshold) {
      // put this point outside the clipping range
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      return;
    }

    float z = (1.0 - brightness) * (farClipping - nearClipping) + nearClipping;

    vec4 pos = vec4(
      (position.x / width - 0.5) * z * XtoZ,
      (position.y / height - 0.5) * z * YtoZ,
      -z + zOffset,
      1.0
    );

    gl_PointSize = pointSize;
    gl_Position = projectionMatrix * modelViewMatrix * pos;
  }
`;

const kinectFragmentShader = /* glsl */ `
  uniform sampler2D map;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(map, vUv);
    gl_FragColor = vec4(color.r, color.g, color.b, 0.2);
  }
`;

function useKinectVideoTexture(src: string) {
  const video = useMemo(() => {
    const v = document.createElement("video");
    v.loop = true;
    v.muted = true;
    v.crossOrigin = "anonymous";
    v.playsInline = true;
    v.src = src;
    return v;
  }, [src]);

  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(video);
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    return t;
  }, [video]);

  useEffect(() => {
    video.playbackRate = 0.5;
    video.play();

    return () => {
      video.pause();
      texture.dispose();
    };
  }, [video, texture]);

  return texture;
}

function usePointCloudGeometry() {
  return useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(VIDEO_WIDTH * VIDEO_HEIGHT * 3);

    for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
      vertices[i] = j % VIDEO_WIDTH;
      vertices[i + 1] = Math.floor(j / VIDEO_WIDTH);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    return geometry;
  }, []);
}

export function KinectPoints() {
  const texture = useKinectVideoTexture("/assets/video.mp4");
  const geometry = usePointCloudGeometry();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { nearClipping, farClipping, pointSize, zOffset } = useControls(
    "kinect",
    {
      nearClipping: { value: 350, min: 1, max: 10000, step: 1 },
      farClipping: { value: 1280, min: 1, max: 10000, step: 1 },
      pointSize: { value: 2, min: 1, max: 10, step: 1 },
      zOffset: { value: 1000, min: 0, max: 4000, step: 1 },
    },
  );

  const uniforms = useMemo(
    () => ({
      map: { value: texture },
      width: { value: VIDEO_WIDTH },
      height: { value: VIDEO_HEIGHT },
      nearClipping: { value: nearClipping },
      farClipping: { value: farClipping },
      pointSize: { value: pointSize },
      zOffset: { value: zOffset },
    }),
    [texture, nearClipping, farClipping, pointSize, zOffset],
  );

  useFrame(() => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.nearClipping.value = nearClipping;
    u.farClipping.value = farClipping;
    u.pointSize.value = pointSize;
    u.zOffset.value = zOffset;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={kinectVertexShader}
        fragmentShader={kinectFragmentShader}
        blending={THREE.AdditiveBlending}
        depthTest={true}
        depthWrite={true}
        transparent={true}
      />
    </points>
  );
}
