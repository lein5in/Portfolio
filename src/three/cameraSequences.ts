import * as THREE from 'three';
import { gsap } from 'gsap';
import { collectFadeTargets } from './fade';
import { heroFraming, anchoredFraming, planetFraming } from './framing';
import type { Body } from './sceneSetup';
import type { SectionId } from './sections';
import type { SunHandle } from './sun';
import type { StarfieldHandle } from './starfield';

interface CameraSequenceDeps {
  camera: THREE.PerspectiveCamera;
  lookAtTarget: THREE.Vector3;
  bodies: Body[];
  orbitLines: { line: THREE.Line; isHero: boolean }[];
  sun: SunHandle;
  starfield: StarfieldHandle;
  systemFillLight: THREE.PointLight;
  heroLight: THREE.DirectionalLight;
  heroLightTarget: THREE.Object3D;
  heroRim: THREE.DirectionalLight;
  heroRimTarget: THREE.Object3D;
  reducedMotionRef: { current: boolean };
  onEnterZoomComplete: () => void;
}

export interface CameraSequences {
  zoomToHero: () => void;
  transitionToPortfolio: () => void;
  flyToSection: (id: SectionId) => void;
  snapToPortfolio: () => void;
  dispose: () => void;
}

const EARTH_LIGHT_OFFSET = new THREE.Vector3(4.2, 1.1, -4.2);
const EARTH_RIM_OFFSET = new THREE.Vector3(-3.0, -0.8, 3.0);
const PLANET_LIGHT_OFFSET = new THREE.Vector3(5.0, 1.0, -1.2);
const PLANET_RIM_OFFSET = new THREE.Vector3(-4.0, -0.8, 1.5);

const PLANET_EMISSIVE_BACKGROUND = 0.18;
const PLANET_EMISSIVE_HERO = 0.02;

