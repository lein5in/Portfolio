import { useEffect, useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import EntryScreen from './components/EntryScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState(false);

  useEffect(() => {
    document.title = 'Habib Ibrahim Touré | Portfolio';
  }, []);

  const handleEnter = () => {
    // Short delay after fade to black before showing portfolio
    setTimeout(() => {
      setHasEntered(true);
      // Fade in portfolio
      setTimeout(() => setPortfolioVisible(true), 80);
    }, 700);
  };

  return (
    <LanguageProvider>
      {/* Entry screen */}
      {!hasEntered && <EntryScreen onEnter={handleEnter} />}

      {/* Portfolio — fades in after entry */}
      <div
        style={{
          opacity: portfolioVisible ? 1 : 0,
          transition: 'opacity 0.8s ease',
          position: 'relative',
          minHeight: '100vh',
          background: 'var(--bg)',
          color: 'var(--text)',
          overflowX: 'hidden',
        }}
      >
        <Navbar />
        <Hero />
        <div className="divider" />
        <About />
        <div className="divider" />
        <Projects />
        <div className="divider" />
        <Skills />
        <div className="divider" />
        <Experience />
        <div className="divider" />
        <Contact />
      </div>
    </LanguageProvider>
  );
}

export default App;