import * as THREE from 'three';

// ─── PLASMA SUN SHADER ──────────────────────────────────────────────────────
// Real-time animated turbulence (value-noise fbm) — the surface actually
// churns like plasma, rather than a static painted texture.

const sunVert = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFrag = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vPos;
  varying vec3 vNormal;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float vnoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p *= 2.05;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = normalize(vPos) * 3.2;
    float t = uTime * 0.08;
    float n = fbm(p + vec3(t, -t * 0.7, t * 0.4));
    n += 0.4 * fbm(p * 2.4 + vec3(-t * 1.3, t * 0.9, t));

    vec3 coolC = vec3(0.85, 0.24, 0.02);
    vec3 midC  = vec3(1.0, 0.56, 0.12);
    vec3 hotC  = vec3(1.0, 0.85, 0.5);

    vec3 col = mix(coolC, midC, smoothstep(0.25, 0.65, n));
    col = mix(col, hotC, smoothstep(0.62, 0.95, n));

    float rim = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    col += hotC * pow(rim, 3.0) * 0.25;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

export interface SunHandle {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  update: (elapsedSeconds: number) => void;
}

export function createSun(radius = 1.25): SunHandle {
  const material = new THREE.ShaderMaterial({
    vertexShader:   sunVert,
    fragmentShader: sunFrag,
    uniforms: {
      uTime:    { value: 0 },
      uOpacity: { value: 1 },
    },
    transparent: true,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 64), material);
  const update = (elapsedSeconds: number) => { material.uniforms.uTime.value = elapsedSeconds; };
  return { mesh, material, update };
}