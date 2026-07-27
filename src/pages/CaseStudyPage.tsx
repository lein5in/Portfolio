import { CASE_STUDIES } from '../data/caseStudies';
import AITradingMetrics from '../components/Portfolio/AITradingMetrics';
import { navigate } from '../router';

interface CaseStudyPageProps {
  slug: string;
}

export default function CaseStudyPage({ slug }: CaseStudyPageProps) {
  const data = CASE_STUDIES[slug];

  if (!data) {
    return (
      <div style={pageStyle}>
        <div style={pageInnerStyle}>
          <BackLink />
          <p style={{ fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.5)' }}>
            This case study does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={pageInnerStyle}>
        <BackLink />

        <div style={{ marginBottom: 56 }}>
          <div style={labelStyle}>Case Study</div>
          <h1 style={titleStyle}>{data.title}</h1>
          <p style={subtitleStyle}>{data.subtitle}</p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7ecfa0', flexShrink: 0 }} />
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.04em',
            }}>
              {data.status}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {data.stack.map(t => <span key={t} style={tagStyle}>{t}</span>)}
          </div>

          {data.repoHref ? (
            <a
              href={data.repoHref}
              target="_blank"
              rel="noopener noreferrer"
              style={repoLinkStyle}
            >
              {data.repoLabel} →
            </a>
          ) : (
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
              fontStyle: 'italic',
            }}>
              {data.repoLabel}
            </span>
          )}
        </div>

        {data.sections.map(section => (
          <div key={section.heading} style={{ marginBottom: 48 }}>
            <h2 style={sectionHeadingStyle}>{section.heading}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} style={paragraphStyle}>{p}</p>
            ))}
            {section.diagram && (
              <pre style={diagramStyle}>{section.diagram}</pre>
            )}
            {slug === 'aitradingagent' && section.heading === 'Current production strategy' && (
              <AITradingMetrics />
            )}
          </div>
        ))}

        <BackLink />
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <button onClick={() => navigate('/')} style={backLinkStyle}>
      ← Back to portfolio
    </button>
  );
}



const pageStyle: React.CSSProperties = {
  position:   'fixed',
  inset:      0,
  zIndex:     10,
  overflowY:  'auto',
  background: '#0a0a0a',
  color:      '#ffffff',
};

const pageInnerStyle: React.CSSProperties = {
  padding:  '64px 24px 120px',
  maxWidth: 720,
  margin:   '0 auto',
};

const backLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: "'Space Mono', monospace",
  fontSize: 11,
  letterSpacing: '0.14em',
  color: 'rgba(255,255,255,0.45)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  marginBottom: 40,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 10,
  letterSpacing: '0.28em',
  color: 'rgba(255,255,255,0.42)',
  textTransform: 'uppercase',
  marginBottom: 20,
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 'clamp(36px,6vw,56px)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.0,
  marginBottom: 12,
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 13,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: 24,
};

const tagStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 11,
  color: 'rgba(255,255,255,0.65)',
  background: 'rgba(255,255,255,0.03)',
  border: '0.5px solid rgba(255,255,255,0.08)',
  padding: '4px 10px',
  borderRadius: 2,
  letterSpacing: '0.06em',
};

const repoLinkStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 12,
  color: 'rgba(255,255,255,0.5)',
  textDecoration: 'none',
  letterSpacing: '0.04em',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  marginBottom: 16,
};

const paragraphStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 13.5,
  color: 'rgba(255,255,255,0.68)',
  lineHeight: 1.9,
  marginBottom: 16,
};

const diagramStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 11,
  color: 'rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.02)',
  border: '0.5px solid rgba(255,255,255,0.06)',
  padding: '18px 20px',
  overflowX: 'auto',
  lineHeight: 1.7,
  marginTop: 8,
};