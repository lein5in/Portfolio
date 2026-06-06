import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { LanguageProvider } from './context/LanguageContext';
import EntryScreen from './components/EntryScreen';
import Portfolio from './components/Portfolio/index';

function App() {
  const [hasEntered,       setHasEntered]       = useState(false);
  const [portfolioMounted, setPortfolioMounted] = useState(false);
  const [isVisible,        setIsVisible]        = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Habib Ibrahim Touré | Portfolio';
  }, []);

  const handleEnter = () => {
    // 1. Fade entry screen to black
    const overlay = overlayRef.current;
    if (!overlay) return;

    gsap.to(overlay, {
      opacity:  1,
      duration: 0.55,
      ease:     'power2.inOut',
      onComplete: () => {
        // 2. Mount portfolio (hidden under overlay)
        setHasEntered(true);
        setPortfolioMounted(true);

        // 3. Short pause then fade overlay out → portfolio appears
        gsap.to(overlay, {
          opacity:  0,
          duration: 0.7,
          delay:    0.15,
          ease:     'power2.out',
          onComplete: () => {
            setIsVisible(true);
            overlay.style.pointerEvents = 'none';
          },
        });
      },
    });
  };

  return (
    <LanguageProvider>
      {/* Black transition overlay */}
      <div
        ref={overlayRef}
        style={{
          position:       'fixed',
          inset:          0,
          background:     '#000000',
          zIndex:         9999,
          opacity:        0,
          pointerEvents:  'none',
        }}
      />

      {/* Entry screen */}
      {!hasEntered && <EntryScreen onEnter={handleEnter} />}

      {/* Portfolio — mounted after enter, animated in by PortfolioLayout */}
      {portfolioMounted && (
        <Portfolio isVisible={isVisible} />
      )}
    </LanguageProvider>
  );
}

export default App;