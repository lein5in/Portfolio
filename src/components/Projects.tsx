import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const projects = [
  {
    num: '01',
    title: 'Fretify',
    status: 'In Development',
    summary:
      'AI-powered guitar transcription system that converts any audio or video recording into accurate guitar and bass tablature using machine learning — no music theory required.',
    description:
      'Fretify solves a real problem I kept running into: you hear a guitar riff you love, but transcribing it by ear takes hours. The app uses Demucs to isolate the instrument from a mix, Basic-Pitch for note detection, and a custom FastAPI backend to assemble everything into a clean, interactive tab viewer built in React. I\'m building this as a full-stack project to sharpen both my ML pipeline skills and my ability to design systems that feel intuitive to use.',
    features: [
      'Source separation (vocals/bass/guitar) via Demucs',
      'MIDI & note detection with Basic-Pitch + Librosa',
      'Interactive tab visualization in the browser',
      'Automatic tuning and chord detection',
      'FastAPI backend with async audio processing',
    ],
    tech: ['Python', 'FastAPI', 'React', 'TypeScript', 'PyTorch', 'Librosa', 'Demucs'],
    github: 'https://github.com/lein5in/AI-guitar-tabs-generator',
    live: null,
  },
  {
    num: '02',
    title: 'Seren',
    status: 'In Development',
    summary:
      'A calm, AI-powered PWA designed to help anxious students manage deadlines and schedules — without the overwhelm that traditional productivity tools create.',
    description:
      'Most productivity apps are built for people who already have their lives together. Seren is built for everyone else. It starts by listening — asking about your availability, your priorities, and how you\'re feeling that day — before suggesting anything. It imports your uOzone calendar via .ics, surfaces deadlines by priority, and uses the Claude API to have gentle, adaptive conversations about your workload. The goal is a tool that prevents anxiety spikes rather than just reacting to them.',
    features: [
      'Conversational onboarding powered by Claude API',
      'uOzone calendar import via .ics (no scraping)',
      'Priority-based deadline calendar view',
      'Overwhelm Mode — one task at a time',
      'Daily emotional check-ins & workload adjustment',
      'Browser extension to read Brightspace (Phase 2)',
    ],
    tech: ['React', 'TypeScript', 'FastAPI', 'Claude API', 'PostgreSQL', 'PWA'],
    github: 'https://github.com/lein5in/Seren',
    live: null,
  },
  {
    num: '03',
    title: 'uTaste',
    status: 'Completed',
    summary:
      'A full-featured Android restaurant management app built by a team of three for SEG2505 — covering everything from recipe management to real-time order tracking.',
    description:
      'uTaste was our semester-long team project for Software Engineering. We designed the app around three distinct roles — administrators, chefs, and waiters — each with their own views and permissions. I focused on the ingredient tracking system and QR code integration with the OpenFoodFacts API for nutritional data. We also wrote 20+ JUnit tests to cover core business logic, which was a great exercise in thinking about software quality from the start.',
    features: [
      'Multi-role auth system (admin / chef / waiter)',
      'Recipe and ingredient inventory management',
      'QR code scanning via OpenFoodFacts API',
      'Nutritional info display for all ingredients',
      'Sales tracking and performance reporting',
      '20+ automated JUnit tests',
    ],
    tech: ['Java', 'Android', 'SQLite', 'Retrofit', 'JUnit', 'OpenFoodFacts API'],
    github: 'https://github.com/uOttawa-2025-2026-seg2505-projet/Groupe-19-repo',
    live: null,
  },
];

const statusStyle = (status: string) => ({
  fontFamily: "'DM Mono', monospace",
  fontSize: '11px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  padding: '3px 9px',
  borderRadius: '2px',
  border: `0.5px solid ${status === 'Completed' ? 'rgba(90,180,120,0.3)' : 'rgba(181,169,138,0.3)'}`,
  color: status === 'Completed' ? '#7ecfa0' : 'var(--accent)',
  background: status === 'Completed' ? 'rgba(90,180,120,0.07)' : 'rgba(181,169,138,0.07)',
});

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="projects" ref={ref}>
      <div className="section-container">
        <div className="section-label">Selected Projects</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '0.5px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              style={{
                background: 'var(--bg-2)',
                padding: '36px 40px',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-2)')}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'rgba(196,184,150,0.5)', letterSpacing: '0.1em' }}>
                    {project.num}
                  </span>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', color: 'var(--text)', lineHeight: 1 }}>
                    {project.title}
                  </h3>
                </div>
                <span style={statusStyle(project.status)}>{project.status}</span>
              </div>

              {/* Summary */}
              <p style={{ fontSize: '15px', color: 'var(--text)', lineHeight: 1.7, marginBottom: '14px', fontWeight: 400, maxWidth: '720px' }}>
                {project.summary}
              </p>

              {/* Personal description */}
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '22px', fontWeight: 300, maxWidth: '700px', borderLeft: '2px solid var(--accent)', paddingLeft: '16px', fontStyle: 'italic' }}>
                {project.description}
              </p>

              {/* Features */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Key Features
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '6px' }}>
                  {project.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>›</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.6 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom row: tags + links */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {project.tech.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                    whileHover={{ color: 'var(--accent)' }}
                  >
                    <FaGithub size={13} /> GitHub
                  </motion.a>
                  {project.live && (
                    <motion.a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none' }}
                      whileHover={{ color: 'var(--accent)' }}
                    >
                      <FaExternalLinkAlt size={11} /> Live
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}
        >
          <motion.a
            href="https://github.com/lein5in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaGithub size={13} /> More on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;