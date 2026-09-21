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
