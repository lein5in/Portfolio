import { navigate } from '../router';

const sections = [
  {
    heading: 'The concept',
    paragraphs: [
      "The portfolio is built around one persistent scene, not three that replace each other. A single Three.js scene (Universe) mounts once and stays mounted for the entire session — it serves as the entry screen, the scrolling background, and the transition mechanism between sections. No component ever tears down and rebuilds the solar system; the camera flies through it.",
      'The whole sequence is driven by a small state machine rather than scattered booleans: system, zoomingEnter, revealed, toPortfolio, portfolio. Each phase has exactly one entry condition and one exit condition, which made the auto-triggered camera sequence and the reduced-motion fallback straightforward to add later without touching unrelated code.',
    ],
  },
  {
    heading: 'Why no ENTER button',
    paragraphs: [
      'The first version required a click to start the zoom into Earth. Removing it was a deliberate trade: watching someone land on the page and hesitate over whether to click something is worse than just showing them the sequence. The solar system now displays for about 1.5 seconds, then the camera moves on its own.',
      'Two exceptions matter more than the animation itself. If prefers-reduced-motion is set, or WebGL is unavailable, the site skips straight to the portfolio content — no one is made to wait through an animation they either cannot see properly or explicitly asked not to see.',
    ],
  },
  {
    heading: 'Procedural planets, and where real data takes over',
    paragraphs: [
      'Most planets are generated at runtime from 3D value noise sampled directly on the sphere surface, not painted UV textures — this avoids the seam artifacts that come from projecting 2D noise onto a sphere. Craters, lava cracks, and storm bands are layered on top with canvas drawing calls, seeded deterministically so the same planet always looks the same across reloads.',
      'Earth uses real photographic textures, and Mars and Saturn now do as well — procedural noise reads convincingly as an alien, stylized surface, but it cannot reproduce the specific geological detail of a real body. Those three use real imagery layered with a rim-lit atmosphere shader; the rest of the system stays fully procedural.',
    ],
  },
  {
    heading: 'Performance and graceful degradation',
    paragraphs: [
      'Selective bloom (the glow on the sun) originally ran two full scene traversals every frame to swap materials in and out. It now iterates a small pre-collected list of meshes built once at scene setup — the visual result is identical, the per-frame cost is not.',
      'Below a fixed screen-width threshold, sphere geometry drops from 96 to 48 segments, procedural textures render at a quarter of their desktop resolution, and the two-pass bloom composite is skipped entirely in favor of a direct render. None of this is visible as a deliberate simplification — it is tuned to look intentional at every size, not degraded.',
      'If WebGL itself is unavailable, the site does not just hide the 3D layer — it re-routes the phase state machine to land directly on the portfolio content, so the experience still works end to end without ever depending on a canvas that cannot exist.',
    ],
  },
  {
    heading: 'Assets',
    paragraphs: [
      'Mars and Saturn surface and ring textures are adapted from Solar System Scope (solarsystemscope.com/textures), licensed under CC BY 4.0 and based on NASA source imagery. Everything else — every other planet surface, the sun, comets, and the starfield — is generated procedurally in-browser.',
    ],
  },
  {
    heading: 'What this page is for',
    paragraphs: [
      'Most of this detail is invisible during normal use, which is the point. This page exists for anyone who wants to see the reasoning behind it rather than take the smoothness of it on faith.',
    ],
  },
];

export default function BuildPage() {
  return (
    <div style={pageStyle}>
      <div style={pageInnerStyle}>
        <button onClick={() => navigate('/')} style={backLinkStyle}>
          ← Back to portfolio
        </button>

        <div style={{ marginBottom: 56 }}>
          <div style={labelStyle}>Behind the Scenes</div>
          <h1 style={titleStyle}>How this portfolio<br />was built.</h1>
          <p style={subtitleStyle}>
            React · TypeScript · Three.js · GLSL · GSAP
          </p>
        </div>

        {sections.map(section => (
          <div key={section.heading} style={{ marginBottom: 48 }}>
            <h2 style={sectionHeadingStyle}>{section.heading}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} style={paragraphStyle}>{p}</p>
            ))}
          </div>
        ))}

        <button onClick={() => navigate('/')} style={backLinkStyle}>
          ← Back to portfolio
        </button>
      </div>
    </div>
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
  fontSize: 'clamp(32px,5.5vw,52px)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.05,
  marginBottom: 16,
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 13,
  color: 'rgba(255,255,255,0.5)',
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