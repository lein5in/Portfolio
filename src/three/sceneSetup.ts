import * as THREE from 'three';
import { createEarth } from './createEarth';
import { createSun, type SunHandle } from './sun';
import { createCometSystem, type CometSystemHandle } from './comets';
import { createStarfield, type StarfieldHandle } from './starfield';
import { PLANETS, EARTH_DEF, createPlanet, orbitPosition, buildOrbitRing, type PlanetDef } from './planets';
import { NEUTRAL_LIGHT } from './sectionLights';

export interface Body {
  def: PlanetDef;
  group: THREE.Group;
  mesh: THREE.Mesh;
  angle: number;
  speed: number;
  frozen: boolean;
  isEarth: boolean;
  update: () => void;
}

export interface SceneContent {
  ambient: THREE.AmbientLight;
  fillLight: THREE.PointLight;
  systemFillLight: THREE.PointLight;
  heroLight: THREE.DirectionalLight;
  heroLightTarget: THREE.Object3D;
  heroRim: THREE.DirectionalLight;
  heroRimTarget: THREE.Object3D;
  sun: SunHandle;
  starfield: StarfieldHandle;
  comets: CometSystemHandle;
  bodies: Body[];
  orbitLines: { line: THREE.Line; isHero: boolean }[];
  ready: Promise<void>;
  fullyReady: Promise<void>;
}

export function buildScene(scene: THREE.Scene, isSmallScreen: boolean): SceneContent {
  const ambient = new THREE.AmbientLight(NEUTRAL_LIGHT.ambientColor, NEUTRAL_LIGHT.ambientIntensity);
  scene.add(ambient);

  const fillLight = new THREE.PointLight(0xfff2d9, 2.2, 0, 0);
  fillLight.layers.set(5);
  scene.add(fillLight);

  const systemFillLight = new THREE.PointLight(0xfff2d9, 7.0, 0, 0);
  systemFillLight.layers.set(5);
  scene.add(systemFillLight);

  const heroLight = new THREE.DirectionalLight(NEUTRAL_LIGHT.color, 0);
  const heroLightTarget = new THREE.Object3D();
  scene.add(heroLightTarget);
  heroLight.target = heroLightTarget;

  heroLight.castShadow = true;
  const shadowRes = isSmallScreen ? 512 : 2048;
  heroLight.shadow.mapSize.set(shadowRes, shadowRes);
  heroLight.shadow.camera.near = 0.1;
  heroLight.shadow.camera.far = 20;
  heroLight.shadow.camera.left = -2;
  heroLight.shadow.camera.right = 2;
  heroLight.shadow.camera.top = 2;
  heroLight.shadow.camera.bottom = -2;
  heroLight.shadow.bias = -0.0015;
  heroLight.shadow.normalBias = 0.02;
  scene.add(heroLight);

  const heroRim = new THREE.DirectionalLight(0x2255aa, 0);
  const heroRimTarget = new THREE.Object3D();
  scene.add(heroRimTarget);
  heroRim.target = heroRimTarget;
  scene.add(heroRim);

  const sun = createSun(1.25);
  scene.add(sun.mesh);

  const bodies: Body[] = [];
  const orbitLines: { line: THREE.Line; isHero: boolean }[] = [];
  const criticalReady: Promise<unknown>[] = [];
  const backgroundReady: Promise<unknown>[] = [sun.ready];

  const starfield = createStarfield();
  scene.add(starfield.group);

  const comets = createCometSystem(isSmallScreen ? 1 : 2);
  scene.add(comets.group);

  const segments = isSmallScreen ? { earth: 48, planet: 24 } : { earth: 96, planet: 48 };

  const earthHandle = createEarth(EARTH_DEF.size, { segments: segments.earth });
  scene.add(earthHandle.group);
  criticalReady.push(earthHandle.dayReady);
  backgroundReady.push(earthHandle.ready);
  bodies.push({
    def: EARTH_DEF,
    group: earthHandle.group,
    mesh: earthHandle.earth,
    angle: EARTH_DEF.startAngle,
    speed: EARTH_DEF.orbitSpeed,
    frozen: false,
    isEarth: true,
    update: earthHandle.update,
  });

  for (const def of PLANETS) {
    if (def.id === 'hero') continue;
    const p = createPlanet(def, undefined, { segments: segments.planet });
    scene.add(p.group);
    backgroundReady.push(p.ready);
    bodies.push({
      def,
      group: p.group,
      mesh: p.mesh,
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

  const ready = Promise.all(criticalReady).then(() => {});
  const fullyReady = Promise.all([...criticalReady, ...backgroundReady]).then(() => {});

  return {
    ambient,
    fillLight,
    systemFillLight,
    heroLight,
    heroLightTarget,
    heroRim,
    heroRimTarget,
    sun,
    starfield,
    comets,
    bodies,
    orbitLines,
    ready,
    fullyReady,
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