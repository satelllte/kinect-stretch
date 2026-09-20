// v1
uniform sampler2D tDiffuse;
uniform float stretchX;
uniform float yMin;
uniform float yMax;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  if (uv.y >= yMin && uv.y <= yMax) {
    uv.x = min(uv.x, stretchX);
  }

  gl_FragColor = texture2D(tDiffuse, uv);
}

// v2
// uniform sampler2D tDiffuse;

// uniform float stretchX;
// uniform float yMin;
// uniform float yMax;

// varying vec2 vUv;

// // ------------------------------------------------------------
// // Random helpers
// // ------------------------------------------------------------

// float random(float n) {
//     return fract(sin(n * 43758.5453123) * 143758.5453123);
// }

// float random2(vec2 p) {
//     return fract(
//         sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123
//     );
// }

// void main() {

//     vec2 uv = vUv;

//     if (uv.y >= yMin && uv.y <= yMax) {

//         // Normalize the active region
//         float regionHeight = max(yMax - yMin, 0.0001);
//         float localY = (uv.y - yMin) / regionHeight;

//         // Create several horizontal glitch bands
//         float bands = 12.0;
//         float bandId = floor(localY * bands);

//         float bandRandom = random(bandId + floor(yMin * 100.0));

//         // Random band height / edge breakup
//         float bandNoise = random2(vec2(bandId, floor(uv.y * 80.0)));

//         // Some bands don't glitch at all
//         if (bandRandom > 0.15) {

//             // Random strength for this band
//             float strength = mix(0.05, 1.0, random(bandId * 7.31));

//             // Random direction:
//             // -1 = left
//             // +1 = right
//             float direction = random(bandId * 19.73) < 0.5
//                 ? -1.0
//                 : 1.0;

//             // ------------------------------------------------
//             // Main stretch
//             // ------------------------------------------------

//             float amount = stretchX * strength * direction;

//             if (direction > 0.0) {
//                 // Stretch toward the right
//                 uv.x = mix(uv.x, stretchX, strength);
//             } else {
//                 // Stretch toward the left
//                 uv.x = mix(uv.x, 1.0 - stretchX, strength);
//             }

//             // ------------------------------------------------
//             // Horizontal tearing
//             // ------------------------------------------------

//             float tear = random(bandId * 31.17);

//             if (tear > 0.35) {
//                 float tearAmount = mix(
//                     -0.12,
//                      0.12,
//                     random(bandId * 13.91)
//                 );

//                 uv.x += tearAmount * strength;
//             }

//             // ------------------------------------------------
//             // Small random displacement
//             // ------------------------------------------------

//             float displacement = (
//                 random2(vec2(
//                     floor(uv.y * 120.0),
//                     bandId
//                 )) - 0.5
//             );

//             uv.x += displacement * 0.08 * strength;

//             // ------------------------------------------------
//             // Pixel-ish horizontal slicing
//             // ------------------------------------------------

//             float slice = floor(uv.y * 100.0);

//             if (random(slice + bandId * 4.0) > 0.82) {

//                 float sliceOffset =
//                     (random(slice * 3.71) - 0.5) *
//                     0.18 *
//                     strength;

//                 uv.x += sliceOffset;
//             }

//             // ------------------------------------------------
//             // Occasional inversion / mirror glitch
//             // ------------------------------------------------

//             if (random(bandId * 41.13) > 0.92) {
//                 uv.x = 1.0 - uv.x;
//             }

//             // ------------------------------------------------
//             // Clamp to texture
//             // ------------------------------------------------

//             uv.x = clamp(uv.x, 0.0, 1.0);
//         }
//     }

//     gl_FragColor = texture2D(tDiffuse, uv);
// }
