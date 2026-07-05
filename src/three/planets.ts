import * as THREE from 'three';
import type { SectionId } from './sections';

// ─── DATA ─────────────────────────────────────────────────────────────────────

export interface PlanetDef {
  id:          SectionId;
  name:        string;
  baseColor:   number;
  accentColor: number;
  highlight:   number;
  glowColor:   number; // rim glow + orbit ring tint (matches SECTION_LIGHTS)
  orbitRadius: number;
  orbitSpeed:  number; // radians per frame
  startAngle:  number; // radians
  inclination: number; // orbital plane tilt, radians
  size:        number;
  hasRing?:    boolean;
  /** Surface style used by buildPlanetTexture. Defaults to 'banded'. */
  terrain?:    'cratered' | 'banded' | 'turbulent' | 'volcanic' | 'marbled';
}

export const PLANETS: PlanetDef[] = [
  { id: 'hero',       name: 'Earth',  baseColor: 0x2a5fa8, accentColor: 0x16305c, highlight: 0x8fc7ff, glowColor: 0x2673f2, orbitRadius: 3.2, orbitSpeed: 0.00046, startAngle: 0.4, inclination: 0.05,  size: 0.80 },
  { id: 'about',      name: 'Ochra',  baseColor: 0xd9a441, accentColor: 0x8a5a1c, highlight: 0xffe9b8, glowColor: 0xffaa00, orbitRadius: 4.6, orbitSpeed: 0.00035, startAngle: 2.1, inclination: 0.11,  size: 0.62, terrain: 'cratered' },
  { id: 'projects',   name: 'Nyra',   baseColor: 0x3568c9, accentColor: 0x14275c, highlight: 0x8fc7ff, glowColor: 0x4488ff, orbitRadius: 6.0, orbitSpeed: 0.00027, startAngle: 4.0, inclination: -0.08, size: 0.74, hasRing: true, terrain: 'banded' },
  { id: 'skills',     name: 'Vex',    baseColor: 0x1fae93, accentColor: 0x0b4d40, highlight: 0x7ff5de, glowColor: 0x00ffcc, orbitRadius: 7.4, orbitSpeed: 0.00021, startAngle: 0.9, inclination: 0.14,  size: 0.68, hasRing: true, terrain: 'turbulent' },
  { id: 'experience', name: 'Kryol',  baseColor: 0xc9491f, accentColor: 0x64220a, highlight: 0xffb37a, glowColor: 0xff5500, orbitRadius: 8.8, orbitSpeed: 0.00017, startAngle: 5.2, inclination: -0.05, size: 0.82, terrain: 'volcanic' },
  { id: 'contact',    name: 'Selo',   baseColor: 0xc23a86, accentColor: 0x531a3f, highlight: 0xff9fd0, glowColor: 0xff2288, orbitRadius: 10.2, orbitSpeed: 0.00014, startAngle: 3.3, inclination: 0.08,  size: 0.58, terrain: 'marbled' },
];

export const EARTH_DEF = PLANETS[0];

// ─── ORBIT MATH ───────────────────────────────────────────────────────────────

export function orbitPosition(def: PlanetDef, angle: number): THREE.Vector3 {
  const x = Math.cos(angle) * def.orbitRadius;
  const z = Math.sin(angle) * def.orbitRadius;
  const y = Math.sin(angle * 0.7) * def.orbitRadius * Math.sin(def.inclination);
  return new THREE.Vector3(x, y, z);
}

export function buildOrbitRing(def: PlanetDef): THREE.Line {
  const segments = 128;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    points.push(orbitPosition(def, (i / segments) * Math.PI * 2));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  // No additive blending — that's what made these read as "glowing" and
  // heavy. Plain, thin, low-opacity lines instead.
  const mat = new THREE.LineBasicMaterial({ color: 0x5a7bb8, transparent: true, opacity: 0.05 });
  return new THREE.Line(geo, mat);
}

// ─── COHERENT 3D NOISE (baked to a canvas texture) ─────────────────────────────
// A real value-noise fbm sampled directly on the sphere's surface direction
// (not 2D UV space), so it's seamless with no pole/seam artifacts — genuine
// continent-like patterning instead of scattered random blobs.

function hash3(x: number, y: number, z: number): number {
  const p = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return p - Math.floor(p);
}

function noise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const h = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return lerp(
    lerp(lerp(h(0,0,0), h(1,0,0), u), lerp(h(0,1,0), h(1,1,0), u), v),
    lerp(lerp(h(0,0,1), h(1,0,1), u), lerp(h(0,1,1), h(1,1,1), u), v),
    w
  );
}

function fbm3(x: number, y: number, z: number, octaves = 4): number {
  let v = 0, a = 0.5;
  for (let i = 0; i < octaves; i++) {
    v += a * noise3(x, y, z);
    x *= 2.02; y *= 2.02; z *= 2.02;
    a *= 0.5;
  }
  return v;
}

