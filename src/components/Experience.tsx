import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="experience" ref={ref}>
      <div className="section-container">
        <div className="section-label">Experience & Education</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>

          {/* ── Work Experience ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '24px' }}>
              Work
            </div>

            <div style={{ position: 'relative', paddingLeft: '20px' }}>
              {/* Timeline line */}
              <div style={{ position: 'absolute', left: 0, top: '6px', bottom: 0, width: '0.5px', background: 'var(--border)' }} />

              {/* Entry */}
              <div style={{ position: 'relative', marginBottom: '40px' }}>
                <div style={{ position: 'absolute', left: '-23px', top: '6px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 3px rgba(181,169,138,0.12)' }} />

                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Jun 2025 — Oct 2025
                </div>
                <div style={{ fontSize: '16px', color: 'var(--text)', fontWeight: 500, marginBottom: '4px' }}>
                  Data Annotation & AI Training Specialist
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 300 }}>
                  DataAnnotation · Remote, Ontario
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Prepared and annotated high-quality datasets for production ML models, ensuring accuracy across thousands of data points',
                    'Developed Python automation scripts to streamline repetitive data processing tasks, reducing manual effort significantly',
                    'Applied Scikit-Learn and ML evaluation techniques to support model validation and quality checks',
                    'Collaborated asynchronously with AI development teams using structured feedback loops via online mentors',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '3px', flexShrink: 0 }}>›</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300 }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                  {['Python', 'Scikit-Learn', 'Machine Learning', 'Data Analysis'].map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </div>

              {/* Open to internship */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-23px', top: '6px', width: '6px', height: '6px', borderRadius: '50%', border: '0.5px solid var(--accent)', background: 'var(--bg)' }} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  Summer 2026
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 300 }}>
                  Actively seeking 4-month Co-op internship
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Education ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '24px' }}>
              Education
            </div>

            <div style={{ position: 'relative', paddingLeft: '20px' }}>
              <div style={{ position: 'absolute', left: 0, top: '6px', bottom: 0, width: '0.5px', background: 'var(--border)' }} />

              {/* uOttawa */}
              <div style={{ position: 'relative', marginBottom: '40px' }}>
                <div style={{ position: 'absolute', left: '-23px', top: '6px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 3px rgba(181,169,138,0.12)' }} />

                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Sep 2024 — Apr 2028 (expected)
                </div>
                <div style={{ fontSize: '16px', color: 'var(--text)', fontWeight: 500, marginBottom: '4px' }}>
                  B.Sc. Computer Science (Specialized, Co-op)
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 300 }}>
                  University of Ottawa · Ottawa, ON
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'International Student Merit Scholarship — $36,000 / year',
                    'Relevant courses: Data Structures & Algorithms, Computer Architecture, Intro to Software Engineering',
                    'Enrolled in the Co-op program — structured internship semesters integrated with academic terms',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '3px', flexShrink: 0 }}>›</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300 }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                  {['Algorithms', 'Software Engineering', 'Architecture', 'Co-op'].map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </div>

              {/* High school — condensed */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-23px', top: '6px', width: '6px', height: '6px', borderRadius: '50%', border: '0.5px solid var(--border-md)', background: 'var(--bg)' }} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  2017 — 2024
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 400, marginBottom: '2px' }}>
                  High School Diploma
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 300 }}>
                  Collège Saint-Viateur d'Abidjan · Côte d'Ivoire
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Languages row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ marginTop: '52px', paddingTop: '32px', borderTop: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Languages</span>
          {[
            { lang: 'English', level: 'Fluent' },
            { lang: 'French', level: 'Fluent' },
            { lang: 'Arabic', level: 'Basic' },
          ].map(({ lang, level }) => (
            <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 400 }}>{lang}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{level}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Experience;