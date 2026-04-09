import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const navItems = [
  { name: 'About',      href: '#about' },
  { name: 'Projects',   href: '#projects' },
  { name: 'Skills',     href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact',    href: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '32px' }} className="nav-desktop">
          {navItems.map((item, i) => (
            <motion.a
              key={item.name}
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
        </div>

        {/* Mobile burger */}
        <button
          className="nav-burger"
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', display: 'none' }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
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
              gap: '0',
            }}
          >
            {navItems.map(item => (
              <a
                key={item.name}
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
          .nav-burger  { display: block !important; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;