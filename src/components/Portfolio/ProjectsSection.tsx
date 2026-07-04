import React from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Fade, mono, sectionLabel, divider } from './PortfolioLayout';
import type { SectionId } from '../../three/sections';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const projects = [
  {
    num: '01',
    title: 'MARA',
    subtitle: 'Modular Adaptive Response Assistant',
    status: 'Completed',
    period: 'Apr. 2026 — Jun. 2026',
    summary: 'A fully local, voice-driven personal AI assistant inspired by JARVIS — built from scratch in Python, running 24/7 on a Windows laptop with sub-second response time.',
    description: 'The key engineering insight behind MARA is parallel inference: Haiku and Sonnet run simultaneously. By the time Haiku classifies intent (~150ms), Sonnet has already started generating a response — eliminating nearly all perceived latency. Whisper runs locally on CUDA for STT, Fish Audio streams TTS in real-time via PCM, and a custom PyQt5 orb visualizes assistant state.',
    bullets: [
      'Push-to-talk via Logitech G502 sniper button mapped to F13 — hardware-level trigger',
      'Parallel Haiku + Sonnet inference pipeline achieving <1s response on simple queries',
      'Whisper turbo on CUDA for local STT — zero network dependency for speech recognition',
      '10+ system control actions: volume, brightness, WiFi, screenshots, app management',
      'Full browser automation via Selenium with encrypted credential storage',
      'Vision mode — Claude Vision analyzes live screenshots for autonomous browser interaction',
      'Persistent encrypted memory with Fernet + automatic conversation summarization',
      '3D neural orb UI — custom PyQt5 OpenGL widget that pulses based on assistant state',
    ],
    tech: ['Python', 'Claude Sonnet 4.6', 'Claude Haiku', 'Whisper (CUDA)', 'Fish Audio', 'PyQt5', 'Selenium', 'Fernet'],
    github: 'https://github.com/lein5in/MARA',
    live: null,
  },
  {
    num: '02',
    title: 'Seren',
    subtitle: 'Chrome Extension + Study Platform',
    status: 'In Development',
    period: 'Apr. 2026 — Present',
    summary: "A Chrome extension + web platform that lives in your browser as a study companion — knows your deadlines, helps you understand what you're reading, quizzes you on your material, and reduces cognitive load during high-stress periods.",
    description: 'Seren is architectured across three layers: a Manifest V3 Chrome extension with a floating toolbar that surfaces on any text selection, a React + Vite frontend with a full dashboard, and a FastAPI backend with JWT auth and PostgreSQL. The extension and web platform share a JWT session — log in once on the site, state syncs instantly to the popup.',
    bullets: [
      'Floating AI toolbar on any text selection — instant Solve, Summarize, Quiz me, Save actions',
      'SOS mode — overwhelmed? Seren surfaces exactly one task to focus on right now',
      'Pomodoro focus timer with visual ring progress built into the extension popup',
      'Full-tab mode — expand popup into a two-column app with sidebar + main panel',
      '.ics calendar import — paste your uOzone schedule, deadlines appear automatically',
      'FastAPI backend with JWT auth, 30-day sessions, full account management',
    ],
    tech: ['React', 'TypeScript', 'FastAPI', 'Claude API', 'PostgreSQL', 'Chrome MV3', 'JWT', 'SQLAlchemy'],
    github: 'https://github.com/lein5in/Seren',
    live: null,
  },
  {
    num: '03',
    title: 'This Portfolio',
    subtitle: 'Interactive 3D Portfolio',
    status: 'Completed',
    period: 'Jun. 2026',
    summary: 'A portfolio built around the concept of a view from a plane window — featuring a photorealistic Three.js Earth, custom GLSL shaders, an entry screen with HUD data overlays, and a scroll-driven layout with globe-anchored section markers.',
    description: 'The entry screen renders a photoreal Earth inside a first-class cabin porthole using Three.js with alpha transparency, a custom atmosphere rim-light shader, procedural cloud texture, night city lights, and stars. The portfolio layout keeps the globe fixed to the right while content scrolls left.',
    bullets: [
      'Custom GLSL atmosphere shader with rim-lighting and additive blending',
      'Procedural cloud texture generated on canvas at runtime (2048×1024)',
      'Parallel sun + night lights with per-section color temperature transitions',
      '3D rotating cube markers on globe surface — glow + pulse on active section',
      'Entry screen with HUD data overlay and cursor light canvas effect',
      'GSAP ScrollTrigger — scroll-driven entrance animations throughout',
    ],
    tech: ['React', 'TypeScript', 'Three.js', 'GLSL', 'GSAP', 'Vite', 'EmailJS'],
    github: 'https://github.com/lein5in/Portfolio',
    live: null,
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

interface ProjectsSectionProps {
  setRef: (id: SectionId) => (el: HTMLElement | null) => void;
}

export default function ProjectsSection({ setRef }: ProjectsSectionProps) {
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
          {projects.map((p, idx) => (
            <Fade key={p.title} delay={idx * 0.06}>
              <div style={{
                borderBottom: '0.5px solid rgba(255,255,255,0.05)',
                paddingBottom: 60,
                marginBottom:  60,
              }}>
                {/* Header */}
                <div style={{
                  display:        'flex',
                  alignItems:     'flex-start',
                  justifyContent: 'space-between',
                  marginBottom:   20,
                  gap:            16,
                  flexWrap:       'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                    <span style={{
                      ...mono,
                      fontSize:      12,
                      color:         'rgba(255,255,255,0.32)',
                      letterSpacing: '0.12em',
                    }}>
                      {p.num}
                    </span>
                    <div>
                      <h3 style={{
                        fontFamily:    "'Space Grotesk', sans-serif",
                        fontSize:      28,
                        color:         '#ffffff',
                        fontWeight:    700,
                        lineHeight:    1,
                        marginBottom:  6,
                        letterSpacing: '-0.02em',
                      }}>
                        {p.title}
                      </h3>
                      <div style={{
                        ...mono,
                        fontSize:      12,
                        color:         'rgba(255,255,255,0.48)',
                        letterSpacing: '0.14em',
                      }}>
                        {p.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{
                      ...mono,
                      fontSize:      11,
                      letterSpacing: '0.1em',
                      padding:       '3px 10px',
                      borderRadius:  2,
                      border:        p.status === 'Completed'
                        ? '0.5px solid rgba(126,207,160,0.3)'
                        : '0.5px solid rgba(255,255,255,0.15)',
                      color: p.status === 'Completed'
                        ? '#7ecfa0'
                        : 'rgba(255,255,255,0.4)',
                    }}>
                      {p.status}
                    </span>
                    <span style={{
                      ...mono,
                      fontSize:      11,
                      color:         'rgba(255,255,255,0.58)',
                      letterSpacing: '0.08em',
                    }}>
                      {p.period}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize:   14.5,
                  color:      'rgba(255,255,255,0.68)',
                  lineHeight: 1.9,
                  maxWidth:   520,
                  marginBottom: 16,
                }}>
                  {p.summary}
                </p>

                {/* Description */}
                <p style={{
                  fontFamily:  "'Space Mono', monospace",
                  fontSize:    12.5,
                  color:       'rgba(255,255,255,0.62)',
                  lineHeight:  1.95,
                  maxWidth:    520,
                  marginBottom: 24,
                  borderLeft:  '1px solid rgba(255,255,255,0.09)',
                  paddingLeft: 16,
                }}>
                  {p.description}
                </p>

                {/* Bullets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                  {p.bullets.map(b => (
                    <div key={b} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{
                        color:     'rgba(255,255,255,0.45)',
                        flexShrink: 0,
                        fontSize:  12,
                        marginTop: 2,
                      }}>
                        —
                      </span>
                      <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize:   12,
                        color:      'rgba(255,255,255,0.62)',
                        lineHeight: 1.75,
                      }}>
                        {b}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer — tech + links */}
                <div style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'space-between',
                  flexWrap:       'wrap',
                  gap:            12,
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {p.tech.map(t => (
                      <span key={t} style={techTag}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 24 }}>
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={linkStyle}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.48)'; }}
                      >
                        <FaGithub size={12} /> GITHUB
                      </a>
                    )}
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={linkStyle}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.48)'; }}
                      >
                        <FaExternalLinkAlt size={11} /> LIVE
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Fade>
          ))}
        </div>

        {/* GitHub CTA */}
        <Fade>
          <a
            href="https://github.com/lein5in"
            target="_blank"
            rel="noopener noreferrer"
            style={githubCta}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.opacity = '1'; }}
          >
            <FaGithub size={12} /> MORE ON GITHUB →
          </a>
        </Fade>

      </section>
    </>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const sectionTitle: React.CSSProperties = {
  fontFamily:    "'Space Grotesk', sans-serif",
  fontSize:      'clamp(42px,5.5vw,72px)',
  fontWeight:    700,
  color:         '#ffffff',
  lineHeight:    1.0,
  letterSpacing: '-0.025em',
  marginBottom:  56,
};

const techTag: React.CSSProperties = {
  fontFamily:    "'Space Mono', monospace",
  fontSize:      11,
  color:         'rgba(255,255,255,0.72)',
  background:    'rgba(255,255,255,0.03)',
  border:        '0.5px solid rgba(255,255,255,0.08)',
  padding:       '4px 10px',
  borderRadius:  2,
  letterSpacing: '0.08em',
};

const linkStyle: React.CSSProperties = {
  display:       'flex',
  alignItems:    'center',
  gap:           6,
  fontFamily:    "'Space Mono', monospace",
  fontSize:      12,
  letterSpacing: '0.14em',
  color:         'rgba(255,255,255,0.48)',
  textDecoration: 'none',
  transition:    'color 0.2s',
};

const githubCta: React.CSSProperties = {
  display:       'inline-flex',
  alignItems:    'center',
  gap:           8,
  fontFamily:    "'Space Mono', monospace",
  fontSize:      12,
  letterSpacing: '0.18em',
  color:         'rgba(255,255,255,0.72)',
  textDecoration: 'none',
  transition:    'color 0.2s',
};