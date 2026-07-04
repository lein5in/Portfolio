// ─── SHARED SHADERS ────────────────────────────────────────────────────────────
// Rim-light / atmosphere glow shader, reused by Earth and every procedural
// planet so every body in the system shares the same "atmosphere" language.

export const rimVert = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const rimFrag = /* glsl */ `
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uPower;
  void main() {
    float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float intensity = pow(rim, uPower) * uOpacity;
    gl_FragColor = vec4(uColor, intensity);
  }
`;