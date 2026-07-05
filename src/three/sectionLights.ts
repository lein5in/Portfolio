import * as THREE from 'three';
import type { SectionId } from './sections';

export const SECTION_LIGHTS: Record<SectionId, {
  color:            THREE.Color;
  intensity:        number;
  ambientColor:     THREE.Color;
  ambientIntensity: number;
}> = {
  hero:       { color: new THREE.Color(0xfff5e0), intensity: 2.0,  ambientColor: new THREE.Color(0x0a1628), ambientIntensity: 1.1  },
  about:      { color: new THREE.Color(0xffaa00), intensity: 2.4,  ambientColor: new THREE.Color(0x1a0e00), ambientIntensity: 1.2  },
  projects:   { color: new THREE.Color(0x4488ff), intensity: 2.2,  ambientColor: new THREE.Color(0x000d2a), ambientIntensity: 1.22 },
  skills:     { color: new THREE.Color(0x00ffcc), intensity: 2.0,  ambientColor: new THREE.Color(0x001a14), ambientIntensity: 1.18 },
  experience: { color: new THREE.Color(0xff5500), intensity: 2.5,  ambientColor: new THREE.Color(0x1a0800), ambientIntensity: 1.22 },
  contact:    { color: new THREE.Color(0xff2288), intensity: 2.3,  ambientColor: new THREE.Color(0x1a0010), ambientIntensity: 1.2  },
};