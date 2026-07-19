import * as THREE from 'three';
import { createEarth } from './createEarth';
import { createSun, type SunHandle } from './sun';
import { createCometSystem, type CometSystemHandle } from './comets';
import { PLANETS, EARTH_DEF, createProceduralPlanet, orbitPosition, buildOrbitRing, type PlanetDef } from './planets';
import { SECTION_LIGHTS } from './sectionLights';
import { BLOOM_SCENE } from './postprocessing';

export interface Body {
  def: PlanetDef;
  group: THREE.Group;
  angle: number;
  speed: number;
  frozen: boolean;
  isEarth: boolean;
  update: () => void;
}

export interface SceneContent {
  ambient: THREE.AmbientLight;
  fillLight: THREE.PointLight;
  heroLight: THREE.DirectionalLight;
  heroLightTarget: THREE.Object3D;
  heroRim: THREE.DirectionalLight;
  heroRimTarget: THREE.Object3D;
  sun: SunHandle;
  stars: THREE.Points;
  bigStars: THREE.Points;
  comets: CometSystemHandle;
  bodies: Body[];
  orbitLines: { line: THREE.Line; isHero: boolean }[];
  nonBloomMeshes: THREE.Mesh[];
}

function buildNebulaSprite(scene: THREE.Scene, color: string, x: number, y: number, z: number, scale: number, opacity: number) {
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 512;
  const cx = cv.getContext('2d')!;
  const g = cx.createRadialGradient(256, 256, 0, 256, 256, 256);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  cx.fillStyle = g;
  cx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(cv);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });
  const sprite = new THREE.Sprite(mat);
  sprite.position.set(x, y, z);
  sprite.scale.set(scale, scale, 1);
  scene.add(sprite);
}

export function buildScene(scene: THREE.Scene, isSmallScreen: boolean): SceneContent {
  const ambient = new THREE.AmbientLight(SECTION_LIGHTS.hero.ambientColor, SECTION_LIGHTS.hero.ambientIntensity);
  scene.add(ambient);

  const fillLight = new THREE.PointLight(0xfff2d9, 2.2, 0, 0.3);
  scene.add(fillLight);

  const heroLight = new THREE.DirectionalLight(SECTION_LIGHTS.hero.color, 0);
  const heroLightTarget = new THREE.Object3D();
  scene.add(heroLightTarget);
  heroLight.target = heroLightTarget;
  scene.add(heroLight);

  const heroRim = new THREE.DirectionalLight(0x2255aa, 0);
  const heroRimTarget = new THREE.Object3D();
  scene.add(heroRimTarget);
  heroRim.target = heroRimTarget;
  scene.add(heroRim);

  const sun = createSun(1.25);
  sun.mesh.layers.enable(BLOOM_SCENE);
  scene.add(sun.mesh);

  const starCount = isSmallScreen ? 2000 : 4600;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 160;
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.75 }));
  scene.add(stars);

  const bigStarCount = isSmallScreen ? 60 : 140;
  const bigStarPos = new Float32Array(bigStarCount * 3);
  for (let i = 0; i < bigStarPos.length; i++) bigStarPos[i] = (Math.random() - 0.5) * 140;
  const bigStarGeo = new THREE.BufferGeometry();
  bigStarGeo.setAttribute('position', new THREE.BufferAttribute(bigStarPos, 3));
  const bigStars = new THREE.Points(bigStarGeo, new THREE.PointsMaterial({ color: 0xdbe8ff, size: 0.16, transparent: true, opacity: 0.55, sizeAttenuation: true }));
  scene.add(bigStars);

  if (!isSmallScreen) {
    buildNebulaSprite(scene, 'rgba(90,70,160,0.5)', -55, 22, -90, 130, 0.35);
    buildNebulaSprite(scene, 'rgba(40,90,160,0.45)', 60, -18, -110, 150, 0.3);
    buildNebulaSprite(scene, 'rgba(160,90,60,0.35)', -30, -30, -70, 90, 0.22);
  }

  const comets = createCometSystem(isSmallScreen ? 1 : 2);
  scene.add(comets.group);

  const segments = isSmallScreen ? { earth: 48, planet: 24 } : { earth: 96, planet: 48 };
  const textureSize = isSmallScreen ? { w: 320, h: 160 } : { w: 640, h: 320 };

  const bodies: Body[] = [];
  const orbitLines: { line: THREE.Line; isHero: boolean }[] = [];
  const nonBloomMeshes: THREE.Mesh[] = [];

  const earthHandle = createEarth(EARTH_DEF.size, { segments: segments.earth });
  scene.add(earthHandle.group);
  nonBloomMeshes.push(earthHandle.earth, earthHandle.clouds, earthHandle.nightMesh);
  bodies.push({
    def: EARTH_DEF,
    group: earthHandle.group,
    angle: EARTH_DEF.startAngle,
    speed: EARTH_DEF.orbitSpeed,
    frozen: false,
    isEarth: true,
    update: earthHandle.update,
  });

  for (const def of PLANETS) {
    if (def.id === 'hero') continue;
    const p = createProceduralPlanet(def, undefined, { segments: segments.planet, textureSize });
    scene.add(p.group);
    p.group.traverse(obj => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) nonBloomMeshes.push(mesh);
    });
    bodies.push({
      def,
      group: p.group,
      angle: def.startAngle,
      speed: def.orbitSpeed,
      frozen: false,
      isEarth: false,
      update: p.update,
    });
  }

  for (const def of PLANETS) {
    const ring = buildOrbitRing(def);
    scene.add(ring);
    orbitLines.push({ line: ring, isHero: def.id === 'hero' });
  }

  return {
    ambient,
    fillLight,
    heroLight,
    heroLightTarget,
    heroRim,
    heroRimTarget,
    sun,
    stars,
    bigStars,
    comets,
    bodies,
    orbitLines,
    nonBloomMeshes,
  };
}

export function stepOrbits(bodies: Body[], reducedMotion: boolean) {
  for (const b of bodies) {
    if (!b.frozen && !reducedMotion) {
      b.angle += b.speed;
      b.group.position.copy(orbitPosition(b.def, b.angle));
    }
    b.update();
  }
}