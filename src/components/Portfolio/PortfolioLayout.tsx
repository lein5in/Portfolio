import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../motionPreference';
import type { SectionId } from '../../three/sections';

gsap.registerPlugin(ScrollTrigger);

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

export const mono: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
};

export const sectionLabel: React.CSSProperties = {
  fontFamily:    "'Space Mono', monospace",
  fontSize:      10,
  letterSpacing: '0.28em',
  color:         'rgba(255,255,255,0.42)',
  textTransform: 'uppercase',
  marginBottom:  48,
};

export const bigTitle: React.CSSProperties = {
  fontFamily:    "'Space Grotesk', sans-serif",
  fontSize:      'clamp(42px,5.5vw,72px)',
  lineHeight:    1.0,
  color:         '#ffffff',
  fontWeight:    700,
  marginBottom:  24,
  letterSpacing: '-0.02em',
};

export const bodyText: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize:   13.5,
  color:      'rgba(255,255,255,0.68)',
  lineHeight: 1.95,
  fontWeight: 400,
  maxWidth:   480,
};

export const tag: React.CSSProperties = {
  fontFamily:    "'Space Mono', monospace",
  fontSize:      10,
  color:         'rgba(255,255,255,0.45)',
  background:    'rgba(255,255,255,0.04)',
  border:        '0.5px solid rgba(255,255,255,0.1)',
  padding:       '4px 10px',
  borderRadius:  2,
  letterSpacing: '0.08em',
};

export const divider: React.CSSProperties = {
  height:     '0.5px',
  background: 'rgba(255,255,255,0.05)',
  margin:     '0 64px',
};

// ─── GSAP FADE WRAPPER ────────────────────────────────────────────────────────

interface FadeProps {
  children: React.ReactNode;
  delay?:   number;
  style?:   React.CSSProperties;
  className?: string;
}

