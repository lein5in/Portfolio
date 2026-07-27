import * as THREE from 'three';
import type { SectionId } from './sections';
import { atmosphereVert, atmosphereFrag } from './shaders';
import { loadTextureAsync } from './textureLoad';

export interface AtmosphereDef {
  day: number;
  dawn: number;
  night: number;
  opacity: number;
}

export interface PlanetDef {
  id: SectionId;
  name: string;
  orbitRadius: number;
  orbitSpeed: number;
  startAngle: number;
  inclination: number;
  size: number;
  texture?: string;
  ring?: string;
  atmosphere?: AtmosphereDef;
  zoomFactor?: number;
  framingRadius?: number;
  materialRoughness?: number;
  materialMetalness?: number;
  axialTilt?: number;
  sphereScale?: number;
}

export const PLANETS: PlanetDef[] = [
  {
    id: 'hero', name: 'Earth',
    orbitRadius: 3.2, orbitSpeed: 0.00046, startAngle: 0.4, inclination: 0.05,
    size: 0.80,
    zoomFactor: 1.0,
  },
  {
    id: 'about', name: 'Mars',
    orbitRadius: 4.6, orbitSpeed: 0.00035, startAngle: 2.1, inclination: 0.11,
    size: 0.62,
    texture: '/textures/planets/8k_mars.jpg',
    atmosphere: { day: 0xd98a5f, dawn: 0xffcba0, night: 0x140a06, opacity: 0.06 },
    materialRoughness: 0.97,
    zoomFactor: 0.85,
  },
  {
    id: 'projects', name: 'Jupiter',
    orbitRadius: 6.0, orbitSpeed: 0.00027, startAngle: 4.0, inclination: -0.08,
    size: 0.74,
    texture: '/textures/planets/8k_jupiter.jpg',
    atmosphere: { day: 0xe8d9b0, dawn: 0xfff3d9, night: 0x1a140a, opacity: 0.09 },
    materialRoughness: 0.78,
    zoomFactor: 0.85,
  },
  {
    id: 'skills', name: 'Saturn',
    orbitRadius: 7.4, orbitSpeed: 0.00021, startAngle: 0.9, inclination: 0.14,
    size: 0.68,
    texture: '/textures/planets/8k_saturn.jpg',
    ring: '/textures/planets/8k_saturn_ring_alpha.png',
    atmosphere: { day: 0xf5e8c0, dawn: 0xfff6da, night: 0x1a160a, opacity: 0.08 },
    materialRoughness: 0.8,
    zoomFactor: 1.0,
    framingRadius: 1.3,
    axialTilt: 0.32,
    sphereScale: 1.15,
  },
  {
    id: 'experience', name: 'Venus',
    orbitRadius: 8.8, orbitSpeed: 0.00017, startAngle: 5.2, inclination: -0.05,
    size: 0.78,
    texture: '/textures/planets/8k_venus_surface.jpg',
    atmosphere: { day: 0xf2c869, dawn: 0xffe0a0, night: 0x1a1206, opacity: 0.14 },
    materialRoughness: 0.85,
    zoomFactor: 0.9,
  },
  {
    id: 'contact', name: 'Moon',
    orbitRadius: 10.2, orbitSpeed: 0.00014, startAngle: 3.3, inclination: 0.08,
    size: 0.5,
    texture: '/textures/planets/8k_moon.jpg',
    materialRoughness: 0.98,
    zoomFactor: 0.8,
  },
];

export const EARTH_DEF = PLANETS[0];

export function orbitPosition(def: PlanetDef, angle: number): THREE.Vector3 {
  const x = Math.cos(angle) * def.orbitRadius;
  const z = Math.sin(angle) * def.orbitRadius;
  const y = Math.sin(angle * 0.7) * def.orbitRadius * Math.sin(def.inclination);
  return new THREE.Vector3(x, y, z);
}

