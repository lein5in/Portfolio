import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GlobeEntryProps {
  /** Called once the WebGL renderer is ready (textures may still be loading) */
  onReady?: () => void;
}

// ── Procedural cloud texture ──────────────────────────────────────────────────
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
    cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2);
    cx.fillStyle = g; cx.fill();
  }
  return new THREE.CanvasTexture(cv);
}

// ── Atmosphere shader (Fresnel-style rim glow) ────────────────────────────────
const atmVert = /* glsl */`
  varying vec3 vNormal;
  void main(){
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;
const atmFrag = /* glsl */`
  varying vec3 vNormal;
  void main(){
    float intensity = pow(0.72 - dot(vNormal, vec3(0,0,1)), 4.0);
    gl_FragColor = vec4(0.18, 0.52, 1.0, 1.0) * intensity;
  }
`;

export default function GlobeEntry({ onReady }: GlobeEntryProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1, 100
    );
    camera.position.z = 2.85;

    // ── Lighting ──────────────────────────────────────────────────────────────
    // Ambient — keeps the dark side barely visible
    scene.add(new THREE.AmbientLight(0x0a1628, 0.35));

    // Sun — warm directional
    const sun = new THREE.DirectionalLight(0xfff5e0, 1.9);
    sun.position.set(5, 2.5, 4);
    scene.add(sun);

    // Rim / fill from opposite side — subtle blue
    const rim = new THREE.DirectionalLight(0x2255aa, 0.25);
    rim.position.set(-5, -1, -3);
    scene.add(rim);

    // ── Texture loader ────────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    // ── Earth sphere ──────────────────────────────────────────────────────────
    const earthGeo = new THREE.SphereGeometry(1, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      specular: new THREE.Color(0x1a3355),
      shininess: 22,
    });

    // Day texture
    loader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      tex => { earthMat.map = tex; earthMat.needsUpdate = true; }
    );

    // Specular map (oceans shinier than land)
    loader.load(
      'https://unpkg.com/three-globe/example/img/earth-water.png',
      tex => { earthMat.specularMap = tex; earthMat.needsUpdate = true; }
    );

    const earth = new THREE.Mesh(earthGeo, earthMat);
    // Tilt slightly for a natural look
    earth.rotation.x = 0.12;
    scene.add(earth);

    // ── Cloud layer ───────────────────────────────────────────────────────────
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.012, 96, 96),
      new THREE.MeshPhongMaterial({
        map: buildCloudTexture(),
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      })
    );
    clouds.rotation.x = 0.12;
    scene.add(clouds);

    // ── Atmosphere glow ───────────────────────────────────────────────────────
    const atmMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.12, 96, 96),
      new THREE.ShaderMaterial({
        vertexShader: atmVert,
        fragmentShader: atmFrag,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );
    scene.add(atmMesh);

    // ── Night-side city lights ─────────────────────────────────────────────────
    // Dark overlay that only shows on the shadow side
    const nightMat = new THREE.MeshPhongMaterial({
      color: 0x000000,
      emissive: new THREE.Color(0xffcc66),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    loader.load(
      'https://unpkg.com/three-globe/example/img/earth-night.jpg',
      tex => {
        nightMat.emissiveMap = tex;
        nightMat.emissiveIntensity = 0.8;
        nightMat.opacity = 0.6;
        nightMat.needsUpdate = true;
      }
    );
    const nightMesh = new THREE.Mesh(new THREE.SphereGeometry(1.001, 96, 96), nightMat);
    nightMesh.rotation.x = 0.12;
    scene.add(nightMesh);

    // ── Subtle stars (inside the hublot space) ────────────────────────────────
    const starPos = new Float32Array(1200 * 3);
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 40;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.055, transparent: true, opacity: 0.7 })
    ));

    onReady?.();

    // ── Animation loop ────────────────────────────────────────────────────────
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      earth.rotation.y += 0.0012;
      clouds.rotation.y += 0.0016;
      nightMesh.rotation.y = earth.rotation.y;
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
}