import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggle, t }     = useLanguage();

  const navItems = [
    { name: t('About', 'À propos'),       href: '#about' },
    { name: t('Projects', 'Projets'),     href: '#projects' },
    { name: t('Skills', 'Compétences'),   href: '#skills' },
    { name: t('Experience', 'Expérience'), href: '#experience' },
    { name: t('Contact', 'Contact'),      href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const LangToggle = () => (
    <button
      onClick={toggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-2)',
        border: '0.5px solid var(--border-md)',
        borderRadius: '3px',
        padding: '0',
        cursor: 'pointer',
        overflow: 'hidden',
        height: '28px',
        flexShrink: 0,
      }}
    >
      {(['en', 'fr'] as const).map((l) => (
        <span
          key={l}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0 10px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            background: lang === l ? 'var(--accent)' : 'transparent',
            color: lang === l ? '#0d0d0d' : 'var(--text-faint)',
            transition: 'background 0.2s, color 0.2s',
            fontWeight: lang === l ? 500 : 400,
          }}
        >
          {l.toUpperCase()}
        </span>
      ))}
    </button>
  );

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(13,13,13,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '0.5px solid rgba(232,228,220,0.08)' : 'none',
        transition: 'background 0.3s',
      }}
    >
      <div style={{
        maxWidth: '1080px', margin: '0 auto', padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>

        {/* Logo */}
        <a
          href="#"
          onClick={e => scrollTo(e as any, '#home')}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '13px',
            color: 'var(--accent)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          H.I.T.
        </a>

        {/* Desktop: nav links + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="nav-desktop">
          {navItems.map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={e => scrollTo(e, item.href)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              whileHover={{ color: 'var(--text)' } as any}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '13px',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'color 0.2s',
              }}
            >
              {item.name}
            </motion.a>
          ))}
          <LangToggle />
        </div>

        {/* Mobile: toggle + burger */}
        <div style={{ display: 'none', alignItems: 'center', gap: '12px' }} className="nav-mobile">
          <LangToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(13,13,13,0.97)',
              borderTop: '0.5px solid var(--border)',
              padding: '16px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={e => scrollTo(e, item.href)}
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '15px',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '13px 0',
                  borderBottom: '0.5px solid var(--border)',
                }}
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;