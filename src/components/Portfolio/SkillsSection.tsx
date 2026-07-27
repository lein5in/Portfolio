import React from 'react';
import { Fade, mono, sectionLabel, divider } from './PortfolioLayout';
import type { SectionId } from '../../three/sections';



const skillGroups = [
  {
    label: 'Languages',
    skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'HTML / CSS', 'SQL'],
  },
  {
    label: 'Frameworks',
    skills: ['React', 'FastAPI', 'Node.js', 'Tailwind CSS', 'Scikit-Learn', 'NumPy', 'Librosa', 'SQLAlchemy', 'PyQt5', 'Selenium'],
  },
  {
    label: 'Databases & Tools',
    skills: ['PostgreSQL', 'MySQL', 'SQLite', 'Git', 'Docker', 'Linux', 'JWT', 'Chrome MV3', 'CI/CD'],
  },
  {
    label: 'AI & ML',
    skills: ['Claude API', 'OpenAI Whisper', 'PyTorch', 'CUDA', 'Demucs', 'Basic-Pitch', 'Prompt Engineering'],
  },
  {
    label: '3D & Graphics',
    skills: ['Three.js', 'GLSL', 'WebGL', 'Shader Programming'],
  },
];

const softSkills = [
  'Problem Solving',
  'Systems Thinking',
  'Bilingual EN/FR',
  'Async Collaboration',
  'Technical Writing',
  'Self-directed',
];



interface SkillsSectionProps {
  setRef: (id: SectionId) => (el: HTMLElement | null) => void;
}

export default function SkillsSection({ setRef }: SkillsSectionProps) {
  return (
    <>
      <div className="pf-divider" style={divider} />

      <section ref={setRef('skills')} className="pf-section-pad" style={{ padding: '110px 64px' }}>

        <Fade>
          <div style={sectionLabel}>Skills</div>
          <h2 style={sectionTitle}>
            What I work<br />with.
          </h2>
        </Fade>

        {}
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          borderTop:     '0.5px solid rgba(255,255,255,0.06)',
          marginBottom:  2,
        }}>
          {skillGroups.map((g, i) => (
            <Fade key={g.label} delay={i * 0.05}>
              <div className="pf-skills-row" style={{
                padding:      '24px 0',
                display:      'grid',
                gridTemplateColumns: '140px 1fr',
                gap:          24,
                alignItems:   'start',
                borderBottom: '0.5px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{
                  ...mono,
                  fontSize:      12,
                  color:         'rgba(255,255,255,0.45)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  paddingTop:    4,
                } as React.CSSProperties}>
                  {g.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {g.skills.map(s => (
                    <span
                      key={s}
                      style={skillTag}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.58)'; }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Fade>
          ))}

          {}
          <Fade>
            <div className="pf-skills-row" style={{
              padding:      '24px 0',
              display:      'grid',
              gridTemplateColumns: '140px 1fr',
              gap:          24,
              alignItems:   'center',
            }}>
              <div style={{
                ...mono,
                fontSize:      12,
                color:         'rgba(255,255,255,0.45)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              } as React.CSSProperties}>
                Other
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {softSkills.map(s => (
                  <span key={s} style={{
                    fontFamily:    "'Space Mono', monospace",
                    fontSize:      12,
                    color:         'rgba(255,255,255,0.55)',
                    letterSpacing: '0.06em',
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Fade>
        </div>

      </section>
    </>
  );
}



const sectionTitle: React.CSSProperties = {
  fontFamily:    "'Space Grotesk', sans-serif",
  fontSize:      'clamp(45.4px,5.5vw,77.8px)',
  fontWeight:    700,
  color:         '#ffffff',
  lineHeight:    1.0,
  letterSpacing: '-0.025em',
  marginBottom:  52,
};

const skillTag: React.CSSProperties = {
  fontFamily:    "'Space Mono', monospace",
  fontSize:      12,
  color:         'rgba(255,255,255,0.72)',
  letterSpacing: '0.06em',
  cursor:        'default',
  transition:    'color 0.2s',
};