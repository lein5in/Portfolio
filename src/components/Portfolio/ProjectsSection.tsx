import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaGithub, FaArrowRight, FaTimes } from 'react-icons/fa';
import { Fade, mono, sectionLabel, divider } from './PortfolioLayout';
import ProjectGallery from './ProjectGallery';
import GitHubActivityFeed from './GitHubActivityFeed';
import { navigate } from '../../router';
import type { SectionId } from '../../three/sections';

const projects = [
  {
    num: '01',
    title: 'MARA',
    subtitle: 'Modular Adaptive Response Assistant',
    status: 'Completed',
    period: 'Apr. 2026 — Jun. 2026',
    summary: 'A fully local, voice-driven personal AI assistant inspired by JARVIS — built from scratch in Python, running 24/7 with sub-second response time.',
    tech: ['Python', 'Claude Sonnet 4.6', 'Claude Haiku', 'Whisper (CUDA)', 'Fish Audio', 'PyQt5', 'Selenium', 'Fernet'],
    github: 'https://github.com/lein5in/MARA',
    images: ['/mara1.png', '/mara2.png'],
    noThumb: false,
    previewLabel: null as string | null,
    caseStudy: '/case-study/mara',
  },
  {
    num: '02',
    title: 'Seren',
    subtitle: 'Chrome Extension + Study Platform',
    status: 'In Development',
    period: 'Apr. 2026 — Present',
    summary: "A Chrome extension + web platform that lives in your browser as a study companion — knows your deadlines, quizzes you, reduces cognitive load during high-stress periods.",
    tech: ['React', 'TypeScript', 'FastAPI', 'Claude API', 'PostgreSQL', 'Chrome MV3', 'JWT', 'SQLAlchemy'],
    github: 'https://github.com/lein5in/Seren',
    images: ['/seren1.png', '/seren2.png', '/seren3.png'],
    noThumb: false,
    previewLabel: null as string | null,
    caseStudy: '/case-study/seren',
  },
  {
    num: '03',
    title: 'AITradingAgent',
    subtitle: 'Multi-Agent Algorithmic Trading System',
    status: 'Active',
    period: 'Jan. 2026 — Present',
    summary: 'An event-driven, multi-agent crypto trading system built on one rule: every strategy has to clear backtesting and a fixed significance bar before it touches real capital.',
    tech: ['Python', 'FastAPI', 'Redis', 'PostgreSQL', 'TimescaleDB', 'ccxt', 'Pydantic'],
    github: null as string | null,
    images: [] as string[],
    noThumb: false,
    previewLabel: 'SOON',
    caseStudy: '/case-study/aitradingagent',
  },
  {
    num: '04',
    title: 'This Portfolio',
    subtitle: 'Interactive 3D Portfolio',
    status: 'Completed',
    period: 'Jun. 2026',
    summary: 'A portfolio built around a photorealistic Three.js solar system — camera flies to a planet per section, GLSL atmosphere shaders, GSAP-driven transitions throughout.',
    tech: ['React', 'TypeScript', 'Three.js', 'GLSL', 'GSAP', 'Vite', 'EmailJS'],
    github: 'https://github.com/lein5in/Portfolio',
    images: [] as string[],
    previewLabel: null as string | null,
    noThumb: true,
    caseStudy: '/build',
  },
];

type Project = typeof projects[number];

interface ProjectsSectionProps {
  setRef: (id: SectionId) => (el: HTMLElement | null) => void;
}

