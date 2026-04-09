import { useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';

function App() {
  useEffect(() => {
    document.title = 'Habib Ibrahim Touré | Portfolio';
  }, []);

  return (
    <LanguageProvider>
      <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>
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