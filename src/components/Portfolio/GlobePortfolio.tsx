import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type SectionId = 'hero' | 'about' | 'projects' | 'skills' | 'experience' | 'contact';

export interface Badge {
  id:    SectionId;
  label: string;
  lat:   number;
  lon:   number;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const BADGES: Badge[] = [
  { id: 'hero',       label: 'HOME',    lat:  25,  lon:  20  },
  { id: 'about',      label: 'ABOUT',   lat:  48,  lon: -80  },
  { id: 'projects',   label: 'WORK',    lat:  10,  lon:  80  },
  { id: 'skills',     label: 'SKILLS',  lat: -20,  lon:  40  },
  { id: 'experience', label: 'EXP',     lat:  35,  lon: 140  },
  { id: 'contact',    label: 'CONTACT', lat:  55,  lon:  15  },
];

// Light colors per section — warm/cool variation like Enzo's plasma
export const SECTION_LIGHTS: Record<SectionId, { color: THREE.Color; intensity: number }> = {
  hero:       { color: new THREE.Color(0xfff5e0), intensity: 1.9 },
  about:      { color: new THREE.Color(0xffd090), intensity: 2.2 }, // warm gold like Enzo about
  projects:   { color: new THREE.Color(0xb0d4ff), intensity: 1.7 }, // cool blue
  skills:     { color: new THREE.Color(0xc8eaff), intensity: 1.6 },
  experience: { color: new THREE.Color(0xffb060), intensity: 2.1 }, // deep orange
  contact:    { color: new THREE.Color(0xff90c0), intensity: 1.8 }, // pink like Enzo contact
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

function buildCloudTexture(): THREE.CanvasTexture {
  const w = 2048, h = 1024;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const cx = cv.getContext('2d')!;
  cx.clearRect(0, 0, w, h);
  for (let i = 0; i < 420; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 18 + Math.random() * 80;
    const g = cx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${0.25 + Math.random() * 0.35})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    cx.beginPath();
    cx.arc(x, y, r, 0, Math.PI * 2);
    cx.fillStyle = g;
    cx.fill();
  }
  return new THREE.CanvasTexture(cv);
}

// Build a canvas texture for one cube face — icon symbol
function buildCubeFaceTexture(symbol: string, active: boolean): THREE.CanvasTexture {
  const size = 128;
  const cv   = document.createElement('canvas');
  cv.width = size; cv.height = size;
  const ctx  = cv.getContext('2d')!;

  // Background
  ctx.fillStyle = active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)';
  ctx.fillRect(0, 0, size, size);

  // Border
  ctx.strokeStyle = active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)';
  ctx.lineWidth   = active ? 3 : 1.5;
  ctx.strokeRect(2, 2, size - 4, size - 4);

  // Symbol
  ctx.fillStyle   = active ? '#ffffff' : 'rgba(255,255,255,0.5)';
  ctx.font        = `bold ${size * 0.42}px monospace`;
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, size / 2, size / 2);

  return new THREE.CanvasTexture(cv);
}

// Section symbols
const SECTION_SYMBOLS: Record<SectionId, string> = {
  hero:       '⌂',
  about:      '◉',
  projects:   '⬡',
  skills:     '◈',
  experience: '◎',
  contact:    '◌',
};

// ─── SHADERS ──────────────────────────────────────────────────────────────────

const atmVert = `
  varying vec3 vNormal;
  void main(){
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

const atmFrag = `
  varying vec3 vNormal;
  void main(){
    float rim = 1.0 - abs(dot(vNormal, vec3(0.0,0.0,1.0)));
    float intensity = pow(rim, 8.0) * 0.28;
    gl_FragColor = vec4(0.15, 0.45, 0.95, intensity);
  }
