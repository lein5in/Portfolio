import * as THREE from 'three';
import { EARTH_DEF, type PlanetDef } from './planets';

const REF_SIZE = EARTH_DEF.size;
const HERO_K = 2.25;
const ANCHORED_K = 3.3;

export const heroDistance = (def: PlanetDef) => HERO_K * def.size;
export const anchoredDistance = (def: PlanetDef) => ANCHORED_K * def.size;

export function heroFraming(pos: THREE.Vector3, def: PlanetDef) {
  const dist = heroDistance(def);
  const scale = def.size / REF_SIZE;
  return {
    camPos: pos.clone().add(new THREE.Vector3(0.4 * scale, 0.2 * scale, dist)),
    lookAt: pos.clone(),
  };
}

export function anchoredFraming(pos: THREE.Vector3, def: PlanetDef) {
  const dist = anchoredDistance(def);
  const scale = def.size / REF_SIZE;
  return {
    camPos: pos.clone().add(new THREE.Vector3(0.25 * scale, 0.12 * scale, dist)),
    lookAt: pos.clone().add(new THREE.Vector3(-dist * 0.4, 0, 0)),
  };
}