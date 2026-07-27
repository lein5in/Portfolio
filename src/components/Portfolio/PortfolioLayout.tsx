import React, { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useReducedMotion } from '../../motionPreference';
import type { SectionId } from '../../three/sections';
import Navbar from './Navbar';

gsap.registerPlugin(ScrollTrigger);

export const mono: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
};

export const sectionLabel: React.CSSProperties = {
  fontFamily:    "'Space Mono', monospace",
  fontSize:      11,
  letterSpacing: '0.28em',
  color:         'rgba(255,255,255,0.42)',
  textTransform: 'uppercase',
  marginBottom:  48,
};

export const bigTitle: React.CSSProperties = {
  fontFamily:    "'Space Grotesk', sans-serif",
  fontSize:      'clamp(45.4px,5.5vw,77.8px)',
  lineHeight:    1.0,
  color:         '#ffffff',
  fontWeight:    700,
  marginBottom:  24,
  letterSpacing: '-0.02em',
};

export const bodyText: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize:   14.5,
  color:      'rgba(255,255,255,0.68)',
  lineHeight: 1.95,
  fontWeight: 400,
  maxWidth:   480,
};

export const tag: React.CSSProperties = {
  fontFamily:    "'Space Mono', monospace",
  fontSize:      11,
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

interface PortfolioLayoutProps {
  children: (
    activeSection: SectionId,
    setRef: (id: SectionId) => (el: HTMLElement | null) => void
  ) => React.ReactNode;
  isVisible?: boolean;
  onActiveSectionChange?: (id: SectionId) => void;
}

export default function PortfolioLayout({ children, isVisible = true, onActiveSectionChange }: PortfolioLayoutProps) {
  const activeSectionRef = useRef<SectionId>('hero');
  const [activeId, setActiveId] = useState<SectionId>('hero');

  const nameRef    = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const linksRef   = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    hero: null, about: null, projects: null,
    skills: null, experience: null, contact: null,
  });

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
        setActiveId(next);
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

  useEffect(() => {
    if (!isVisible) return;

    gsap.set(nameRef.current, { opacity: 0, y: 64 });
    gsap.set([taglineRef.current, linksRef.current, socialsRef.current], {
      opacity: 0.15, y: 0,
    });

    const tl = gsap.timeline({ delay: 0.6 });

    tl.fromTo(nameRef.current,
      { opacity: 0, y: 64 },
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

  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = cursorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let mx = -999, my = -999;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (mx < -900) return;
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

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; draw(); };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; draw(); };
    window.addEventListener('mousemove', onMove);

    return () => {
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

      <div className="pf-scrim" style={{
        position:      'fixed',
        inset:         0,
        zIndex:        1,
        pointerEvents: 'none',
        background:    'linear-gradient(90deg, #0a0a0a 0%, rgba(10,10,10,0.9) 32%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0) 64%)',
      }} />

      <canvas ref={cursorCanvasRef} style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', zIndex: 5, mixBlendMode: 'screen',
      }} />

      <div className="pf-left-col" style={{ width: '48%', minHeight: '100vh', position: 'relative', zIndex: 2 }}>

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
          <h1 ref={nameRef} style={{
            fontFamily:    "'Space Grotesk', sans-serif",
            fontSize:      'clamp(47.5px,5.5vw,77.8px)',
            lineHeight:    1.08,
            color:         '#ffffff',
            fontWeight:    600,
            marginBottom:  0,
            letterSpacing: '-0.02em',
            opacity:       0,
          }}>
            Habib<br />
            Ibrahim Touré
          </h1>

          <div ref={taglineRef} style={{ opacity: 0.15, marginTop: 28, marginBottom: 40 }}>
            <div style={{
              fontFamily:    "'Space Mono', monospace",
              fontSize:      12,
              letterSpacing: '0.22em',
              color:         'rgba(255,255,255,0.42)',
              textTransform: 'uppercase',
              marginBottom:  6,
            }}>
              Aspiring AI · Full-Stack · Finance
            </div>
            <div style={{
              fontFamily:    "'Space Mono', monospace",
              fontSize:      12,
              letterSpacing: '0.22em',
              color:         'rgba(255,255,255,0.78)',
              fontWeight:    700,
              textTransform: 'uppercase',
              marginBottom:  22,
            }}>
              University of Ottawa
            </div>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize:   14,
              color:      'rgba(255,255,255,0.68)',
              lineHeight: 1.75,
              maxWidth:   360,
              margin:     0,
            }}>
              Building intelligent systems<br />
              that people actually enjoy using.
            </p>
          </div>

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

          <div ref={socialsRef} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 56, opacity: 0.15 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { href: 'https://github.com/lein5in',                                Icon: FaGithub },
                { href: 'https://www.linkedin.com/in/habib-ibrahim-toure-440740389', Icon: FaLinkedin },
                { href: 'mailto:htour018@uottawa.ca',                                Icon: FaEnvelope },
              ].map(({ href, Icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s', lineHeight: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

            <button onClick={() => scrollTo('about')} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            >
              <span style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid currentColor', display: 'inline-block' }} />
              SCROLL
            </button>
          </div>
        </section>

        {children('hero', setRef)}

      </div>

      <Navbar activeId={activeId} onNavigate={scrollTo} />

    </div>
  );
}

function ctaLink(): React.CSSProperties {
  return {
    fontFamily:    "'Space Mono', monospace",
    fontSize:      12,
    letterSpacing: '0.2em',
    color:         'rgba(255,255,255,0.45)',
    background:    'none',
    border:        'none',
    cursor:        'pointer',
    padding:       0,
    transition:    'color 0.2s',
  };
}