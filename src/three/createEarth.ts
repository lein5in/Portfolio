import * as THREE from 'three';

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

function loadTextureSafe(
  loader: THREE.TextureLoader,
  url: string,
  onLoad: (tex: THREE.Texture) => void,
) {
  loader.load(
    url,
    onLoad,
    undefined,
    () => {
      console.warn(`[createEarth] failed to load texture: ${url}`);
    }
  );
}

export interface EarthOptions {
  segments?: number;
}

export interface EarthHandle {
  group: THREE.Group;
  earth: THREE.Mesh;
  clouds: THREE.Mesh;
  nightMesh: THREE.Mesh;
  update: () => void;
}

export function createEarth(radius = 1, options: EarthOptions = {}): EarthHandle {
  const segments = options.segments ?? 96;
  const group = new THREE.Group();

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';

  const earthMat = new THREE.MeshStandardMaterial({
    color: 0x2a5fa8,
    roughness: 0.6,
    metalness: 0.05,
    transparent: true,
    opacity: 1,
  });
  loadTextureSafe(loader, '/textures/earth-blue-marble.jpg', tex => {
    earthMat.map = tex;
    earthMat.color.set(0xffffff);
    earthMat.needsUpdate = true;
  });
  loadTextureSafe(loader, '/textures/earth-water.png', tex => {
    earthMat.roughnessMap = tex;
    earthMat.needsUpdate = true;
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), earthMat);
  earth.rotation.x = 0.12;
  group.add(earth);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.012, segments, segments),
    new THREE.MeshStandardMaterial({
      map: buildCloudTexture(),
      roughness: 1,
      metalness: 0,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  clouds.rotation.x = 0.12;
  group.add(clouds);

  const nightMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: new THREE.Color(0xffcc66),
    emissiveIntensity: 0,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  loadTextureSafe(loader, '/textures/earth-night.jpg', tex => {
    nightMat.emissiveMap = tex;
    nightMat.emissiveIntensity = 0.8;
    nightMat.opacity = 0.6;
    nightMat.needsUpdate = true;
  });
  const nightMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.001, segments, segments), nightMat);
  nightMesh.rotation.x = 0.12;
  group.add(nightMesh);

  const update = () => {
    earth.rotation.y += 0.0007;
    clouds.rotation.y += 0.0010;
    nightMesh.rotation.y = earth.rotation.y;
  };

  return { group, earth, clouds, nightMesh, update };
}