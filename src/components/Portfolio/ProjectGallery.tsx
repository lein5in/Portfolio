import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaImages, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// ─── IMAGE GALLERY LINK ───────────────────────────────────────────────────────
// Sits next to GITHUB / LIVE. Hovering shows a quick preview popup (first
// image) with a "See all" shortcut; clicking either opens the full lightbox.

interface ProjectGalleryProps {
  images: string[];
  label?: string;
}

export default function ProjectGallery({ images, label = 'VIEW IMAGES' }: ProjectGalleryProps) {
  const [hovering, setHovering]   = useState(false);
  const [lightbox, setLightbox]   = useState<number | null>(null);

  // Keyboard nav for the lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(i => (i === null ? i : (i + 1) % images.length));
      if (e.key === 'ArrowLeft')  setLightbox(i => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  if (!images.length) return null;

  return (
    <>
      <div
        style={{ position: 'relative', display: 'inline-flex' }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <button
          onClick={() => setLightbox(0)}
          style={linkStyle}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.48)'; }}
        >
          <FaImages size={11} /> {label}
        </button>

        {hovering && (
          <div style={previewPopupStyle}>
            <img src={images[0]} alt="" style={previewImgStyle} />
            <button
              onClick={() => setLightbox(0)}
              style={seeAllStyle}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              See all ({images.length}) →
            </button>
          </div>
        )}
      </div>

      {lightbox !== null && createPortal(
        <div style={overlayStyle} onClick={() => setLightbox(null)}>
          <button
            style={closeBtnStyle}
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <FaTimes size={16} />
          </button>

          {images.length > 1 && (
            <button
              style={{ ...navBtnStyle, left: 24 }}
              onClick={e => { e.stopPropagation(); setLightbox(i => (i === null ? 0 : (i - 1 + images.length) % images.length)); }}
              aria-label="Previous image"
            >
              <FaChevronLeft size={18} />
            </button>
          )}

          <img
            src={images[lightbox]}
            alt=""
            style={lightboxImgStyle}
            onClick={e => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              style={{ ...navBtnStyle, right: 24 }}
              onClick={e => { e.stopPropagation(); setLightbox(i => (i === null ? 0 : (i + 1) % images.length)); }}
              aria-label="Next image"
            >
              <FaChevronRight size={18} />
            </button>
          )}

          <div style={counterStyle}>{lightbox + 1} / {images.length}</div>
        </div>,
        document.body
      )}
    </>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const linkStyle: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  gap:            6,
  fontFamily:     "'Space Mono', monospace",
  fontSize:       12,
  letterSpacing:  '0.14em',
  color:          'rgba(255,255,255,0.48)',
  background:     'none',
  border:         'none',
  padding:        0,
  cursor:         'pointer',
  textDecoration: 'none',
  transition:     'color 0.2s',
};

const previewPopupStyle: React.CSSProperties = {
  position:      'absolute',
  bottom:        'calc(100% + 12px)',
  left:          '50%',
  transform:     'translateX(-50%)',
  width:         220,
  background:    '#0d0d0d',
  border:        '0.5px solid rgba(255,255,255,0.12)',
  borderRadius:  3,
  padding:       8,
  boxShadow:     '0 12px 32px rgba(0,0,0,0.6)',
  zIndex:        30,
  pointerEvents: 'auto',
};

const previewImgStyle: React.CSSProperties = {
  width:        '100%',
  height:       130,
  objectFit:    'cover',
  borderRadius: 2,
  display:      'block',
  marginBottom: 8,
};

const seeAllStyle: React.CSSProperties = {
  display:       'block',
  width:         '100%',
  textAlign:     'right',
  fontFamily:    "'Space Mono', monospace",
  fontSize:      10.5,
  letterSpacing: '0.08em',
  color:         'rgba(255,255,255,0.6)',
  background:    'none',
  border:        'none',
  padding:       0,
  cursor:        'pointer',
  transition:    'color 0.2s',
};

const overlayStyle: React.CSSProperties = {
  position:       'fixed',
  inset:          0,
  background:     'rgba(6,6,6,0.94)',
  zIndex:         200,
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  cursor:         'zoom-out',
};

const lightboxImgStyle: React.CSSProperties = {
  maxWidth:  '86vw',
  maxHeight: '82vh',
  objectFit: 'contain',
  borderRadius: 3,
  boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
  cursor:    'default',
};

const closeBtnStyle: React.CSSProperties = {
  position:     'fixed',
  top:          28,
  right:        32,
  background:   'rgba(10,10,10,0.7)',
  border:       '0.5px solid rgba(255,255,255,0.18)',
  color:        'rgba(255,255,255,0.75)',
  borderRadius: '50%',
  width:        36,
  height:       36,
  display:      'flex',
  alignItems:   'center',
  justifyContent: 'center',
  cursor:       'pointer',
};

const navBtnStyle: React.CSSProperties = {
  position:     'fixed',
  top:          '50%',
  transform:    'translateY(-50%)',
  background:   'rgba(10,10,10,0.7)',
  border:       '0.5px solid rgba(255,255,255,0.18)',
  color:        'rgba(255,255,255,0.75)',
  borderRadius: '50%',
  width:        44,
  height:       44,
  display:      'flex',
  alignItems:   'center',
  justifyContent: 'center',
  cursor:       'pointer',
};

const counterStyle: React.CSSProperties = {
  position:      'fixed',
  bottom:        28,
  left:          '50%',
  transform:     'translateX(-50%)',
  fontFamily:    "'Space Mono', monospace",
  fontSize:      11,
  letterSpacing: '0.14em',
  color:         'rgba(255,255,255,0.45)',
};