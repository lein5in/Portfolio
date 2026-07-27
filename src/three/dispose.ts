import * as THREE from 'three';


export function disposeObject3D(root: THREE.Object3D) {
  root.traverse(child => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();

    const raw = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (!raw) return;
    const materials = Array.isArray(raw) ? raw : [raw];
    for (const mat of materials) disposeMaterial(mat);
  });
}

function disposeMaterial(mat: THREE.Material) {
  const anyMat = mat as unknown as Record<string, unknown>;

  
  for (const key of Object.keys(anyMat)) {
    const value = anyMat[key];
    if (value && (value as THREE.Texture).isTexture) {
      (value as THREE.Texture).dispose();
    }
  }

  
  const uniforms = (mat as THREE.ShaderMaterial).uniforms;
  if (uniforms) {
    for (const key of Object.keys(uniforms)) {
      const value = uniforms[key]?.value;
      if (value && (value as THREE.Texture).isTexture) {
        (value as THREE.Texture).dispose();
      }
    }
  }

  mat.dispose();
}