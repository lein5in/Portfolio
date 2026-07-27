import * as THREE from 'three';
import { gsap } from 'gsap';

export interface FadeTarget {
  obj: Record<string, number>;
  key: string;
}



export function collectFadeTargets(root: THREE.Object3D): FadeTarget[] {
  const targets: FadeTarget[] = [];
  root.traverse(obj => {
    const mesh = obj as THREE.Mesh;
    const raw  = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (!raw) return;
    const mats = Array.isArray(raw) ? raw : [raw];
    for (const mat of mats) {
      const shaderMat = mat as THREE.ShaderMaterial;
      if (shaderMat.uniforms && shaderMat.uniforms.uOpacity) {
        targets.push({ obj: shaderMat.uniforms.uOpacity as unknown as Record<string, number>, key: 'value' });
      } else if ('opacity' in mat) {
        targets.push({ obj: mat as unknown as Record<string, number>, key: 'opacity' });
      }
    }
  });
  return targets;
}

export function setOpacity(targets: FadeTarget[], value: number) {
  for (const t of targets) t.obj[t.key] = value;
}

export function tweenOpacity(targets: FadeTarget[], value: number, duration = 0.9, ease = 'power2.inOut') {
  for (const t of targets) {
    gsap.to(t.obj, { [t.key]: value, duration, ease });
  }
}