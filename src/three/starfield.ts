import * as THREE from 'three';

function buildPointTexture(soft: boolean): THREE.CanvasTexture {
  const size = soft ? 64 : 16;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const cx = cv.getContext('2d')!;
  const g = cx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  if (soft) {
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.7)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
  } else {
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
  }
  cx.fillStyle = g;
  cx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(cv);
}

function buildNebulaTexture(): THREE.CanvasTexture {
  const size = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const cx = cv.getContext('2d')!;
  const g = cx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(130,150,215,0.3)');
  g.addColorStop(0.45, 'rgba(100,110,170,0.12)');
  g.addColorStop(1, 'rgba(70,80,140,0)');
  cx.fillStyle = g;
  cx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(cv);
}

function randomOnSphere(radius: number, out: THREE.Vector3) {
  const u = Math.random() * 2 - 1;
  const theta = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - u * u);
  out.set(radius * r * Math.cos(theta), radius * u, radius * r * Math.sin(theta));
}

function buildLayer(
  count: number,
  shellRadius: number,
  size: number,
  soft: boolean,
  brightnessRange: [number, number],
): THREE.Points {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const v = new THREE.Vector3();
  const c = new THREE.Color();
  const [lo, hi] = brightnessRange;

  for (let i = 0; i < count; i++) {
    randomOnSphere(shellRadius * (0.85 + Math.random() * 0.15), v);
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;

    const brightness = lo + Math.pow(Math.random(), 2.4) * (hi - lo);
    const tint = Math.random();
    if (tint < 0.06) c.setHSL(0.58, 0.4, brightness);
    else if (tint < 0.12) c.setHSL(0.1, 0.45, brightness);
    else c.setHSL(0, 0, brightness);

    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    map: buildPointTexture(soft),
    transparent: true,
    depthWrite: false,
    sizeAttenuation: false,
    vertexColors: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geo, material);
}

export interface StarfieldHandle {
  group: THREE.Group;
  points: THREE.Points;
  nebulae: THREE.Sprite[];
  material: { opacity: number };
}

export function createStarfield(starCount = 3400, shellRadius = 130): StarfieldHandle {
  const group = new THREE.Group();

  const dim = buildLayer(Math.round(starCount * 0.82), shellRadius, 1.1, false, [0.32, 0.58]);
  const bright = buildLayer(Math.round(starCount * 0.18), shellRadius, 2.3, true, [0.68, 1.0]);
  group.add(dim, bright);

  const nebulaTex = buildNebulaTexture();
  const nebulae: THREE.Sprite[] = [];
  for (let i = 0; i < 3; i++) {
    const mat = new THREE.SpriteMaterial({
      map: nebulaTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    const sprite = new THREE.Sprite(mat);
    const v = new THREE.Vector3();
    randomOnSphere(shellRadius * 0.9, v);
    sprite.position.copy(v);
    const scale = shellRadius * (0.35 + Math.random() * 0.25);
    sprite.scale.set(scale, scale, 1);
    nebulae.push(sprite);
    group.add(sprite);
  }

  const dimMat = dim.material as THREE.PointsMaterial;
  const brightMat = bright.material as THREE.PointsMaterial;

  const proxy = {
    get opacity() { return brightMat.opacity; },
    set opacity(v: number) {
      dimMat.opacity = v * 0.8;
      brightMat.opacity = v;
      for (const s of nebulae) (s.material as THREE.SpriteMaterial).opacity = v * 0.18;
    },
  };

  return { group, points: dim, nebulae, material: proxy };
}