export default function ProjectsSection({ setRef }: ProjectsSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const openProject = openIdx !== null ? projects[openIdx] : null;

  return (
    <>
      <div className="pf-divider" style={divider} />

      <section ref={setRef('projects')} className="pf-section-pad" style={{ padding: '110px 64px' }}>

        <Fade>
          <div style={sectionLabel}>Selected Projects</div>
          <h2 style={sectionTitle}>
            What I've<br />built.
          </h2>
        </Fade>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {projects.map((p, i) => (
            <Fade key={p.title} delay={i * 0.05}>
              <button
                onClick={() => setOpenIdx(i)}
                className="pf-project-row"
                style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:           32,
                  width:         '100%',
                  textAlign:     'left',
                  background:    'none',
                  border:        'none',
                  borderBottom:  '0.5px solid rgba(255,255,255,0.06)',
                  padding:       '28px 0',
                  cursor:        'pointer',
                }}
              >
                <div style={{ flex: p.noThumb ? '1 1 100%' : '1 1 55%', display: 'flex', alignItems: 'baseline', gap: 18 }}>
                  <span style={{ ...mono, fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' } as React.CSSProperties}>
                    {p.num}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize:   24.2,
                      fontWeight: 600,
                      color:      '#ffffff',
                      marginBottom: 8,
                      letterSpacing: '-0.01em',
                    }}>
                      {p.title}
                    </div>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize:   13.5,
                      color:      'rgba(255,255,255,0.55)',
                      lineHeight: 1.65,
                      maxWidth:   p.noThumb ? 640 : 420,
                    }}>
                      {p.summary}
                    </div>
                  </div>
                </div>

                {!p.noThumb && (
                  <div className="pf-project-thumb" style={{
                    flex:         '0 0 220px',
                    height:       130,
                    borderRadius: 4,
                    overflow:     'hidden',
                    background:   'rgba(255,255,255,0.02)',
                    border:       '0.5px solid rgba(255,255,255,0.07)',
                  }}>
                    {p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ ...mono, fontSize: p.previewLabel === 'SOON' ? 13 : 11, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.14em' } as React.CSSProperties}>
                          {p.previewLabel ?? 'NO PREVIEW'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </button>
            </Fade>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
        <Fade>
          <a
            href="https://github.com/lein5in"
            target="_blank"
            rel="noopener noreferrer"
            style={githubCta}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >
            <FaGithub size={12} /> MORE ON GITHUB →
          </a>
        </Fade>

        <Fade>
          <GitHubActivityFeed />
        </Fade>
        </div>

      </section>

      {openProject && createPortal(
        <ProjectModal project={openProject} onClose={() => setOpenIdx(null)} />,
        document.body
      )}
    </>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={closeBtnStyle} aria-label="Close">
          <FaTimes size={13} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: project.status === 'Completed' ? '#7ecfa0' : 'rgba(255,255,255,0.4)',
          }} />
          <span style={{ ...mono, fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' } as React.CSSProperties}>
            {project.status} · {project.period}
          </span>
        </div>

        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 35.2, fontWeight: 600, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>
          {project.title}
        </h3>
        <div style={{ ...mono, fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 22 } as React.CSSProperties}>
          {project.subtitle}
        </div>

        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 14.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.85, marginBottom: 28 }}>
          {project.summary}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 32 }}>
          {project.tech.map(t => (
            <span key={t} style={{ ...mono, fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' } as React.CSSProperties}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', borderTop: '0.5px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" style={modalLinkStyle}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              <FaGithub size={13} /> VIEW ON GITHUB
            </a>
          )}
          {project.images.length > 0 && (
            <ProjectGallery images={project.images} label="VIEW IMAGES" />
          )}
          {project.caseStudy && (
            <button
              onClick={() => { onClose(); navigate(project.caseStudy); }}
              style={{ ...modalLinkStyle, background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              <FaArrowRight size={12} /> CASE STUDY
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontFamily:    "'Space Grotesk', sans-serif",
  fontSize:      'clamp(45.4px,5.5vw,77.8px)',
  fontWeight:    600,
  color:         '#ffffff',
  lineHeight:    1.0,
  letterSpacing: '-0.025em',
  marginBottom:  56,
};

const githubCta: React.CSSProperties = {
  display:        'inline-flex',
  alignItems:     'center',
  gap:            8,
  fontFamily:     "'Space Mono', monospace",
  fontSize:       13,
  letterSpacing:  '0.18em',
  color:          'rgba(255,255,255,0.6)',
  textDecoration: 'none',
  transition:     'color 0.2s',
};

const overlayStyle: React.CSSProperties = {
  position:       'fixed',
  inset:          0,
  background:     'rgba(6,6,6,0.88)',
  zIndex:         200,
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  padding:        24,
};

const cardStyle: React.CSSProperties = {
  position:     'relative',
  width:        '100%',
  maxWidth:     560,
  maxHeight:    '86vh',
  overflowY:    'auto',
  background:   '#0d0d0d',
  border:       '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: 4,
  padding:      '40px 40px 32px',
};

const closeBtnStyle: React.CSSProperties = {
  position:     'absolute',
  top:          20,
  right:        20,
  background:   'none',
  border:       '1px solid rgba(255,255,255,0.15)',
  borderRadius: '50%',
  width:        30,
  height:       30,
  display:      'flex',
  alignItems:   'center',
  justifyContent: 'center',
  color:        'rgba(255,255,255,0.6)',
  cursor:       'pointer',
};

const modalLinkStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  gap:            8,
  fontFamily:     "'Space Mono', monospace",
  fontSize:       13,
  letterSpacing:  '0.14em',
  color:          'rgba(255,255,255,0.6)',
  textDecoration: 'none',
  transition:     'color 0.2s',
};