export function buildOrbitRing(def: PlanetDef): THREE.Line {
  const segments = 128;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    points.push(orbitPosition(def, (i / segments) * Math.PI * 2));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: 0x5a7bb8, transparent: true, opacity: 0.05 });
  return new THREE.Line(geo, mat);
}

function remapRingUV(geometry: THREE.RingGeometry, innerRadius: number, outerRadius: number) {
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const uv = geometry.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const radius = Math.sqrt(x * x + y * y);
    const u = THREE.MathUtils.clamp((radius - innerRadius) / (outerRadius - innerRadius), 0, 1);
    uv.setXY(i, u, 0.5);
  }
  uv.needsUpdate = true;
}

export interface PlanetMeshOptions {
  segments?: number;
}

export interface PlanetHandle {
  group: THREE.Group;
  mesh: THREE.Mesh;
  update: () => void;
  ready: Promise<void>;
}

export function createPlanet(
  def: PlanetDef,
  radiusOverride?: number,
  options: PlanetMeshOptions = {},
): PlanetHandle {
  const group = new THREE.Group();
  const r = radiusOverride ?? def.size;
  const segments = options.segments ?? 48;

  const mat = new THREE.MeshStandardMaterial({
    roughness: def.materialRoughness ?? 0.92,
    metalness: def.materialMetalness ?? 0.0,
    transparent: true,
    opacity: 1,
    envMapIntensity: 0.08,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.18,
  });

  const readyPromises: Promise<unknown>[] = [];

  if (def.texture) {
    readyPromises.push(
      loadTextureAsync(def.texture)
        .then(tex => {
          tex.anisotropy = 8;
          mat.map = tex;
          mat.emissiveMap = tex;
          mat.needsUpdate = true;
        })
        .catch(err => console.warn(`[planets] failed to load texture: ${def.texture}`, err))
    );
  } else {
    console.warn(`[planets] "${def.name}" has no texture defined.`);
  }

  const sphereR = r * (def.sphereScale ?? 1);
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(sphereR, segments, segments), mat);
  const axialTilt = def.axialTilt ?? (0.15 + Math.random() * 0.12);
  mesh.rotation.x = axialTilt;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.layers.enable(5);
  mesh.renderOrder = 0;
  group.add(mesh);

  if (def.ring) {
    const innerR = sphereR * 1.25;
    const outerR = sphereR * 2.2;
    const ringGeo = new THREE.RingGeometry(innerR, outerR, 256, 32);
    remapRingUV(ringGeo, innerR, outerR);

    const ringMat = new THREE.MeshBasicMaterial({
      transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
      alphaTest: 0.04,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + axialTilt;
    ring.castShadow = true;
    ring.receiveShadow = true;
    ring.layers.enable(5);
    ring.renderOrder = 1;
    group.add(ring);

    readyPromises.push(
      loadTextureAsync(def.ring)
        .then(tex => {
          tex.anisotropy = 16;
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          ringMat.map = tex;
          ringMat.alphaMap = tex;
          ringMat.opacity = 0.65;
          ringMat.needsUpdate = true;
        })
        .catch(err => console.warn(`[planets] failed to load ring texture: ${def.ring}`, err))
    );
  }

  if (def.atmosphere) {
    const { day, dawn, night, opacity } = def.atmosphere;
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVert,
      fragmentShader: atmosphereFrag,
      uniforms: {
        uSunPosition: { value: new THREE.Vector3(0, 0, 0) },
        uDayColor: { value: new THREE.Color(day) },
        uDawnColor: { value: new THREE.Color(dawn) },
        uNightColor: { value: new THREE.Color(night) },
        uOpacity: { value: opacity },
        uPower: { value: 6.0 },
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(sphereR * 1.016, segments, segments), atmoMat);
    atmo.castShadow = false;
    atmo.receiveShadow = false;
    group.add(atmo);
  }

  const spinSpeed = 0.0009 + Math.random() * 0.0006;
  const update = () => { mesh.rotation.y += spinSpeed; };

  const ready = Promise.all(readyPromises).then(() => {});

  return { group, mesh, update, ready };
}