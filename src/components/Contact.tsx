import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const contactLinks = [
  {
    label: 'Email',
    value: 'htour018@uottawa.ca',
    href: 'mailto:htour018@uottawa.ca',
    icon: <FaEnvelope size={14} />,
  },
  {
    label: 'GitHub',
    value: 'github.com/lein5in',
    href: 'https://github.com/lein5in',
    icon: <FaGithub size={14} />,
  },
  {
    label: 'LinkedIn',
    value: 'habib-ibrahim-toure',
    href: 'https://www.linkedin.com/in/habib-ibrahim-toure-440740389',
    icon: <FaLinkedin size={14} />,
  },
  {
    label: 'Location',
    value: 'Ottawa, ON, Canada',
    href: null,
    icon: <FaMapMarkerAlt size={14} />,
  },
];

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [form, setForm] = useState({ from_name: '', from_email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace",
    fontSize: '10px',
    color: 'var(--text-faint)',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '8px',
  };

  return (
    <section id="contact" ref={ref}>
      <div className="section-container">
        <div className="section-label">Contact</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }} className="contact-grid">

          {/* Left — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: 1.1, color: 'var(--text)', marginBottom: '12px' }}>
              Let's work<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>together.</em>
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.7, marginBottom: '36px' }}>
              Open to co-op opportunities, interesting projects, and conversations about software.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Your name</label>
                <input
                  type="text"
                  name="from_name"
                  value={form.from_name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="field-input"
                />
              </div>

              <div>
                <label style={labelStyle}>Your email</label>
                <input
                  type="email"
                  name="from_email"
                  value={form.from_email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="field-input"
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
                  className="field-input"
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary"
                whileHover={{ opacity: 0.85 }}
                whileTap={{ scale: 0.98 }}
                style={{ justifyContent: 'center', width: '100%' }}
              >
                {status === 'sending' ? (
                  <>
                    <div style={{ width: '14px', height: '14px', border: '1.5px solid rgba(13,13,13,0.4)', borderTop: '1.5px solid #0d0d0d', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Sending...
                  </>
                ) : (
                  <><FaPaperPlane size={12} /> Send Message</>
                )}
              </motion.button>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#7ecfa0', letterSpacing: '0.08em', textAlign: 'center' }}
                >
                  ✓ Message sent — I'll get back to you soon.
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#e27e7e', letterSpacing: '0.08em', textAlign: 'center' }}
                >
                  ✗ Something went wrong — email me directly.
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Right — info + CV download */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Contact links */}
            <div style={{ background: 'var(--bg-2)', border: '0.5px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
              {contactLinks.map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    borderBottom: i < contactLinks.length - 1 ? '0.5px solid var(--border)' : 'none',
                  }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '18px 24px',
                        textDecoration: 'none',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 300 }}>{item.value}</div>
                      </div>
                    </a>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 24px' }}>
                      <span style={{ color: 'var(--text-faint)', flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 300 }}>{item.value}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CV download */}
            <div style={{ background: 'var(--bg-2)', border: '0.5px solid var(--border)', borderRadius: '6px', padding: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 300, marginBottom: '16px', lineHeight: 1.6 }}>
                Actively seeking a <span style={{ color: 'var(--text)', fontWeight: 400 }}>4-month Co-op</span> for Summer 2026
              </p>
              <motion.a
                href="/Ibraheem_habib_toure.cv_en.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Download Resume
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            marginTop: '64px',
            paddingTop: '28px',
            borderTop: '0.5px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
            © 2026 Habib Ibrahim Touré
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
            Built with React · TypeScript · Framer Motion
          </span>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default Contact;