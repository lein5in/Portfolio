import { useState, useRef, useEffect, Suspense, lazy } from 'react';

// Lazy load the heavy Three.js globe
const GlobeEntry = lazy(() => import('./GlobeEntry'));

interface EntryScreenProps {
  onEnter: () => void;
}

export default function EntryScreen({ onEnter }: EntryScreenProps) {
  const [exiting, setExiting] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const animRef = useRef<number>(0);
  const zoomRef = useRef({ active: false });

  // ── Hublot geometry — tuned for the centered cabin image ─────────────────
  // Adjust these if the planet doesn't sit perfectly in the window frame.
  const HUBLOT = {
    left: '50%',
    top:  '40%',
    // The window in the image is ~30% wide and ~55% tall of the viewport
    width:  '30%',
    height: '55%',
  };

  // ── Cursor light (Canvas) ─────────────────────────────────────────────────
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
        const g = ctx.createRadialGradient(x, y, 0, x, y, 300);
        g.addColorStop(0,   'rgba(100,160,255,0.07)');
        g.addColorStop(0.4, 'rgba(60,110,200,0.03)');
        g.addColorStop(1,   'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    const onMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = ()               => { mouseRef.current = { x: -1,       y: -1        }; };
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // ── Enter handler ─────────────────────────────────────────────────────────
  const handleEnter = () => {
    if (zoomRef.current.active || exiting) return;
    zoomRef.current.active = true;
    setTimeout(() => setExiting(true), 80);
    setTimeout(() => onEnter(),         900);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}>

      {/* ── Cabin photo ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:    'url(/plane_view.png)',
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.48) saturate(0.18)',
      }} />

      {/* ── Three.js globe clipped to hublot oval ── */}
      <div style={{
        position:  'absolute',
        left:      HUBLOT.left,
        top:       HUBLOT.top,
        width:     HUBLOT.width,
        height:    HUBLOT.height,
        transform: 'translate(-50%, -50%)',
        // Oval clip that matches the window frame shape
        clipPath:  'ellipse(48% 50% at 50% 50%)',
        overflow:  'hidden',
        opacity:   globeReady ? 1 : 0,
        transition:'opacity 1.2s ease',
        zIndex:    2,
        pointerEvents: 'none',
      }}>
        <Suspense fallback={null}>
          <GlobeEntry onReady={() => setGlobeReady(true)} />
        </Suspense>
      </div>

      {/* ── Inner vignette — blends globe edges with frame ── */}
      <div style={{
        position:  'absolute',
        left:      HUBLOT.left,
        top:       HUBLOT.top,
        width:     HUBLOT.width,
        height:    HUBLOT.height,
        transform: 'translate(-50%, -50%)',
        clipPath:  'ellipse(48% 50% at 50% 50%)',
        background:'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.45) 74%, rgba(0,0,0,0.88) 100%)',
        pointerEvents: 'none',
        zIndex:    3,
      }} />

      {/* ── Atmosphere halo just outside the frame ── */}
      <div style={{
        position:  'absolute',
        left:      HUBLOT.left,
        top:       HUBLOT.top,
        width:     `calc(${HUBLOT.width} + 3%)`,
        height:    `calc(${HUBLOT.height} + 3%)`,
        transform: 'translate(-50%, -50%)',
        background:'radial-gradient(ellipse at center, transparent 46%, rgba(40,90,220,0.05) 62%, rgba(70,130,255,0.09) 76%, transparent 92%)',
        pointerEvents: 'none',
        zIndex:    1,
      }} />

      {/* ── Cursor light canvas ── */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
      }} />

      {/* ── Loading hint ── */}
      {!globeReady && (
        <div style={{
          position:    'absolute',
          left:        HUBLOT.left,
          top:         HUBLOT.top,
          transform:   'translate(-50%, -50%)',
          fontFamily:  "'DM Mono', monospace",
          fontSize:    10,
          letterSpacing: '0.18em',
          color:       'rgba(255,255,255,0.18)',
          zIndex:      5,
          pointerEvents: 'none',
        }}>
          loading...
        </div>
      )}

      {/* ── Top label ── */}
      <div style={{
        position:    'absolute',
        top:         28,
        left:        '50%',
        transform:   'translateX(-50%)',
        fontFamily:  "'DM Mono', monospace",
        fontSize:    10,
        letterSpacing: '0.22em',
        color:       'rgba(255,255,255,0.18)',
        textTransform: 'uppercase',
        whiteSpace:  'nowrap',
        zIndex:      10,
      }}>
        H · I · T &nbsp;·&nbsp; Ottawa → Everywhere
      </div>

      {/* ── ENTER button ── */}
      <button
        onClick={handleEnter}
        style={{
          position:    'absolute',
          bottom:      48,
          left:        '50%',
          transform:   'translateX(-50%)',
          padding:     '10px 42px',
          background:  'transparent',
          border:      '0.5px solid rgba(255,255,255,0.22)',
          color:       'rgba(255,255,255,0.55)',
          fontFamily:  "'DM Mono', monospace",
          fontSize:    11,
          letterSpacing: '0.28em',
          cursor:      'pointer',
          zIndex:      10,
          transition:  'all 0.3s ease',
          opacity:     exiting ? 0 : 1,
        }}
        onMouseEnter={e => {
          const b = e.currentTarget;
          b.style.color       = '#fff';
          b.style.borderColor = 'rgba(255,255,255,0.5)';
          b.style.background  = 'rgba(255,255,255,0.04)';
        }}
        onMouseLeave={e => {
          const b = e.currentTarget;
          b.style.color       = 'rgba(255,255,255,0.55)';
          b.style.borderColor = 'rgba(255,255,255,0.22)';
          b.style.background  = 'transparent';
        }}
      >
        ENTER
      </button>

      {/* ── Fade to black ── */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: '#0d0d0d',
        opacity:    exiting ? 1 : 0,
        transition: 'opacity 0.85s ease',
        pointerEvents: 'none',
        zIndex:     20,
      }} />
    </div>
  );
}