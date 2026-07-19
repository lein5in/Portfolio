import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable } from '../three/webgl';
import { createSelectiveBloom } from '../three/postprocessing';
import { buildScene, stepOrbits } from '../three/sceneSetup';
import { createCameraSequences } from '../three/cameraSequences';
import { SECTION_LIGHTS } from '../three/sectionLights';
import type { SectionId } from '../three/sections';
import type { Phase } from '../phase';

interface UniverseProps {
  phase: Phase;
  activeSection: SectionId;
  reducedMotion?: boolean;
  onReady?: (webglAvailable: boolean) => void;
  onEnterZoomComplete?: () => void;
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

  useEffect(() => {
    const api = apiRef.current;
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = phase;
    if (!api) return;
    if (phase === 'zoomingEnter' && prev === 'system') api.zoomToHero();
    if (phase === 'toPortfolio' && prev === 'revealed') api.transitionToPortfolio();
  }, [phase]);

  useEffect(() => {
    if (phase !== 'portfolio') return;
    apiRef.current?.flyToSection(activeSection);
  }, [activeSection, phase]);

  useEffect(() => {
    const mount = mountRef.current!;

    if (!isWebGLAvailable()) {
      setWebglOk(false);
      onReadyRef.current?.(false);
      return;
    }

    const isSmallScreen = mount.clientWidth <= 860;
    const useBloom = !isSmallScreen;

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

    const content = buildScene(scene, isSmallScreen);

    const bloom = useBloom
      ? createSelectiveBloom(renderer, scene, camera, mount.clientWidth, mount.clientHeight, isSmallScreen ? 0.5 : 1)
      : null;
    if (bloom) {
      for (const mesh of content.nonBloomMeshes) bloom.registerNonBloomMesh(mesh);
    }

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

    const sequences = createCameraSequences({
      camera,
      lookAtTarget,
      bodies: content.bodies,
      orbitLines: content.orbitLines,
      sun: content.sun,
      stars: content.stars,
      heroLight: content.heroLight,
      heroLightTarget: content.heroLightTarget,
      heroRim: content.heroRim,
      heroRimTarget: content.heroRimTarget,
      setMood,
      reducedMotionRef,
      onEnterZoomComplete: () => onEnterZoomCompleteRef.current?.(),
    });
    apiRef.current = sequences;

    onReadyRef.current?.(true);

    let animId = 0;
    const clockStart = performance.now();
    let lastFrame = clockStart;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt  = Math.min(0.1, (now - lastFrame) / 1000);
      lastFrame = now;

      stepOrbits(content.bodies, reducedMotionRef.current);
      content.sun.update((now - clockStart) / 1000);

      if (reducedMotionRef.current) {
        content.comets.group.visible = false;
      } else {
        content.comets.group.visible = true;
        content.comets.update(dt);
      }

      camera.lookAt(lookAtTarget);

      currentLightColor.lerp(targetLightColor, 0.02);
      content.heroLight.color.copy(currentLightColor);

      currentAmbColor.lerp(targetAmbColor, 0.02);
      content.ambient.color.copy(currentAmbColor);
      content.ambient.intensity += (targetAmbIntens - content.ambient.intensity) * 0.02;

      if (bloom) {
        bloom.renderWithSelectiveBloom();
      } else {
        renderer.render(scene, camera);
      }
    };
    animate();

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      bloom?.setSize(w, h);
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