export function Fade({ children, delay = 0, style, className }: FadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reducedMotion] = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: keep the same on-scroll reveal (so content doesn't
    // just dump in all at once) but drop the vertical travel — opacity only.
    const travel = reducedMotion ? 0 : 48;
    const outDur = reducedMotion ? 0.25 : 0.5;
    const inDur  = reducedMotion ? 0.35 : 0.7;

    gsap.set(el, { opacity: 0.15, y: travel });

    const st = ScrollTrigger.create({
      trigger:     el,
      start:       'top 92%',
      end:         'bottom 8%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: inDur, delay, ease: 'power2.out' });
      },
      onLeave: () => {
        gsap.to(el, { opacity: 0.15, y: reducedMotion ? 0 : -24, duration: outDur, ease: 'power2.in' });
      },
      onEnterBack: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: inDur, delay, ease: 'power2.out' });
      },
      onLeaveBack: () => {
        gsap.to(el, { opacity: 0.15, y: travel, duration: outDur, ease: 'power2.in' });
      },
    });

    return () => st.kill();
  }, [delay, reducedMotion]);

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface PortfolioLayoutProps {
  children: (
    activeSection: SectionId,
    setRef: (id: SectionId) => (el: HTMLElement | null) => void
  ) => React.ReactNode;
  isVisible?: boolean;
  onActiveSectionChange?: (id: SectionId) => void;
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────

export default function PortfolioLayout({ children, isVisible = true, onActiveSectionChange }: PortfolioLayoutProps) {
  const activeSectionRef = useRef<SectionId>('hero');

  const nameRef    = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const linksRef   = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    hero: null, about: null, projects: null,
    skills: null, experience: null, contact: null,
  });

  // ── Scroll spy — bubbles the active section up to Universe via a callback ──
  useEffect(() => {
    const ids: SectionId[] = ['hero', 'about', 'projects', 'skills', 'experience', 'contact'];
    const onScroll = () => {
      let next: SectionId = 'hero';
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[ids[i]];
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
          next = ids[i];
          break;
        }
      }
      if (next !== activeSectionRef.current) {
        activeSectionRef.current = next;
        onActiveSectionChange?.(next);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [onActiveSectionChange]);

  const setRef = useCallback(
    (id: SectionId) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  const scrollTo = (id: SectionId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── GSAP entrance ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isVisible) return;

    gsap.set([nameRef.current, taglineRef.current, linksRef.current, socialsRef.current], {
      opacity: 0.15, y: 0,
    });

    const tl = gsap.timeline({ delay: 0.05 });

    tl.fromTo(nameRef.current,
      { opacity: 0.15, y: 64 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      0
    );
    tl.fromTo(taglineRef.current,
      { opacity: 0.15, y: 28 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      0.35
    );
    tl.fromTo(linksRef.current,
      { opacity: 0.15, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      0.55
    );
    tl.fromTo(socialsRef.current,
      { opacity: 0.15 },
      { opacity: 1, duration: 0.55, ease: 'power2.out' },
      0.7
    );
  }, [isVisible]);

  // ── Cursor light ─────────────────────────────────────────────────────────────
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = cursorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let mx = -999, my = -999;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const g1 = ctx.createRadialGradient(mx, my, 0, mx, my, 480);
      g1.addColorStop(0, 'rgba(255,255,255,0.028)');
      g1.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const g2 = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
      g2.addColorStop(0, 'rgba(255,255,255,0.05)');
      g2.addColorStop(1, 'rgba(255,255,255,0)');
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
      color:      '#fff',
      position:   'relative',
    }}>

      {/* Readability scrim — guarantees the text column stays legible no
          matter how bright the anchored planet gets behind it. Fixed so it
          tracks the viewport rather than the (much taller) scrolling page. */}
      <div className="pf-scrim" style={{
        position:      'fixed',
        inset:         0,
        zIndex:        1,
        pointerEvents: 'none',
        background:    'linear-gradient(90deg, #0a0a0a 0%, rgba(10,10,10,0.9) 32%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0) 64%)',
      }} />

      {/* Cursor light */}
      <canvas ref={cursorCanvasRef} style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', zIndex: 5, mixBlendMode: 'screen',
      }} />

      {/* ── LEFT CONTENT ── (Universe, mounted at the App level, shows through on the right) */}
      <div className="pf-left-col" style={{ width: '48%', minHeight: '100vh', position: 'relative', zIndex: 2 }}>

        {/* HERO */}
        <section
          ref={el => { sectionRefs.current['hero'] = el; }}
          className="pf-hero-section"
          style={{
            minHeight:      '100vh',
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'flex-end',
            padding:        '0 64px 72px',
          }}
        >
          {/* Name */}
          <h1 ref={nameRef} style={{
            fontFamily:    "'Space Grotesk', sans-serif",
            fontSize:      'clamp(52px,7.5vw,104px)',
            lineHeight:    0.90,
            color:         '#ffffff',
            fontWeight:    700,
            marginBottom:  0,
            letterSpacing: '-0.025em',
            opacity:       0.15,
          }}>
            Habib<br />
            Ibrahim<br />
            Touré
          </h1>

          {/* Tagline */}
          <p ref={taglineRef} style={{
            fontFamily:   "'Space Mono', monospace",
            fontSize:     12,
            color:        'rgba(255,255,255,0.42)',
            lineHeight:   1.85,
            marginTop:    28,
            marginBottom: 40,
            maxWidth:     400,
            opacity:      0.15,
          }}>
            CS student · University of Ottawa<br />
            Building intelligent systems at the intersection<br />
            of AI and thoughtful software engineering.
          </p>

          {/* CTAs */}
          <div ref={linksRef} style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap', opacity: 0.15 }}>
            {[
              { label: 'VIEW PROJECTS →', target: 'projects' as SectionId },
              { label: 'CONTACT →',       target: 'contact'  as SectionId },
            ].map(({ label, target }) => (
              <button key={label} onClick={() => scrollTo(target)} style={ctaLink()}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Socials */}
          <div ref={socialsRef} style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 52, opacity: 0.15 }}>
            {[
              { href: 'https://github.com/lein5in',                                label: 'GH' },
              { href: 'https://www.linkedin.com/in/habib-ibrahim-toure-440740389', label: 'LI' },
              { href: 'mailto:htour018@uottawa.ca',                                label: 'ML' },
            ].map(({ href, label }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.22)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.22)'; }}
              >
                {label}
              </a>
            ))}
            <div style={{ height: '0.5px', width: 40, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.12em' }}>
              Ottawa, ON
            </span>
          </div>
        </section>

        {children('hero', setRef)}

      </div>

    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function ctaLink(): React.CSSProperties {
  return {
    fontFamily:    "'Space Mono', monospace",
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