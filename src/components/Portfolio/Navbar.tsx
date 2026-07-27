import React from 'react';
import type { SectionId } from '../../three/sections';

const NAV_ITEMS: SectionId[] = ['projects', 'about', 'contact'];

const NAV_LABELS: Record<SectionId, string> = {
  hero: 'Home', about: 'About', projects: 'Projects',
  skills: 'Skills', experience: 'Experience', contact: 'Contact',
};

interface NavbarProps {
  activeId: SectionId;
  onNavigate: (id: SectionId) => void;
}

export default function Navbar({ activeId, onNavigate }: NavbarProps) {
  return (
    <nav className="pf-navbar" style={navStyle}>
      <button onClick={() => onNavigate('hero')} style={logoStyle}>
        HIT <span style={{ opacity: 0.5 }}>·</span>
      </button>

      <div className="pf-nav-links" style={{ display: 'flex', gap: 32 }}>
        {NAV_ITEMS.map(id => {
          const active = activeId === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{ ...navLinkStyle, color: active ? '#ffffff' : 'rgba(255,255,255,0.45)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = active ? '#ffffff' : 'rgba(255,255,255,0.45)'; }}
            >
              {NAV_LABELS[id]}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const navStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '28px 64px', pointerEvents: 'none',
};

const logoStyle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700,
  letterSpacing: '0.08em', color: 'rgba(255,255,255,0.85)',
  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  pointerEvents: 'auto',
};

const navLinkStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '0.12em',
  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  transition: 'color 0.2s', pointerEvents: 'auto',
};