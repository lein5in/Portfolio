import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createEarth } from '../three/createEarth';
import { createSun } from '../three/sun';
import { createCometSystem } from '../three/comets';
import { PLANETS, EARTH_DEF, createProceduralPlanet, orbitPosition, buildOrbitRing, type PlanetDef } from '../three/planets';
import { SECTION_LIGHTS } from '../three/sectionLights';
import { collectFadeTargets } from '../three/fade';
import type { SectionId } from '../three/sections';
import type { Phase } from '../phase';

interface UniverseProps {
  phase: Phase;
  activeSection: SectionId;
  reducedMotion?: boolean;
  onReady?: () => void;
  onEnterZoomComplete?: () => void;
}

interface Body {
  def:     PlanetDef;
  group:   THREE.Group;
  angle:   number;
  speed:   number;
  frozen:  boolean;
  isEarth: boolean;
  update:  () => void;
}

// Distance is now PROPORTIONAL to the planet's own radius (not inverted),
// so every planet keeps the same apparent on-screen size regardless of its
// physical size in the wide solar-system shot. Previously this was
// `base * (REF_SIZE / def.size)` — inverted — which made smaller planets
// (e.g. Selo, Vex) recede much further and read as tiny during their
// section, while bigger ones ballooned. The offset vectors are scaled by
// the same ratio so the off-center framing composition stays consistent
// across planets too.
const REF_SIZE   = EARTH_DEF.size;
const HERO_K     = 2.25; // close, dramatic — used for the ENTER zoom
const ANCHORED_K = 3.3;  // settled, generous — used while scrolling sections

const heroDistance     = (def: PlanetDef) => HERO_K * def.size;
const anchoredDistance = (def: PlanetDef) => ANCHORED_K * def.size;

