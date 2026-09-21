// v1
uniform sampler2D tDiffuse;
uniform float amplitude;
uniform float seed;
uniform float steps;

varying vec2 vUv;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float discreteNoise(float x) {
  float step = floor(x * steps);
  return hash(step + seed);
}

void main() {
  vec2 uv = vUv;

  float noise = discreteNoise(uv.y) * amplitude;
  uv.x = clamp(uv.x, noise, 1.0 - noise);

  gl_FragColor = texture2D(tDiffuse, uv);
}
