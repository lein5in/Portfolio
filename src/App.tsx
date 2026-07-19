import { useEffect, useState, useCallback } from 'react';
import Universe from './components/Universe';
import EntryOverlay from './components/EntryOverlay';
import Portfolio from './components/Portfolio/Index';
import { useReducedMotion } from './motionPreference';
import type { Phase } from './phase';
import type { SectionId } from './three/sections';

function App() {
  const [phase, setPhase]                 = useState<Phase>('system');
  const [sceneReady, setSceneReady]        = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [activeSection, setActiveSection]  = useState<SectionId>('hero');
  const [reducedMotion, setReducedMotion]  = useReducedMotion();

  useEffect(() => {
    document.title = 'Habib Ibrahim Touré | Portfolio';
  }, []);

  useEffect(() => {
    const locked = phase !== 'toPortfolio' && phase !== 'portfolio';
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [phase]);

  const handleReady = useCallback((available: boolean) => {
    setWebglAvailable(available);
    setSceneReady(true);
  }, []);

  const handleEnter = useCallback(() => {
    setPhase(p => {
      if (p !== 'system') return p;
      return webglAvailable ? 'zoomingEnter' : 'portfolio';
    });
  }, [webglAvailable]);

  const handleEnterZoomComplete = useCallback(() => {
    setPhase('revealed');
  }, []);

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
      <Universe
        phase={phase}
        activeSection={activeSection}
        reducedMotion={reducedMotion}
        onReady={handleReady}
        onEnterZoomComplete={handleEnterZoomComplete}
      />

      {phase !== 'portfolio' && (
        <EntryOverlay phase={phase} sceneReady={sceneReady} onEnter={handleEnter} />
      )}

      {showPortfolio && (
        <Portfolio
          isVisible={showPortfolio}
          onActiveSectionChange={setActiveSection}
        />
      )}

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
  );
}

export default App;