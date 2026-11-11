import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { socialLinks, personalInfo } from '../../data/portfolio';
import { copyToClipboard, isValidEmail } from '../../utils/helpers';
import SectionHeader from '../SectionHeader/SectionHeader';
import './Contact.css';

/* ── Social Icon SVGs ── */
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const formRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | sending | success | error | no-config
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopyEmail = async () => {
    const ok = await copyToClipboard(personalInfo.email);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.from_name.trim()) {
      newErrors.from_name = 'Name is required';
    }
    if (!formData.from_email.trim()) {
      newErrors.from_email = 'Email is required';
    } else if (!isValidEmail(formData.from_email)) {
      newErrors.from_email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitStatus === 'sending') return;

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey || serviceId === 'your_service_id_here') {
      setSubmitStatus('no-config');
      return;
    }

    setSubmitStatus('sending');
    setErrorMessage('');

    const templateParams = {
      from_name: formData.from_name.trim(),
      from_email: formData.from_email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, {
        publicKey,
      });
      setSubmitStatus('success');
      setFormData({ from_name: '', from_email: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      setSubmitStatus('error');
      const msg =
        (err && typeof err.text === 'string' && err.text) ||
        (err && typeof err.message === 'string' && err.message) ||
        'Failed to send message. Please try again or reach out directly via email.';
      setErrorMessage(msg);
    }
  };

  const handleReset = () => {
    setSubmitStatus('idle');
    setFormData({ from_name: '', from_email: '', subject: '', message: '' });
    setErrors({});
    setErrorMessage('');
  };

  const socials = [
    { label: 'Facebook', href: socialLinks.facebook, Icon: FacebookIcon },
    { label: 'LinkedIn', href: socialLinks.linkedin, Icon: LinkedInIcon },
    { label: 'GitHub', href: socialLinks.github, Icon: GitHubIcon },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section id="contact" className="section section-dark contact-section" ref={sectionRef}>
      <div className="contact-container">
        {/* Section Header */}
        <SectionHeader
          theme="contact"
          badgeText="Get In Touch"
          title="Let's"
          highlightWord="Connect"
          subtitle="Have an idea or an opportunity? Let's connect and create something meaningful."
          align="center"
        />

        <div className="contact-grid">
          {/* ── Left: Info ── */}
          <motion.div
            className="contact-info"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            custom={1}
          >
            <p className="contact-statement">
              Have a project in mind, want to collaborate, or just want to say hello?
            </p>

            {/* Email with copy */}
            <div className="contact-email-row">
              <a href={`mailto:${personalInfo.email}`} className="contact-email-link">
                {personalInfo.email}
              </a>
              <button
                className={`contact-copy-btn${copied ? ' contact-copy-btn--copied' : ''}`}
                onClick={handleCopyEmail}
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Social links */}
            <nav className="contact-socials" aria-label="Social links">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link"
                >
                  <Icon />
                  <span>{label}</span>
                  <svg className="contact-social-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
              ))}
            </nav>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            className="contact-form-wrapper"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            custom={2}
          >
            {submitStatus === 'success' ? (
              <motion.div
                className="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="contact-success-icon" aria-hidden="true">✓</span>
                <p className="contact-success-title">Message sent!</p>
                <p className="contact-success-text">Thank you for reaching out. I'll get back to you soon.</p>
                <button
                  type="button"
                  className="contact-success-reset"
                  onClick={handleReset}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <div className={`contact-field${errors.from_name ? ' contact-field--error' : ''}`}>
                  <input
                    type="text"
                    name="from_name"
                    id="contact-name"
                    value={formData.from_name}
                    onChange={handleChange}
                    disabled={submitStatus === 'sending'}
                    required
                    autoComplete="name"
                    placeholder=" "
                  />
                  <label htmlFor="contact-name">Your Name</label>
                  {errors.from_name && <span className="contact-field-error">{errors.from_name}</span>}
                </div>

                {/* Email */}
                <div className={`contact-field${errors.from_email ? ' contact-field--error' : ''}`}>
                  <input
                    type="email"
                    name="from_email"
                    id="contact-email"
                    value={formData.from_email}
                    onChange={handleChange}
                    disabled={submitStatus === 'sending'}
                    required
                    autoComplete="email"
                    placeholder=" "
                  />
                  <label htmlFor="contact-email">Your Email</label>
                  {errors.from_email && <span className="contact-field-error">{errors.from_email}</span>}
                </div>

                {/* Subject */}
                <div className={`contact-field${errors.subject ? ' contact-field--error' : ''}`}>
                  <input
                    type="text"
                    name="subject"
                    id="contact-subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={submitStatus === 'sending'}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="contact-subject">Subject</label>
                  {errors.subject && <span className="contact-field-error">{errors.subject}</span>}
                </div>

                {/* Message */}
                <div className={`contact-field contact-field--textarea${errors.message ? ' contact-field--error' : ''}`}>
                  <textarea
                    name="message"
                    id="contact-message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={submitStatus === 'sending'}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="contact-message">Your Message</label>
                  {errors.message && <span className="contact-field-error">{errors.message}</span>}
                </div>

                {/* Error / No-config messages */}
                {submitStatus === 'error' && (
                  <p className="contact-form-error" role="alert">
                    {errorMessage || 'Something went wrong. Please try again or email me directly.'}
                  </p>
                )}
                {submitStatus === 'no-config' && (
                  <p className="contact-form-notice" role="alert">
                    Contact form service is currently unconfigured. Please email me directly at{' '}
                    <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="contact-submit"
                  disabled={submitStatus === 'sending'}
                  aria-busy={submitStatus === 'sending'}
                >
                  {submitStatus === 'sending' ? (
                    <>
                      <span className="contact-spinner" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
