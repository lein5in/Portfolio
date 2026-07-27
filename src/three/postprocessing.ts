import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export interface PostFX {
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  render: () => void;
  setSize: (w: number, h: number) => void;
  dispose: () => void;
}

export function createPostFX(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number,
): PostFX {
  const composer = new EffectComposer(renderer);
  composer.setSize(width, height);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.32, 0.28, 0.94);
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  const render = () => composer.render();
  const setSize = (w: number, h: number) => composer.setSize(w, h);
  const dispose = () => {
    renderPass.dispose();
    bloomPass.dispose();
    outputPass.dispose();
  };

  return { composer, bloomPass, render, setSize, dispose };
}