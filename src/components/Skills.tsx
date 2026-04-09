import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const { t } = useLanguage();

  const skillGroups = [
    {
      label: t('Languages', 'Langages'),
      skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'Assembly', 'HTML5', 'CSS3'],
    },
    {
      label: t('Frameworks & Libraries', 'Frameworks & Librairies'),
      skills: ['React', 'FastAPI', 'TailwindCSS', 'Scikit-Learn', 'PyTorch', 'Librosa', 'Basic-Pitch', 'NumPy'],
    },
    {
      label: t('Databases & Tools', 'Bases de données & Outils'),
      skills: ['MySQL', 'SQLite', 'Git', 'Virtual Environments', 'OOP', 'REST APIs'],
    },
    {
      label: t('Areas of Interest', "Domaines d'intérêt"),
      skills: t('en', 'fr') === 'fr'
        ? ['Intelligence Artificielle', 'Apprentissage Machine', 'Cybersécurité', 'Dév. Full-Stack', 'Design Produit']
        : ['Artificial Intelligence', 'Machine Learning', 'Cybersecurity', 'Full-Stack Development', 'Product Design'],
    },
  ];

  const softSkills = t('en', 'fr') === 'fr'
    ? ['Résolution de problèmes', 'Travail en équipe', 'Communication', 'Pensée critique', 'Adaptabilité', 'Bilingue (EN/FR)']
    : ['Problem Solving', 'Teamwork', 'Communication', 'Critical Thinking', 'Adaptability', 'Bilingual (EN/FR)'];

  return (
    <section id="skills" ref={ref}>
      <div className="section-container">
        <div className="section-label">{t('Skills', 'Compétences')}</div>

        {/* Technical skill groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '0.5px solid var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: 'var(--bg-2)', padding: '28px 36px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px', alignItems: 'start' }}
              className="skill-row"
            >
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.16em', textTransform: 'uppercase', paddingTop: '4px' }}>
                {group.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {group.skills.map(skill => (
                  <motion.span
                    key={skill}
                    whileHover={{ borderColor: 'rgba(196,184,150,0.5)', color: 'var(--text)' } as any}
                    style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--accent)', background: 'var(--accent-dim)', border: '0.5px solid rgba(196,184,150,0.2)', padding: '5px 12px', borderRadius: '2px', letterSpacing: '0.05em', cursor: 'default', transition: 'border-color 0.2s, color 0.2s' }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Soft skills row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ background: 'var(--bg-2)', border: '0.5px solid var(--border)', borderRadius: '6px', padding: '28px 36px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px', alignItems: 'center' }}
          className="skill-row"
        >
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {t('Soft Skills', 'Compétences transversales')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {softSkills.map(skill => (
              <span key={skill} style={{ fontSize: '14px', color: 'var(--text)', padding: '6px 14px', border: '0.5px solid var(--border-md)', borderRadius: '2px', fontWeight: 300 }}>
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .skill-row { grid-template-columns: 1fr !important; gap: 14px !important; padding: 20px !important; }
        }
      `}</style>
    </section>
  );
};

export default Skills;