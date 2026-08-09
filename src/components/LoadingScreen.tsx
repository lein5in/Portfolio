interface LoadingScreenProps {
  progress: number;
  visible: boolean;
}

const PATH = 'M60,60 C60,26 94,26 120,60 C146,94 180,94 180,60 C180,26 146,26 120,60 C94,94 60,94 60,60 Z';

export default function LoadingScreen({ progress, visible }: LoadingScreenProps) {
  const pct = Math.min(100, Math.round(progress * 100));

  return (
    <div style={{
      position:      'fixed',
      inset:         0,
      zIndex:        50,
      background:    '#000000',
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      justifyContent: 'center',
      opacity:       visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition:    'opacity 0.7s ease',
    }}>
      <svg width="140" height="70" viewBox="0 0 240 120" style={{ marginBottom: 44 }}>
        <path d={PATH} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={2.5} />
        <path
          d={PATH}
          fill="none"
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="70 640"
          style={{ animation: 'pf-loading-trace 2.6s linear infinite' }}
        />
      </svg>

      <div style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           14,
      }}>
        <div style={{
          width:        160,
          height:       1,
          background:   'rgba(255,255,255,0.12)',
          overflow:     'hidden',
        }}>
          <div style={{
            height:     '100%',
            width:      `${pct}%`,
            background: 'rgba(255,255,255,0.75)',
            transition: 'width 0.25s ease-out',
          }} />
        </div>

        <div style={{
          fontFamily:    "'Space Mono', monospace",
          fontSize:      10,
          letterSpacing: '0.28em',
          color:         'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
        }}>
          Loading {pct}%
        </div>
      </div>

      <style>{`
        @keyframes pf-loading-trace {
          to { stroke-dashoffset: -710; }
        }
      `}</style>
    </div>
  );
}