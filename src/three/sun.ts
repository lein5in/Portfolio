import * as THREE from 'three';
import { loadTextureAsync } from './textureLoad';

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
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vPos;
  varying vec3 vNormal;

  #define PI 3.14159265359

  void main() {
    vec3 dir = normalize(vPos);
    float lon = atan(dir.z, dir.x) / (2.0 * PI) + 0.5;
    float lat = asin(clamp(dir.y, -1.0, 1.0)) / PI + 0.5;

    vec2 uv = vec2(lon + uTime * 0.004, lat);
    vec3 texColor = texture2D(uMap, uv).rgb;

    float facing = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float limbDarkening = mix(0.4, 1.0, pow(facing, 0.5));

    vec3 col = texColor * vec3(1.65, 1.3, 0.98) * limbDarkening;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

function createGlowTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0.0, 'rgba(255,248,228,0.9)');
  gradient.addColorStop(0.14, 'rgba(255,210,130,0.55)');
  gradient.addColorStop(0.32, 'rgba(255,150,70,0.2)');
  gradient.addColorStop(0.55, 'rgba(255,110,50,0.06)');
  gradient.addColorStop(1.0, 'rgba(255,90,40,0.0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export interface SunHandle {
  mesh: THREE.Object3D;
  material: THREE.ShaderMaterial;
  setOpacity: (v: number) => void;
  update: (elapsedSeconds: number) => void;
  ready: Promise<void>;
}

export function createSun(radius = 1.25): SunHandle {
  const texture = new THREE.Texture();

  const material = new THREE.ShaderMaterial({
    vertexShader: sunVert,
    fragmentShader: sunFrag,
    uniforms: {
      uMap: { value: texture },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
    },
    transparent: true,
  });

  const core = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 64), material);

  const glowMaterial = new THREE.SpriteMaterial({
    map: createGlowTexture(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: new THREE.Color(1.7, 1.15, 0.65),
  });
  const glow = new THREE.Sprite(glowMaterial);
  glow.scale.set(radius * 2.35, radius * 2.35, 1);

  const group = new THREE.Group();
  group.add(glow, core);

  const ready = loadTextureAsync('/textures/8k_sun.jpg')
    .then(tex => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      material.uniforms.uMap.value = tex;
    })
    .catch(err => {
      console.warn('[sun] failed to load /textures/8k_sun.jpg', err);
    });

  const setOpacity = (v: number) => {
    material.uniforms.uOpacity.value = v;
    glowMaterial.opacity = v;
  };

  const update = (elapsedSeconds: number) => {
    material.uniforms.uTime.value = elapsedSeconds;
  };

  return { mesh: group, material, setOpacity, update, ready };
}