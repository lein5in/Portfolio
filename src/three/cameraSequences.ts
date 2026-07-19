import * as THREE from 'three';
import { gsap } from 'gsap';
import { collectFadeTargets } from './fade';
import { heroFraming, anchoredFraming } from './framing';
import type { Body } from './sceneSetup';
import type { SectionId } from './sections';
import type { SunHandle } from './sun';

interface CameraSequenceDeps {
  camera: THREE.PerspectiveCamera;
  lookAtTarget: THREE.Vector3;
  bodies: Body[];
  orbitLines: { line: THREE.Line; isHero: boolean }[];
  sun: SunHandle;
  stars: THREE.Points;
  heroLight: THREE.DirectionalLight;
  heroLightTarget: THREE.Object3D;
  heroRim: THREE.DirectionalLight;
  heroRimTarget: THREE.Object3D;
  setMood: (id: SectionId) => void;
  reducedMotionRef: { current: boolean };
  onEnterZoomComplete: () => void;
}

export interface CameraSequences {
  zoomToHero: () => void;
  transitionToPortfolio: () => void;
  flyToSection: (id: SectionId) => void;
}

export function createCameraSequences(deps: CameraSequenceDeps): CameraSequences {
  const {
    camera, lookAtTarget, bodies, orbitLines, sun, stars,
    heroLight, heroLightTarget, heroRim, heroRimTarget,
    setMood, reducedMotionRef, onEnterZoomComplete,
  } = deps;

  let heroId: SectionId = 'hero';
  let activeTimeline: ReturnType<typeof gsap.timeline> | null = null;

  const dur = (seconds: number) => (reducedMotionRef.current ? Math.min(0.12, seconds * 0.06) : seconds);

  const positionHeroLights = (pos: THREE.Vector3) => {
    heroLight.position.copy(pos.clone().add(new THREE.Vector3(5, 2.5, 4)));
    heroLightTarget.position.copy(pos);
    heroRim.position.copy(pos.clone().add(new THREE.Vector3(-5, -1, -3)));
    heroRimTarget.position.copy(pos);
  };

  const dimGroup = (group: THREE.Group, bodyTarget: number, glowTarget: number, duration: number) => {
    for (const t of collectFadeTargets(group)) {
      const target = t.key === 'value' ? glowTarget : bodyTarget;
      gsap.to(t.obj, { [t.key]: target, duration, ease: 'power2.out' });
    }
  };

  const zoomToHero = () => {
    const body = bodies.find(b => b.isEarth)!;
    body.frozen = true;
    const pos = body.group.position.clone();
    const { camPos, lookAt } = heroFraming(pos, body.def);
    positionHeroLights(pos);
    setMood('hero');

    const tl = gsap.timeline({ onComplete: onEnterZoomComplete });
    activeTimeline = tl;

    tl.to(camera.position, { x: camPos.x, y: camPos.y, z: camPos.z, duration: dur(2.6), ease: 'power3.inOut' }, 0);
    tl.to(lookAtTarget, { x: lookAt.x, y: lookAt.y, z: lookAt.z, duration: dur(2.6), ease: 'power3.inOut' }, 0);
    tl.to(heroLight, { intensity: 2.1, duration: dur(1.8), ease: 'power2.out' }, 0.5);
    tl.to(heroRim, { intensity: 0.28, duration: dur(1.8), ease: 'power2.out' }, 0.5);

    for (const b of bodies) {
      if (b.isEarth) continue;
      for (const t of collectFadeTargets(b.group)) tl.to(t.obj, { [t.key]: 0, duration: dur(1.3), ease: 'power2.in' }, 0.15);
    }
    for (const { line } of orbitLines) tl.to(line.material as THREE.LineBasicMaterial, { opacity: 0, duration: dur(1.0) }, 0.05);
    tl.to(sun.material.uniforms.uOpacity, { value: 0, duration: dur(1.1) }, 0.1);
    tl.to(stars.material as THREE.PointsMaterial, { opacity: 0.2, duration: dur(1.6) }, 0.1);
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
    }
    for (const { line, isHero } of orbitLines) {
      if (isHero) continue;
      tl.to(line.material as THREE.LineBasicMaterial, { opacity: 0.05, duration: dur(1.4) }, 0);
    }
    tl.to(stars.material as THREE.PointsMaterial, { opacity: 0.75, duration: dur(1.4) }, 0);
  };

  const flyToSection = (id: SectionId) => {
    if (id === heroId) return;
    const oldBody = bodies.find(b => b.def.id === heroId)!;
    const newBody = bodies.find(b => b.def.id === id)!;
    oldBody.frozen = false;
    newBody.frozen = true;
    heroId = id;
    setMood(id);

    activeTimeline?.kill();
    const newPos = newBody.group.position.clone();
    const { camPos, lookAt } = anchoredFraming(newPos, newBody.def);
    positionHeroLights(newPos);

    const tl = gsap.timeline();
    activeTimeline = tl;

    tl.to(camera.position, { x: camPos.x, y: camPos.y, z: camPos.z, duration: dur(1.75), ease: 'expo.inOut' }, 0);
    tl.to(lookAtTarget, { x: lookAt.x, y: lookAt.y, z: lookAt.z, duration: dur(1.75), ease: 'expo.inOut' }, 0);
    dimGroup(oldBody.group, 0.5, 0.15, dur(1.0));
    for (const t of collectFadeTargets(newBody.group)) {
      gsap.to(t.obj, { [t.key]: t.key === 'value' ? 0.3 : 1, duration: dur(1.0), ease: 'power2.out' });
    }
  };

  return { zoomToHero, transitionToPortfolio, flyToSection };
}