// Deterministic per-planet RNG (same planet always paints the same craters/
// storms — no reshuffling on re-render) — seeded off orbitRadius since every
// PlanetDef has a distinct one.
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hexc(c: number): string {
  return `#${new THREE.Color(c).getHexString()}`;
}

/** Impact craters — dark rim, faint accent-lit far wall. `molten` swaps the
 *  rim glow for the planet's highlight color, like a cooling lava rim. */
function paintCraters(cx: CanvasRenderingContext2D, w: number, h: number, def: PlanetDef, molten: boolean) {
  const rand   = seededRandom(def.orbitRadius * 1000 + 7);
  const count  = molten ? 24 : 34;
  const glow   = hexc(def.highlight);
  const accent = hexc(def.accentColor);

  for (let i = 0; i < count; i++) {
    const px = rand() * w;
    const py = h * 0.12 + rand() * h * 0.76; // stay clear of the pole seam
    const r  = 6 + rand() * (molten ? 26 : 20);

    for (const dx of [-w, 0, w]) {
      const cxp = px + dx;
      if (cxp < -r || cxp > w + r) continue;

      const rim = cx.createRadialGradient(cxp, py, r * 0.15, cxp, py, r);
      if (molten) {
        rim.addColorStop(0,    'rgba(0,0,0,0.55)');
        rim.addColorStop(0.6,  'rgba(0,0,0,0.28)');
        rim.addColorStop(0.82, glow + 'aa');
        rim.addColorStop(1,    'rgba(0,0,0,0)');
      } else {
        rim.addColorStop(0,    'rgba(0,0,0,0.42)');
        rim.addColorStop(0.65, 'rgba(0,0,0,0.18)');
        rim.addColorStop(0.8,  accent + '55');
        rim.addColorStop(1,    'rgba(0,0,0,0)');
      }
      cx.fillStyle = rim;
      cx.beginPath();
      cx.arc(cxp, py, r, 0, Math.PI * 2);
      cx.fill();
    }
  }
}

/** Glowing fracture lines across a volcanic surface. */
function paintCracks(cx: CanvasRenderingContext2D, w: number, h: number, def: PlanetDef) {
  const rand = seededRandom(def.orbitRadius * 500 + 3);
  const glow = hexc(def.highlight);

  for (let i = 0; i < 9; i++) {
    let x = rand() * w;
    let y = h * 0.15 + rand() * h * 0.7;
    const segs = 5 + Math.floor(rand() * 5);

    cx.strokeStyle  = glow;
    cx.lineWidth    = 1 + rand() * 1.4;
    cx.globalAlpha  = 0.55;
    cx.shadowColor  = glow;
    cx.shadowBlur   = 6;
    cx.beginPath();
    cx.moveTo(x, y);
    for (let s = 0; s < segs; s++) {
      x += (rand() - 0.5) * 34;
      y += (rand() - 0.5) * 18;
      cx.lineTo(x, y);
    }
    cx.stroke();
  }
  cx.shadowBlur  = 0;
  cx.globalAlpha = 1;
}

/** Soft blurred storm ellipses — Jupiter-spot style accents for gas bodies. */
function paintStormSpots(cx: CanvasRenderingContext2D, w: number, h: number, def: PlanetDef, count: number) {
  const rand = seededRandom(def.orbitRadius * 250 + 11);
  const glow = hexc(def.highlight);

  for (let i = 0; i < count; i++) {
    const px = rand() * w;
    const py = h * 0.2 + rand() * h * 0.6;
    const rx = 26 + rand() * 40;
    const ry = rx * (0.5 + rand() * 0.3);

    for (const dx of [-w, 0, w]) {
      const cxp = px + dx;
      if (cxp < -rx || cxp > w + rx) continue;
      cx.save();
      cx.translate(cxp, py);
      cx.scale(1, ry / rx);
      cx.translate(-cxp, -py);
      const g = cx.createRadialGradient(cxp, py, 0, cxp, py, rx);
      g.addColorStop(0, glow + '66');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g;
      cx.beginPath();
      cx.arc(cxp, py, rx, 0, Math.PI * 2);
      cx.fill();
      cx.restore();
    }
  }
}

/**
 * Builds each planet's surface from real 3D fbm noise sampled directly on
 * the sphere (seamless, no UV pole/seam artifacts), layered with a second
 * high-frequency pass for grain so nothing reads flat or blurred, then
 * finished with a `terrain`-specific pass: latitude bands + domain-warp for
 * gas bodies, or canvas-drawn craters / lava cracks / storm spots for rocky
 * and volcanic ones. Fully procedural — zero network dependency.
 */
