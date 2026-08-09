import * as THREE from 'three';

export const textureLoadingManager = new THREE.LoadingManager();

export interface LoadProgress {
  loaded: number;
  total: number;
}

type ProgressListener = (p: LoadProgress) => void;
const listeners = new Set<ProgressListener>();

textureLoadingManager.onProgress = (_url, loaded, total) => {
  for (const l of listeners) l({ loaded, total });
};

export function onTextureLoadProgress(cb: ProgressListener): () => void {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export async function loadTextureAsync(url: string): Promise<THREE.Texture> {
  const loader = new THREE.TextureLoader(textureLoadingManager);
  loader.crossOrigin = 'anonymous';
  const texture = await loader.loadAsync(url);
  const image = texture.image as HTMLImageElement | undefined;
  if (image && typeof image.decode === 'function') {
    try {
      await image.decode();
    } catch {
      try {
        await new Promise<void>((resolve, reject) => {
          if (image.complete && image.naturalWidth > 0) { resolve(); return; }
          image.addEventListener('load', () => resolve(), { once: true });
          image.addEventListener('error', () => reject(new Error('image load error')), { once: true });
        });
      } catch {
        
      }
    }
  }
  return texture;
}