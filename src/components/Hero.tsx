import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowDown } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const rolesEN = ['Software Developer', 'AI/ML Enthusiast', 'CS Student @ uOttawa', 'Full-Stack Builder'];
const rolesFR = ['Développeur Logiciel', 'Passionné IA/ML', 'Étudiant en INFO @ uOttawa', 'Développeur Full-Stack'];

const Hero = () => {
  const { lang, t } = useLanguage();
  const roles = lang === 'en' ? rolesEN : rolesFR;

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed]  = useState('');
  const [deleting, setDeleting]    = useState(false);

  // Reset typing when language changes
  useEffect(() => {
    setDisplayed('');
    setDeleting(false);
    setRoleIndex(0);
  }, [lang]);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 55);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex, roles]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '80px 40px 0',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%', alignItems: 'center' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}
          >
            <span className="pulse-dot" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {t('Available — Summer 2026 Internship', 'Disponible — Stage Été 2026')}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(52px, 8vw, 96px)', lineHeight: 0.92, color: 'var(--text)', marginBottom: '8px' }}
          >
            Habib<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Ibrahim</em><br />
            Touré
          </motion.h1>

          {/* Typing role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: 'var(--text-muted)', marginTop: '24px', letterSpacing: '0.04em', height: '22px', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            {displayed}
            <span style={{ display: 'inline-block', width: '1.5px', height: '14px', background: 'var(--accent)', animation: 'blink 1s ease-in-out infinite' }} />
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.75, marginTop: '24px', maxWidth: '460px' }}
          >
            {t(
              'Second-year CS student at the University of Ottawa, building intelligent systems at the intersection of AI and thoughtful software engineering. Bilingual (EN/FR), passionate about tools that genuinely help people.',
              "Étudiant en 2e année d'informatique à l'Université d'Ottawa, je construis des systèmes à l'intersection de l'IA et d'un génie logiciel réfléchi. Bilingue (EN/FR), passionné par les outils qui aident vraiment les gens."
            )}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{ display: 'flex', gap: '12px', marginTop: '36px', flexWrap: 'wrap' }}
          >
            <motion.button className="btn-primary" onClick={() => scrollTo('#projects')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              {t('View Projects', 'Voir les projets')}
            </motion.button>
            <motion.button className="btn-secondary" onClick={() => scrollTo('#contact')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              {t('Contact Me', 'Me contacter')}
            </motion.button>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ display: 'flex', gap: '20px', marginTop: '56px', alignItems: 'center' }}
          >
            {[
              { href: 'https://github.com/lein5in', icon: <FaGithub size={18} /> },
              { href: 'https://www.linkedin.com/in/habib-ibrahim-toure-440740389', icon: <FaLinkedin size={18} /> },
              { href: 'mailto:htour018@uottawa.ca', icon: <FaEnvelope size={18} /> },
            ].map(({ href, icon }) => (
              <motion.a key={href} href={href} target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                whileHover={{ color: 'var(--accent)', scale: 1.15 } as any}
              >
                {icon}
              </motion.a>
            ))}
            <div style={{ flex: 1, height: '0.5px', background: 'var(--border)', maxWidth: '100px' }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
              Ottawa, ON
            </span>
          </motion.div>
        </div>

        {/* Right column — rotating quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: '340px' }}
          className="hero-right"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', width: '280px', height: '280px' }}
          >
            <svg viewBox="0 0 280 280" width="280" height="280">
              <defs>
                <path id="circlePath" d="M 140,140 m -110,0 a 110,110 0 1,1 220,0 a 110,110 0 1,1 -220,0" />
              </defs>
              <text fill="rgba(196,184,150,0.45)" fontSize="11" fontFamily="'DM Mono', monospace" letterSpacing="3.5">
                <textPath href="#circlePath">
                  {t(
                    '"The only way to do great work is to love what you do." — Steve Jobs ·',
                    '"La seule façon de faire du bon travail est d\'aimer ce que vous faites." — Steve Jobs ·'
                  )}
                </textPath>
              </text>
            </svg>
          </motion.div>

          <div style={{ width: '180px', height: '180px', borderRadius: '50%', border: '0.5px solid rgba(196,184,150,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '40px', color: 'var(--accent)', lineHeight: 1, opacity: 0.6 }}>H</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.2em', marginTop: '6px' }}>I.T.</div>
            </div>
          </div>

          <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', width: '240px', height: '240px' }}
          >
            <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.7 }} />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)' }}
      >
        <motion.button onClick={() => scrollTo('#about')} animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
          style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <FaArrowDown size={13} />
        </motion.button>
      </motion.div>

      <style>{`
        @media (max-width: 768px) { .hero-right { display: none; } }
      `}</style>
    </section>
  );
};

export default Hero;