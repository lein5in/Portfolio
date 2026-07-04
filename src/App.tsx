import { useEffect, useState, useCallback } from 'react';
import Universe from './components/Universe';
import EntryOverlay from './components/EntryOverlay';
import Portfolio from './components/Portfolio/Index';
import type { Phase } from './phase';
import type { SectionId } from './three/sections';

function App() {
  const [phase, setPhase]               = useState<Phase>('system');
  const [sceneReady, setSceneReady]      = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');

  useEffect(() => {
    document.title = 'Habib Ibrahim Touré | Portfolio';
  }, []);

  // Lock page scroll until we've actually handed off into the portfolio —
  // the entry sequence is fully controlled (ENTER click, then a deliberate
  // scroll gesture to advance), real document scroll only starts once we're
  // in portfolio mode.
  useEffect(() => {
    const locked = phase !== 'toPortfolio' && phase !== 'portfolio';
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [phase]);

  const handleEnter = useCallback(() => {
    setPhase(p => (p === 'system' ? 'zoomingEnter' : p));
  }, []);

  const handleEnterZoomComplete = useCallback(() => {
    setPhase('revealed');
  }, []);

  // Once "revealed", the user's own scroll/touch/key — not a timer —
  // triggers the continuous hand-off into the portfolio.
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

  // toPortfolio → portfolio once the camera hand-off has had time to settle
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
        onReady={() => setSceneReady(true)}
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
    </>
  );
}

export default App;