import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
];

const stats = [
  { value: '3',    label: 'Languages spoken' },
  { value: '3+',   label: 'Projects shipped' },
  { value: '2026', label: 'Co-op ready' },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <section id="about" ref={ref}>
      <div className="section-container">
        <div className="section-label">About</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }} className="about-grid">

          {/* Left — bio */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(28px, 4vw, 42px)',
              lineHeight: 1.15,
              color: 'var(--text)',
              marginBottom: '28px',
            }}>
              Building things that<br />
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>actually matter.</em>
            </h2>

            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.85, fontWeight: 300, marginBottom: '18px' }}>
              I'm a second-year Computer Science student (Co-op) at the University of Ottawa, driven by a
              genuine curiosity about how software can solve real, everyday problems. Whether it's a web app,
              a data pipeline, or a mobile tool — I care about building things that feel thoughtful and work well.
            </p>

            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.85, fontWeight: 300, marginBottom: '18px' }}>
              I've worked across full-stack development, machine learning, and Android — which has given me
              a broad view of what it takes to ship software end to end. I'm particularly drawn to AI and the
              ways it can be applied to help people, not just impress them.
            </p>

            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.85, fontWeight: 300 }}>
              I think a lot about product design, clean systems, and tools that respect the people using them.
              Bilingual (EN/FR), originally from Côte d'Ivoire — I tend to bring a different perspective
              to most rooms I walk into, and I think that's a strength.
            </p>

            {/* Language badges */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '30px', flexWrap: 'wrap' }}>
              {[
                { lang: 'English', level: 'Fluent' },
                { lang: 'French',  level: 'Fluent' },
                { lang: 'Arabic',  level: 'Basic'  },
              ].map(({ lang, level }) => (
                <div
                  key={lang}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    border: '0.5px solid var(--border-md)',
                    borderRadius: '3px',
                    background: 'var(--bg-2)',
                  }}
                >
                  <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 400 }}>{lang}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.06em' }}>{level}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — quote + stats + interests */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Quote */}
            <div style={{
              background: 'var(--bg-2)',
              border: '0.5px solid var(--border-md)',
              borderLeft: '2px solid var(--accent)',
              borderRadius: '3px',
              padding: '28px 28px 22px',
            }}>
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '17px',
                color: 'var(--text)',
                lineHeight: 1.7,
                fontStyle: 'italic',
                marginBottom: '14px',
              }}>
                "{quote.text}"
              </p>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '10px',
                color: 'var(--accent)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                — {quote.author}
              </p>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              background: 'var(--border)',
              border: '0.5px solid var(--border)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}>
              {stats.map(({ value, label }) => (
                <div key={label} style={{ background: 'var(--bg-2)', padding: '22px 16px', textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: '30px',
                    color: 'var(--accent)',
                    lineHeight: 1,
                    marginBottom: '8px',
                  }}>
                    {value}
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.07em',
                    lineHeight: 1.4,
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Interests */}
            <div style={{
              background: 'var(--bg-2)',
              border: '0.5px solid var(--border)',
              borderRadius: '3px',
              padding: '22px 24px',
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '9px',
                color: 'var(--text-faint)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}>
                Interests
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Artificial Intelligence', 'Full-Stack Dev', 'Machine Learning', 'Product Design', 'Cybersecurity', 'Open Source'].map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  );
};

export default About;