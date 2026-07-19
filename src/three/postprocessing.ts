import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export const BLOOM_SCENE = 1;

export interface BloomHandle {
  registerNonBloomMesh: (mesh: THREE.Mesh) => void;
  renderWithSelectiveBloom: () => void;
  setSize: (w: number, h: number) => void;
}

export function createSelectiveBloom(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number,
  resolutionScale: number,
): BloomHandle {
  const bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM_SCENE);

  const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const nonBloomMeshes: THREE.Mesh[] = [];
  const materialCache = new Map<string, THREE.Material | THREE.Material[]>();

  const renderScene = new RenderPass(scene, camera);
  const bloomRes = new THREE.Vector2(width * resolutionScale, height * resolutionScale);
  const bloomPass = new UnrealBloomPass(bloomRes, 0.75, 0.4, 0.4);
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  const mixPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: { baseTexture: { value: null }, bloomTexture: { value: bloomComposer.renderTarget2.texture } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `,
      fragmentShader: `
        uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv;
        void main(){ gl_FragColor = texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv); }
      `,
    }),
    'baseTexture'
  );
  mixPass.needsSwap = true;

  const finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(mixPass);
  finalComposer.addPass(new OutputPass());

  const registerNonBloomMesh = (mesh: THREE.Mesh) => {
    nonBloomMeshes.push(mesh);
  };

  const renderWithSelectiveBloom = () => {
    for (const mesh of nonBloomMeshes) {
      if (!bloomLayer.test(mesh.layers)) {
        materialCache.set(mesh.uuid, mesh.material);
        mesh.material = darkMaterial;
      }
    }
    bloomComposer.render();
    for (const mesh of nonBloomMeshes) {
      const cached = materialCache.get(mesh.uuid);
      if (cached) {
        mesh.material = cached;
        materialCache.delete(mesh.uuid);
      }
    }
    finalComposer.render();
  };

  const setSize = (w: number, h: number) => {
    bloomComposer.setSize(w, h);
    finalComposer.setSize(w, h);
  };

  return { registerNonBloomMesh, renderWithSelectiveBloom, setSize };
}