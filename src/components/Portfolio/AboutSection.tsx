import React from 'react';
import { Fade, mono, sectionLabel, divider } from './PortfolioLayout';
import type { SectionId } from '../../three/sections';

const phrases = [
  {
    text: "I grew up curious — about how things work, why they break, and what happens when you push them past their limits.",
    size: 'large',
  },
  {
    text: "Software is the closest thing I've found to building a thought and watching it run.",
    size: 'medium',
  },
  {
    text: "Originally from Côte d'Ivoire. Now in Ottawa. Bilingual. Always building.",
    size: 'small',
  },
];

const stats = [
  { value: '<1s',  label: 'MARA response latency' },
  { value: '~30%', label: 'Annotation effort reduced' },
  { value: '3',    label: 'Full-stack projects shipped' },
];

const next = [
  'Seren — building out persistent memory for conversations and flashcards',
  'AITradingAgent — testing strategies against more historical data',
  'This portfolio — new case studies as things ship',
];

interface AboutSectionProps {
  setRef: (id: SectionId) => (el: HTMLElement | null) => void;
}

export default function AboutSection({ setRef }: AboutSectionProps) {
  return (
    <>
      <div className="pf-divider" style={divider} />

      <section ref={setRef('about')} className="pf-section-pad" style={{ padding: '110px 64px' }}>

        <Fade>
          <div style={sectionLabel}>About</div>
        </Fade>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginBottom: 80 }}>
          {phrases.map((p, i) => (
            <Fade key={i} delay={i * 0.18}>
              <p
                className={i === 0 ? 'pf-breakout' : undefined}
                style={i === 0
                  ? { ...phraseStyle('large'), maxWidth: 'min(78vw, 760px)', fontSize: 'clamp(28.6px,3.4vw,43.2px)' }
                  : phraseStyle(p.size as 'large' | 'medium' | 'small')}
              >
                {p.text}
              </p>
            </Fade>
          ))}
        </div>

        <Fade>
          <div className="pf-stats-grid" style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap:                 1,
            background:          'rgba(255,255,255,0.03)',
            borderTop:           '0.5px solid rgba(255,255,255,0.06)',
            borderBottom:        '0.5px solid rgba(255,255,255,0.06)',
            marginBottom:        48,
            overflow:            'hidden',
          }}>
            {stats.map(({ value, label }, i) => (
              <div key={label} style={{
                background:  '#0a0a0a',
                padding:     '32px 20px',
                textAlign:   'center',
                borderLeft:  i > 0 ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{
                  fontFamily:    "'Space Grotesk', sans-serif",
                  fontSize:      43.2,
                  color:         '#ffffff',
                  fontWeight:    700,
                  lineHeight:    1,
                  marginBottom:  10,
                  letterSpacing: '-0.02em',
                }}>
                  {value}
                </div>
                <div style={{
                  ...mono,
                  fontSize:      12,
                  color:         'rgba(255,255,255,0.42)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                } as React.CSSProperties}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Fade>

        <Fade>
          <div style={{ marginBottom: 40 }}>
            <div style={{
              ...mono,
              fontSize:      12,
              color:         'rgba(255,255,255,0.45)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              marginBottom:  24,
            } as React.CSSProperties}>
              Currently
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Building',     value: 'MARA · Seren · This portfolio'                    },
                { label: 'Studying',     value: 'B.Sc. Computer Science — University of Ottawa'     },
                { label: 'Looking for',  value: 'Co-op · 4 months · Ottawa or remote'   },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
                  <span style={{
                    ...mono,
                    fontSize:      12,
                    color:         'rgba(255,255,255,0.48)',
                    letterSpacing: '0.12em',
                    minWidth:      88,
                    textTransform: 'uppercase',
                  } as React.CSSProperties}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize:   16,
                    color:      'rgba(255,255,255,0.68)',
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Fade>

        <Fade>
          <div>
            <div style={{
              ...mono,
              fontSize:      12,
              color:         'rgba(255,255,255,0.45)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              marginBottom:  24,
            } as React.CSSProperties}>
              What's Next
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {next.map(item => (
                <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    color:     'rgba(255,255,255,0.35)',
                    flexShrink: 0,
                    fontSize:  13,
                    marginTop: 2,
                  }}>
                    •
                  </span>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize:   14,
                    color:      'rgba(255,255,255,0.68)',
                    lineHeight: 1.7,
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Fade>

      </section>
    </>
  );
}

function phraseStyle(size: 'large' | 'medium' | 'small'): React.CSSProperties {
  const base: React.CSSProperties = {
    color:      'rgba(255,255,255,0.65)',
    lineHeight: 1.55,
    fontWeight: 400,
    maxWidth:   520,
  };
  if (size === 'large') return {
    ...base,
    fontFamily:    "'Space Grotesk', sans-serif",
    fontSize:      'clamp(22px,2.4vw,30.8px)',
    fontWeight:    700,
    color:         'rgba(255,255,255,0.88)',
    lineHeight:    1.25,
    letterSpacing: '-0.01em',
  };
  if (size === 'medium') return {
    ...base,
    fontFamily: "'Space Mono', monospace",
    fontSize:   16.5,
    color:      'rgba(255,255,255,0.8)',
    lineHeight: 1.9,
  };
  return {
    ...base,
    fontFamily:    "'Space Mono', monospace",
    fontSize:      13,
    letterSpacing: '0.18em',
    color:         'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  };
}