function heroFraming(pos: THREE.Vector3, def: PlanetDef) {
  const dist  = heroDistance(def);
  const scale = def.size / REF_SIZE;
  return {
    camPos: pos.clone().add(new THREE.Vector3(0.4 * scale, 0.2 * scale, dist)),
    lookAt: pos.clone(),
  };
}
function anchoredFraming(pos: THREE.Vector3, def: PlanetDef) {
  const dist  = anchoredDistance(def);
  const scale = def.size / REF_SIZE;
  return {
    camPos: pos.clone().add(new THREE.Vector3(0.25 * scale, 0.12 * scale, dist)),
    lookAt: pos.clone().add(new THREE.Vector3(-dist * 0.4, 0, 0)),
  };
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export default function Universe({ phase, activeSection, reducedMotion = false, onReady, onEnterZoomComplete }: UniverseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglOk, setWebglOk] = useState(true);
  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => { reducedMotionRef.current = reducedMotion; }, [reducedMotion]);
  const apiRef = useRef<{
    zoomToHero: () => void;
    transitionToPortfolio: () => void;
    flyToSection: (id: SectionId) => void;
  } | null>(null);
  const prevPhaseRef = useRef<Phase>('system');
  const onEnterZoomCompleteRef = useRef(onEnterZoomComplete);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onEnterZoomCompleteRef.current = onEnterZoomComplete;
    onReadyRef.current = onReady;
  }, [onEnterZoomComplete, onReady]);

  // ── React to phase changes ──────────────────────────────────────────────
  useEffect(() => {
    const api = apiRef.current;
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = phase;
    if (!api) return;
    if (phase === 'zoomingEnter' && prev === 'system') api.zoomToHero();
    if (phase === 'toPortfolio' && prev === 'revealed') api.transitionToPortfolio();
  }, [phase]);

  // ── React to section changes (only meaningful once in portfolio phase) ──
  useEffect(() => {
    if (phase !== 'portfolio') return;
    apiRef.current?.flyToSection(activeSection);
  }, [activeSection, phase]);

  useEffect(() => {
    const mount = mountRef.current!;

    if (!isWebGLAvailable()) {
      setWebglOk(false);
      // Still call onReady — the rest of the app (ENTER button, portfolio
      // content) shouldn't hang waiting for a 3D scene that can't exist here.
      onReadyRef.current?.();
      return;
    }

    const isSmallScreen = mount.clientWidth <= 860;

    const renderer = new THREE.WebGLRenderer({ antialias: !isSmallScreen, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 300);
    camera.position.set(0, 4.4, 12.5);
    const lookAtTarget = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAtTarget);

    // ── Selective bloom (sun only) ────────────────────────────────────────
    const BLOOM_SCENE = 1;
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);
    const darkMaterial  = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const materialCache = new Map<string, THREE.Material | THREE.Material[]>();
    const darkenNonBloomed = (obj: THREE.Object3D) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && !bloomLayer.test(mesh.layers)) {
        materialCache.set(mesh.uuid, mesh.material);
        mesh.material = darkMaterial;
      }
    };
    const restoreMaterial = (obj: THREE.Object3D) => {
      const mesh = obj as THREE.Mesh;
      const cached = materialCache.get(mesh.uuid);
      if (cached) { mesh.material = cached; materialCache.delete(mesh.uuid); }
    };

    // ── Lights ───────────────────────────────────────────────────────────
    // Ambient is intentionally high so no planet ever reads with a harsh
    // dark side — flat, legible lighting across the whole system.
    const ambient = new THREE.AmbientLight(SECTION_LIGHTS.hero.ambientColor, SECTION_LIGHTS.hero.ambientIntensity);
    scene.add(ambient);

    const fillLight = new THREE.PointLight(0xfff2d9, 2.2, 0, 0.3);
    scene.add(fillLight);

    const heroLight = new THREE.DirectionalLight(SECTION_LIGHTS.hero.color, 0);
    const heroLightTarget = new THREE.Object3D();
    scene.add(heroLightTarget);
    heroLight.target = heroLightTarget;
    scene.add(heroLight);

    const heroRim = new THREE.DirectionalLight(0x2255aa, 0);
    const heroRimTarget = new THREE.Object3D();
    scene.add(heroRimTarget);
    heroRim.target = heroRimTarget;
    scene.add(heroRim);

    // ── Sun ──────────────────────────────────────────────────────────────
    const sun = createSun(1.25);
    sun.mesh.layers.enable(BLOOM_SCENE);
    scene.add(sun.mesh);

    // ── Starfield — denser, with a handful of larger "feature" stars ───────
    const starCount = isSmallScreen ? 2000 : 4600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 160;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.75 }));
    scene.add(stars);

    const bigStarCount = isSmallScreen ? 60 : 140;
    const bigStarPos = new Float32Array(bigStarCount * 3);
    for (let i = 0; i < bigStarPos.length; i++) bigStarPos[i] = (Math.random() - 0.5) * 140;
    const bigStarGeo = new THREE.BufferGeometry();
    bigStarGeo.setAttribute('position', new THREE.BufferAttribute(bigStarPos, 3));
    const bigStars = new THREE.Points(bigStarGeo, new THREE.PointsMaterial({ color: 0xdbe8ff, size: 0.16, transparent: true, opacity: 0.55, sizeAttenuation: true }));
    scene.add(bigStars);

    // ── Nebula — a couple of huge, very soft tinted sprites far behind the
    // system. Purely decorative: breaks up the dead-black gaps in the wide
    // establishing shot without competing with the planets for attention.
    function buildNebulaSprite(color: string, x: number, y: number, z: number, scale: number, opacity: number) {
      const cv = document.createElement('canvas');
      cv.width = 512; cv.height = 512;
      const cx = cv.getContext('2d')!;
      const g = cx.createRadialGradient(256, 256, 0, 256, 256, 256);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, 512, 512);
      const tex = new THREE.CanvasTexture(cv);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(x, y, z);
      sprite.scale.set(scale, scale, 1);
      scene.add(sprite);
    }
    if (!isSmallScreen) {
      buildNebulaSprite('rgba(90,70,160,0.5)',  -55, 22, -90, 130, 0.35);
      buildNebulaSprite('rgba(40,90,160,0.45)',  60, -18, -110, 150, 0.3);
      buildNebulaSprite('rgba(160,90,60,0.35)', -30, -30, -70, 90, 0.22);
    }

    const comets = createCometSystem(isSmallScreen ? 1 : 2);
    scene.add(comets.group);

    // ── Planets (always present — this IS the background AND the hero) ────
    const bodies: Body[] = [];
    const orbitLines: { line: THREE.Line; isHero: boolean }[] = [];

    const earthHandle = createEarth(EARTH_DEF.size);
    scene.add(earthHandle.group);
    bodies.push({ def: EARTH_DEF, group: earthHandle.group, angle: EARTH_DEF.startAngle, speed: EARTH_DEF.orbitSpeed, frozen: false, isEarth: true, update: earthHandle.update });

    for (const def of PLANETS) {
      if (def.id === 'hero') continue;
      const p = createProceduralPlanet(def);
      scene.add(p.group);
      bodies.push({ def, group: p.group, angle: def.startAngle, speed: def.orbitSpeed, frozen: false, isEarth: false, update: p.update });
    }
    for (const def of PLANETS) {
      const ring = buildOrbitRing(def);
      scene.add(ring);
      orbitLines.push({ line: ring, isHero: def.id === 'hero' });
    }

    // ── Post-processing ──────────────────────────────────────────────────
    const renderScene = new RenderPass(scene, camera);
    const bloomRes = new THREE.Vector2(
      mount.clientWidth  * (isSmallScreen ? 0.5 : 1),
      mount.clientHeight * (isSmallScreen ? 0.5 : 1),
    );
    const bloomPass = new UnrealBloomPass(bloomRes, 0.75, 0.4, 0.4);
    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const mixPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: { baseTexture: { value: null }, bloomTexture: { value: bloomComposer.renderTarget2.texture } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `,
        fragmentShader: `
          uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv;
          void main(){ gl_FragColor = texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv); }
        `,
      }),
      'baseTexture'
    );
    mixPass.needsSwap = true;

    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(mixPass);
    finalComposer.addPass(new OutputPass());

    // ── Lighting mood lerp (per active section) ─────────────────────────
    const targetLightColor  = SECTION_LIGHTS.hero.color.clone();
    const currentLightColor = SECTION_LIGHTS.hero.color.clone();
    const targetAmbColor    = SECTION_LIGHTS.hero.ambientColor.clone();
    const currentAmbColor   = SECTION_LIGHTS.hero.ambientColor.clone();
    let targetAmbIntens   = SECTION_LIGHTS.hero.ambientIntensity;

    const setMood = (id: SectionId) => {
      const l = SECTION_LIGHTS[id];
      targetLightColor.copy(l.color);
      targetAmbColor.copy(l.ambientColor);
      targetAmbIntens = l.ambientIntensity;
    };

    // ── Helpers ──────────────────────────────────────────────────────────
    const positionHeroLights = (pos: THREE.Vector3) => {
      heroLight.position.copy(pos.clone().add(new THREE.Vector3(5, 2.5, 4)));
      heroLightTarget.position.copy(pos);
      heroRim.position.copy(pos.clone().add(new THREE.Vector3(-5, -1, -3)));
      heroRimTarget.position.copy(pos);
    };

    const dimGroup = (group: THREE.Group, bodyTarget: number, glowTarget: number, duration: number) => {
      for (const t of collectFadeTargets(group)) {
        const target = t.key === 'value' ? glowTarget : bodyTarget;
        gsap.to(t.obj, { [t.key]: target, duration, ease: 'power2.out' });
      }
    };

    let activeTimeline: ReturnType<typeof gsap.timeline> | null = null;
    let heroId: SectionId = 'hero';

    // ── Phase 1: ENTER — dive from the wide shot into a close Earth shot ──
    // In reduced-motion mode, every camera fly-through collapses to a quick
    // cut instead of a sweeping animated move — the scene still updates,
    // it just doesn't sell the travel with a multi-second swoop.
    const dur = (seconds: number) => (reducedMotionRef.current ? Math.min(0.12, seconds * 0.06) : seconds);

    const zoomToHero = () => {
      const body = bodies.find(b => b.isEarth)!;
      body.frozen = true;
      const pos = body.group.position.clone();
      const { camPos, lookAt } = heroFraming(pos, body.def);
      positionHeroLights(pos);
      setMood('hero');

      const tl = gsap.timeline({ onComplete: () => onEnterZoomCompleteRef.current?.() });
      activeTimeline = tl;

      tl.to(camera.position, { x: camPos.x, y: camPos.y, z: camPos.z, duration: dur(2.6), ease: 'power3.inOut' }, 0);
      tl.to(lookAtTarget,     { x: lookAt.x, y: lookAt.y, z: lookAt.z, duration: dur(2.6), ease: 'power3.inOut' }, 0);
      tl.to(heroLight, { intensity: 2.1, duration: dur(1.8), ease: 'power2.out' }, 0.5);
      tl.to(heroRim,   { intensity: 0.28, duration: dur(1.8), ease: 'power2.out' }, 0.5);

      // Dive past the rest of the system — it fades away as we approach Earth.
      for (const b of bodies) {
        if (b.isEarth) continue;
        for (const t of collectFadeTargets(b.group)) tl.to(t.obj, { [t.key]: 0, duration: dur(1.3), ease: 'power2.in' }, 0.15);
      }
      for (const { line } of orbitLines) tl.to(line.material as THREE.LineBasicMaterial, { opacity: 0, duration: dur(1.0) }, 0.05);
      tl.to(sun.material.uniforms.uOpacity, { value: 0, duration: dur(1.1) }, 0.1);
      tl.to(stars.material as THREE.PointsMaterial, { opacity: 0.2, duration: dur(1.6) }, 0.1);
    };

    // ── Phase 2: continuous hand-off into the anchored portfolio framing ──
    const transitionToPortfolio = () => {
      const body = bodies.find(b => b.isEarth)!;
      const pos = body.group.position.clone();
      const { camPos, lookAt } = anchoredFraming(pos, body.def);

      const tl = gsap.timeline();
      activeTimeline = tl;

      tl.to(camera.position, { x: camPos.x, y: camPos.y, z: camPos.z, duration: dur(1.7), ease: 'power2.inOut' }, 0);
      tl.to(lookAtTarget,     { x: lookAt.x, y: lookAt.y, z: lookAt.z, duration: dur(1.7), ease: 'power2.inOut' }, 0);

      // The rest of the system fades back in, dimmed, and resumes orbiting —
      // it's the visible background from here on, for every section.
      for (const b of bodies) {
        if (b.isEarth) continue;
        b.frozen = false;
        dimGroup(b.group, 0.5, 0.15, dur(1.4));
      }
      for (const { line, isHero } of orbitLines) {
        if (isHero) continue; // Earth's own ring stays hidden forever — this
        // close to the camera it would read as a line slicing across the
        // globe, which is exactly the artifact this guards against.
        tl.to(line.material as THREE.LineBasicMaterial, { opacity: 0.05, duration: dur(1.4) }, 0);
      }
      // Sun stays hidden from here on — it already faded out during
      // zoomToHero. Its light (fillLight, a separate PointLight at the
      // origin) keeps warming the planets from that direction, but the
      // blown-out bloomed disk itself never comes back into the frame.
      tl.to(stars.material as THREE.PointsMaterial, { opacity: 0.75, duration: dur(1.4) }, 0);
    };

    // ── Phase 3: section-to-section — same camera-fly mechanism, reused ───
    const flyToSection = (id: SectionId) => {
      if (id === heroId) return;
      const oldBody = bodies.find(b => b.def.id === heroId)!;
      const newBody = bodies.find(b => b.def.id === id)!;
      oldBody.frozen = false;
      newBody.frozen = true;
      heroId = id;
      setMood(id);

      activeTimeline?.kill();
      const newPos = newBody.group.position.clone();
      const { camPos, lookAt } = anchoredFraming(newPos, newBody.def);
      positionHeroLights(newPos);

      const tl = gsap.timeline();
      activeTimeline = tl;

      tl.to(camera.position, { x: camPos.x, y: camPos.y, z: camPos.z, duration: dur(1.75), ease: 'expo.inOut' }, 0);
      tl.to(lookAtTarget,     { x: lookAt.x, y: lookAt.y, z: lookAt.z, duration: dur(1.75), ease: 'expo.inOut' }, 0);
      // Starts immediately alongside the camera move (not delayed) so the
      // planet swap reads in sync with the text, which changes on its own
      // scroll-driven trigger — staggering them was the source of the felt
      // "lag" between the two.
      dimGroup(oldBody.group, 0.5, 0.15, dur(1.0));
      for (const t of collectFadeTargets(newBody.group)) {
        gsap.to(t.obj, { [t.key]: t.key === 'value' ? 0.3 : 1, duration: dur(1.0), ease: 'power2.out' });
      }
    };

    apiRef.current = { zoomToHero, transitionToPortfolio, flyToSection };

    onReadyRef.current?.();

    // ── Animation loop ──────────────────────────────────────────────────
    let animId = 0;
    const clockStart = performance.now();
    let lastFrame = clockStart;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt  = Math.min(0.1, (now - lastFrame) / 1000); // clamp guards against tab-switch jumps
      lastFrame = now;

      for (const b of bodies) {
        if (!b.frozen && !reducedMotionRef.current) {
          b.angle += b.speed;
          b.group.position.copy(orbitPosition(b.def, b.angle));
        }
        b.update();
      }
      sun.update((now - clockStart) / 1000);
      if (reducedMotionRef.current) {
        comets.group.visible = false;
      } else {
        comets.group.visible = true;
        comets.update(dt);
      }
      camera.lookAt(lookAtTarget);

      currentLightColor.lerp(targetLightColor, 0.02);
      heroLight.color.copy(currentLightColor);

      currentAmbColor.lerp(targetAmbColor, 0.02);
      ambient.color.copy(currentAmbColor);
      ambient.intensity += (targetAmbIntens - ambient.intensity) * 0.02;

      scene.traverse(darkenNonBloomed);
      bloomComposer.render();
      scene.traverse(restoreMaterial);
      finalComposer.render();
    };
    animate();

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      bloomComposer.setSize(w, h);
      finalComposer.setSize(w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  if (!webglOk) {
    return (
      <div
        className="pf-universe-mount"
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 70% 40%, #14203a 0%, #0a0a0a 55%, #050505 100%)',
        }}
      />
    );
  }

  return (
    <div
      ref={mountRef}
      className="pf-universe-mount"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', transition: 'opacity 0.4s ease' }}
    />
  );
}