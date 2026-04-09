import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [quote, setQuote] = useState(quotes[0]);
  const { t } = useLanguage();

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const stats = [
    { value: '3',    label: t('Languages spoken', 'Langues parlées') },
    { value: '3+',   label: t('Projects shipped', 'Projets livrés') },
    { value: '2026', label: t('Co-op ready', 'Stage prêt') },
  ];

  const langBadges = [
    { lang: t('English', 'Anglais'),  level: t('Fluent', 'Courant') },
    { lang: t('French', 'Français'),  level: t('Fluent', 'Courant') },
    { lang: t('Arabic', 'Arabe'),     level: t('Basic', 'Notions') },
  ];

  const interests = (lang: string) => lang === 'fr'
    ? ['Intelligence Artificielle', 'Dév. Full-Stack', 'Apprentissage Machine', 'Design Produit', 'Cybersécurité', 'Open Source']
    : ['Artificial Intelligence', 'Full-Stack Dev', 'Machine Learning', 'Product Design', 'Cybersecurity', 'Open Source'];

  return (
    <section id="about" ref={ref}>
      <div className="section-container">
        <div className="section-label">{t('About', 'À propos')}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }} className="about-grid">

          {/* Left — bio */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.15, color: 'var(--text)', marginBottom: '28px' }}>
              {t('Building things that', 'Construire des choses qui')}<br />
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
                {t('actually matter.', 'comptent vraiment.')}
              </em>
            </h2>

            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.85, fontWeight: 300, marginBottom: '18px' }}>
              {t(
                "I'm a second-year Computer Science student (Co-op) at the University of Ottawa, driven by a genuine curiosity about how software can solve real, everyday problems. Whether it's a web app, a data pipeline, or a mobile tool — I care about building things that feel thoughtful and work well.",
                "Je suis étudiant en 2e année d'informatique (Co-op) à l'Université d'Ottawa, animé par une vraie curiosité sur la façon dont le logiciel peut résoudre des problèmes concrets. Qu'il s'agisse d'une app web, d'un pipeline de données ou d'un outil mobile — je veux construire des choses réfléchies qui fonctionnent bien."
              )}
            </p>

            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.85, fontWeight: 300, marginBottom: '18px' }}>
              {t(
                "I've worked across full-stack development, machine learning, and Android — which has given me a broad view of what it takes to ship software end to end. I'm particularly drawn to AI and the ways it can be applied to help people, not just impress them.",
                "J'ai travaillé sur du full-stack, du machine learning et Android — ce qui m'a donné une vue large de ce que ça implique de livrer un logiciel de bout en bout. Je suis particulièrement attiré par l'IA et la façon dont elle peut vraiment aider les gens, pas juste les impressionner."
              )}
            </p>

            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.85, fontWeight: 300 }}>
              {t(
                "I think a lot about product design, clean systems, and tools that respect the people using them. Bilingual (EN/FR), originally from Côte d'Ivoire — I tend to bring a different perspective to most rooms I walk into, and I think that's a strength.",
                "Je réfléchis beaucoup au design produit, aux systèmes épurés, aux outils qui respectent leurs utilisateurs. Bilingue (EN/FR), originaire de Côte d'Ivoire — j'apporte souvent une perspective différente, et je pense que c'est une force."
              )}
            </p>

            {/* Language badges */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '30px', flexWrap: 'wrap' }}>
              {langBadges.map(({ lang: l, level }) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: '0.5px solid var(--border-md)', borderRadius: '3px', background: 'var(--bg-2)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 400 }}>{l}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.06em' }}>{level}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — quote + stats + interests */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.18 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Quote */}
            <div style={{ background: 'var(--bg-2)', border: '0.5px solid var(--border-md)', borderLeft: '2px solid var(--accent)', borderRadius: '3px', padding: '28px 28px 22px' }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '17px', color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '14px' }}>
                "{quote.text}"
              </p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                — {quote.author}
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', border: '0.5px solid var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
              {stats.map(({ value, label }) => (
                <div key={label} style={{ background: 'var(--bg-2)', padding: '22px 16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '30px', color: 'var(--accent)', lineHeight: 1, marginBottom: '8px' }}>{value}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.07em', lineHeight: 1.4 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Interests */}
            <div style={{ background: 'var(--bg-2)', border: '0.5px solid var(--border)', borderRadius: '3px', padding: '22px 24px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '14px' }}>
                {t('Interests', 'Intérêts')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {interests(t('en', 'fr')).map(tag => (
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