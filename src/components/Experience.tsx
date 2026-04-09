import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const { t } = useLanguage();

  const workBullets = [
    t('Prepared and annotated high-quality datasets for production ML models, ensuring accuracy across thousands of data points',
      'Préparation et annotation de datasets de haute qualité pour des modèles ML en production, avec précision sur des milliers de points de données'),
    t('Developed Python automation scripts to streamline repetitive data processing tasks, reducing manual effort significantly',
      "Développement de scripts Python d'automatisation pour simplifier les tâches répétitives de traitement des données"),
    t('Applied Scikit-Learn and ML evaluation techniques to support model validation and quality checks',
      "Application de Scikit-Learn et de techniques d'évaluation ML pour la validation des modèles"),
    t('Collaborated asynchronously with AI development teams using structured feedback loops via online mentors',
      "Collaboration asynchrone avec des équipes de développement IA via des boucles de feedback structurées"),
  ];

  const eduBullets = [
    t('International Student Merit Scholarship — $36,000 / year',
      'Bourse de mérite pour étudiant international — 36 000 $ / an'),
    t('Relevant courses: Data Structures & Algorithms, Computer Architecture, Intro to Software Engineering',
      'Cours pertinents : Structures de données & Algorithmes, Architecture des ordinateurs, Intro au Génie Logiciel'),
    t('Enrolled in the Co-op program — structured internship semesters integrated with academic terms',
      "Inscrit au programme Co-op — semestres de stage structurés intégrés au cursus académique"),
  ];

  const langList = [
    { lang: t('English', 'Anglais'),  level: t('Fluent', 'Courant') },
    { lang: t('French', 'Français'),  level: t('Fluent', 'Courant') },
    { lang: t('Arabic', 'Arabe'),     level: t('Basic', 'Notions') },
  ];

  const dot = (filled: boolean) => ({
    position: 'absolute' as const,
    left: '-23px', top: '6px',
    width: '6px', height: '6px',
    borderRadius: '50%',
    background: filled ? 'var(--accent)' : 'var(--bg)',
    border: filled ? 'none' : '0.5px solid var(--border-md)',
    boxShadow: filled ? '0 0 0 3px rgba(196,184,150,0.12)' : 'none',
  });

  return (
    <section id="experience" ref={ref}>
      <div className="section-container">
        <div className="section-label">{t('Experience & Education', 'Expérience & Formation')}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }} className="exp-grid">

          {/* Work */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '24px' }}>
              {t('Work', 'Expérience')}
            </div>

            <div style={{ position: 'relative', paddingLeft: '20px' }}>
              <div style={{ position: 'absolute', left: 0, top: '6px', bottom: 0, width: '0.5px', background: 'var(--border)' }} />

              {/* DataAnnotation */}
              <div style={{ position: 'relative', marginBottom: '40px' }}>
                <div style={dot(true)} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {t('Jun 2025 — Oct 2025', 'Juin 2025 — Oct. 2025')}
                </div>
                <div style={{ fontSize: '16px', color: 'var(--text)', fontWeight: 500, marginBottom: '4px' }}>
                  {t('Data Annotation & AI Training Specialist', 'Spécialiste Annotation de Données & IA')}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 300 }}>
                  DataAnnotation · {t('Remote, Ontario', 'Télétravail, Ontario')}
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {workBullets.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: 'var(--accent)', fontSize: '13px', marginTop: '3px', flexShrink: 0 }}>›</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300 }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                  {['Python', 'Scikit-Learn', 'Machine Learning', 'Data Analysis'].map(s => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </div>

              {/* Future coop */}
              <div style={{ position: 'relative' }}>
                <div style={dot(false)} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {t('Summer 2026', 'Été 2026')}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 300 }}>
                  {t('Actively seeking 4-month Co-op internship', 'À la recherche d\'un stage Co-op de 4 mois')}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.15 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '24px' }}>
              {t('Education', 'Formation')}
            </div>

            <div style={{ position: 'relative', paddingLeft: '20px' }}>
              <div style={{ position: 'absolute', left: 0, top: '6px', bottom: 0, width: '0.5px', background: 'var(--border)' }} />

              {/* uOttawa */}
              <div style={{ position: 'relative', marginBottom: '40px' }}>
                <div style={dot(true)} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {t('Sep 2024 — Apr 2028 (expected)', 'Sep. 2024 — Avr. 2028 (prévu)')}
                </div>
                <div style={{ fontSize: '16px', color: 'var(--text)', fontWeight: 500, marginBottom: '4px' }}>
                  {t('B.Sc. Computer Science (Specialized, Co-op)', 'B.Sc. Informatique (Spécialisé, Co-op)')}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 300 }}>
                  {t('University of Ottawa · Ottawa, ON', 'Université d\'Ottawa · Ottawa, ON')}
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {eduBullets.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: 'var(--accent)', fontSize: '13px', marginTop: '3px', flexShrink: 0 }}>›</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300 }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                  {[t('Algorithms', 'Algorithmes'), t('Software Engineering', 'Génie Logiciel'), t('Architecture', 'Architecture'), 'Co-op'].map(s => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </div>

              {/* High school */}
              <div style={{ position: 'relative' }}>
                <div style={dot(false)} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(196,184,150,0.4)', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  2017 — 2024
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 400, marginBottom: '2px' }}>
                  {t('High School Diploma', 'Baccalauréat')}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 300 }}>
                  {t("Collège Saint-Viateur d'Abidjan · Côte d'Ivoire", "Collège Saint-Viateur d'Abidjan · Côte d'Ivoire")}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Languages row */}
        <motion.div
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.4 }}
          style={{ marginTop: '52px', paddingTop: '32px', borderTop: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {t('Languages', 'Langues')}
          </span>
          {langList.map(({ lang: l, level }) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 400 }}>{l}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{level}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .exp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default Experience;