function buildPlanetTexture(def: PlanetDef): THREE.CanvasTexture {
  const w = 640, h = 320;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const cx = cv.getContext('2d')!;
  const img = cx.createImageData(w, h);

  const base      = new THREE.Color(def.baseColor);
  const accent    = new THREE.Color(def.accentColor);
  const highlight = new THREE.Color(def.highlight);
  const terrain   = def.terrain ?? 'banded';
  const scale     = 2.6;

  const bandFreq   = terrain === 'turbulent' ? 7.5 : terrain === 'banded' ? 4.5 : 0;
  const warpAmount = terrain === 'turbulent' ? 2.2 : terrain === 'banded' ? 0.7 : terrain === 'marbled' ? 1.6 : 0;
  const bandWeight = terrain === 'turbulent' ? 0.55 : terrain === 'banded' ? 0.45 : terrain === 'marbled' ? 0.3 : 0;

  for (let py = 0; py < h; py++) {
    const lat = (py / h - 0.5) * Math.PI;
    for (let px = 0; px < w; px++) {
      const lon = (px / w) * Math.PI * 2;
      const x = Math.cos(lat) * Math.cos(lon) * scale;
      const y = Math.sin(lat) * scale;
      const z = Math.cos(lat) * Math.sin(lon) * scale;

      // Base terrain + a finer secondary pass layered on top
      let n = fbm3(x, y, z, 5);
      n += 0.25 * fbm3(x * 3.1 + 9, y * 3.1 + 9, z * 3.1 + 9, 3);

      // Latitude banding, warped through noise so it's never a clean stripe
      if (bandFreq > 0) {
        const warp = fbm3(x * 1.4, y * 1.4, z * 1.4, 4) - 0.5;
        const band = Math.sin(lat * bandFreq + warp * warpAmount) * 0.5 + 0.5;
        n = n * (1 - bandWeight) + band * bandWeight;
      }
      // Marbled bodies: fold a second, offset noise domain into the first
      if (terrain === 'marbled') {
        const swirl = fbm3(x * 0.6 - 4, y * 0.6 - 4, z * 0.6 - 4, 4);
        n += (swirl - 0.5) * 0.5;
      }
      n = Math.min(1, Math.max(0, n));

      // Fine grain — subtle per-pixel brightness jitter, kills the "smooth
      // gradient blob" look the old single-octave version had.
      const grain    = fbm3(x * 11 + 31, y * 11 + 31, z * 11 + 31, 2);
      const grainMul = 0.92 + grain * 0.16;

      let r: number, g: number, b: number;
      if (n < 0.4) {
        const t = n / 0.4;
        r = accent.r + (base.r - accent.r) * t;
        g = accent.g + (base.g - accent.g) * t;
        b = accent.b + (base.b - accent.b) * t;
      } else if (n < 0.72) {
        const t = (n - 0.4) / 0.32;
        r = base.r + (highlight.r - base.r) * t * 0.55;
        g = base.g + (highlight.g - base.g) * t * 0.55;
        b = base.b + (highlight.b - base.b) * t * 0.55;
      } else {
        const t = Math.min(1, (n - 0.72) / 0.28);
        r = base.r * (1 - t) + highlight.r * t;
        g = base.g * (1 - t) + highlight.g * t;
        b = base.b * (1 - t) + highlight.b * t;
      }
      r *= grainMul; g *= grainMul; b *= grainMul;

      const i = (py * w + px) * 4;
      img.data[i]     = Math.min(255, r * 255);
      img.data[i + 1] = Math.min(255, g * 255);
      img.data[i + 2] = Math.min(255, b * 255);
      img.data[i + 3] = 255;
    }
  }
  cx.putImageData(img, 0, 0);

  // Detail pass — layered on top with real canvas drawing, seam-aware
  if (terrain === 'cratered' || terrain === 'volcanic') {
    paintCraters(cx, w, h, def, terrain === 'volcanic');
  }
  if (terrain === 'volcanic') {
    paintCracks(cx, w, h, def);
  }
  if (terrain === 'marbled' || terrain === 'turbulent') {
    paintStormSpots(cx, w, h, def, terrain === 'turbulent' ? 3 : 2);
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

// ─── PLANET FACTORY ─────────────────────────────────────────────────────────

export interface ProceduralPlanetHandle {
  group: THREE.Group;
  mesh:  THREE.Mesh;
  update: () => void;
}

export function createProceduralPlanet(def: PlanetDef, radiusOverride?: number): ProceduralPlanetHandle {
  const group = new THREE.Group();
  const r = radiusOverride ?? def.size;

  const mat = new THREE.MeshPhongMaterial({
    map:         buildPlanetTexture(def),
    specular:    new THREE.Color(0x2a2a2a),
    shininess:   10,
    transparent: true,
    opacity:     1,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 48), mat);
  mesh.rotation.x = 0.15 + Math.random() * 0.12;
  group.add(mesh);

  if (def.hasRing) {
    const ringGeo = new THREE.RingGeometry(r * 1.55, r * 2.15, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: def.glowColor, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    group.add(ring);
  }

  const spinSpeed = 0.0009 + Math.random() * 0.0006;
  const update = () => { mesh.rotation.y += spinSpeed; };

  return { group, mesh, update };
}