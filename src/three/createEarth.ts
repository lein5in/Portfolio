import * as THREE from 'three';

// ─── TEXTURES ─────────────────────────────────────────────────────────────────

function buildCloudTexture(): THREE.CanvasTexture {
  const w = 2048, h = 1024;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const cx = cv.getContext('2d')!;
  cx.clearRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 14 + Math.random() * 52;
    const g = cx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${0.16 + Math.random() * 0.24})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    cx.beginPath();
    cx.arc(x, y, r, 0, Math.PI * 2);
    cx.fillStyle = g;
    cx.fill();
  }
  return new THREE.CanvasTexture(cv);
}

// ─── FACTORY ──────────────────────────────────────────────────────────────────

export interface EarthHandle {
  group:     THREE.Group;
  earth:     THREE.Mesh;
  clouds:    THREE.Mesh;
  nightMesh: THREE.Mesh;
  /** Advance rotation by one frame. */
  update: () => void;
}

/**
 * Builds a photorealistic Earth (blue marble + specular water + procedural
 * clouds + night city lights), scaled to `radius`. Shared by the solar
 * system entry scene and the portfolio's anchored globe. No atmosphere/rim
 * glow — that shell was removed everywhere per design direction.
 */
export function createEarth(radius = 1): EarthHandle {
  const group = new THREE.Group();

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';

  // Surface
  const earthMat = new THREE.MeshPhongMaterial({ specular: new THREE.Color(0x1a3355), shininess: 22, transparent: true, opacity: 1 });
  loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', tex => { earthMat.map = tex; earthMat.needsUpdate = true; });
  loader.load('https://unpkg.com/three-globe/example/img/earth-water.png',       tex => { earthMat.specularMap = tex; earthMat.needsUpdate = true; });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 96), earthMat);
  earth.rotation.x = 0.12;
  group.add(earth);

  // Clouds — thinner, wispier layer
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.012, 96, 96),
    new THREE.MeshPhongMaterial({ map: buildCloudTexture(), transparent: true, opacity: 0.24, depthWrite: false })
  );
  clouds.rotation.x = 0.12;
  group.add(clouds);

  // Night lights
  const nightMat = new THREE.MeshPhongMaterial({
    color: 0x000000, emissive: new THREE.Color(0xffcc66), emissiveIntensity: 0,
    transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  loader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg', tex => {
    nightMat.emissiveMap = tex; nightMat.emissiveIntensity = 0.8; nightMat.opacity = 0.6; nightMat.needsUpdate = true;
  });
  const nightMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.001, 96, 96), nightMat);
  nightMesh.rotation.x = 0.12;
  group.add(nightMesh);

  const update = () => {
    earth.rotation.y    += 0.0007;
    clouds.rotation.y   += 0.0010;
    nightMesh.rotation.y = earth.rotation.y;
  };

  return { group, earth, clouds, nightMesh, update };
}