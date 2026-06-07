import React from 'react';
import { Fade, mono, sectionLabel, divider } from './PortfolioLayout';
import type { SectionId } from './GlobePortfolio';

// ─── COMPONENT ────────────────────────────────────────────────────────────────

interface ExperienceSectionProps {
  setRef: (id: SectionId) => (el: HTMLElement | null) => void;
}

export default function ExperienceSection({ setRef }: ExperienceSectionProps) {
  return (
    <>
      <div style={divider} />

      <section ref={setRef('experience')} style={{ padding: '110px 64px' }}>

        <Fade>
          <div style={sectionLabel}>Experience & Education</div>
          <h2 style={sectionTitle}>
            Where I've<br />been.
          </h2>
        </Fade>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52 }}>

          {/* ── WORK ── */}
          <div>
            <Fade>
              <div style={{
                ...mono,
                fontSize:      11,
                color:         'rgba(255,255,255,0.45)',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                marginBottom:  36,
              } as React.CSSProperties}>
                Work
              </div>
            </Fade>

            <div style={{ position: 'relative', paddingLeft: 20 }}>
              <div style={{
                position:   'absolute',
                left:       0,
                top:        8,
                bottom:     0,
                width:      '0.5px',
                background: 'rgba(255,255,255,0.06)',
              }} />

              {/* DataAnnotation */}
              <Fade>
                <div style={{ position: 'relative', marginBottom: 48 }}>
                  <Dot filled />
                  <div style={{
                    ...mono,
                    fontSize:      11,
                    color:         'rgba(255,255,255,0.48)',
                    letterSpacing: '0.1em',
                    marginBottom:  8,
                  }}>
                    Jun 2025 — Oct 2025
                  </div>
                  <div style={{
                    fontFamily:    "'Syne', sans-serif",
                    fontSize:      16,
                    color:         '#ffffff',
                    fontWeight:    700,
                    marginBottom:  4,
                    letterSpacing: '-0.01em',
                  }}>
                    Data Annotation & AI Training Specialist
                  </div>
                  <div style={{
                    ...mono,
                    fontSize:      12,
                    color:         'rgba(255,255,255,0.52)',
                    marginBottom:  18,
                  }}>
                    DataAnnotation · Remote, ON
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                    {[
                      'Annotated and evaluated datasets across 5+ ML projects to train and benchmark production models',
                      'Built Python automation scripts reducing manual annotation effort by ~30%',
                      'Delivered structured feedback that improved labeling consistency across projects',
                      'Identified systematic labeling errors and refined annotation guidelines',
                    ].map(b => <Bullet key={b} text={b} />)}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['Python', 'Scikit-Learn', 'Machine Learning', 'Data Analysis'].map(s => (
                      <span key={s} style={techTag}>{s}</span>
                    ))}
                  </div>
                </div>
              </Fade>

              {/* Future */}
              <Fade>
                <div style={{ position: 'relative' }}>
                  <Dot filled={false} />
                  <div style={{
                    ...mono,
                    fontSize:      11,
                    color:         'rgba(255,255,255,0.58)',
                    letterSpacing: '0.1em',
                    marginBottom:  6,
                  }}>
                    Summer 2026
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize:   12,
                    color:      'rgba(255,255,255,0.48)',
                    fontStyle:  'italic',
                  }}>
                    Actively seeking 4-month Co-op internship
                  </div>
                </div>
              </Fade>
            </div>
          </div>

          {/* ── EDUCATION ── */}
          <div>
            <Fade>
              <div style={{
                ...mono,
                fontSize:      11,
                color:         'rgba(255,255,255,0.45)',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                marginBottom:  36,
              } as React.CSSProperties}>
                Education
              </div>
            </Fade>

            <div style={{ position: 'relative', paddingLeft: 20 }}>
              <div style={{
                position:   'absolute',
                left:       0,
                top:        8,
                bottom:     0,
                width:      '0.5px',
                background: 'rgba(255,255,255,0.06)',
              }} />

              {/* uOttawa */}
              <Fade>
                <div style={{ position: 'relative', marginBottom: 48 }}>
                  <Dot filled />
                  <div style={{
                    ...mono,
                    fontSize:      11,
                    color:         'rgba(255,255,255,0.48)',
                    letterSpacing: '0.1em',
                    marginBottom:  8,
                  }}>
                    Sep 2024 — Apr 2028
                  </div>
                  <div style={{
                    fontFamily:    "'Syne', sans-serif",
                    fontSize:      16,
                    color:         '#ffffff',
                    fontWeight:    700,
                    marginBottom:  4,
                    letterSpacing: '-0.01em',
                  }}>
                    B.Sc. Computer Science (Co-op)
                  </div>
                  <div style={{
                    ...mono,
                    fontSize:  12,
                    color:     'rgba(255,255,255,0.52)',
                    marginBottom: 18,
                  }}>
                    University of Ottawa · Ottawa, ON
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                    {[
                      'International Student Merit Scholarship — $36,000/year',
                      'Relevant: Data Structures & Algorithms, Computer Architecture, Software Engineering',
                      'Co-op program — structured internship semesters integrated with academic terms',
                    ].map(b => <Bullet key={b} text={b} />)}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['Algorithms', 'Software Engineering', 'Architecture', 'Co-op'].map(s => (
                      <span key={s} style={techTag}>{s}</span>
                    ))}
                  </div>
                </div>
              </Fade>

              {/* High school */}
              <Fade>
                <div style={{ position: 'relative' }}>
                  <Dot filled={false} />
                  <div style={{
                    ...mono,
                    fontSize:      11,
                    color:         'rgba(255,255,255,0.32)',
                    letterSpacing: '0.1em',
                    marginBottom:  6,
                  }}>
                    2017 — 2024
                  </div>
                  <div style={{
                    fontFamily:    "'Syne', sans-serif",
                    fontSize:      14,
                    color:         'rgba(255,255,255,0.45)',
                    fontWeight:    600,
                    marginBottom:  4,
                  }}>
                    High School Diploma
                  </div>
                  <div style={{
                    ...mono,
                    fontSize: 12,
                    color:    'rgba(255,255,255,0.42)',
                  }}>
                    Collège Saint-Viateur d'Abidjan · Côte d'Ivoire
                  </div>
                </div>
              </Fade>
            </div>
          </div>
        </div>

        {/* Languages row */}
        <Fade>
          <div style={{
            marginTop:     60,
            paddingTop:    28,
            borderTop:     '0.5px solid rgba(255,255,255,0.05)',
            display:       'flex',
            alignItems:    'center',
            gap:           36,
            flexWrap:      'wrap',
          }}>
            <span style={{
              ...mono,
              fontSize:      11,
              color:         'rgba(255,255,255,0.58)',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
            } as React.CSSProperties}>
              Languages
            </span>
            {[
              { l: 'English', lv: 'Fluent' },
              { l: 'French',  lv: 'Fluent' },
              { l: 'Arabic',  lv: 'Basic'  },
            ].map(({ l, lv }) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize:   14,
                  color:      'rgba(255,255,255,0.55)',
                  fontWeight: 600,
                }}>
                  {l}
                </span>
                <span style={{
                  ...mono,
                  fontSize:      11,
                  color:         'rgba(255,255,255,0.45)',
                  letterSpacing: '0.1em',
                }}>
                  {lv}
                </span>
              </div>
            ))}
          </div>
        </Fade>

      </section>
    </>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Dot({ filled }: { filled: boolean }) {
  return (
    <div style={{
      position:     'absolute',
      left:         -23,
      top:          6,
      width:        6,
      height:       6,
      borderRadius: '50%',
      background:   filled ? 'rgba(255,255,255,0.7)' : '#0a0a0a',
      border:       filled ? 'none' : '0.5px solid rgba(255,255,255,0.18)',
      boxShadow:    filled ? '0 0 0 3px rgba(255,255,255,0.06)' : 'none',
    }} />
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{
        color:     'rgba(255,255,255,0.38)',
        flexShrink: 0,
        fontSize:  11,
        marginTop: 2,
      }}>
        —
      </span>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize:   12,
        color:      'rgba(255,255,255,0.58)',
        lineHeight: 1.75,
      }}>
        {text}
      </span>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const sectionTitle: React.CSSProperties = {
  fontFamily:    "'Syne', sans-serif",
  fontSize:      'clamp(42px,5.5vw,72px)',
  fontWeight:    800,
  color:         '#ffffff',
  lineHeight:    1.0,
  letterSpacing: '-0.025em',
  marginBottom:  52,
};

const techTag: React.CSSProperties = {
  fontFamily:    "'DM Mono', monospace",
  fontSize:      11,
  color:         'rgba(255,255,255,0.52)',
  background:    'transparent',
  border:        '0.5px solid rgba(255,255,255,0.07)',
  padding:       '3px 9px',
  borderRadius:  2,
  letterSpacing: '0.06em',
};