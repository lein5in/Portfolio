import * as THREE from 'three';
import { atmosphereVert, atmosphereFrag } from './shaders';
import { loadTextureAsync } from './textureLoad';

function buildOceanRoughnessMap(source: TexImageSource): THREE.CanvasTexture {
  const W = 1024, H = 512;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const cx = cv.getContext('2d')!;
  cx.drawImage(source as CanvasImageSource, 0, 0, W, H);
  const imgData = cx.getImageData(0, 0, W, H);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const blueDominance = b - (r + g) * 0.5;
    const oceanLikelihood = Math.max(0, Math.min(1, blueDominance / 55));
    const roughness = Math.round(255 * (0.9 - oceanLikelihood * 0.55));
    d[i] = d[i + 1] = d[i + 2] = roughness;
  }
  cx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return tex;
}

export interface EarthOptions {
  segments?: number;
}

export interface EarthHandle {
  group: THREE.Group;
  earth: THREE.Mesh;
  clouds: THREE.Mesh;
  nightMesh: THREE.Mesh;
  atmosphere: THREE.Mesh;
  update: () => void;
  ready: Promise<void>;
}

export function createEarth(radius = 1, options: EarthOptions = {}): EarthHandle {
  const segments = options.segments ?? 96;
  const group = new THREE.Group();

  const earthMat = new THREE.MeshStandardMaterial({
    color:             0x2a5fa8,
    roughness:         0.7,
    metalness:         0.05,
    transparent:       true,
    opacity:           1,
    emissive:          new THREE.Color(0x16324f),
    emissiveIntensity: 0.35,
    envMapIntensity:   0.1,
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), earthMat);
  earth.rotation.x = 0.12;
  earth.castShadow = true;
  earth.receiveShadow = true;
  group.add(earth);

  const dayReady = loadTextureAsync('/textures/8k_earth_daymap.jpg')
    .then(tex => {
      earthMat.map = tex;
      earthMat.color.set(0xffffff);
      earthMat.emissiveMap = tex;
      try {
        const roughnessTex = buildOceanRoughnessMap(tex.image as HTMLImageElement);
        earthMat.roughnessMap = roughnessTex;
        earthMat.roughness = 1.0;
      } catch (err) {
        console.warn('[createEarth] roughness map generation failed, falling back to flat roughness', err);
        earthMat.roughness = 0.6;
      }
      earthMat.needsUpdate = true;
    })
    .catch(err => console.warn('[createEarth] failed to load 8k_earth_daymap.jpg', err));

  const cloudsMat = new THREE.MeshStandardMaterial({
    color:             0xffffff,
    roughness:         1,
    metalness:         0,
    transparent:       true,
    depthWrite:        false,
    opacity:           0.85,
    emissive:          new THREE.Color(0x1c3f63),
    emissiveIntensity: 0.4,
    envMapIntensity:   0.04,
  });
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.012, segments, segments),
    cloudsMat
  );
  clouds.rotation.x = 0.12;
  clouds.castShadow = true;
  clouds.receiveShadow = false;
  group.add(clouds);

  const cloudsReady = loadTextureAsync('/textures/8k_earth_clouds.jpg')
    .then(tex => {
      cloudsMat.alphaMap = tex;
      cloudsMat.emissiveMap = tex;
      cloudsMat.needsUpdate = true;
    })
    .catch(err => console.warn('[createEarth] failed to load 8k_earth_clouds.jpg', err));

  const nightMat = new THREE.MeshStandardMaterial({
    color:             0x000000,
    emissive:          new THREE.Color(0xffcc66),
    emissiveIntensity: 0,
    roughness:         1,
    metalness:         0,
    transparent:       true,
    opacity:           0,
    depthWrite:        false,
    blending:          THREE.AdditiveBlending,
    envMapIntensity:   0,
  });
  const nightMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.001, segments, segments), nightMat);
  nightMesh.rotation.x = 0.12;
  nightMesh.castShadow = false;
  nightMesh.receiveShadow = false;
  group.add(nightMesh);

  const nightReady = loadTextureAsync('/textures/8k_earth_nightmap.jpg')
    .then(tex => {
      nightMat.emissiveMap = tex;
      nightMat.emissiveIntensity = 0.5;
      nightMat.opacity = 0.4;
      nightMat.needsUpdate = true;
    })
    .catch(err => console.warn('[createEarth] failed to load 8k_earth_nightmap.jpg', err));

  const atmoMat = new THREE.ShaderMaterial({
    vertexShader:   atmosphereVert,
    fragmentShader: atmosphereFrag,
    uniforms: {
      uSunPosition: { value: new THREE.Vector3(0, 0, 0) },
      uDayColor:    { value: new THREE.Color(0x4a90ff) },
      uDawnColor:   { value: new THREE.Color(0xffb26b) },
      uNightColor:  { value: new THREE.Color(0x040a18) },
      uOpacity:     { value: 0.075 },
      uPower:       { value: 8.0 },
    },
    transparent: true,
    side:        THREE.BackSide,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.018, segments, segments), atmoMat);
  atmosphere.castShadow = false;
  atmosphere.receiveShadow = false;
  group.add(atmosphere);

  const update = () => {
    earth.rotation.y += 0.0007;
    clouds.rotation.y += 0.0010;
    nightMesh.rotation.y = earth.rotation.y;
  };

  const ready = Promise.all([dayReady, cloudsReady, nightReady]).then(() => {});

  return { group, earth, clouds, nightMesh, atmosphere, update, ready };
}