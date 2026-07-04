import React from 'react';
import { Fade, RevealText, mono, sectionLabel, divider } from './PortfolioLayout';
import type { SectionId } from '../../three/sections';

// ─── PHRASES ──────────────────────────────────────────────────────────────────

const phrases = [
  {
    text: "I didn't grow up dreaming of a computer science degree. I grew up curious — about how things work, why they break, and what happens when you push them past their limits.",
    size: 'large',
  },
  {
    text: "Somewhere along the way I discovered that software is the closest thing we have to building a thought and watching it run.",
    size: 'large',
  },
  {
    text: "I'm drawn to problems that sit at the edge of what's easy — voice assistants that need to feel instant, study tools that need to feel calm, interfaces that need to feel alive.",
    size: 'medium',
  },
  {
    text: "I build across the stack, from CUDA inference pipelines to Chrome extensions to GLSL shaders, because the engineers I admire most understand what's happening at every layer.",
    size: 'medium',
  },
  {
    text: "Originally from Côte d'Ivoire. Now in Ottawa. Bilingual. Always building.",
    size: 'small',
  },
];

const stats = [
  { value: '3',    label: 'Languages spoken' },
  { value: '4+',   label: 'Projects shipped'  },
  { value: '2026', label: 'Co-op ready'        },
];

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface AboutSectionProps {
  setRef: (id: SectionId) => (el: HTMLElement | null) => void;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function AboutSection({ setRef }: AboutSectionProps) {
  return (
    <>
      <div className="pf-divider" style={divider} />

      <section ref={setRef('about')} className="pf-section-pad" style={{ padding: '110px 64px' }}>

        {/* Label */}
        <Fade>
          <div style={sectionLabel}>About</div>
        </Fade>

        {/* Phrases */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginBottom: 80 }}>
          {phrases.map((p, i) => (
            p.size === 'small' ? (
              <Fade key={i} delay={i * 0.04}>
                <p style={phraseStyle('small')}>{p.text}</p>
              </Fade>
            ) : (
              <RevealText
                key={i}
                as="p"
                text={p.text}
                delay={i * 0.03}
                className={i === 0 ? 'pf-breakout' : undefined}
                style={i === 0
                  ? { ...phraseStyle('large'), maxWidth: 'min(78vw, 760px)', fontSize: 'clamp(26px,3.4vw,40px)' }
                  : phraseStyle(p.size as 'large' | 'medium')}
              />
            )
          ))}
        </div>

        {/* Stats */}
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
                  fontSize:      40,
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
                  fontSize:      11,
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

        {/* Currently */}
        <Fade>
          <div>
            <div style={{
              ...mono,
              fontSize:      11,
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
                    fontSize:      11,
                    color:         'rgba(255,255,255,0.48)',
                    letterSpacing: '0.12em',
                    minWidth:      88,
                    textTransform: 'uppercase',
                  } as React.CSSProperties}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize:   14,
                    color:      'rgba(255,255,255,0.5)',
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

      </section>
    </>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

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
    fontSize:      'clamp(20px,2.4vw,28px)',
    fontWeight:    700,
    color:         'rgba(255,255,255,0.88)',
    lineHeight:    1.25,
    letterSpacing: '-0.01em',
  };
  if (size === 'medium') return {
    ...base,
    fontFamily: "'Space Mono', monospace",
    fontSize:   14.5,
    color:      'rgba(255,255,255,0.74)',
    lineHeight: 1.9,
  };
  return {
    ...base,
    fontFamily:    "'Space Mono', monospace",
    fontSize:      12,
    letterSpacing: '0.18em',
    color:         'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  };
}