import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlobePortfolio, { type SectionId, BADGES } from './GlobePortfolio';

gsap.registerPlugin(ScrollTrigger);

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

export const mono: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
};

export const sectionLabel: React.CSSProperties = {
  fontFamily:    "'DM Mono', monospace",
  fontSize:      10,
  letterSpacing: '0.28em',
  color:         'rgba(255,255,255,0.22)',
  textTransform: 'uppercase',
  marginBottom:  48,
};

export const bigTitle: React.CSSProperties = {
  fontFamily:  "'Syne', sans-serif",
  fontSize:    'clamp(42px,5.5vw,72px)',
  lineHeight:  1.0,
  color:       '#ffffff',
  fontWeight:  800,
  marginBottom: 24,
  letterSpacing: '-0.02em',
};

export const bodyText: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize:   13,
  color:      'rgba(255,255,255,0.38)',
  lineHeight: 1.9,
  fontWeight: 400,
  maxWidth:   480,
};

export const tag: React.CSSProperties = {
  fontFamily:    "'DM Mono', monospace",
  fontSize:      10,
  color:         'rgba(255,255,255,0.35)',
  background:    'rgba(255,255,255,0.04)',
  border:        '0.5px solid rgba(255,255,255,0.08)',
  padding:       '4px 10px',
  borderRadius:  2,
  letterSpacing: '0.08em',
};

export const divider: React.CSSProperties = {
  height:     '0.5px',
  background: 'rgba(255,255,255,0.04)',
  margin:     '0 64px',
};

// ─── GSAP FADE WRAPPER ────────────────────────────────────────────────────────

interface FadeProps {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function Fade({ children, delay = 0, style, className }: FadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity:  1,
        y:        0,
        duration: 0.85,
        delay,
        ease:     'power3.out',
        scrollTrigger: {
          trigger: el,
          start:   'top 88%',
          once:    true,
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === el) st.kill();
      });
    };
  }, [delay]);

  return (
    <div ref={ref} style={{ opacity: 0, ...style }} className={className}>
      {children}
    </div>
  );
}

// ─── BADGE LABEL POSITIONS (overlay CSS) ─────────────────────────────────────

function getBadgePos(id: SectionId): React.CSSProperties {
  const map: Record<SectionId, React.CSSProperties> = {
    hero:       { top: '56%', left: '42%' },
    about:      { top: '28%', left: '12%' },
    projects:   { top: '54%', right: '8%' },
    skills:     { top: '70%', left: '48%' },
    experience: { top: '36%', right: '6%' },
    contact:    { top: '20%', left: '35%' },
  };
  return map[id];
}

// ─── BADGE LABEL NAMES ────────────────────────────────────────────────────────

