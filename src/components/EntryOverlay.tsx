import { useRef, useEffect } from 'react';
import type { Phase } from '../phase';

interface EntryOverlayProps {
  phase: Phase;
  sceneReady: boolean;
  onEnter: () => void;
}

export default function EntryOverlay({ phase, sceneReady, onEnter }: EntryOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -1, y: -1 });
  const animRef   = useRef<number>(0);

  // Cursor light
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x, y } = mouseRef.current;
      if (x >= 0) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, 480);
        g.addColorStop(0,    'rgba(120,175,255,0.13)');
        g.addColorStop(0.25, 'rgba(80,130,220,0.07)');
        g.addColorStop(0.6,  'rgba(50,90,180,0.03)');
        g.addColorStop(1,    'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const g2 = ctx.createRadialGradient(x, y, 0, x, y, 80);
        g2.addColorStop(0, 'rgba(160,200,255,0.09)');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    const onMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = ()               => { mouseRef.current = { x: -1, y: -1 }; };
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize',     resize);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const handleEnter = () => {
    if (phase !== 'system') return;
    onEnter();
  };

  const nameRevealed = phase === 'revealed' || phase === 'toPortfolio';
  // Fades out as the continuous hand-off into the portfolio's own hero text begins
  const nameOpacity  = phase === 'revealed' ? 1 : phase === 'toPortfolio' ? 0 : 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3,
      pointerEvents: phase === 'portfolio' ? 'none' : undefined,
    }}>

      {/* Soft vignette — keeps a trace of the "cockpit window" framing */}
      <div style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none',
        opacity: phase === 'toPortfolio' || phase === 'portfolio' ? 0 : 1,
        transition: 'opacity 1.2s ease',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* Name + tagline — bottom left, over the lit Earth, once the zoom lands */}
      <div style={{
        position:      'absolute',
        left:          48,
        bottom:        64,
        zIndex:        8,
        maxWidth:      560,
        pointerEvents: 'none',
        opacity:       nameRevealed ? nameOpacity : 0,
        transform:     nameRevealed ? 'translateY(0)' : 'translateY(24px)',
        transition:    'opacity 0.9s ease, transform 1s ease',
      }}>
        <h1 style={{
          fontFamily:    "'Space Grotesk', sans-serif",
          fontWeight:    700,
          fontSize:      'clamp(32px,4.2vw,58px)',
          letterSpacing: '-0.02em',
          color:         '#ffffff',
          lineHeight:    1.05,
          marginBottom:  14,
        }}>
          Habib Ibrahim Touré
        </h1>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize:   12,
          color:      'rgba(255,255,255,0.55)',
          lineHeight: 1.8,
        }}>
          CS student · University of Ottawa<br />
          Building intelligent systems at the intersection of AI and software engineering.
        </p>
      </div>

      {/* Scroll hint — bottom right, mirrors the name */}
      <div style={{
        position:      'absolute',
        right:         48,
        bottom:        64,
        zIndex:        8,
        textAlign:     'right',
        pointerEvents: 'none',
        opacity:       phase === 'revealed' ? 1 : 0,
        transition:    'opacity 0.9s ease',
      }}>
        <div style={{
          fontFamily:    "'Space Mono', monospace",
          fontSize:      10,
          letterSpacing: '0.3em',
          color:         'rgba(255,255,255,0.4)',
          marginBottom:  10,
        }}>
          SCROLL
        </div>
        <div style={{
          width:      1,
          height:     28,
          background: 'rgba(255,255,255,0.25)',
          marginLeft: 'auto',
        }} />
      </div>

      {/* Cursor light canvas */}
      <canvas ref={canvasRef} style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
        opacity: phase === 'portfolio' ? 0 : 1,
        transition: 'opacity 0.8s ease',
      }} />

      {/* Loading */}
      {!sceneReady && phase === 'system' && (
        <div style={{
          position:      'absolute',
          left:          '50%',
          top:           '50%',
          transform:     'translate(-50%, -50%)',
          fontFamily:    "'Space Mono', monospace",
          fontSize:      10,
          letterSpacing: '0.18em',
          color:         'rgba(255,255,255,0.18)',
          zIndex:        5,
        }}>
          loading solar system...
        </div>
      )}

      {/* ENTER button */}
      <button
        onClick={handleEnter}
        style={{
          position:      'absolute',
          bottom:        48,
          left:          '50%',
          transform:     'translateX(-50%)',
          padding:       '10px 42px',
          background:    'transparent',
          border:        '0.5px solid rgba(255,255,255,0.22)',
          color:         'rgba(255,255,255,0.55)',
          fontFamily:    "'Space Mono', monospace",
          fontSize:      11,
          letterSpacing: '0.28em',
          cursor:        'pointer',
          zIndex:        10,
          transition:    'opacity 0.4s ease, color 0.3s ease, border-color 0.3s ease, background 0.3s ease',
          opacity:       phase === 'system' && sceneReady ? 1 : 0,
          pointerEvents: phase === 'system' ? 'auto' : 'none',
        }}
        onMouseEnter={e => {
          const b = e.currentTarget;
          b.style.color       = '#fff';
          b.style.borderColor = 'rgba(255,255,255,0.5)';
          b.style.background  = 'rgba(255,255,255,0.04)';
          b.style.textShadow  = '0 0 12px rgba(120,175,255,0.5)';
        }}
        onMouseLeave={e => {
          const b = e.currentTarget;
          b.style.color       = 'rgba(255,255,255,0.55)';
          b.style.borderColor = 'rgba(255,255,255,0.22)';
          b.style.background  = 'transparent';
          b.style.textShadow  = 'none';
        }}
      >
        ENTER
      </button>
    </div>
  );
}