`;

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface GlobePortfolioProps {
  activeSection: SectionId;
  onReady:       () => void;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function GlobePortfolio({ activeSection, onReady }: GlobePortfolioProps) {
  const mountRef         = useRef<HTMLDivElement>(null);
  const activeSectionRef = useRef<SectionId>(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // Refs to scene objects that need per-frame or per-section updates
  const sceneRef = useRef<{
    sun:          THREE.DirectionalLight;
    cubeGroups:   { id: SectionId; group: THREE.Group; materials: THREE.MeshStandardMaterial[] }[];
    targetColor:  THREE.Color;
    targetIntens: number;
  } | null>(null);

  // Update light target + cube active state when section changes
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;

    const light = SECTION_LIGHTS[activeSection];
    s.targetColor.copy(light.color);
    s.targetIntens = light.intensity;

    s.cubeGroups.forEach(({ id, materials }) => {
      const isActive = id === activeSection;
      materials.forEach(mat => {
        mat.emissiveIntensity = isActive ? 0.6 : 0.05;
        mat.color.set(isActive ? 0xffffff : 0x888888);
        mat.emissive.set(isActive ? 0xffffff : 0x444444);
        mat.opacity = isActive ? 1.0 : 0.55;
      });
    });
  }, [activeSection]);

  // Three.js init
  useEffect(() => {
    const mount = mountRef.current!;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    // Scene + camera
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 3.2;

    // Lights
    scene.add(new THREE.AmbientLight(0x0a1628, 0.35));
    const sun = new THREE.DirectionalLight(0xfff5e0, 1.9);
    sun.position.set(5, 2.5, 4);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x2255aa, 0.25);
    rim.position.set(-5, -1, -3);
    scene.add(rim);

    // Textures
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    // Earth
    const earthMat = new THREE.MeshPhongMaterial({
      specular:  new THREE.Color(0x1a3355),
      shininess: 22,
    });
    loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', tex => {
      earthMat.map = tex; earthMat.needsUpdate = true;
    });
    loader.load('https://unpkg.com/three-globe/example/img/earth-water.png', tex => {
      earthMat.specularMap = tex; earthMat.needsUpdate = true;
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), earthMat);
    earth.rotation.x = 0.12;
    scene.add(earth);

    // Clouds
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.012, 96, 96),
      new THREE.MeshPhongMaterial({
        map:         buildCloudTexture(),
        transparent: true,
        opacity:     0.38,
        depthWrite:  false,
      })
    );
    clouds.rotation.x = 0.12;
    scene.add(clouds);

    // Atmosphere
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.06, 96, 96),
      new THREE.ShaderMaterial({
        vertexShader:   atmVert,
        fragmentShader: atmFrag,
        side:           THREE.BackSide,
        blending:       THREE.AdditiveBlending,
        transparent:    true,
        depthWrite:     false,
      })
    ));

    // Night lights
    const nightMat = new THREE.MeshPhongMaterial({
      color:             0x000000,
      emissive:          new THREE.Color(0xffcc66),
      emissiveIntensity: 0,
      transparent:       true,
      opacity:           0.0,
      depthWrite:        false,
      blending:          THREE.AdditiveBlending,
    });
    loader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg', tex => {
      nightMat.emissiveMap       = tex;
      nightMat.emissiveIntensity = 0.8;
      nightMat.opacity           = 0.6;
      nightMat.needsUpdate       = true;
    });
    const nightMesh = new THREE.Mesh(new THREE.SphereGeometry(1.001, 96, 96), nightMat);
    nightMesh.rotation.x = 0.12;
    scene.add(nightMesh);

    // Stars
    const starPos = new Float32Array(1800 * 3);
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 40;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
      color:       0xffffff,
      size:        0.06,
      transparent: true,
      opacity:     0.7,
    })));

    // ── CUBES on globe surface ──────────────────────────────────────────────
    const cubeGroups: {
      id:        SectionId;
      group:     THREE.Group;
      materials: THREE.MeshStandardMaterial[];
    }[] = [];

    const cubeSize = 0.055;
    const cubeGeo  = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    BADGES.forEach(badge => {
      const isActive = badge.id === activeSectionRef.current;
      const pos      = latLonToVec3(badge.lat, badge.lon, 1.085);

      const group = new THREE.Group();
      group.position.copy(pos);

      // Orient cube to face outward from globe center
      group.lookAt(new THREE.Vector3(0, 0, 0));
      group.rotateX(Math.PI); // flip to face outward

      // 6 face materials — same material for all faces
      const materials: THREE.MeshStandardMaterial[] = Array.from({ length: 6 }, () =>
        new THREE.MeshStandardMaterial({
          color:             isActive ? 0xffffff : 0x888888,
          emissive:          new THREE.Color(isActive ? 0xffffff : 0x444444),
          emissiveIntensity: isActive ? 0.6 : 0.05,
          transparent:       true,
          opacity:           isActive ? 1.0 : 0.55,
          roughness:         0.2,
          metalness:         0.8,
        })
      );

      const cube = new THREE.Mesh(cubeGeo, materials);
      group.add(cube);

      // Glow ring around active cube — thin torus
      const ringGeo = new THREE.TorusGeometry(cubeSize * 1.1, cubeSize * 0.08, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color:       isActive ? 0xffffff : 0x555555,
        transparent: true,
        opacity:     isActive ? 0.7 : 0.15,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      scene.add(group);
      cubeGroups.push({ id: badge.id, group, materials });
    });

    // Light lerp targets
    const targetColor  = SECTION_LIGHTS['hero'].color.clone();
    const currentColor = SECTION_LIGHTS['hero'].color.clone();
    let   targetIntens = SECTION_LIGHTS['hero'].intensity;

    sceneRef.current = { sun, cubeGroups, targetColor, targetIntens };
    onReady();

    // ── Animation loop ──────────────────────────────────────────────────────
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      earth.rotation.y      += 0.0007;
      clouds.rotation.y     += 0.0010;
      nightMesh.rotation.y   = earth.rotation.y;

      // Lerp sun color + intensity smoothly
      currentColor.lerp(targetColor, 0.025);
      sun.color.copy(currentColor);
      sun.intensity += (targetIntens - sun.intensity) * 0.025;

      // Rotate cubes + keep billboard to camera
      cubeGroups.forEach(({ group, materials, id }) => {
        const isActive = id === activeSectionRef.current;

        // Rotate the cube child (index 0)
        const cube = group.children[0] as THREE.Mesh;
        cube.rotation.y += isActive ? 0.025 : 0.008;
        cube.rotation.x += isActive ? 0.015 : 0.005;

        // Pulse ring opacity
        const ring = group.children[1] as THREE.Mesh;
        const ringMat = ring.material as THREE.MeshBasicMaterial;
        if (isActive) {
          ringMat.opacity = 0.4 + Math.sin(elapsed * 3.0) * 0.3;
          ringMat.color.set(0xffffff);
        } else {
          ringMat.opacity = 0.12;
          ringMat.color.set(0x555555);
        }

        // Scale active cube up slightly
        const targetScale = isActive ? 1.5 : 1.0;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

        // Keep group oriented outward from globe (not billboard — cubes look better fixed)
        // They rotate in place but stay on their lat/lon
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
    const ro = new ResizeObserver(() => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}