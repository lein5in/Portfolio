import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GlobeEntryProps {
  onReady?: () => void;
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
    cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2);
    cx.fillStyle = g; cx.fill();
  }
  return new THREE.CanvasTexture(cv);
}

// Softer atmosphere — very subtle, won't create a hard ring
const atmVert = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main(){
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position,1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;
const atmFrag = /* glsl */`
  varying vec3 vNormal;
  void main(){
    // Softer falloff — pow 6 instead of 4, lower base value
    float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float intensity = pow(rim, 8.0) * 0.28;
    vec3 atmColor = vec3(0.15, 0.45, 0.95);
    gl_FragColor = vec4(atmColor, intensity);
  }
`;

export default function GlobeEntry({ onReady }: GlobeEntryProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 3.0;

    // Lighting
    scene.add(new THREE.AmbientLight(0x0a1628, 0.35));
    const sun = new THREE.DirectionalLight(0xfff5e0, 1.9);
    sun.position.set(5, 2.5, 4);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x2255aa, 0.25);
    rim.position.set(-5, -1, -3);
    scene.add(rim);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    // Earth
    const earthGeo = new THREE.SphereGeometry(1, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      specular: new THREE.Color(0x1a3355),
      shininess: 22,
    });
    loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      tex => { earthMat.map = tex; earthMat.needsUpdate = true; });
    loader.load('https://unpkg.com/three-globe/example/img/earth-water.png',
      tex => { earthMat.specularMap = tex; earthMat.needsUpdate = true; });

    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.rotation.x = 0.12;
    scene.add(earth);

    // Clouds
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.012, 96, 96),
      new THREE.MeshPhongMaterial({
        map: buildCloudTexture(),
        transparent: true, opacity: 0.38, depthWrite: false,
      })
    );
    clouds.rotation.x = 0.12;
    scene.add(clouds);

    // Atmosphere — soft, no hard edge, slightly larger sphere
    const atmMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.06, 96, 96),
      new THREE.ShaderMaterial({
        vertexShader: atmVert,
        fragmentShader: atmFrag,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );
    scene.add(atmMesh);

    // Night city lights
    const nightMat = new THREE.MeshPhongMaterial({
      color: 0x000000,
      emissive: new THREE.Color(0xffcc66),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    loader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg', tex => {
      nightMat.emissiveMap = tex;
      nightMat.emissiveIntensity = 0.8;
      nightMat.opacity = 0.6;
      nightMat.needsUpdate = true;
    });
    const nightMesh = new THREE.Mesh(new THREE.SphereGeometry(1.001, 96, 96), nightMat);
    nightMesh.rotation.x = 0.12;
    scene.add(nightMesh);

    // Stars — slightly more visible for depth
    const starPos = new Float32Array(1800 * 3);
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 40;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.85 })
    ));

    // Subtle depth haze — very faint radial fog around scene
    // Achieved via a large dark sphere behind everything
    const hazeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(18, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x000008,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.6,
      })
    );
    scene.add(hazeMesh);

    onReady?.();

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      // Slower rotation
      earth.rotation.y  += 0.0007;
      clouds.rotation.y += 0.0010;
      nightMesh.rotation.y = earth.rotation.y;
      renderer.render(scene, camera);
    };
    animate();

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

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}