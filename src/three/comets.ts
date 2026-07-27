import * as THREE from 'three';



const TRAIL_POINTS = 22;
const TRAIL_SPACING = 0.6;

function buildHeadTexture(): THREE.CanvasTexture {
  const s = 128;
  const cv = document.createElement('canvas');
  cv.width = s; cv.height = s;
  const cx = cv.getContext('2d')!;
  const g = cx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0,    'rgba(255,255,255,1)');
  g.addColorStop(0.28, 'rgba(210,228,255,0.85)');
  g.addColorStop(1,    'rgba(210,228,255,0)');
  cx.fillStyle = g;
  cx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(cv);
}

interface Comet {
  group:    THREE.Group;
  line:     THREE.Line;
  head:     THREE.Sprite;
  start:    THREE.Vector3;
  end:      THREE.Vector3;
  dir:      THREE.Vector3;
  duration: number;
  elapsed:  number;
  active:   boolean;
}

function createComet(headTexture: THREE.CanvasTexture): Comet {
  const positions = new Float32Array(TRAIL_POINTS * 3);
  const colors    = new Float32Array(TRAIL_POINTS * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const line = new THREE.Line(geo, lineMat);

  const headMat = new THREE.SpriteMaterial({
    map: headTexture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0,
  });
  const head = new THREE.Sprite(headMat);
  head.scale.set(0.6, 0.6, 1);

  const group = new THREE.Group();
  group.add(line, head);

  return {
    group, line, head,
    start: new THREE.Vector3(), end: new THREE.Vector3(), dir: new THREE.Vector3(),
    duration: 1, elapsed: 0, active: false,
  };
}

function launch(c: Comet) {
  const radius = 55 + Math.random() * 30;
  const angle  = Math.random() * Math.PI * 2;
  const height = (Math.random() - 0.5) * 45;
  c.start.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);

 
  const through = new THREE.Vector3(
    (Math.random() - 0.5) * 26,
    (Math.random() - 0.5) * 18,
    (Math.random() - 0.5) * 26
  );
  c.dir.copy(through).sub(c.start).normalize();
  c.end.copy(c.start).addScaledVector(c.dir, radius * 2 + 50);

  c.duration = 2.4 + Math.random() * 2.4;
  c.elapsed  = 0;
  c.active   = true;
}

export interface CometSystemHandle {
  group:  THREE.Group;
  update: (dt: number) => void;
}


 
export function createCometSystem(
  maxConcurrent = 2,
  minGap = 9,
  maxGap = 22,
): CometSystemHandle {
  const group = new THREE.Group();
  const headTexture = buildHeadTexture();
  const comets: Comet[] = [];
  for (let i = 0; i < maxConcurrent; i++) {
    const c = createComet(headTexture);
    group.add(c.group);
    comets.push(c);
  }

  const tailColor = new THREE.Color(0xbfd9ff);
  let clock = 0;
  let nextSpawn = 3 + Math.random() * 5; 

  const tmpHead = new THREE.Vector3();
  const tmpPoint = new THREE.Vector3();

  const update = (dt: number) => {
    clock += dt;

    if (clock >= nextSpawn) {
      const idle = comets.find(c => !c.active);
      if (idle) launch(idle);
      nextSpawn = clock + minGap + Math.random() * (maxGap - minGap);
    }

    for (const c of comets) {
      if (!c.active) continue;
      c.elapsed += dt;
      const t = c.elapsed / c.duration;
      if (t >= 1) {
        c.active = false;
        (c.head.material as THREE.SpriteMaterial).opacity = 0;
        continue;
      }

      tmpHead.copy(c.start).lerp(c.end, t);

      
      const fadeIn  = Math.min(1, t / 0.06);
      const fadeOut = Math.min(1, (1 - t) / 0.22);
      const envelope = Math.min(fadeIn, fadeOut);

      c.head.position.copy(tmpHead);
      (c.head.material as THREE.SpriteMaterial).opacity = envelope * 0.95;

      const posAttr = c.line.geometry.getAttribute('position') as THREE.BufferAttribute;
      const colAttr = c.line.geometry.getAttribute('color') as THREE.BufferAttribute;
      for (let i = 0; i < TRAIL_POINTS; i++) {
        tmpPoint.copy(tmpHead).addScaledVector(c.dir, -i * TRAIL_SPACING);
        posAttr.setXYZ(i, tmpPoint.x, tmpPoint.y, tmpPoint.z);
        const fade = (1 - i / TRAIL_POINTS) * envelope;
        colAttr.setXYZ(i, tailColor.r * fade, tailColor.g * fade, tailColor.b * fade);
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  };

  return { group, update };
}