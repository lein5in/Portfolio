import React from 'react';
import type { SectionId } from '../../three/sections';

interface RailItem {
  id: SectionId;
  index: string;
  label: string;
  image: string;
}

const RAIL_ITEMS: RailItem[] = [
  { id: 'hero',       index: '01', label: 'Home',       image: '/textures/8k_earth_daymap.jpg' },
  { id: 'about',      index: '02', label: 'About',      image: '/textures/planets/8k_mars.jpg' },
  { id: 'projects',   index: '03', label: 'Projects',   image: '/textures/planets/8k_jupiter.jpg' },
  { id: 'skills',     index: '04', label: 'Skills',     image: '/textures/planets/8k_saturn.jpg' },
  { id: 'experience', index: '05', label: 'Experience', image: '/textures/planets/8k_venus_surface.jpg' },
  { id: 'contact',    index: '06', label: 'Contact',    image: '/textures/planets/8k_moon.jpg' },
];

interface SectionRailProps {
  activeId: SectionId;
  onNavigate: (id: SectionId) => void;
}

export default function SectionRail({ activeId, onNavigate }: SectionRailProps) {
  return (
    <div className="pf-rail" style={railStyle}>
      {RAIL_ITEMS.map(item => {
        const active = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              ...rowStyle,
              backgroundImage: `linear-gradient(90deg, rgba(6,6,6,0.88) 0%, rgba(6,6,6,0.55) 45%, rgba(6,6,6,0.15) 100%), url(${item.image})`,
            }}
          >
            <div style={{ opacity: active ? 1 : 0.55, transition: 'opacity 0.3s' }}>
              <div style={indexStyle}>{item.index}</div>
              <div style={{ ...labelStyle, color: active ? '#ffffff' : 'rgba(255,255,255,0.7)' }}>
                {item.label.toUpperCase()}
              </div>
              <div style={{ ...dashStyle, width: active ? 28 : 16, background: active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)' }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

const railStyle: React.CSSProperties = {
  position: 'fixed', top: 0, right: 0, width: '30%', minWidth: 280, maxWidth: 380,
  height: '100vh', zIndex: 15, display: 'flex', flexDirection: 'column',
};

const rowStyle: React.CSSProperties = {
  flex: 1, border: 'none', borderBottom: '0.5px solid rgba(255,255,255,0.08)',
  backgroundSize: 'cover', backgroundPosition: 'center right',
  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
  alignItems: 'flex-start', padding: '0 0 20px 24px', cursor: 'pointer', textAlign: 'left',
};

const indexStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)',
  letterSpacing: '0.1em', marginBottom: 6,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700,
  letterSpacing: '0.06em', marginBottom: 8,
};

const dashStyle: React.CSSProperties = { height: 1, transition: 'width 0.3s, background 0.3s' };