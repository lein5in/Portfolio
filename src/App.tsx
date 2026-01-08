import { useEffect } from 'react';
import ParticlesBackground from './components/ParticlesBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';

function App() {
  useEffect(() => {
    document.title = 'Habib Ibrahim Toure | Portfolio';
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0e27] text-white overflow-x-hidden">
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Main Content */}
      <div className="relative z-20">
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </div>
    </div>
  );
}

export default App;