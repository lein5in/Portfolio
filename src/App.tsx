import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { LanguageProvider } from './context/LanguageContext';
import EntryScreen from './components/EntryScreen';
import Portfolio from './components/Portfolio/Index';

function App() {
  const [hasEntered,       setHasEntered]       = useState(false);
  const [portfolioMounted, setPortfolioMounted] = useState(false);
  const [isVisible,        setIsVisible]        = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Habib Ibrahim Touré | Portfolio';
  }, []);

  const handleEnter = () => {
    // EntryScreen handles its own fade to black (0.85s)
    // We mount portfolio at ~700ms (black is fully opaque)
    setTimeout(() => {
      setHasEntered(true);
      setPortfolioMounted(true);
    }, 400);

    // Then fade our overlay out — portfolio animates in underneath
    setTimeout(() => {
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity:  0,
          duration: 0.35,
          ease:     'power2.out',
          onComplete: () => {
            setIsVisible(true);
            if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none';
          },
        });
      } else {
        setIsVisible(true);
      }
    }, 550);
  };

  return (
    <LanguageProvider>
      {/* Transition overlay — starts opaque, fades out */}
      <div
        ref={overlayRef}
        style={{
          position:      'fixed',
          inset:         0,
          background:    '#0a0a0a',
          zIndex:        9998,
          opacity:       portfolioMounted ? 1 : 0,
          pointerEvents: portfolioMounted ? 'all' : 'none',
        }}
      />

      {/* Entry screen */}
      {!hasEntered && <EntryScreen onEnter={handleEnter} />}

      {/* Portfolio */}
      {portfolioMounted && (
        <Portfolio isVisible={isVisible} />
      )}
    </LanguageProvider>
  );
}

export default App;