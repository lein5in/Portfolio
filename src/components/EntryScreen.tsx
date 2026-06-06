import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';

const GlobeEntry = lazy(() => import('./GlobeEntry'));

interface EntryScreenProps {
  onEnter: () => void;
}

const HUD_STYLE: React.CSSProperties = {
  fontFamily:    "'DM Mono', monospace",
  fontSize:      10,
  letterSpacing: '0.18em',
  lineHeight:    '2em',
  color:         'rgba(255,255,255,0.28)',
  transition:    'color 0.3s ease, text-shadow 0.3s ease',
  cursor:        'default',
  userSelect:    'none',
};

const HUD_LABEL: React.CSSProperties = {
  color:         'rgba(255,255,255,0.14)',
  fontSize:      8,
  letterSpacing: '0.22em',
  display:       'inline-block',
  width:         36,
};

export default function EntryScreen({ onEnter }: EntryScreenProps) {
  const [exiting, setExiting]     = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouseRef   = useRef({ x: -1, y: -1 });
  const animRef    = useRef<number>(0);
  const zoomRef    = useRef({ active: false });

  const HUBLOT = {
    left:   '50%',
    top:    '40%',
    width:  '27%',
    height: '52%',
  };

  // Cursor light — stronger
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
        // Primary glow — larger, more visible
        const g = ctx.createRadialGradient(x, y, 0, x, y, 480);
        g.addColorStop(0,    'rgba(120,175,255,0.13)');
        g.addColorStop(0.25, 'rgba(80,130,220,0.07)');
        g.addColorStop(0.6,  'rgba(50,90,180,0.03)');
        g.addColorStop(1,    'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Tight inner hotspot
        const g2 = ctx.createRadialGradient(x, y, 0, x, y, 80);
        g2.addColorStop(0,   'rgba(160,200,255,0.09)');
        g2.addColorStop(1,   'transparent');
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
    if (zoomRef.current.active || exiting) return;
    zoomRef.current.active = true;
    setTimeout(() => setExiting(true), 80);
    setTimeout(() => onEnter(), 900);
  };

  const hudHover = (e: React.MouseEvent<HTMLDivElement>, on: boolean) => {
    const el = e.currentTarget;
    el.style.color      = on ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.28)';
    el.style.textShadow = on ? '0 0 12px rgba(120,175,255,0.6)' : 'none';
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}>

      {/* Cabin photo */}
      <div style={{
        position:           'absolute', inset: 0,
        backgroundImage:    'url(/plane_view.png)',
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        filter:             'brightness(0.48) saturate(0.18)',
      }} />

      {/* Globe */}
      <div style={{
        position:      'absolute',
        left:          HUBLOT.left,
        top:           HUBLOT.top,
        width:         HUBLOT.width,
        height:        HUBLOT.height,
        transform:     'translate(-50%, -50%)',
        overflow:      'hidden',
        clipPath:      'ellipse(46% 46% at 50% 50%)',
        opacity:       globeReady ? 1 : 0,
        transition:    'opacity 1.2s ease',
        zIndex:        2,
        pointerEvents: 'none',
      }}>
        <Suspense fallback={null}>
          <GlobeEntry onReady={() => setGlobeReady(true)} />
        </Suspense>
      </div>

      {/* HUD — bottom left */}
      <div
        onMouseEnter={e => hudHover(e, true)}
        onMouseLeave={e => hudHover(e, false)}
        style={{
          ...HUD_STYLE,
          position: 'absolute',
          bottom:   52,
          left:     48,
          zIndex:   6,
          opacity:  exiting ? 0 : globeReady ? 1 : 0,
          transition: 'opacity 1.2s ease, color 0.3s ease, text-shadow 0.3s ease',
        }}
      >
        <div><span style={HUD_LABEL}>ALT</span> 38,000 ft</div>
        <div><span style={HUD_LABEL}>SPD</span> 0.85 M</div>
        <div><span style={HUD_LABEL}>HDG</span> 047°</div>
      </div>

      {/* HUD — bottom right */}
      <div
        onMouseEnter={e => hudHover(e, true)}
        onMouseLeave={e => hudHover(e, false)}
        style={{
          ...HUD_STYLE,
          position:  'absolute',
          bottom:    52,
          right:     48,
          textAlign: 'right',
          zIndex:    6,
          opacity:   exiting ? 0 : globeReady ? 1 : 0,
          transition: 'opacity 1.2s ease, color 0.3s ease, text-shadow 0.3s ease',
        }}
      >
        <div>OTT → ∞</div>
        <div>ETA &nbsp; --:--</div>
        <div>2026-06-05</div>
      </div>

      {/* Cursor light canvas */}
      <canvas ref={canvasRef} style={{
        position:      'absolute', inset: 0,
        width:         '100%', height: '100%',
        pointerEvents: 'none',
        zIndex:        4,
      }} />

      {/* Loading */}
      {!globeReady && (
        <div style={{
          position:      'absolute',
          left:          HUBLOT.left,
          top:           HUBLOT.top,
          transform:     'translate(-50%, -50%)',
          fontFamily:    "'DM Mono', monospace",
          fontSize:      10,
          letterSpacing: '0.18em',
          color:         'rgba(255,255,255,0.18)',
          zIndex:        5,
          pointerEvents: 'none',
        }}>
          loading...
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
          fontFamily:    "'DM Mono', monospace",
          fontSize:      11,
          letterSpacing: '0.28em',
          cursor:        'pointer',
          zIndex:        10,
          transition:    'all 0.3s ease',
          opacity:       exiting ? 0 : 1,
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

      {/* Fade to black */}
      <div style={{
        position:      'absolute', inset: 0,
        background:    '#0d0d0d',
        opacity:       exiting ? 1 : 0,
        transition:    'opacity 0.85s ease',
        pointerEvents: 'none',
        zIndex:        20,
      }} />
    </div>
  );
}