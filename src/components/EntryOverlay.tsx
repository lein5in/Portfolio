import { useRef, useEffect } from 'react';
import type { Phase } from '../phase';

interface EntryOverlayProps {
  phase: Phase;
  sceneReady: boolean;
}

export default function EntryOverlay({ phase, sceneReady }: EntryOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x, y } = mouseRef.current;
      if (x < 0) return;

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
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; draw(); };
    const onLeave = ()               => { mouseRef.current = { x: -1, y: -1 }; draw(); };
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('resize',     resize);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const nameRevealed = phase === 'revealed' || phase === 'toPortfolio';
  const nameOpacity  = phase === 'revealed' ? 1 : phase === 'toPortfolio' ? 0 : 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3,
      pointerEvents: phase === 'portfolio' ? 'none' : undefined,
    }}>

      <div style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none',
        opacity: phase === 'toPortfolio' || phase === 'portfolio' ? 0 : 1,
        transition: 'opacity 1.2s ease',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)',
      }} />

      <div style={{
        position:      'absolute',
        left:          48,
        bottom:        64,
        zIndex:        8,
        maxWidth:      560,
        pointerEvents: 'none',
        opacity:       nameRevealed ? nameOpacity : 0,
        transition:    'opacity 0.5s ease',
      }}>
        <h1 style={{
          fontFamily:    "'Space Grotesk', sans-serif",
          fontWeight:    600,
          fontSize:      'clamp(35.2px,4.2vw,62.6px)',
          letterSpacing: '-0.02em',
          color:         '#ffffff',
          lineHeight:    1.05,
          marginBottom:  14,
        }}>
          Habib Ibrahim Touré
        </h1>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize:   13,
          color:      'rgba(255,255,255,0.55)',
          lineHeight: 1.8,
        }}>
          Aspiring AI · Full-Stack · Finance · University of Ottawa<br />
          Building intelligent systems that people actually enjoy using.
        </p>
      </div>

      <div style={{
        position:      'absolute',
        right:         48,
        bottom:        64,
        zIndex:        8,
        textAlign:     'right',
        pointerEvents: 'none',
        opacity:       phase === 'revealed' ? 1 : 0,
        transition:    'opacity 0.5s ease',
      }}>
        <div style={{
          fontFamily:    "'Space Mono', monospace",
          fontSize:      11,
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

      <canvas ref={canvasRef} style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
        opacity: phase === 'portfolio' ? 0 : 1,
        transition: 'opacity 0.8s ease',
      }} />

      {!sceneReady && phase === 'system' && (
        <div style={{
          position:      'absolute',
          left:          '50%',
          top:           '50%',
          transform:     'translate(-50%, -50%)',
          fontFamily:    "'Space Mono', monospace",
          fontSize:      11,
          letterSpacing: '0.18em',
          color:         'rgba(255,255,255,0.18)',
          zIndex:        5,
        }}>
          loading solar system...
        </div>
      )}
    </div>
  );
}