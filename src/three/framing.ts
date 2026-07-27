import * as THREE from 'three';
import { EARTH_DEF, type PlanetDef } from './planets';

const REF_SIZE = EARTH_DEF.size;
const HERO_K = 1.9;
const ANCHORED_K = 2.9;
const PLANET_K = 2.5;

const zoomOf = (def: PlanetDef) => def.zoomFactor ?? 1;
const effectiveRadius = (def: PlanetDef) => def.framingRadius ?? def.size;

export const heroDistance = (def: PlanetDef) => HERO_K * def.size * zoomOf(def);
export const anchoredDistance = (def: PlanetDef) => ANCHORED_K * def.size * zoomOf(def);
export const planetDistance = (def: PlanetDef) => PLANET_K * effectiveRadius(def) * zoomOf(def);

export function heroFraming(pos: THREE.Vector3, def: PlanetDef) {
  const dist = heroDistance(def);
  const scale = (def.size / REF_SIZE) * zoomOf(def);
  return {
    camPos: pos.clone().add(new THREE.Vector3(0.4 * scale, 0.2 * scale, dist)),
    lookAt: pos.clone(),
  };
}

export function anchoredFraming(pos: THREE.Vector3, def: PlanetDef) {
  const dist = anchoredDistance(def);
  const scale = (def.size / REF_SIZE) * zoomOf(def);
  return {
    camPos: pos.clone().add(new THREE.Vector3(0.25 * scale, 0.12 * scale, dist)),
    lookAt: pos.clone().add(new THREE.Vector3(-dist * 0.4, 0, 0)),
  };
}

export function planetFraming(pos: THREE.Vector3, def: PlanetDef) {
  const dist = planetDistance(def);
  const scale = (def.size / REF_SIZE) * zoomOf(def);
  return {
    camPos: pos.clone().add(new THREE.Vector3(0.15 * scale, 0.08 * scale, dist)),
    lookAt: pos.clone().add(new THREE.Vector3(-dist * 0.22, dist * 0.03, 0)),
  };
}