const BADGE_LABELS: Record<SectionId, string> = {
  hero:       'HOME',
  about:      'ABOUT',
  projects:   'WORK',
  skills:     'SKILLS',
  experience: 'EXP',
  contact:    'CONTACT',
};

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface PortfolioLayoutProps {
  children: (
    activeSection: SectionId,
    setRef: (id: SectionId) => (el: HTMLElement | null) => void
  ) => React.ReactNode;
  isVisible?: boolean;
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────

export default function PortfolioLayout({ children, isVisible = true }: PortfolioLayoutProps) {
  const [globeReady,    setGlobeReady]    = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');

  const heroRef    = useRef<HTMLElement>(null);
  const nameRef    = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const statusRef  = useRef<HTMLDivElement>(null);
  const linksRef   = useRef<HTMLDivElement>(null);
  const globeWrapRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    hero: null, about: null, projects: null,
    skills: null, experience: null, contact: null,
  });

  // ── Scroll spy ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const ids: SectionId[] = ['hero', 'about', 'projects', 'skills', 'experience', 'contact'];
    const onScroll = () => {
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[ids[i]];
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
          setActiveSection(ids[i]);
          return;
        }
      }
      setActiveSection('hero');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const setRef = useCallback(
    (id: SectionId) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  const scrollTo = (id: SectionId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── GSAP entrance — fires when globe is ready AND portfolio is visible ───────
  useEffect(() => {
    if (!globeReady || !isVisible) return;

    const tl = gsap.timeline({ delay: 0.1 });

    // Globe slides in from right + scales up
    if (globeWrapRef.current) {
      tl.fromTo(globeWrapRef.current,
        { opacity: 0, x: 80, scale: 0.88 },
        { opacity: 1, x: 0,  scale: 1, duration: 1.2, ease: 'power3.out' },
        0
      );
    }

    // Name rises from below
    if (nameRef.current) {
      tl.fromTo(nameRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
        0.15
      );
    }

    // Status dot
    if (statusRef.current) {
      tl.fromTo(statusRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        0.55
      );
    }

    // Tagline
    if (taglineRef.current) {
      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        0.7
      );
    }

    // Links
    if (linksRef.current) {
      tl.fromTo(linksRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.9
      );
    }

  }, [globeReady, isVisible]);

  // ── Cursor light effect ──────────────────────────────────────────────────────
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = cursorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let mx = -999, my = -999;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const g1 = ctx.createRadialGradient(mx, my, 0, mx, my, 480);
      g1.addColorStop(0,   'rgba(255,255,255,0.028)');
      g1.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const g2 = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
      g2.addColorStop(0,   'rgba(255,255,255,0.055)');
      g2.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div style={{
      display:    'flex',
      minHeight:  '100vh',
      background: '#0a0a0a',
      color:      '#fff',
      position:   'relative',
      overflow:   'hidden',
    }}>

      {/* Cursor light canvas */}
      <canvas
        ref={cursorCanvasRef}
        style={{
          position:      'fixed',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        5,
          mixBlendMode:  'screen',
        }}
      />

      {/* ── GLOBE — fixed right half ──────────────────────────────────────── */}
      <div
        ref={globeWrapRef}
        style={{
          position:      'fixed',
          right:         0,
          top:           0,
          width:         '52%',
          height:        '100vh',
          zIndex:        10,
          opacity:       0, // GSAP will animate this
          pointerEvents: 'none',
        }}
      >
        <GlobePortfolio
          activeSection={activeSection}
          onReady={() => setGlobeReady(true)}
        />

        {/* Badge overlay labels */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {BADGES.map(badge => (
            <button
              key={badge.id}
              onClick={() => scrollTo(badge.id)}
              style={{
                position:      'absolute',
                ...getBadgePos(badge.id),
                fontFamily:    "'DM Mono', monospace",
                fontSize:      8,
                letterSpacing: '0.26em',
                color:         activeSection === badge.id
                  ? 'rgba(255,255,255,0.9)'
                  : 'rgba(255,255,255,0.18)',
                background:    'none',
                border:        'none',
                cursor:        'pointer',
                transition:    'color 0.4s ease, text-shadow 0.4s ease',
                textShadow:    activeSection === badge.id
                  ? '0 0 12px rgba(255,255,255,0.5)'
                  : 'none',
                pointerEvents: 'all',
                padding:       '2px 4px',
                transform:     'translateX(-50%)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
              onMouseLeave={e => {
                e.currentTarget.style.color = activeSection === badge.id
                  ? 'rgba(255,255,255,0.9)'
                  : 'rgba(255,255,255,0.18)';
              }}
            >
              {BADGE_LABELS[badge.id]}
            </button>
          ))}
        </div>
      </div>

      {/* ── SCROLLABLE LEFT CONTENT ───────────────────────────────────────── */}
      <div style={{ width: '48%', minHeight: '100vh' }}>

        {/* ── HERO ── */}
        <section
          ref={heroRef}
          style={{
            minHeight:      '100vh',
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'flex-end',
            padding:        '0 64px 72px',
          }}
        >
          {/* Name */}
          <h1
            ref={nameRef}
            style={{
              fontFamily:    "'Syne', sans-serif",
              fontSize:      'clamp(52px,7.5vw,104px)',
              lineHeight:    0.90,
              color:         '#ffffff',
              fontWeight:    800,
              marginBottom:  0,
              letterSpacing: '-0.025em',
              opacity:       0,
            }}
          >
            Habib<br />
            Ibrahim<br />
            Touré
          </h1>

          {/* Tagline */}
          <p
            ref={taglineRef}
            style={{
              fontFamily:   "'DM Mono', monospace",
              fontSize:     12,
              color:        'rgba(255,255,255,0.32)',
              lineHeight:   1.85,
              marginTop:    28,
              marginBottom: 40,
              maxWidth:     400,
              opacity:      0,
            }}
          >
            CS student · University of Ottawa<br />
            Building intelligent systems at the intersection<br />
            of AI and thoughtful software engineering.
          </p>

          {/* CTA links */}
          <div
            ref={linksRef}
            style={{
              display:    'flex',
              gap:        32,
              alignItems: 'center',
              flexWrap:   'wrap',
              opacity:    0,
            }}
          >
            <button
              onClick={() => scrollTo('projects')}
              style={ctaLink()}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.opacity = '1'; }}
            >
              VIEW PROJECTS →
            </button>
            <button
              onClick={() => scrollTo('contact')}
              style={ctaLink()}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
            >
              CONTACT →
            </button>
          </div>

          {/* Social + location */}
          <div style={{
            display:    'flex',
            gap:        20,
            alignItems: 'center',
            marginTop:  52,
          }}>
            {[
              { href: 'https://github.com/lein5in',                                label: 'GH' },
              { href: 'https://www.linkedin.com/in/habib-ibrahim-toure-440740389', label: 'LI' },
              { href: 'mailto:htour018@uottawa.ca',                                label: 'ML' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily:    "'DM Mono', monospace",
                  fontSize:      10,
                  letterSpacing: '0.14em',
                  color:         'rgba(255,255,255,0.2)',
                  textDecoration: 'none',
                  transition:    'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; }}
              >
                {label}
              </a>
            ))}
            <div style={{ height: '0.5px', width: 40, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{
              fontFamily:    "'DM Mono', monospace",
              fontSize:      10,
              color:         'rgba(255,255,255,0.15)',
              letterSpacing: '0.12em',
            }}>
              Ottawa, ON
            </span>
          </div>
        </section>

        {/* Sections */}
        {children(activeSection, setRef)}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0a0a0a; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        ::selection { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function ctaLink(): React.CSSProperties {
  return {
    fontFamily:    "'DM Mono', monospace",
    fontSize:      11,
    letterSpacing: '0.2em',
    color:         'rgba(255,255,255,0.45)',
    background:    'none',
    border:        'none',
    cursor:        'pointer',
    padding:       0,
    transition:    'color 0.2s',
  };
}