export function createCameraSequences(deps: CameraSequenceDeps): CameraSequences {
  const {
    camera, lookAtTarget, bodies, orbitLines, sun, starfield, systemFillLight,
    heroLight, heroLightTarget, heroRim, heroRimTarget,
    reducedMotionRef, onEnterZoomComplete,
  } = deps;

  let heroId: SectionId = 'hero';
  let activeTimeline: ReturnType<typeof gsap.timeline> | null = null;
  const sunOpacityProxy = { v: 1 };

  const dur = (seconds: number) => (reducedMotionRef.current ? Math.min(0.12, seconds * 0.06) : seconds);

  const positionHeroLights = (pos: THREE.Vector3, isEarth: boolean) => {
    const lightOffset = isEarth ? EARTH_LIGHT_OFFSET : PLANET_LIGHT_OFFSET;
    const rimOffset = isEarth ? EARTH_RIM_OFFSET : PLANET_RIM_OFFSET;
    heroLight.position.copy(pos.clone().add(lightOffset));
    heroLightTarget.position.copy(pos);
    heroRim.position.copy(pos.clone().add(rimOffset));
    heroRimTarget.position.copy(pos);
  };

  const dimGroup = (group: THREE.Group, bodyTarget: number, glowTarget: number, duration: number) => {
    for (const t of collectFadeTargets(group)) {
      const target = t.key === 'value' ? glowTarget : bodyTarget;
      gsap.to(t.obj, { [t.key]: target, duration, ease: 'power2.out' });
    }
  };

  const setPlanetEmissive = (body: Body, target: number, duration: number, instant = false) => {
    if (body.isEarth) return;
    const mat = body.mesh.material as THREE.MeshStandardMaterial;
    if (instant) { mat.emissiveIntensity = target; return; }
    gsap.to(mat, { emissiveIntensity: target, duration, ease: 'power2.out' });
  };

  const zoomToHero = () => {
    const body = bodies.find(b => b.isEarth)!;
    body.frozen = true;
    const pos = body.group.position.clone();
    const { camPos, lookAt } = heroFraming(pos, body.def);
    positionHeroLights(pos, true);

    const tl = gsap.timeline({ onComplete: onEnterZoomComplete });
    activeTimeline = tl;

    tl.to(camera.position, { x: camPos.x, y: camPos.y, z: camPos.z, duration: dur(2.6), ease: 'power3.inOut' }, 0);
    tl.to(lookAtTarget, { x: lookAt.x, y: lookAt.y, z: lookAt.z, duration: dur(2.6), ease: 'power3.inOut' }, 0);
    tl.to(heroLight, { intensity: 1.9, duration: dur(1.8), ease: 'power2.out' }, 0.5);
    tl.to(heroRim, { intensity: 0, duration: dur(1.8), ease: 'power2.out' }, 0.5);

    for (const b of bodies) {
      if (b.isEarth) continue;
      for (const t of collectFadeTargets(b.group)) tl.to(t.obj, { [t.key]: 0, duration: dur(1.3), ease: 'power2.in' }, 0.15);
    }
    for (const { line } of orbitLines) tl.to(line.material as THREE.LineBasicMaterial, { opacity: 0, duration: dur(1.0) }, 0.05);
    tl.to(systemFillLight, { intensity: 0, duration: dur(1.3), ease: 'power2.in' }, 0.15);

    sunOpacityProxy.v = 1;
    tl.to(sunOpacityProxy, {
      v: 0,
      duration: dur(1.1),
      onUpdate: () => sun.setOpacity(sunOpacityProxy.v),
      onComplete: () => { sun.mesh.visible = false; },
    }, 0.1);

    tl.to(starfield.material, { opacity: 0.2, duration: dur(1.6) }, 0.1);
  };

  const transitionToPortfolio = () => {
    const body = bodies.find(b => b.isEarth)!;
    const pos = body.group.position.clone();
    const { camPos, lookAt } = anchoredFraming(pos, body.def);

    const tl = gsap.timeline();
    activeTimeline = tl;

    tl.to(camera.position, { x: camPos.x, y: camPos.y, z: camPos.z, duration: dur(1.7), ease: 'power2.inOut' }, 0);
    tl.to(lookAtTarget, { x: lookAt.x, y: lookAt.y, z: lookAt.z, duration: dur(1.7), ease: 'power2.inOut' }, 0);

    for (const b of bodies) {
      if (b.isEarth) continue;
      b.frozen = false;
      dimGroup(b.group, 0.5, 0.15, dur(1.4));
      setPlanetEmissive(b, PLANET_EMISSIVE_BACKGROUND, dur(1.4));
    }
    for (const { line } of orbitLines) {
      tl.to(line.material as THREE.LineBasicMaterial, { opacity: 0, duration: dur(1.4) }, 0);
    }
    tl.to(starfield.material, { opacity: 0.75, duration: dur(1.4) }, 0);
  };

  const flyToSection = (id: SectionId) => {
    if (id === heroId) return;
    const oldBody = bodies.find(b => b.def.id === heroId)!;
    const newBody = bodies.find(b => b.def.id === id)!;
    oldBody.frozen = false;
    newBody.frozen = true;
    heroId = id;

    activeTimeline?.kill();
    const newPos = newBody.group.position.clone();
    const framingFn = newBody.isEarth ? anchoredFraming : planetFraming;
    const { camPos, lookAt } = framingFn(newPos, newBody.def);

    const lightOffset = newBody.isEarth ? EARTH_LIGHT_OFFSET : PLANET_LIGHT_OFFSET;
    const rimOffset = newBody.isEarth ? EARTH_RIM_OFFSET : PLANET_RIM_OFFSET;
    const targetLightPos = newPos.clone().add(lightOffset);
    const targetRimPos = newPos.clone().add(rimOffset);

    const tl = gsap.timeline();
    activeTimeline = tl;
    const flyDuration = dur(1.75);

    tl.to(camera.position, { x: camPos.x, y: camPos.y, z: camPos.z, duration: flyDuration, ease: 'expo.inOut' }, 0);
    tl.to(lookAtTarget, { x: lookAt.x, y: lookAt.y, z: lookAt.z, duration: flyDuration, ease: 'expo.inOut' }, 0);

    tl.to(heroLight.position, { x: targetLightPos.x, y: targetLightPos.y, z: targetLightPos.z, duration: flyDuration, ease: 'expo.inOut' }, 0);
    tl.to(heroLightTarget.position, { x: newPos.x, y: newPos.y, z: newPos.z, duration: flyDuration, ease: 'expo.inOut' }, 0);
    tl.to(heroRim.position, { x: targetRimPos.x, y: targetRimPos.y, z: targetRimPos.z, duration: flyDuration, ease: 'expo.inOut' }, 0);
    tl.to(heroRimTarget.position, { x: newPos.x, y: newPos.y, z: newPos.z, duration: flyDuration, ease: 'expo.inOut' }, 0);

    dimGroup(oldBody.group, 0.5, 0.15, dur(1.0));
    setPlanetEmissive(oldBody, PLANET_EMISSIVE_BACKGROUND, dur(1.0));
    setPlanetEmissive(newBody, PLANET_EMISSIVE_HERO, dur(1.0));
    for (const t of collectFadeTargets(newBody.group)) {
      gsap.to(t.obj, { [t.key]: t.key === 'value' ? 0.3 : 1, duration: dur(1.0), ease: 'power2.out' });
    }
  };

  const snapToPortfolio = () => {
    activeTimeline?.kill();
    const body = bodies.find(b => b.isEarth)!;
    body.frozen = true;
    const pos = body.group.position.clone();
    const { camPos, lookAt } = anchoredFraming(pos, body.def);

    camera.position.set(camPos.x, camPos.y, camPos.z);
    lookAtTarget.set(lookAt.x, lookAt.y, lookAt.z);
    positionHeroLights(pos, true);
    heroLight.intensity = 1.9;
    heroRim.intensity = 0;

    for (const b of bodies) {
      if (b.isEarth) continue;
      b.frozen = false;
      for (const t of collectFadeTargets(b.group)) {
        t.obj[t.key] = t.key === 'value' ? 0.15 : 0.5;
      }
      setPlanetEmissive(b, PLANET_EMISSIVE_BACKGROUND, 0, true);
    }
    for (const { line } of orbitLines) {
      (line.material as THREE.LineBasicMaterial).opacity = 0;
    }
    sunOpacityProxy.v = 0;
    sun.setOpacity(0);
    sun.mesh.visible = false;
    starfield.material.opacity = 0.75;
    systemFillLight.intensity = 0;
  };

  const dispose = () => {
    activeTimeline?.kill();
  };

  return { zoomToHero, transitionToPortfolio, flyToSection, snapToPortfolio, dispose };
}