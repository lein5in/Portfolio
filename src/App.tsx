import { useEffect, useState, useCallback } from 'react';
import Universe from './components/Universe';
import EntryOverlay from './components/EntryOverlay';
import Portfolio from './components/Portfolio/Index';
import CaseStudyPage from './pages/CaseStudyPage';
import BuildPage from './pages/BuildPage';
import { usePath } from './router';
import { useReducedMotion } from './motionPreference';
import type { Phase } from './phase';
import type { SectionId } from './three/sections';

const AUTO_ZOOM_DELAY = 1500;

function App() {
  const path = usePath();
  const isOverlayPage = path.startsWith('/case-study/') || path === '/build';

  const [phase, setPhase]                   = useState<Phase>('system');
  const [sceneReady, setSceneReady]          = useState(false);
  const [webglAvailable, setWebglAvailable]  = useState(true);
  const [activeSection, setActiveSection]    = useState<SectionId>('hero');
  const [reducedMotion, setReducedMotion]    = useReducedMotion();
  const [textMode, setTextMode]              = useState(false);

  useEffect(() => {
    document.title = 'Habib Ibrahim Touré | Portfolio';
  }, []);

  
  useEffect(() => {
    const locked = !isOverlayPage && phase !== 'toPortfolio' && phase !== 'portfolio';
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [phase, isOverlayPage]);

  const handleReady = useCallback((available: boolean) => {
    setWebglAvailable(available);
    setSceneReady(true);
  }, []);

  const handleEnterZoomComplete = useCallback(() => {
    setPhase('revealed');
  }, []);

  useEffect(() => {
    if (textMode) setPhase('portfolio');
  }, [textMode]);

  useEffect(() => {
    if (phase !== 'system' || !sceneReady) return;

    if (!webglAvailable || reducedMotion) {
      setPhase('portfolio');
      return;
    }

    const t = setTimeout(() => setPhase('zoomingEnter'), AUTO_ZOOM_DELAY);
    return () => clearTimeout(t);
  }, [phase, sceneReady, webglAvailable, reducedMotion]);

  useEffect(() => {
    if (phase !== 'revealed') return;
    let touchY: number | null = null;

    const advance = () => setPhase('toPortfolio');
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 8) advance(); };
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? null; };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY == null) return;
      const dy = touchY - (e.touches[0]?.clientY ?? touchY);
      if (dy > 12) advance();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') advance();
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'toPortfolio') return;
    const t = setTimeout(() => setPhase('portfolio'), 1700);
    return () => clearTimeout(t);
  }, [phase]);

  const showPortfolio = phase === 'toPortfolio' || phase === 'portfolio';

  return (
    <>
      {}
      <Universe
        phase={phase}
        activeSection={activeSection}
        reducedMotion={reducedMotion}
        hideVisual={textMode}
        paused={isOverlayPage}
        onReady={handleReady}
        onEnterZoomComplete={handleEnterZoomComplete}
      />

      {!isOverlayPage && phase !== 'portfolio' && (
        <EntryOverlay phase={phase} sceneReady={sceneReady} />
      )}

      {!isOverlayPage && showPortfolio && (
        <Portfolio
          isVisible={showPortfolio}
          onActiveSectionChange={setActiveSection}
        />
      )}

      {isOverlayPage && (
        path.startsWith('/case-study/')
          ? <CaseStudyPage slug={path.replace('/case-study/', '')} />
          : <BuildPage />
      )}

      {!isOverlayPage && (
        <>
          <button
            onClick={() => setTextMode(v => !v)}
            aria-pressed={textMode}
            style={{
              position:      'fixed',
              bottom:        16,
              left:          16,
              zIndex:        50,
              padding:       '7px 12px',
              background:    'rgba(10,10,10,0.55)',
              border:        '0.5px solid rgba(255,255,255,0.16)',
              borderRadius:  3,
              color:         textMode ? '#fff' : 'rgba(255,255,255,0.4)',
              fontFamily:    "'Space Mono', monospace",
              fontSize:      9.5,
              letterSpacing: '0.14em',
              cursor:        'pointer',
              backdropFilter: 'blur(4px)',
              transition:    'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; }}
            title="Toggle text-only version"
          >
            {textMode ? '◉ TEXT VERSION' : '◎ TEXT VERSION'}
          </button>

          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            aria-pressed={reducedMotion}
            style={{
              position:      'fixed',
              bottom:        16,
              right:         16,
              zIndex:        50,
              padding:       '7px 12px',
              background:    'rgba(10,10,10,0.55)',
              border:        '0.5px solid rgba(255,255,255,0.16)',
              borderRadius:  3,
              color:         reducedMotion ? '#fff' : 'rgba(255,255,255,0.4)',
              fontFamily:    "'Space Mono', monospace",
              fontSize:      9.5,
              letterSpacing: '0.14em',
              cursor:        'pointer',
              backdropFilter: 'blur(4px)',
              transition:    'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; }}
            title="Toggle reduced motion"
          >
            {reducedMotion ? '◉ REDUCED MOTION' : '◎ REDUCE MOTION'}
          </button>
        </>
      )}
    </>
  );
}

export default App;