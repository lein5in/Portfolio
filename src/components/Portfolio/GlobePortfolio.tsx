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

export const BADGES: Badge[] = [
  { id: 'hero',       label: 'HOME',    lat:  25,  lon:  20  },
  { id: 'about',      label: 'ABOUT',   lat:  48,  lon: -80  },
  { id: 'projects',   label: 'WORK',    lat:  10,  lon:  80  },
  { id: 'skills',     label: 'SKILLS',  lat: -20,  lon:  40  },
  { id: 'experience', label: 'EXP',     lat:  35,  lon: 140  },
  { id: 'contact',    label: 'CONTACT', lat:  55,  lon:  15  },
];

export const SECTION_LIGHTS: Record<SectionId, {
  color:       THREE.Color;
  intensity:   number;
  ambientColor: THREE.Color;
  ambientIntensity: number;
}> = {
  hero:       { color: new THREE.Color(0xfff5e0), intensity: 2.0,  ambientColor: new THREE.Color(0x0a1628), ambientIntensity: 0.35 },
  about:      { color: new THREE.Color(0xffaa00), intensity: 2.8,  ambientColor: new THREE.Color(0x1a0e00), ambientIntensity: 0.55 },
  projects:   { color: new THREE.Color(0x4488ff), intensity: 2.5,  ambientColor: new THREE.Color(0x000d2a), ambientIntensity: 0.6  },
  skills:     { color: new THREE.Color(0x00ffcc), intensity: 2.2,  ambientColor: new THREE.Color(0x001a14), ambientIntensity: 0.5  },
  experience: { color: new THREE.Color(0xff5500), intensity: 2.9,  ambientColor: new THREE.Color(0x1a0800), ambientIntensity: 0.6  },
  contact:    { color: new THREE.Color(0xff2288), intensity: 2.6,  ambientColor: new THREE.Color(0x1a0010), ambientIntensity: 0.55 },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

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

  const sceneRef = useRef<{
    sun:              THREE.DirectionalLight;
    ambient:          THREE.AmbientLight;
    targetColor:      THREE.Color;
    targetIntens:     number;
    targetAmbColor:   THREE.Color;
    targetAmbIntens:  number;
  } | null>(null);

  // Update light targets on section change
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    const light = SECTION_LIGHTS[activeSection];
    s.targetColor.copy(light.color);
    s.targetIntens    = light.intensity;
    s.targetAmbColor.copy(light.ambientColor);
    s.targetAmbIntens = light.ambientIntensity;
  }, [activeSection]);

  useEffect(() => {
    const mount = mountRef.current!;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 3.2;

    // Lights
    const ambient = new THREE.AmbientLight(0x0a1628, 0.35);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff5e0, 2.0);
    sun.position.set(5, 2.5, 4);
    scene.add(sun);

    const rimLight = new THREE.DirectionalLight(0x2255aa, 0.25);
    rimLight.position.set(-5, -1, -3);
    scene.add(rimLight);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    // Earth
    const earthMat = new THREE.MeshPhongMaterial({ specular: new THREE.Color(0x1a3355), shininess: 22 });
    loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', tex => { earthMat.map = tex; earthMat.needsUpdate = true; });
    loader.load('https://unpkg.com/three-globe/example/img/earth-water.png',       tex => { earthMat.specularMap = tex; earthMat.needsUpdate = true; });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), earthMat);
    earth.rotation.x = 0.12;
    scene.add(earth);

    // Clouds
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.012, 96, 96),
      new THREE.MeshPhongMaterial({ map: buildCloudTexture(), transparent: true, opacity: 0.38, depthWrite: false })
    );
    clouds.rotation.x = 0.12;
    scene.add(clouds);

    // Atmosphere
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.06, 96, 96),
      new THREE.ShaderMaterial({ vertexShader: atmVert, fragmentShader: atmFrag, side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })
    ));

    // Night lights
    const nightMat = new THREE.MeshPhongMaterial({
      color: 0x000000, emissive: new THREE.Color(0xffcc66), emissiveIntensity: 0,
      transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    loader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg', tex => {
      nightMat.emissiveMap = tex; nightMat.emissiveIntensity = 0.8; nightMat.opacity = 0.6; nightMat.needsUpdate = true;
    });
    const nightMesh = new THREE.Mesh(new THREE.SphereGeometry(1.001, 96, 96), nightMat);
    nightMesh.rotation.x = 0.12;
    scene.add(nightMesh);

    // Stars
    const starPos = new Float32Array(1800 * 3);
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 40;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.7 })));

    // Lerp state
    const targetColor     = SECTION_LIGHTS['hero'].color.clone();
    const currentColor    = SECTION_LIGHTS['hero'].color.clone();
    const targetAmbColor  = SECTION_LIGHTS['hero'].ambientColor.clone();
    const currentAmbColor = SECTION_LIGHTS['hero'].ambientColor.clone();
    let   targetIntens    = SECTION_LIGHTS['hero'].intensity;
    let   targetAmbIntens = SECTION_LIGHTS['hero'].ambientIntensity;

    sceneRef.current = { sun, ambient, targetColor, targetIntens, targetAmbColor, targetAmbIntens };
    onReady();

    // Animation loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      earth.rotation.y    += 0.0007;
      clouds.rotation.y   += 0.0010;
      nightMesh.rotation.y = earth.rotation.y;

      // Lerp sun
      currentColor.lerp(targetColor, 0.018);
      sun.color.copy(currentColor);
      sun.intensity += (targetIntens - sun.intensity) * 0.018;

      // Lerp ambient
      currentAmbColor.lerp(targetAmbColor, 0.018);
      ambient.color.copy(currentAmbColor);
      ambient.intensity += (targetAmbIntens - ambient.intensity) * 0.018;

      renderer.render(scene, camera);
    };
    animate();

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