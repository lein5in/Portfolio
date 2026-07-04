import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { Fade, mono, sectionLabel, divider } from './PortfolioLayout';
import type { SectionId } from '../../three/sections';

// ─── COMPONENT ────────────────────────────────────────────────────────────────

interface ContactSectionProps {
  setRef: (id: SectionId) => (el: HTMLElement | null) => void;
}

export default function ContactSection({ setRef }: ContactSectionProps) {
  const [form,   setForm]   = useState({ from_name: '', from_email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send(
        'service_7q5hmds',
        'template_p1nnvb6',
        { from_name: form.from_name, from_email: form.from_email, message: form.message },
        'h8rxQkQDRLjyLvEX4'
      );
      setStatus('success');
      setForm({ from_name: '', from_email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <>
      <div className="pf-divider" style={divider} />

      <section ref={setRef('contact')} className="pf-section-pad" style={{ padding: '110px 64px 140px' }}>

        <Fade>
          <div style={sectionLabel}>Contact</div>
          <div style={{
            ...mono,
            fontSize:      11,
            color:         'rgba(255,255,255,0.45)',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            marginBottom:  12,
          } as React.CSSProperties}>
            Currently Available
          </div>
          <h2 className="pf-breakout" style={{ ...sectionTitle, fontSize: 'clamp(52px,7vw,96px)', maxWidth: 'min(90vw, 820px)' }}>
            Make contact.
          </h2>
          <p style={{
            fontFamily:   "'Space Mono', monospace",
            fontSize:     13,
            color:        'rgba(255,255,255,0.66)',
            lineHeight:   1.95,
            maxWidth:     400,
            marginBottom: 52,
          }}>
            Open to Co-op opportunities, interesting problems,<br />
            and good conversations about software.
          </p>
        </Fade>

        {/* Form */}
        <Fade>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
            <div>
              <label style={labelStyle}>Your Name</label>
              <input
                type="text"
                name="from_name"
                value={form.from_name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              />
            </div>
            <div>
              <label style={labelStyle}>Your Email</label>
              <input
                type="email"
                name="from_email"
                value={form.from_email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              />
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              style={submitBtn}
              onMouseEnter={e => {
                e.currentTarget.style.color        = '#ffffff';
                e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.48)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color        = 'rgba(255,255,255,0.4)';
                e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.1)';
              }}
            >
              {status === 'sending' ? (
                <>
                  <div style={{
                    width:        12,
                    height:       12,
                    border:       '1.5px solid rgba(255,255,255,0.15)',
                    borderTop:    '1.5px solid rgba(255,255,255,0.6)',
                    borderRadius: '50%',
                    animation:    'spin 0.8s linear infinite',
                  }} />
                  SENDING...
                </>
              ) : (
                <><FaPaperPlane size={10} /> SEND MESSAGE</>
              )}
            </button>

            {status === 'success' && (
              <p style={{ ...mono, fontSize: 12, color: '#7ecfa0', letterSpacing: '0.1em', textAlign: 'center' } as React.CSSProperties}>
                ✓ Message sent — I'll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p style={{ ...mono, fontSize: 12, color: '#e27e7e', letterSpacing: '0.1em', textAlign: 'center' } as React.CSSProperties}>
                ✗ Something went wrong — email me directly.
              </p>
            )}
          </form>
        </Fade>

        {/* Links */}
        <Fade>
          <div style={{
            borderTop:    '0.5px solid rgba(255,255,255,0.06)',
            marginBottom: 16,
          }}>
            {[
              { label: 'Email',    value: 'htour018@uottawa.ca',    href: 'mailto:htour018@uottawa.ca',                                icon: <FaEnvelope size={12} />     },
              { label: 'GitHub',   value: 'github.com/lein5in',      href: 'https://github.com/lein5in',                                icon: <FaGithub size={12} />       },
              { label: 'LinkedIn', value: 'habib-ibrahim-toure',     href: 'https://www.linkedin.com/in/habib-ibrahim-toure-440740389', icon: <FaLinkedin size={12} />     },
              { label: 'Location', value: 'Ottawa, ON, Canada',      href: null,                                                        icon: <FaMapMarkerAlt size={12} /> },
            ].map((item, i, arr) => {
              const inner = (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.68)', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{
                      ...mono,
                      fontSize:      8,
                      color:         'rgba(255,255,255,0.58)',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      marginBottom:  3,
                    } as React.CSSProperties}>
                      {item.label}
                    </div>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize:   12,
                      color:      'rgba(255,255,255,0.65)',
                    }}>
                      {item.value}
                    </div>
                  </div>
                </>
              );
              const rowStyle: React.CSSProperties = {
                display:        'flex',
                alignItems:     'center',
                gap:            14,
                padding:        '16px 0',
                borderBottom:   i < arr.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                transition:     'opacity 0.2s',
                textDecoration: 'none',
                color:          'inherit',
              };
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  style={rowStyle}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {inner}
                </a>
              ) : (
                <div key={item.label} style={rowStyle}>{inner}</div>
              );
            })}
          </div>
        </Fade>

        {/* Resume */}
        <Fade>
          <a
            href="/Ibraheem_habib_toure.cv_en.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={cvBtn}
            onMouseEnter={e => {
              e.currentTarget.style.color       = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color       = 'rgba(255,255,255,0.52)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            }}
          >
            DOWNLOAD RESUME →
          </a>
        </Fade>

        {/* Footer */}
        <Fade>
          <div style={{
            marginTop:      80,
            paddingTop:     28,
            borderTop:      '0.5px solid rgba(255,255,255,0.04)',
            display:        'flex',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            12,
          }}>
            <span style={{ ...mono, fontSize: 11, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' } as React.CSSProperties}>
              © 2026 Habib Ibrahim Touré
            </span>
            <span style={{ ...mono, fontSize: 11, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' } as React.CSSProperties}>
              Built with React · Three.js · GLSL · GSAP
            </span>
          </div>
        </Fade>

      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.12); }
      `}</style>
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
  marginBottom:  28,
};

const labelStyle: React.CSSProperties = {
  fontFamily:    "'Space Mono', monospace",
  fontSize:      8,
  color:         'rgba(255,255,255,0.45)',
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  display:       'block',
  marginBottom:  8,
};

const inputStyle: React.CSSProperties = {
  width:        '100%',
  background:   'rgba(255,255,255,0.02)',
  border:       '0.5px solid rgba(255,255,255,0.07)',
  borderRadius: 2,
  padding:      '12px 14px',
  color:        'rgba(255,255,255,0.75)',
  fontSize:     13,
  fontFamily:   "'Space Mono', monospace",
  outline:      'none',
  boxSizing:    'border-box',
  transition:   'border-color 0.2s',
};

const submitBtn: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  gap:            8,
  fontFamily:     "'Space Mono', monospace",
  fontSize:       10,
  letterSpacing:  '0.2em',
  padding:        '13px 28px',
  background:     'transparent',
  border:         '0.5px solid rgba(255,255,255,0.1)',
  color:          'rgba(255,255,255,0.4)',
  borderRadius:   2,
  cursor:         'pointer',
  transition:     'all 0.2s',
};

const cvBtn: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  fontFamily:     "'Space Mono', monospace",
  fontSize:       10,
  letterSpacing:  '0.2em',
  padding:        '13px',
  background:     'transparent',
  border:         '0.5px solid rgba(255,255,255,0.07)',
  color:          'rgba(255,255,255,0.52)',
  borderRadius:   2,
  textDecoration: 'none',
  transition:     'all 0.2s',
};