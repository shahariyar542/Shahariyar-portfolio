import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { certificatesData, achievements } from '../../data/portfolio.js';
import './Recognition.css';

/* ── Interactive 3D Award Trophy Card ── */
function AwardCard3D({ item }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: xPct, y: yPct });

    const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  return (
    <motion.article
      ref={cardRef}
      className={`award-3d-card ${isHovered ? 'award-3d-card--hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      <div
        className="award-3d-sheen"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(251, 191, 36, 0.18) 0%, rgba(96, 165, 250, 0.05) 50%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />
      <div className="award-3d-glow" aria-hidden="true" />

      <div className="award-card-inner">
        <div className="award-emblem-wrap">
          <div className="award-emblem-halo" aria-hidden="true" />
          <div className="award-emblem-icon">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
              <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
              <path d="M12 2v20" />
              <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
            </svg>
          </div>
        </div>

        <div className="award-badges">
          <span className="award-badge-gold">
            <span className="award-star">★</span> {item.badge || 'Regional 1st Place'}
          </span>
          <span className="award-badge-category">
            {item.category || 'Scientific Innovation'}
          </span>
        </div>

        <h3 className="award-main-title">{item.title}</h3>
        <p className="award-rank-text">{item.award}</p>
        <p className="award-desc">{item.impact || item.description}</p>

        <div className="award-footer-strip">
          <div className="award-verified-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Verified Regional Distinction</span>
          </div>
          <span className="award-year-tag">{item.year || 'Excellence in Scientific Methodology'}</span>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Certificate Card ── */
function CertificateCard({ cert, onOpenModal, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });

  return (
    <motion.article
      ref={cardRef}
      className="cert-card"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="cert-preview-wrap" onClick={() => onOpenModal(cert)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenModal(cert)} aria-label={`View ${cert.title} certificate`}>
        <img
          src={cert.image}
          alt={`${cert.title} - ${cert.organization}`}
          className="cert-thumbnail"
          loading="lazy"
        />
        <div className="cert-preview-overlay">
          <div className="cert-preview-pill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <span>Inspect Certificate</span>
          </div>
        </div>
      </div>

      <div className="cert-content">
        <div className="cert-header-row">
          <span className="cert-badge">{cert.badge}</span>
          <span className="cert-date">{cert.issueDate}</span>
        </div>

        <h3 className="cert-title">{cert.title}</h3>
        <p className="cert-issuer">
          <strong>{cert.organization}</strong>
          {cert.issuerSub && <span className="cert-issuer-sub"> • {cert.issuerSub}</span>}
        </p>

        {cert.grade && (
          <div className="cert-stat-badge">
            <span className="cert-stat-label">Final Evaluation:</span>
            <span className="cert-stat-value">{cert.grade}</span>
            {cert.credits && <span className="cert-stat-sub">({cert.credits})</span>}
          </div>
        )}

        <p className="cert-desc">{cert.description}</p>

        <div className="cert-tags">
          {cert.skillsLearned.map((skill) => (
            <span key={skill} className="cert-tag">
              {skill}
            </span>
          ))}
        </div>

        <div className="cert-footer">
          <div className="cert-id-wrap">
            <span className="cert-id-label">ID:</span>
            <span className="cert-id-code">{cert.certificateId}</span>
          </div>
          <button
            type="button"
            className="cert-inspect-btn"
            onClick={() => onOpenModal(cert)}
          >
            <span>View Details</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Fullscreen Interactive Lightbox Modal ── */
function CertificateLightbox({ cert, onClose }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [handleKeyDown]);

  if (!cert) return null;

  return (
    <motion.div
      className="cert-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} Certificate Preview`}
    >
      <motion.div
        className="cert-modal-card"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar */}
        <div className="cert-modal-header">
          <div className="cert-modal-header-meta">
            <span className="cert-modal-issuer">{cert.organization}</span>
            <span className="cert-modal-badge">{cert.badge}</span>
          </div>
          <button
            type="button"
            className="cert-modal-close"
            onClick={onClose}
            aria-label="Close certificate preview (Esc)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="cert-modal-body">
          {/* Certificate High-Res Viewer */}
          <div className="cert-modal-media">
            <img
              src={cert.image}
              alt={cert.title}
              className="cert-modal-img"
            />
          </div>

          {/* Certificate Information Sidebar */}
          <div className="cert-modal-details">
            <h3 className="cert-modal-title">{cert.title}</h3>
            <p className="cert-modal-recipient">
              Awarded to: <strong>{cert.recipient}</strong>
            </p>

            <div className="cert-meta-grid">
              <div className="cert-meta-item">
                <span className="cert-meta-label">Issuing Body</span>
                <span className="cert-meta-val">{cert.organization}</span>
              </div>
              <div className="cert-meta-item">
                <span className="cert-meta-label">Issue Date</span>
                <span className="cert-meta-val">{cert.issueDate}</span>
              </div>
              <div className="cert-meta-item">
                <span className="cert-meta-label">Credential ID</span>
                <span className="cert-meta-val cert-meta-val--mono">{cert.certificateId}</span>
              </div>
              <div className="cert-meta-item">
                <span className="cert-meta-label">Field / Domain</span>
                <span className="cert-meta-val">{cert.category}</span>
              </div>
              {cert.grade && (
                <div className="cert-meta-item">
                  <span className="cert-meta-label">Honors &amp; Score</span>
                  <span className="cert-meta-val cert-meta-val--highlight">{cert.grade}</span>
                </div>
              )}
            </div>

            <p className="cert-modal-desc">{cert.description}</p>

            <div className="cert-modal-skills">
              <span className="cert-skills-heading">Verified Competencies:</span>
              <div className="cert-modal-tags">
                {cert.skillsLearned.map((s) => (
                  <span key={s} className="cert-modal-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions: View PDF / Open Validation */}
            <div className="cert-modal-actions">
              {cert.pdfPath && (
                <a
                  href={cert.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-btn-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span>Open Full PDF Document</span>
                </a>
              )}
              {cert.verificationUrl && (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-btn-secondary"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>Verify at Issuer</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Recognition() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [selectedCert, setSelectedCert] = useState(null);
  const awardItem = achievements[0];

  return (
    <section id="recognition" className="recognition section" ref={sectionRef}>
      {/* Anchor for backward compatibility with #achievements */}
      <div id="achievements" className="nav-anchor-compat" aria-hidden="true" />

      <div className="container">
        {/* Section Header */}
        <motion.header
          className="section-header recognition-header"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">08 — Milestones &amp; Honors</p>
          <h2 className="section-title">
            Certificates &amp; <em>Recognition</em>
          </h2>
          <p className="section-subtitle">
            Milestones, Achievements &amp; Continuous Learning
          </p>
        </motion.header>

        {/* Subsection A: Prestigious Award Showcase */}
        <div className="recognition-awards-wrap">
          <div className="recognition-subheading-wrap">
            <span className="recognition-subheading-tag">Featured Honor</span>
            <h3 className="recognition-subheading">Competitive Distinction</h3>
          </div>
          <AwardCard3D item={awardItem} />
        </div>

        {/* Subsection B: Verified Certifications */}
        <div className="recognition-certs-wrap">
          <div className="recognition-subheading-wrap">
            <span className="recognition-subheading-tag">Continuous Mastery</span>
            <h3 className="recognition-subheading">Verified Certifications</h3>
          </div>

          <div className="cert-cards-grid">
            {certificatesData.map((cert, index) => (
              <CertificateCard
                key={cert.id}
                cert={cert}
                index={index}
                onOpenModal={(c) => setSelectedCert(c)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <CertificateLightbox
            cert={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
