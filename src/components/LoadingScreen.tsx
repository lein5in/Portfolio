

interface LoadingScreenProps {
  progress: number;
  visible: boolean;
}

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
      transition:    'opacity 0.6s ease',
    }}>
      <div style={{
        fontSize:   'clamp(64px,10vw,120px)',
        fontWeight: 900,
        color:      '#ffffff',
        lineHeight: 1,
        marginBottom: 40,
        animation:  'pf-infinity-pulse 2.2s ease-in-out infinite',
      }}>
        ∞
      </div>

      <div style={{
        width:        180,
        height:       2,
        background:   'rgba(255,255,255,0.15)',
        borderRadius: 2,
        overflow:     'hidden',
      }}>
        <div style={{
          height:     '100%',
          width:      `${pct}%`,
          background: '#ffffff',
          transition: 'width 0.25s ease-out',
        }} />
      </div>

      <div style={{
        marginTop:     16,
        fontFamily:    "'Space Mono', monospace",
        fontSize:      11,
        letterSpacing: '0.2em',
        color:         'rgba(255,255,255,0.35)',
        textTransform: 'uppercase',
      }}>
        {pct}%
      </div>

      <style>{`
        @keyframes pf-infinity-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.94); }
        }
      `}</style>
    </div>
  );
}