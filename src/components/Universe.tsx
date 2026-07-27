import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable } from '../three/webgl';
import { buildScene, stepOrbits } from '../three/sceneSetup';
import { createCameraSequences } from '../three/cameraSequences';
import { createPostFX } from '../three/postprocessing';
import { disposeObject3D } from '../three/dispose';
import { onTextureLoadProgress } from '../three/textureLoad';
import LoadingScreen from './LoadingScreen';
import type { SectionId } from '../three/sections';
import type { Phase } from '../phase';

THREE.Cache.enabled = false;

const PAGE_BACKGROUND = 0x000000;

interface UniverseProps {
  phase: Phase;
  activeSection: SectionId;
  reducedMotion?: boolean;
  hideVisual?: boolean;
  paused?: boolean;
  onReady?: (webglAvailable: boolean) => void;
  onEnterZoomComplete?: () => void;
}

export default function Universe({
  phase, activeSection, reducedMotion = false, hideVisual = false, paused = false,
  onReady, onEnterZoomComplete,
}: UniverseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglOk, setWebglOk] = useState(true);
  const [assetsReady, setAssetsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => { reducedMotionRef.current = reducedMotion; }, [reducedMotion]);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const apiRef = useRef<{
    zoomToHero: () => void;
    transitionToPortfolio: () => void;
    flyToSection: (id: SectionId) => void;
    snapToPortfolio: () => void;
    dispose: () => void;
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
    if (phase === 'portfolio' && prev !== 'toPortfolio') api.snapToPortfolio();
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

    let cancelled = false;

    const isSmallScreen = mount.clientWidth <= 860;

    while (mount.firstChild) mount.removeChild(mount.firstChild);

    const renderer = new THREE.WebGLRenderer({ antialias: !isSmallScreen, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(PAGE_BACKGROUND, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animId);
      setWebglOk(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 300);
    camera.position.set(0, 4.4, 12.5);
    const lookAtTarget = new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookAtTarget);

    const content = buildScene(scene, isSmallScreen);
    const postFX = createPostFX(renderer, scene, camera, mount.clientWidth, mount.clientHeight);

    const unsubscribeProgress = onTextureLoadProgress(({ loaded, total }) => {
      if (cancelled || total === 0) return;
      setLoadProgress(loaded / total);
    });

    content.ready.then(() => {
      if (cancelled) return;
      setLoadProgress(1);
      setAssetsReady(true);
      onReadyRef.current?.(true);
    });

    const sequences = createCameraSequences({
      camera,
      lookAtTarget,
      bodies: content.bodies,
      orbitLines: content.orbitLines,
      sun: content.sun,
      starfield: content.starfield,
      systemFillLight: content.systemFillLight,
      heroLight: content.heroLight,
      heroLightTarget: content.heroLightTarget,
      heroRim: content.heroRim,
      heroRimTarget: content.heroRimTarget,
      reducedMotionRef,
      onEnterZoomComplete: () => onEnterZoomCompleteRef.current?.(),
    });
    apiRef.current = sequences;

    if (phase === 'portfolio') sequences.snapToPortfolio();

    let animId = 0;
    const clockStart = performance.now();
    let lastFrame = clockStart;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (pausedRef.current) return;

      const now = performance.now();
      const dt = Math.min(0.1, (now - lastFrame) / 1000);
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

      postFX.render();
    };
    animate();

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      postFX.setSize(w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      ro.disconnect();
      unsubscribeProgress();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);

      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);

      try { sequences.dispose(); }
      catch (err) { console.warn('[Universe] sequences.dispose() a échoué', err); }

      try { postFX.dispose(); }
      catch (err) { console.warn('[Universe] postFX.dispose() a échoué', err); }

      try { disposeObject3D(scene); }
      catch (err) { console.warn('[Universe] disposeObject3D(scene) a échoué', err); }

      try { renderer.dispose(); }
      catch (err) { console.warn('[Universe] renderer.dispose() a échoué', err); }

      try { renderer.forceContextLoss(); }
      catch (err) { console.warn('[Universe] renderer.forceContextLoss() a échoué', err); }
    };
  }, []);

  if (!webglOk) {
    return (
      <div
        className="pf-universe-mount"
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 70% 40%, #14203a 0%, #0a0a0a 55%, #050505 100%)',
          opacity: hideVisual ? 0 : 1,
        }}
      />
    );
  }

  return (
    <>
      <div
        ref={mountRef}
        className="pf-universe-mount"
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          transition: 'opacity 0.4s ease',
          opacity: hideVisual ? 0 : (assetsReady ? 1 : 0),
        }}
      />
      {!hideVisual && <LoadingScreen progress={loadProgress} visible={!assetsReady} />}
    </>
  );
}