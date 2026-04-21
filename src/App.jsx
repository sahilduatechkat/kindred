import { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream: #FAF6F0;
  --cream-dark: #F0EBE3;
  --sage: #7B8E6D;
  --sage-light: #E8EDE4;
  --sage-lighter: #F2F5EF;
  --sage-dark: #5C6B52;
  --clay: #C17A5A;
  --clay-light: #F3E0D6;
  --clay-dark: #A65D42;
  --text: #2D2A26;
  --text-secondary: #7A756F;
  --white: #FFFFFF;
  --divider: #E5E0DA;
  --font-display: 'DM Serif Display', Georgia, 'Times New Roman', serif;
  --font-body: 'DM Sans', system-ui, -apple-system, sans-serif;
}

html { scroll-behavior: smooth; }

.kindred-root {
  font-family: var(--font-body);
  color: var(--text);
  background: var(--cream);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  overflow-x: hidden;
}

.kindred-root::after {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.025;
  pointer-events: none;
  z-index: 9999;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* Navigation */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 1.25rem 2rem;
  display: flex; align-items: center; justify-content: space-between;
  transition: all 0.4s ease;
  background: transparent;
}
.nav.scrolled {
  background: rgba(250, 246, 240, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--divider);
}
.nav.therapist-nav.scrolled {
  background: rgba(240, 235, 227, 0.92);
}
.therapist-nav:not(.scrolled) .nav-link {
  color: rgba(255, 255, 255, 0.65);
}
.therapist-nav:not(.scrolled) .nav-link:hover {
  color: rgba(255, 255, 255, 0.95);
}
.therapist-nav:not(.scrolled) .nav-wordmark {
  color: rgba(232, 237, 228, 0.9);
}
.nav-wordmark {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--sage-dark);
  letter-spacing: -0.02em;
  cursor: pointer;
  text-decoration: none;
  background: none;
  border: none;
}
.nav-links { display: flex; align-items: center; gap: 2rem; }
.nav-link {
  font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
  color: var(--text-secondary); text-decoration: none; cursor: pointer;
  transition: color 0.2s; background: none; border: none; letter-spacing: 0.01em;
}
.nav-link:hover { color: var(--text); }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-family: var(--font-body); font-size: 0.9375rem; font-weight: 500;
  padding: 0.8125rem 1.75rem; border-radius: 100px; border: none;
  cursor: pointer; transition: all 0.25s ease; text-decoration: none;
  letter-spacing: 0.005em; line-height: 1;
}
.btn-primary { background: var(--clay); color: var(--white); }
.btn-primary:hover { background: var(--clay-dark); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(193,122,90,0.3); }
.btn-sage { background: var(--sage-dark); color: var(--white); }
.btn-sage:hover { background: #4a5940; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(92,107,82,0.3); }
.btn-secondary { background: transparent; color: var(--text); border: 1.5px solid var(--divider); }
.btn-secondary:hover { border-color: var(--sage); color: var(--sage-dark); background: var(--sage-lighter); }
.btn-outline-white { background: transparent; color: var(--white); border: 1.5px solid rgba(255,255,255,0.4); }
.btn-outline-white:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.7); }
.btn-sm { font-size: 0.8125rem; padding: 0.625rem 1.25rem; }
.btn-lg { font-size: 1rem; padding: 1rem 2.25rem; }

/* Section Layout */
.section { padding: 7rem 2rem; max-width: 1200px; margin: 0 auto; }
.section-eyebrow {
  font-family: var(--font-body); font-size: 0.75rem; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--sage); margin-bottom: 1.25rem;
}
.section-heading {
  font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.15; color: var(--text); margin-bottom: 1.5rem; letter-spacing: -0.02em;
}
.section-subtext {
  font-size: 1.125rem; line-height: 1.7; color: var(--text-secondary);
  max-width: 600px; font-weight: 300;
}

/* Animations */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal.delay-1 { transition-delay: 0.12s; }
.reveal.delay-2 { transition-delay: 0.24s; }
.reveal.delay-3 { transition-delay: 0.36s; }
.reveal.delay-4 { transition-delay: 0.48s; }

/* Hero */
.hero {
  min-height: 100vh; display: flex; align-items: center;
  padding: 8rem 2rem 6rem; max-width: 1200px; margin: 0 auto; position: relative;
}
.hero-content { flex: 1; max-width: 620px; position: relative; z-index: 2; }
.hero-heading {
  font-family: var(--font-display); font-size: clamp(2.5rem, 5.5vw, 3.75rem);
  line-height: 1.1; color: var(--text); margin-bottom: 0.75rem; letter-spacing: -0.025em;
}
.hero-heading-light {
  display: block; color: var(--text-secondary);
  font-family: var(--font-display); font-style: italic;
}
.hero-body {
  font-size: 1.1875rem; line-height: 1.75; color: var(--text-secondary);
  margin: 1.75rem 0 2.5rem; max-width: 520px; font-weight: 300;
}
.hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
.hero-meta { margin-top: 2.5rem; font-size: 0.8125rem; color: var(--text-secondary); font-weight: 300; }
.hero-meta button { background: none; border: none; font-family: var(--font-body); font-size: 0.8125rem; color: var(--sage); cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
.hero-visual {
  position: absolute; right: -2rem; top: 50%; transform: translateY(-50%);
  width: 500px; height: 500px; opacity: 0.6; z-index: 1;
}

/* Therapist Hero — dark section */
.therapist-hero-wrap {
  background: linear-gradient(150deg, #3D4F38 0%, #2D3A29 100%);
  position: relative; overflow: hidden;
}
.therapist-hero-wrap::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 70% 50%, rgba(193,122,90,0.12) 0%, transparent 60%);
  pointer-events: none;
}
.therapist-hero-wrap .hero { max-width: 1200px; }
.therapist-hero-wrap .hero-heading { color: #F5F0EB; }
.therapist-hero-wrap .hero-heading-light { color: rgba(245,240,235,0.6); }
.therapist-hero-wrap .hero-body { color: rgba(245,240,235,0.7); }
.therapist-hero-wrap .hero-meta { color: rgba(245,240,235,0.5); }
.therapist-hero-wrap .hero-meta button { color: #C17A5A; }

/* Trust badge strip */
.trust-strip {
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 2rem;
  padding: 1.5rem 2rem; border-bottom: 1px solid var(--divider);
  background: var(--white);
}
.trust-item {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.8125rem; color: var(--text-secondary); font-weight: 400;
}
.trust-item svg { color: var(--sage); flex-shrink: 0; }
.trust-item strong { color: var(--text); font-weight: 600; }

/* Problem Cards */
.problem-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3.5rem; }
.problem-card {
  padding: 2.25rem; background: var(--white); border-radius: 20px;
  border: 1px solid var(--divider); transition: all 0.3s ease;
}
.problem-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(45,42,38,0.07); border-color: transparent; }
.problem-card--clay { border-top: 3px solid var(--clay-light); }
.problem-icon {
  width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
  border-radius: 14px; background: var(--sage-lighter); margin-bottom: 1.5rem;
}
.problem-icon--clay { background: var(--clay-light); color: var(--clay-dark); }
.problem-stat { font-family: var(--font-display); font-size: 2.5rem; color: var(--clay); margin-bottom: 0.25rem; letter-spacing: -0.03em; }
.problem-label { font-size: 0.9375rem; font-weight: 500; color: var(--text); margin-bottom: 0.75rem; line-height: 1.4; }
.problem-body { font-size: 0.875rem; line-height: 1.65; color: var(--text-secondary); font-weight: 300; }

/* ===== FLOW DIAGRAM ===== */
.flow-section {
  background: var(--white);
  border-top: 1px solid var(--divider);
  border-bottom: 1px solid var(--divider);
  padding: 5rem 2rem;
}
.flow-inner { max-width: 1100px; margin: 0 auto; }
.flow-wrapper { margin-top: 3.5rem; overflow-x: auto; padding-bottom: 1rem; -webkit-overflow-scrolling: touch; }
.flow-track {
  display: flex; align-items: flex-start; justify-content: center;
  min-width: 700px; gap: 0;
}
.flow-step-card {
  flex: 1; min-width: 110px; max-width: 155px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 0 0.375rem;
}
.flow-step-card--ai { max-width: 172px; }
.flow-eyebrow {
  font-size: 0.625rem; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--sage); margin-bottom: 0.875rem; white-space: nowrap;
}
.flow-node {
  width: 68px; height: 68px; border-radius: 50%;
  background: var(--cream); border: 1.5px solid var(--divider);
  display: flex; align-items: center; justify-content: center;
  color: var(--sage-dark); margin-bottom: 1rem; flex-shrink: 0;
  transition: box-shadow 0.3s ease;
}
.flow-node--ai {
  width: 84px; height: 84px;
  background: linear-gradient(135deg, var(--sage-dark) 0%, #3D4F38 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 0 0 8px rgba(92,107,82,0.1), 0 8px 28px rgba(92,107,82,0.22);
}
.flow-step-title { font-size: 0.875rem; font-weight: 600; color: var(--text); margin-bottom: 0.375rem; line-height: 1.3; }
.flow-step-desc { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.55; font-weight: 300; max-width: 128px; }
.flow-ai-badge {
  margin-top: 0.625rem;
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: var(--sage-lighter); border: 1px solid var(--sage-light);
  border-radius: 100px; padding: 0.2rem 0.625rem;
  font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sage-dark);
}
.flow-arrow-wrap {
  display: flex; align-items: flex-start; padding-top: 22px; flex-shrink: 0;
}
.flow-feedback-note {
  margin-top: 2rem;
  display: flex; align-items: center; justify-content: center; gap: 0.625rem; flex-wrap: wrap;
  padding: 0.875rem 1.5rem; border-radius: 12px;
  background: var(--sage-lighter); border: 1px dashed var(--sage-light);
  color: var(--text-secondary); font-size: 0.8125rem; font-weight: 300; line-height: 1.5;
  text-align: center; max-width: 580px; margin-left: auto; margin-right: auto;
}

/* Stats */
.stats-section { background: var(--white); border-top: 1px solid var(--divider); border-bottom: 1px solid var(--divider); }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; margin-top: 3rem; }
.stat-item { text-align: center; }
.stat-number { font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 2.75rem); color: var(--sage-dark); margin-bottom: 0.375rem; letter-spacing: -0.03em; }
.stat-label { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; font-weight: 300; }

/* Quote */
.quote-section { background: var(--sage-lighter); padding: 5rem 2rem; text-align: center; }

/* CTA Section */
.cta-section { text-align: center; padding: 8rem 2rem; }
.cta-section .section-heading { max-width: 700px; margin: 0 auto 1rem; }
.cta-section .section-subtext { margin: 0 auto 2.5rem; text-align: center; }
.cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

/* Footer */
.footer { padding: 3rem 2rem; text-align: center; border-top: 1px solid var(--divider); }
.footer-wordmark { font-family: var(--font-display); font-size: 1.25rem; color: var(--sage); margin-bottom: 0.5rem; }
.footer-text { font-size: 0.8125rem; color: var(--text-secondary); font-weight: 300; }

/* Form Pages */
.form-page { min-height: 100vh; display: flex; flex-direction: column; animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.form-container { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem 3rem; max-width: 560px; margin: 0 auto; width: 100%; }
.form-progress { position: fixed; top: 0; left: 0; height: 3px; background: var(--sage); transition: width 0.5s cubic-bezier(0.25,0.46,0.45,0.94); z-index: 200; border-radius: 0 2px 2px 0; }
.form-step { width: 100%; animation: stepIn 0.35s ease; }
@keyframes stepIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.form-step-number { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sage); margin-bottom: 0.75rem; }
.form-question { font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.25; color: var(--text); margin-bottom: 0.625rem; letter-spacing: -0.015em; }
.form-hint { font-size: 0.9375rem; color: var(--text-secondary); margin-bottom: 2rem; font-weight: 300; line-height: 1.6; }
.form-input { width: 100%; font-family: var(--font-body); font-size: 1.0625rem; padding: 1rem 1.25rem; border: 1.5px solid var(--divider); border-radius: 14px; background: var(--white); color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-weight: 300; }
.form-input:focus { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(123,142,109,0.1); }
.form-input::placeholder { color: #C4BFB8; }
.form-textarea { resize: vertical; min-height: 140px; line-height: 1.6; }
.form-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-actions { display: flex; gap: 1rem; margin-top: 2.5rem; width: 100%; }
.form-actions .btn { flex: 1; }
.form-back-btn { background: none; border: none; font-family: var(--font-body); font-size: 0.875rem; color: var(--text-secondary); cursor: pointer; padding: 0.5rem; display: flex; align-items: center; gap: 0.375rem; transition: color 0.2s; }
.form-back-btn:hover { color: var(--text); }
.form-options { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
.form-option { padding: 1rem 1.25rem; border: 1.5px solid var(--divider); border-radius: 14px; background: var(--white); cursor: pointer; transition: all 0.2s ease; font-family: var(--font-body); font-size: 0.9375rem; color: var(--text); text-align: left; font-weight: 400; line-height: 1.4; }
.form-option:hover { border-color: var(--sage); background: var(--sage-lighter); }
.form-option.selected { border-color: var(--sage); background: var(--sage-light); color: var(--sage-dark); font-weight: 500; }
.form-pills { display: flex; flex-wrap: wrap; gap: 0.625rem; width: 100%; }
.form-pill { padding: 0.625rem 1.125rem; border: 1.5px solid var(--divider); border-radius: 100px; background: var(--white); cursor: pointer; transition: all 0.2s ease; font-family: var(--font-body); font-size: 0.8125rem; color: var(--text-secondary); font-weight: 400; line-height: 1; }
.form-pill:hover { border-color: var(--sage); color: var(--text); }
.form-pill.selected { border-color: var(--sage); background: var(--sage); color: var(--white); font-weight: 500; }
.thankyou { text-align: center; }
.thankyou-icon { width: 64px; height: 64px; border-radius: 50%; background: var(--sage-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; }
.thankyou-heading { font-family: var(--font-display); font-size: 2.25rem; color: var(--text); margin-bottom: 1rem; letter-spacing: -0.02em; }
.thankyou-body { font-size: 1.0625rem; line-height: 1.7; color: var(--text-secondary); font-weight: 300; max-width: 400px; margin: 0 auto 0.75rem; }
.thankyou-sig { font-family: var(--font-display); font-style: italic; color: var(--sage); font-size: 1rem; margin-top: 1.5rem; }

/* Responsive */
@media (max-width: 768px) {
  .hero { padding: 7rem 1.5rem 4rem; min-height: auto; }
  .hero-visual { display: none; }
  .hero-content { max-width: 100%; }
  .problem-grid { grid-template-columns: 1fr; gap: 1.25rem; }
  .stats-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .section { padding: 4rem 1.5rem; }
  .nav-links .nav-link-text { display: none; }
  .form-input-row { grid-template-columns: 1fr; }
  .hero-ctas { flex-direction: column; }
  .hero-ctas .btn { text-align: center; justify-content: center; }
  .trust-strip { gap: 1rem; }
  .flow-wrapper { overflow-x: auto; }
  .flow-feedback-note { font-size: 0.75rem; }
  .dim-grid { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 480px) {
  .dim-grid { grid-template-columns: 1fr !important; }
}
`;

// ============================================================
// ICONS
// ============================================================

const Icons = {
  scroll: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <line x1="7" y1="8" x2="17" y2="8"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
      <line x1="7" y1="16" x2="13" y2="16"/>
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12,7 12,12 15.5,14"/>
    </svg>
  ),
  doorOpen: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2h11a2 2 0 012 2v16a2 2 0 01-2 2H5"/>
      <path d="M5 22V2"/>
      <circle cx="13" cy="12" r="1" fill="currentColor"/>
      <path d="M2 12h3"/>
    </svg>
  ),
  brokenHeart: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      <polyline points="12,9 10,13 14,15 12,19"/>
    </svg>
  ),
  chat: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      <line x1="8" y1="9" x2="16" y2="9"/>
      <line x1="8" y1="13" x2="13" y2="13"/>
    </svg>
  ),
  neural: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="8" r="2"/>
      <circle cx="12" cy="4" r="2"/>
      <circle cx="19" cy="8" r="2"/>
      <circle cx="8" cy="17" r="2"/>
      <circle cx="16" cy="17" r="2"/>
      <line x1="7" y1="8" x2="10" y2="4"/>
      <line x1="14" y1="4" x2="17" y2="8"/>
      <line x1="5" y1="10" x2="7" y2="15"/>
      <line x1="19" y1="10" x2="17" y2="15"/>
      <line x1="10" y1="17" x2="14" y2="17"/>
    </svg>
  ),
  matchCards: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3"/>
      <path d="M4 18c0-2.8 2.24-5 5-5s5 2.2 5 5"/>
      <circle cx="17" cy="9" r="2" strokeDasharray="3 2"/>
      <path d="M19 18c0-2 1.5-3.5 3-4"/>
    </svg>
  ),
  calCheck: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <polyline points="9,16 11,18 15,14"/>
    </svg>
  ),
  cycle: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  ),
  video: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="14" height="14" rx="2"/>
      <path d="M16 10l5-3v10l-5-3"/>
    </svg>
  ),
  userCheck: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <polyline points="16,11 18,13 22,9"/>
    </svg>
  ),
  calEmpty: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="9" y1="15" x2="15" y2="19"/>
      <line x1="15" y1="15" x2="9" y2="19"/>
    </svg>
  ),
  trendDown: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/>
      <polyline points="17,18 23,18 23,12"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="8" x2="13" y2="8"/>
      <polyline points="9,4 13,8 9,12"/>
    </svg>
  ),
  arrowLeft: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="13" y1="8" x2="3" y2="8"/>
      <polyline points="7,4 3,8 7,12"/>
    </svg>
  ),
  check: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,12 10,16 18,8"/>
    </svg>
  ),
  checkSmall: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,7 6,10 11,4"/>
    </svg>
  ),
  person: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="6" r="3.5"/>
      <path d="M3 18c0-3.5 3.134-6 7-6s7 2.5 7 6"/>
    </svg>
  ),
  therapist: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="6" r="3.5"/>
      <path d="M3 18c0-3.5 3.134-6 7-6s7 2.5 7 6"/>
      <path d="M14 3l1.5 1.5L14 6"/>
    </svg>
  ),
};

// ============================================================
// HERO ILLUSTRATION
// ============================================================

// Patient hero: "From hundreds of options to your one perfect match"
const HeroIllustration = () => (
  <svg viewBox="0 0 460 420" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    <defs>
      <radialGradient id="matchHalo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#C17A5A" stopOpacity="0.12"/>
        <stop offset="100%" stopColor="#C17A5A" stopOpacity="0"/>
      </radialGradient>
    </defs>

    {/* ── Patient node (left) ── */}
    <circle cx="88" cy="210" r="46" fill="#F2F5EF" stroke="#D8E0D2" strokeWidth="1.5"/>
    {/* person silhouette */}
    <circle cx="88" cy="199" r="14" fill="#7B8E6D" opacity="0.4"/>
    <path d="M60 228 C60 212 116 212 116 228" fill="#7B8E6D" opacity="0.28"/>

    {/* ── Muted option: top ── */}
    <circle cx="352" cy="108" r="30" fill="#F5F5F2" stroke="#E5E0DA" strokeWidth="1" opacity="0.6"/>
    <circle cx="352" cy="99"  r="10" fill="#BBBDBA" opacity="0.35"/>
    <path d="M331 118 C331 110 373 110 373 118" fill="#BBBDBA" opacity="0.28"/>

    {/* ── THE MATCH: middle ── */}
    <circle cx="352" cy="210" r="58" fill="url(#matchHalo)"/>
    <circle cx="352" cy="210" r="42" fill="#FFF9F7" stroke="#C17A5A" strokeWidth="2"/>
    <circle cx="352" cy="198" r="15" fill="#C17A5A" opacity="0.38"/>
    <path d="M323 224 C323 208 381 208 381 224" fill="#C17A5A" opacity="0.26"/>
    {/* check badge */}
    <circle cx="384" cy="178" r="15" fill="#C17A5A"/>
    <polyline points="377,178 383,184 393,172" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

    {/* ── Muted option: bottom ── */}
    <circle cx="352" cy="312" r="30" fill="#F5F5F2" stroke="#E5E0DA" strokeWidth="1" opacity="0.6"/>
    <circle cx="352" cy="303" r="10" fill="#BBBDBA" opacity="0.35"/>
    <path d="M331 322 C331 314 373 314 373 322" fill="#BBBDBA" opacity="0.28"/>

    {/* ── Connector: patient → muted top (dashed) ── */}
    <path d="M133 196 Q220 146 322 116" stroke="#D8DDD5" strokeWidth="1.5" fill="none" strokeDasharray="5 4"/>

    {/* ── Connector: patient → match (solid + dimension dots) ── */}
    <line x1="134" y1="210" x2="310" y2="210" stroke="#C17A5A" strokeWidth="1.75" opacity="0.3"/>
    <circle cx="178" cy="210" r="3.5" fill="#C17A5A" opacity="0.55"/>
    <circle cx="212" cy="210" r="3.5" fill="#C17A5A" opacity="0.55"/>
    <circle cx="246" cy="210" r="3.5" fill="#C17A5A" opacity="0.55"/>
    <circle cx="280" cy="210" r="3.5" fill="#C17A5A" opacity="0.55"/>

    {/* ── Connector: patient → muted bottom (dashed) ── */}
    <path d="M133 224 Q220 274 322 304" stroke="#D8DDD5" strokeWidth="1.5" fill="none" strokeDasharray="5 4"/>

    {/* ── "Best match" label ── */}
    <rect x="296" y="250" width="96" height="22" rx="11" fill="#C17A5A" opacity="0.1"/>
    <text x="344" y="265" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="10" fontWeight="600" fill="#A65D42" letterSpacing="0.04em">Best match</text>
  </svg>
);

// Therapist hero: "Right-fit clients find you — the rest don't reach you"
const TherapistHeroIllustration = () => (
  <svg viewBox="0 0 460 420" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    <defs>
      <radialGradient id="therapistGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#C17A5A" stopOpacity="0.18"/>
        <stop offset="100%" stopColor="#C17A5A" stopOpacity="0"/>
      </radialGradient>
    </defs>

    {/* ── Therapist node (right, large) ── */}
    <circle cx="360" cy="210" r="64" fill="rgba(255,255,255,0.07)"/>
    <circle cx="360" cy="210" r="46" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
    {/* person silhouette - lighter on dark bg */}
    <circle cx="360" cy="198" r="15" fill="rgba(255,255,255,0.4)"/>
    <path d="M330 226 C330 210 390 210 390 226" fill="rgba(255,255,255,0.3)"/>

    {/* ── Right-fit clients (arrive — warm/clay colored paths) ── */}
    {/* Client A - top left */}
    <circle cx="82" cy="112" r="24" fill="rgba(193,122,90,0.18)" stroke="rgba(193,122,90,0.35)" strokeWidth="1.2"/>
    <circle cx="82" cy="105" r="8" fill="rgba(193,122,90,0.45)"/>
    <path d="M68 120 C68 113 96 113 96 120" fill="rgba(193,122,90,0.35)"/>
    <path d="M106 118 Q230 130 314 194" stroke="#C17A5A" strokeWidth="1.5" fill="none" opacity="0.4"/>
    <circle cx="166" cy="124" r="3" fill="#C17A5A" opacity="0.5"/>
    <circle cx="220" cy="142" r="3" fill="#C17A5A" opacity="0.5"/>
    <circle cx="268" cy="166" r="3" fill="#C17A5A" opacity="0.5"/>

    {/* Client B - middle left (closest, arriving) */}
    <circle cx="66" cy="210" r="26" fill="rgba(193,122,90,0.22)" stroke="rgba(193,122,90,0.4)" strokeWidth="1.5"/>
    <circle cx="66" cy="202" r="9" fill="rgba(193,122,90,0.5)"/>
    <path d="M50 220 C50 211 82 211 82 220" fill="rgba(193,122,90,0.38)"/>
    <path d="M92 210 L314 210" stroke="#C17A5A" strokeWidth="1.75" fill="none" opacity="0.4"/>
    <circle cx="148" cy="210" r="3.5" fill="#C17A5A" opacity="0.55"/>
    <circle cx="196" cy="210" r="3.5" fill="#C17A5A" opacity="0.55"/>
    <circle cx="244" cy="210" r="3.5" fill="#C17A5A" opacity="0.55"/>
    <circle cx="285" cy="210" r="3.5" fill="#C17A5A" opacity="0.55"/>

    {/* Client C - bottom left */}
    <circle cx="82" cy="308" r="24" fill="rgba(193,122,90,0.18)" stroke="rgba(193,122,90,0.35)" strokeWidth="1.2"/>
    <circle cx="82" cy="301" r="8" fill="rgba(193,122,90,0.45)"/>
    <path d="M68 316 C68 309 96 309 96 316" fill="rgba(193,122,90,0.35)"/>
    <path d="M106 302 Q230 290 314 226" stroke="#C17A5A" strokeWidth="1.5" fill="none" opacity="0.4"/>
    <circle cx="174" cy="296" r="3" fill="#C17A5A" opacity="0.5"/>
    <circle cx="228" cy="278" r="3" fill="#C17A5A" opacity="0.5"/>
    <circle cx="274" cy="252" r="3" fill="#C17A5A" opacity="0.5"/>

    {/* ── Wrong-fit clients (stopped, muted, no connection) ── */}
    <circle cx="168" cy="76"  r="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
    <circle cx="148" cy="348" r="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
    <circle cx="210" cy="52"  r="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
    <circle cx="116" cy="156" r="13" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
    <circle cx="130" cy="270" r="13" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

    {/* ── "Right-fit only" label ── */}
    <rect x="292" y="258" width="110" height="22" rx="11" fill="rgba(193,122,90,0.15)" stroke="rgba(193,122,90,0.25)" strokeWidth="1"/>
    <text x="347" y="273" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="10" fontWeight="600" fill="#E8C4A8" letterSpacing="0.04em">Right-fit only</text>
  </svg>
);

// ============================================================
// FLOW DIAGRAM — SVG arrow connector
// ============================================================

const FlowArrow = () => (
  <svg width="44" height="24" viewBox="0 0 44 24" fill="none" aria-hidden="true"
    style={{flexShrink:0, alignSelf:'flex-start', marginTop:'24px'}}>
    <line x1="2" y1="12" x2="34" y2="12" stroke="#C4BFB8" strokeWidth="1.5" strokeDasharray="4 3"/>
    <polyline points="26,5 36,12 26,19" stroke="#B8C4B2" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ============================================================
// PATIENT MATCH FLOW DIAGRAM
// ============================================================

const PatientFlowDiagram = () => {
  const steps = [
    {
      eyebrow: 'Step 01',
      icon: Icons.chat,
      title: 'Share Your Story',
      desc: 'In your own words — no clinical jargon, no wrong answers.',
    },
    {
      eyebrow: 'Step 02',
      icon: Icons.neural,
      title: 'AI Matching Engine',
      desc: 'Dozens of dimensions analyzed instantly.',
      special: true,
    },
    {
      eyebrow: 'Step 03',
      icon: Icons.matchCards,
      title: 'Your Top 3 Matches',
      desc: 'Plain-language explanation of why each fits you.',
    },
    {
      eyebrow: 'Step 04',
      icon: Icons.calCheck,
      title: 'Book & Connect',
      desc: "First session already confident — no guessing.",
    },
    {
      eyebrow: 'Step 05',
      icon: Icons.cycle,
      title: 'Platform Learns',
      desc: 'Every session refines your match over time.',
    },
  ];

  return (
    <div className="flow-wrapper">
      <div className="flow-track">
        {steps.flatMap((step, i) => [
          <div key={`step-${i}`} className={`flow-step-card${step.special ? ' flow-step-card--ai' : ''}`}>
            <span className="flow-eyebrow">{step.eyebrow}</span>
            <div className={`flow-node${step.special ? ' flow-node--ai' : ''}`}>
              {step.icon}
            </div>
            <div className="flow-step-title">{step.title}</div>
            <div className="flow-step-desc">{step.desc}</div>
            {step.special && <div className="flow-ai-badge">✦ AI Powered</div>}
          </div>,
          i < steps.length - 1 && (
            <div key={`arrow-${i}`} className="flow-arrow-wrap">
              <FlowArrow />
            </div>
          ),
        ])}
      </div>
      <div className="flow-feedback-note">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--sage)',flexShrink:0}}>
          <path d="M2 7a5 5 0 1 0 5-5"/>
          <polyline points="1,3 2,7 6,6"/>
        </svg>
        <span>Every booking and session makes the matching engine smarter — continuously adapting to you and helping your therapist understand you better too</span>
      </div>
    </div>
  );
};

// ============================================================
// THERAPIST FLOW DIAGRAM
// ============================================================

const TherapistFlowDiagram = () => {
  const steps = [
    {
      eyebrow: 'Step 01',
      icon: Icons.chat,
      title: 'Tell Us How You Work',
      desc: 'Guided prompts about your approach, style, and who thrives with you.',
    },
    {
      eyebrow: 'Step 02',
      icon: Icons.video,
      title: '60-Second Intro Video',
      desc: "Your voice, your personality. Let patients know who they're booking with.",
    },
    {
      eyebrow: 'Step 03',
      icon: Icons.neural,
      title: 'AI Matches You',
      desc: 'Right-fit patients matched to your profile across dozens of dimensions.',
      special: true,
    },
    {
      eyebrow: 'Step 04',
      icon: Icons.userCheck,
      title: 'Sessions That Stick',
      desc: 'Patients arrive ready. Less churn. More meaningful work.',
    },
    {
      eyebrow: 'Step 05',
      icon: Icons.cycle,
      title: 'Matches Improve',
      desc: 'Every outcome signal sends you more of the right clients — automatically.',
    },
  ];

  return (
    <div className="flow-wrapper">
      <div className="flow-track">
        {steps.flatMap((step, i) => [
          <div key={`step-${i}`} className={`flow-step-card${step.special ? ' flow-step-card--ai' : ''}`}>
            <span className="flow-eyebrow">{step.eyebrow}</span>
            <div className={`flow-node${step.special ? ' flow-node--ai' : ''}`}>
              {step.icon}
            </div>
            <div className="flow-step-title">{step.title}</div>
            <div className="flow-step-desc">{step.desc}</div>
            {step.special && <div className="flow-ai-badge">✦ AI Powered</div>}
          </div>,
          i < steps.length - 1 && (
            <div key={`arrow-${i}`} className="flow-arrow-wrap">
              <FlowArrow />
            </div>
          ),
        ])}
      </div>
      <div className="flow-feedback-note">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--sage)',flexShrink:0}}>
          <path d="M2 7a5 5 0 1 0 5-5"/>
          <polyline points="1,3 2,7 6,6"/>
        </svg>
        <span>Each booking outcome trains the model — your ideal client profile sharpens automatically over time</span>
      </div>
    </div>
  );
};

// ============================================================
// SCROLL ANIMATION HOOK
// ============================================================

function useScrollReveal(deps = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, deps);
}

// ============================================================
// PATIENT LANDING PAGE
// ============================================================

function PatientLandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  useScrollReveal([]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      {/* Nav */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <span className="nav-wordmark">kindred</span>
        <div className="nav-links">
          <button className="nav-link nav-link-text" onClick={() => onNavigate('therapist-landing')}>
            For Therapists
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('patient')}>
            Join the Waitlist {Icons.arrow}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="section-eyebrow reveal" style={{marginBottom:'1rem'}}>For Patients</p>
          <h1 className="hero-heading reveal">
            The right therapist
            <span className="hero-heading-light"> changes everything.</span>
          </h1>
          <p className="hero-body reveal delay-1">
            Finding them shouldn't require scrolling through hundreds of identical listings and hoping for the best.
            Kindred uses AI to match you based on what actually matters — personality, approach, and genuine human fit.
          </p>
          <div className="hero-ctas reveal delay-2">
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('patient')}>
              Join the Waitlist {Icons.arrow}
            </button>
          </div>
          <p className="hero-meta reveal delay-3">
            Free for patients, always.{' '}
            <button onClick={() => onNavigate('therapist-landing')}>Are you a therapist?</button>
          </p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <HeroIllustration />
        </div>
      </section>

      {/* Trust strip */}
      <div className="trust-strip">
        <div className="trust-item">
          {Icons.checkSmall}
          <span><strong>Free</strong> for patients</span>
        </div>
        <div className="trust-item">
          {Icons.checkSmall}
          <span>Matched in <strong>minutes</strong>, not days</span>
        </div>
        <div className="trust-item">
          {Icons.checkSmall}
          <span><strong>2–3 curated</strong> matches, not 300 listings</span>
        </div>
        <div className="trust-item">
          {Icons.checkSmall}
          <span>Plain-language <strong>fit explanations</strong></span>
        </div>
      </div>

      {/* Problem Section */}
      <section className="section">
        <div className="reveal">
          <p className="section-eyebrow">The Problem</p>
          <h2 className="section-heading">Finding help is broken.<br/>You deserve better.</h2>
          <p className="section-subtext">
            The way therapy discovery works today was built to generate website traffic — not to help you find someone who will actually understand you.
          </p>
        </div>
        <div className="problem-grid">
          <div className="problem-card reveal delay-1">
            <div className="problem-icon" style={{color:'var(--sage)'}}>
              {Icons.scroll}
            </div>
            <div className="problem-stat">340+</div>
            <div className="problem-label">identical profiles, no real signal</div>
            <p className="problem-body">
              Directories show you credentials, insurance panels, and a stock headshot. They tell you nothing about whether this human being will actually click with you. So you scroll, guess, and hope.
            </p>
          </div>

          <div className="problem-card reveal delay-2">
            <div className="problem-icon problem-icon--clay">
              {Icons.brokenHeart}
            </div>
            <div className="problem-stat" style={{color:'var(--clay-dark)'}}>1 in 3</div>
            <div className="problem-label">patients drop out because the fit was wrong</div>
            <p className="problem-body">
              A bad match doesn't just waste your time — it compounds the weight you're already carrying.
              When therapy fails because of poor fit, the next attempt feels harder. That barrier shouldn't exist.
            </p>
          </div>

          <div className="problem-card reveal delay-3">
            <div className="problem-icon" style={{color:'var(--sage)'}}>
              {Icons.doorOpen}
            </div>
            <div className="problem-stat">57%</div>
            <div className="problem-label">of adults with mental illness never get help</div>
            <p className="problem-body">
              When matching fails, people don't just switch therapists — they stop trying altogether.
              A wrong first experience closes the door on care that could change everything.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works — Patient */}
      <section className="flow-section">
        <div className="flow-inner">
          <div className="reveal">
            <p className="section-eyebrow">How Kindred Works</p>
            <h2 className="section-heading">From conversation to the right match.</h2>
            <p className="section-subtext">
              No overwhelming search forms. No guessing. Just a conversation that leads to therapists who are genuinely right for you — with a clear explanation of why.
            </p>
          </div>
          <div className="reveal delay-1">
            <PatientFlowDiagram />
          </div>
        </div>
      </section>

      {/* What We Match On */}
      <section className="section">
        <div className="reveal" style={{textAlign:'center'}}>
          <p className="section-eyebrow">What We Analyze</p>
          <h2 className="section-heading" style={{maxWidth:560,margin:'0 auto 0.75rem'}}>
            Matching across dozens of dimensions.
          </h2>
          <p className="section-subtext" style={{margin:'0 auto 3rem'}}>
            Most platforms match on insurance and zip code. We match on what actually predicts whether therapy works.
          </p>
        </div>
        <div className="reveal delay-1 dim-grid" style={{
          display:'grid',
          gridTemplateColumns:'repeat(3, 1fr)',
          gap:'1px',
          background:'var(--divider)',
          borderRadius:20,
          overflow:'hidden',
          border:'1px solid var(--divider)',
        }}>
          {[
            { label: 'Therapeutic approach', desc: 'CBT, somatic, psychodynamic, and more' },
            { label: 'Communication style', desc: 'Coach-style guidance vs. reflective listening' },
            { label: 'Primary focus areas', desc: 'Anxiety, trauma, relationships, life transitions' },
            { label: 'Cultural & language fit', desc: 'Background, identity, lived experience' },
            { label: 'Depth of therapy', desc: 'Symptom-focused vs. insight-oriented' },
            { label: 'Session setting', desc: 'In-person, telehealth, or hybrid' },
          ].map((dim, i) => (
            <div key={i} style={{
              background:'var(--white)',
              padding:'1.75rem 2rem',
              display:'flex',
              flexDirection:'column',
              gap:'0.4rem',
            }}>
              <div style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                width:28, height:28, borderRadius:8,
                background:'var(--sage-lighter)', color:'var(--sage-dark)',
                marginBottom:'0.375rem', flexShrink:0,
              }}>
                {Icons.checkSmall}
              </div>
              <div style={{fontSize:'0.9375rem', fontWeight:600, color:'var(--text)', lineHeight:1.3}}>{dim.label}</div>
              <div style={{fontSize:'0.8125rem', color:'var(--text-secondary)', fontWeight:300, lineHeight:1.55}}>{dim.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="quote-section">
        <div className="reveal" style={{maxWidth:680,margin:'0 auto'}}>
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" style={{marginBottom:'1.5rem',opacity:0.25}}>
            <path d="M0 24V14.4C0 6.24 4.8 1.44 14.4 0L16 3.84C11.04 5.28 8.64 8.16 8.64 12H14.4V24H0ZM17.6 24V14.4C17.6 6.24 22.4 1.44 32 0L33.6 3.84C28.64 5.28 26.24 8.16 26.24 12H32V24H17.6Z" fill="#7B8E6D"/>
          </svg>
          <p style={{fontFamily:'var(--font-display)',fontStyle:'italic',fontSize:'clamp(1.25rem,2.5vw,1.625rem)',lineHeight:1.5,color:'var(--text)',marginBottom:'1.25rem'}}>
            There's a gap in the market for personality fit — you can find therapist credentials, but not personality fit.
          </p>
          <p style={{fontSize:'0.875rem',color:'var(--text-secondary)',fontWeight:400}}>
            Nick Norman, Clinical Program Manager, Mindful Therapy Group
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section stats-section">
        <div className="reveal" style={{textAlign:'center'}}>
          <p className="section-eyebrow">The Scale of the Problem</p>
          <h2 className="section-heading" style={{maxWidth:580,margin:'0 auto 0.5rem'}}>A broken system for millions of people.</h2>
        </div>
        <div className="stats-grid">
          {[
            { num: '$110B', label: 'U.S. mental health market' },
            { num: '530K', label: 'licensed therapists nationwide' },
            { num: '23%', label: 'of U.S. adults had a mental health disorder last year' },
            { num: '0', label: 'platforms optimizing for actual therapist-patient fit' },
          ].map((s, i) => (
            <div key={i} className={`stat-item reveal delay-${i + 1}`}>
              <div className="stat-number">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="reveal">
          <p className="section-eyebrow">Join the Waitlist</p>
          <h2 className="section-heading">Your match is out there.</h2>
          <p className="section-subtext">
            Kindred is launching in Seattle. Join the waitlist and be among the first to find your therapist the right way.
          </p>
        </div>
        <div className="cta-buttons reveal delay-1">
          <button className="btn btn-primary btn-lg" onClick={() => onNavigate('patient')}>
            Join the Waitlist {Icons.arrow}
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('therapist-landing')}>
            {Icons.therapist} I'm a therapist
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-wordmark">kindred</div>
        <p className="footer-text">Seattle, WA &nbsp;·&nbsp; © 2026 Kindred Health, Inc.</p>
      </footer>
    </>
  );
}

// ============================================================
// THERAPIST LANDING PAGE
// ============================================================

function TherapistLandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  useScrollReveal([]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      {/* Nav */}
      <nav className={`nav therapist-nav ${scrolled ? 'scrolled' : ''}`}>
        <button className="nav-wordmark" onClick={() => onNavigate('home')}
          style={{background:'none',border:'none',cursor:'pointer'}}>
          kindred
        </button>
        <div className="nav-links">
          <button className="nav-link nav-link-text" onClick={() => onNavigate('home')}>
            For Patients
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('therapist')}>
            Join the Waitlist {Icons.arrow}
          </button>
        </div>
      </nav>

      {/* Hero — dark */}
      <div className="therapist-hero-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="section-eyebrow reveal" style={{marginBottom:'1rem',color:'rgba(232,237,228,0.7)'}}>
              For Therapists
            </p>
            <h1 className="hero-heading reveal">
              Fill your practice
              <span className="hero-heading-light"> with clients who stay.</span>
            </h1>
            <p className="hero-body reveal delay-1">
              Stop spending unpaid hours screening people who aren't a good fit.
              Kindred puts your practice in front of patients who are already aligned with how you work —
              before they ever send you a message.
            </p>
            <div className="hero-ctas reveal delay-2">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('therapist')}>
                Join the Waitlist {Icons.arrow}
              </button>
              <button className="btn btn-outline-white btn-lg" onClick={() => onNavigate('home')}>
                {Icons.person} For Patients
              </button>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <TherapistHeroIllustration />
          </div>
        </section>
      </div>

      {/* Trust strip */}
      <div className="trust-strip">
        <div className="trust-item">
          {Icons.checkSmall}
          <span><strong>12</strong> therapist interviews validated the problem</span>
        </div>
        <div className="trust-item">
          {Icons.checkSmall}
          <span><strong>8 in 10</strong> therapists already run unpaid screens</span>
        </div>
        <div className="trust-item">
          {Icons.checkSmall}
          <span>Founding cohort <strong>$29/mo</strong> locked for 12 months</span>
        </div>
        <div className="trust-item">
          {Icons.checkSmall}
          <span><strong>Seattle-first</strong> launch, expanding to West Coast</span>
        </div>
      </div>

      {/* Problem Section */}
      <section className="section">
        <div className="reveal">
          <p className="section-eyebrow">The Problem</p>
          <h2 className="section-heading">The platforms you're paying for<br/>aren't working for you.</h2>
          <p className="section-subtext">
            Directory platforms were built to generate traffic, not matches. They charge you a flat fee and hand you the same broken pipeline — regardless of whether the clients they send are right for you.
          </p>
        </div>
        <div className="problem-grid">
          <div className="problem-card problem-card--clay reveal delay-1">
            <div className="problem-icon problem-icon--clay">
              {Icons.calEmpty}
            </div>
            <div className="problem-stat">50%+</div>
            <div className="problem-label">of therapy slots sit empty in most private practices</div>
            <p className="problem-body">
              Even skilled, experienced therapists struggle to keep their calendars full. The platforms sending you clients optimize for click-throughs — not for whether those clients are right for your practice.
            </p>
          </div>

          <div className="problem-card problem-card--clay reveal delay-2">
            <div className="problem-icon problem-icon--clay">
              {Icons.clock}
            </div>
            <div className="problem-stat">8 in 10</div>
            <div className="problem-label">therapists run unpaid 15-min screens — every week</div>
            <p className="problem-body">
              You invented this workaround yourself because no platform does the filtering for you. Those free consultations add up to hours of unbillable time every month — time the platform should have saved you.
            </p>
          </div>

          <div className="problem-card problem-card--clay reveal delay-3">
            <div className="problem-icon problem-icon--clay">
              {Icons.trendDown}
            </div>
            <div className="problem-stat">2–3</div>
            <div className="problem-label">sessions — then wrong-fit clients disappear</div>
            <p className="problem-body">
              Mismatched clients don't just leave — they erode the continuity and stability your practice depends on. Every early dropout resets your pipeline and leaves a patient worse off than when they started.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works — Therapist */}
      <section className="flow-section">
        <div className="flow-inner">
          <div className="reveal">
            <p className="section-eyebrow">How Kindred Works for You</p>
            <h2 className="section-heading">Set up once. Get better clients continuously.</h2>
            <p className="section-subtext">
              No sales copy to write. No guessing what patients want to hear. Just a profile that shows who you really are — and an engine that finds the people who need exactly that.
            </p>
          </div>
          <div className="reveal delay-1">
            <TherapistFlowDiagram />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="section">
        <div className="reveal" style={{textAlign:'center'}}>
          <p className="section-eyebrow">What You Get</p>
          <h2 className="section-heading" style={{maxWidth:540,margin:'0 auto 0.75rem'}}>
            Built around the way great therapy actually works.
          </h2>
          <p className="section-subtext" style={{margin:'0 auto 3rem'}}>
            Every feature exists because a therapist told us what was missing.
          </p>
        </div>
        <div className="reveal delay-1 dim-grid" style={{
          display:'grid',
          gridTemplateColumns:'repeat(2, 1fr)',
          gap:'1px',
          background:'var(--divider)',
          borderRadius:20,
          overflow:'hidden',
          border:'1px solid var(--divider)',
        }}>
          {[
            {
              icon: Icons.chat,
              title: 'Guided profile prompts',
              desc: '"What does your first session feel like?" — Not checkboxes. Real answers that attract the right clients.',
            },
            {
              icon: Icons.video,
              title: '60-second video intro',
              desc: 'Patients see the real you before booking. Personality, warmth, and approach — all in under a minute.',
            },
            {
              icon: Icons.neural,
              title: 'AI-powered matching',
              desc: 'Patients matched to your profile across therapeutic style, cultural fit, focus areas, and more.',
            },
            {
              icon: Icons.cycle,
              title: 'Match quality improves',
              desc: 'Every outcome signal helps the engine learn your ideal client — and send you more of them.',
            },
          ].map((vp, i) => (
            <div key={i} style={{
              background:'var(--white)',
              padding:'1.75rem 2rem',
              display:'flex',
              flexDirection:'column',
              gap:'0.4rem',
            }}>
              <div style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                width:28, height:28, borderRadius:8,
                background:'var(--sage-lighter)', color:'var(--sage-dark)',
                marginBottom:'0.375rem', flexShrink:0,
              }}>
                {vp.icon}
              </div>
              <div style={{fontSize:'0.9375rem', fontWeight:600, color:'var(--text)', lineHeight:1.3}}>{vp.title}</div>
              <div style={{fontSize:'0.8125rem', color:'var(--text-secondary)', fontWeight:300, lineHeight:1.55}}>{vp.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="quote-section">
        <div className="reveal" style={{maxWidth:680,margin:'0 auto'}}>
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" style={{marginBottom:'1.5rem',opacity:0.25}}>
            <path d="M0 24V14.4C0 6.24 4.8 1.44 14.4 0L16 3.84C11.04 5.28 8.64 8.16 8.64 12H14.4V24H0ZM17.6 24V14.4C17.6 6.24 22.4 1.44 32 0L33.6 3.84C28.64 5.28 26.24 8.16 26.24 12H32V24H17.6Z" fill="#7B8E6D"/>
          </svg>
          <p style={{fontFamily:'var(--font-display)',fontStyle:'italic',fontSize:'clamp(1.25rem,2.5vw,1.625rem)',lineHeight:1.5,color:'var(--text)',marginBottom:'1.25rem'}}>
            There's a gap in the market for personality fit — you can find therapist credentials, but not personality fit.
          </p>
          <p style={{fontSize:'0.875rem',color:'var(--text-secondary)',fontWeight:400}}>
            Nick Norman, Clinical Program Manager, Mindful Therapy Group
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="reveal">
          <p className="section-eyebrow">Join the Founding Cohort</p>
          <h2 className="section-heading">Be among the first therapists on Kindred.</h2>
          <p className="section-subtext">
            We're onboarding our founding cohort of Seattle therapists this summer. Founding members get the locked rate, priority matching, and direct influence on the product.
          </p>
        </div>
        <div className="cta-buttons reveal delay-1">
          <button className="btn btn-sage btn-lg" onClick={() => onNavigate('therapist')}>
            Join the Waitlist {Icons.arrow}
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('home')}>
            {Icons.person} For Patients
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-wordmark">kindred</div>
        <p className="footer-text">Seattle, WA &nbsp;·&nbsp; © 2026 Kindred Health</p>
      </footer>
    </>
  );
}

// ============================================================
// THERAPIST INTEREST FORM STEPS
// ============================================================

const THERAPIST_STEPS = [
  {
    id: 'intro', type: 'intro',
    heading: 'Thank you for your interest in Kindred.',
    body: "We're building something different — a platform where the right clients find you. These questions help us understand your practice and what matters to you.",
  },
  {
    id: 'email', type: 'text', number: '01',
    question: "What's your email?",
    hint: "We'll never share your information with anyone.",
    field: { key: 'email', placeholder: 'you@practice.com', inputType: 'email' },
  },
  {
    id: 'practice', type: 'single-select', number: '02',
    question: 'Tell us about your practice.',
    hint: 'Select the option that best describes your current setup.',
    field: { key: 'practiceType', options: ['Solo private practice', 'Small group practice (2–5 clinicians)', 'Large group practice (6+)', 'Community mental health center'] },
  },
  {
    id: 'experience', type: 'single-select', number: '03',
    question: 'How long have you been practicing?',
    hint: 'Post-licensure clinical experience.',
    field: { key: 'experience', options: ['Under 2 years', '2–5 years', '5–10 years', '10+ years'] },
  },
  {
    id: 'specializations', type: 'multi-select', number: '04',
    question: 'What are your primary areas of focus?',
    hint: 'Select all that apply.',
    field: { key: 'specializations', options: ['Anxiety', 'Depression', 'Trauma & PTSD', 'Relationships', 'Family Dynamics', 'Career & Burnout', 'Identity & Self-Worth', 'Grief & Loss', 'Life Transitions', 'ADHD & Neurodiversity', 'Eating Disorders', 'Substance Use', 'OCD'] },
  },
  {
    id: 'consults', type: 'single-select', number: '05',
    question: "How many hours per week do you spend on consultations that don't convert?",
    hint: 'Free phone screens, no-fit discovery calls, and similar unpaid time.',
    field: { key: 'consultHours', options: ['0–2 hours', '2–5 hours', '5–10 hours', '10+ hours'] },
  },
  {
    id: 'willingness', type: 'single-select', number: '06',
    question: 'If Kindred consistently sent you right-fit clients, would you pay $49/month?',
    hint: "There are no wrong answers. We're testing pricing assumptions.",
    field: { key: 'willingness', options: ['Absolutely', 'Probably — if I saw results first', 'Unlikely', "I'd need to learn more"] },
  },
  {
    id: 'frustration', type: 'textarea', number: '07', optional: true,
    question: "What's your biggest frustration with how clients find you today?",
    hint: "Optional — but this helps us build the right thing. Be as honest as you like.",
    field: { key: 'frustration', placeholder: "Tell us what's broken..." },
  },
  {
    id: 'thankyou', type: 'thankyou',
    heading: "You're in.",
    body: "We're onboarding our founding therapist cohort in Seattle this summer. You'll be among the first to hear from us.",
  },
];

// ============================================================
// PATIENT INTEREST FORM STEPS
// ============================================================

const PATIENT_STEPS = [
  {
    id: 'intro', type: 'intro',
    heading: 'Finding the right therapist matters.',
    body: "We're building Kindred to make that search simpler, more human, and more effective. A few quick questions help us understand what you need.",
  },
  {
    id: 'email', type: 'text', number: '01',
    question: "What's your email?",
    hint: "We'll never share your information with anyone.",
    field: { key: 'email', placeholder: 'you@email.com', inputType: 'email' },
  },
  {
    id: 'history', type: 'single-select', number: '02',
    question: 'Have you tried therapy before?',
    hint: "This helps us understand where you're starting from.",
    field: { key: 'therapyHistory', options: ["Yes, I'm currently seeing a therapist", 'Yes, but not currently', "No, but I've been thinking about it", "No — I'm just exploring"] },
  },
  {
    id: 'hardest', type: 'multi-select', number: '03',
    question: "What's been the hardest part about finding a therapist?",
    hint: 'Select all that apply.',
    field: { key: 'barriers', options: ['All profiles look the same', "I don't know what type of therapy I need", "Hard to find someone who understands my background", "It's too expensive", "I tried before and it wasn't the right fit", "I don't even know where to start"] },
  },
  {
    id: 'matters', type: 'multi-select', number: '04',
    question: 'What matters most to you in a therapist?',
    hint: 'Pick your top two.',
    field: { key: 'priorities', options: ["Personality that clicks with mine", "Specializes in what I'm going through", "Understands my cultural background", "Affordable or takes my insurance", "Available for video sessions", "Recommended by someone I trust"], maxSelect: 2 },
  },
  {
    id: 'urgency', type: 'single-select', number: '05',
    question: 'What best describes where you are right now?',
    hint: "No judgment — we're here to help whenever you're ready.",
    field: { key: 'urgency', options: ['I need support soon', "I've been thinking about this for a while", "I'm just exploring my options"] },
  },
  {
    id: 'thankyou', type: 'thankyou',
    heading: 'We hear you.',
    body: "Kindred is launching in Seattle this year. When we open, you'll be among the first to find your match.",
  },
];

// ============================================================
// FORM COMPONENT
// ============================================================

const SKIP_HISTORY_IDS = ["No, but I've been thinking about it", "No — I'm just exploring"];
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());

function FormFlow({ steps, onBack, formType }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const step = steps[currentStep];
  const totalSteps = steps.length;
  const contentSteps = steps.filter(s => s.type !== 'intro' && s.type !== 'thankyou').length;
  const currentContentStep = steps.slice(0, currentStep + 1).filter(s => s.type !== 'intro' && s.type !== 'thankyou').length;
  const progress = step.type === 'thankyou' ? 100 : step.type === 'intro' ? 0 : (currentContentStep / contentSteps) * 100;

  const shouldSkipNext = (fromIdx, historyOverride) => {
    const from = steps[fromIdx];
    const next = steps[fromIdx + 1];
    const historyVal = historyOverride !== undefined ? historyOverride : formData['therapyHistory'];
    return from?.id === 'history' && next?.id === 'hardest' && SKIP_HISTORY_IDS.includes(historyVal);
  };

  const submitResponse = async (data) => {
    const table = formType === 'therapist' ? 'therapist_responses' : 'patient_responses';
    const payload = formType === 'therapist'
      ? { email: data.email, practice: data.practiceType, experience: data.experience, specializations: data.specializations, consults: data.consultHours, willingness: data.willingness, frustration: data.frustration || null }
      : { email: data.email, therapy_history: data.therapyHistory, barriers: data.barriers, priorities: data.priorities, urgency: data.urgency };
    await supabase.from(table).insert(payload);
  };

  const goNext = (dataOverride) => {
    if (currentStep < totalSteps - 1) {
      const historyOverride = dataOverride?.['therapyHistory'];
      const skip = shouldSkipNext(currentStep, historyOverride);
      const nextIdx = currentStep + (skip ? 2 : 1);
      if (steps[nextIdx]?.type === 'thankyou') {
        const finalData = dataOverride ? { ...formData, ...dataOverride } : formData;
        submitResponse(finalData);
      }
      setCurrentStep(nextIdx);
      window.scrollTo(0, 0);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      const prevPrev = steps[prevIdx];
      const skipBack = prevPrev?.id === 'hardest' && SKIP_HISTORY_IDS.includes(formData['therapyHistory']);
      setCurrentStep(skipBack ? currentStep - 2 : currentStep - 1);
    }
  };

  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const toggleMultiSelect = (key, value, maxSelect) => {
    setFormData(prev => {
      const current = prev[key] || [];
      if (current.includes(value)) return { ...prev, [key]: current.filter(v => v !== value) };
      if (maxSelect && current.length >= maxSelect) return { ...prev, [key]: [...current.slice(1), value] };
      return { ...prev, [key]: [...current, value] };
    });
  };

  const emailVal = step.field?.inputType === 'email' ? (formData[step.field.key] || '') : '';
  const showEmailError = emailVal.length > 0 && !isValidEmail(emailVal);

  // Compute visible question number, skipping hidden steps
  const displayNumber = (() => {
    if (step.id === 'hardest') return '2B';
    let count = 0;
    for (let i = 0; i <= currentStep; i++) {
      const s = steps[i];
      if (s.type === 'intro' || s.type === 'thankyou') continue;
      if (s.id === 'hardest') continue; // always excluded from main count; shown as 2B
      count++;
    }
    return String(count).padStart(2, '0');
  })();

  const nextVisibleIdx = shouldSkipNext(currentStep) ? currentStep + 2 : currentStep + 1;
  const isLastQuestion = steps[nextVisibleIdx]?.type === 'thankyou';

  const canProceed = () => {
    if (step.type === 'intro' || step.type === 'thankyou') return true;
    if (step.optional) return true;
    if (step.type === 'text') {
      if (step.field.inputType === 'email') return isValidEmail(formData[step.field.key]);
      return (formData[step.field.key] || '').trim().length > 0;
    }
    if (step.type === 'text-pair') return step.fields.every(f => (formData[f.key] || '').trim().length > 0);
    if (step.type === 'textarea') return (formData[step.field.key] || '').trim().length > 0;
    if (step.type === 'single-select') return !!formData[step.field.key];
    if (step.type === 'multi-select') return (formData[step.field.key] || []).length > 0;
    return true;
  };

  return (
    <div className="form-page">
      <div className="form-progress" style={{ width: `${progress}%` }} />
      <nav className="nav scrolled">
        <button className="nav-wordmark" onClick={onBack} style={{background:'none',border:'none',cursor:'pointer'}}>
          kindred
        </button>
        {step.type !== 'thankyou' && (
          <button className="form-back-btn" onClick={currentStep === 0 ? onBack : goPrev}>
            {Icons.arrowLeft}
            {currentStep === 0 ? 'Back' : 'Previous'}
          </button>
        )}
      </nav>

      <div className="form-container">
        <div className="form-step" key={currentStep}>

          {step.type === 'intro' && (
            <div style={{textAlign:'center'}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'var(--sage-light)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 2rem',color:'var(--sage-dark)'}}>
                {formType === 'therapist' ? Icons.therapist : Icons.person}
              </div>
              <h1 className="form-question" style={{fontSize:'clamp(1.75rem,3.5vw,2.25rem)'}}>{step.heading}</h1>
              <p className="form-hint" style={{maxWidth:420,margin:'0.75rem auto 0',textAlign:'center'}}>{step.body}</p>
              <div className="form-actions" style={{justifyContent:'center',maxWidth:280,margin:'2.5rem auto 0'}}>
                <button className="btn btn-primary btn-lg" onClick={goNext} style={{width:'100%',justifyContent:'center'}}>
                  Let's begin {Icons.arrow}
                </button>
              </div>
            </div>
          )}

          {step.type === 'thankyou' && (
            <div className="thankyou">
              <div className="thankyou-icon" style={{color:'var(--sage-dark)'}}>
                {Icons.check}
              </div>
              <h2 className="thankyou-heading">{step.heading}</h2>
              <p className="thankyou-body">{step.body}</p>
              <p className="thankyou-sig">— The Kindred Team</p>
              <div style={{marginTop:'2.5rem'}}>
                <button className="btn btn-secondary" onClick={onBack}>Back to home</button>
              </div>
            </div>
          )}

          {step.type === 'text' && (
            <>
              <p className="form-step-number">Question {displayNumber}</p>
              <h2 className="form-question">{step.question}</h2>
              <p className="form-hint">{step.hint}</p>
              <input className="form-input" type={step.field.inputType || 'text'} placeholder={step.field.placeholder}
                value={formData[step.field.key] || ''} onChange={e => updateField(step.field.key, e.target.value)}
                onKeyDown={e => e.key === 'Enter' && canProceed() && goNext()} autoFocus
                style={showEmailError ? {borderColor:'var(--clay)'} : {}} />
              {showEmailError && (
                <p style={{fontSize:'0.8125rem',color:'var(--clay)',marginTop:'0.5rem',fontWeight:400}}>
                  Please enter a valid email address.
                </p>
              )}
              <div className="form-actions">
                <button className="btn btn-primary" onClick={goNext} disabled={!canProceed()}
                  style={{opacity:canProceed()?1:0.4,cursor:canProceed()?'pointer':'default'}}>
                  {isLastQuestion ? 'Submit' : 'Continue'} {Icons.arrow}
                </button>
              </div>
            </>
          )}

          {step.type === 'text-pair' && (
            <>
              <p className="form-step-number">Question {displayNumber}</p>
              <h2 className="form-question">{step.question}</h2>
              <p className="form-hint">{step.hint}</p>
              <div className="form-input-row">
                {step.fields.map((f, i) => (
                  <input key={f.key} className="form-input" type="text" placeholder={f.placeholder}
                    value={formData[f.key] || ''} onChange={e => updateField(f.key, e.target.value)} autoFocus={i === 0} />
                ))}
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" onClick={goNext} disabled={!canProceed()}
                  style={{opacity:canProceed()?1:0.4,cursor:canProceed()?'pointer':'default'}}>
                  {isLastQuestion ? 'Submit' : 'Continue'} {Icons.arrow}
                </button>
              </div>
            </>
          )}

          {step.type === 'textarea' && (
            <>
              <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.75rem'}}>
                <p className="form-step-number" style={{margin:0}}>Question {displayNumber}</p>
                {step.optional && (
                  <span style={{fontSize:'0.6875rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-secondary)',background:'var(--cream-dark)',borderRadius:100,padding:'0.2rem 0.625rem'}}>
                    Optional
                  </span>
                )}
              </div>
              <h2 className="form-question">{step.question}</h2>
              <p className="form-hint">{step.hint}</p>
              <textarea className="form-input form-textarea" placeholder={step.field.placeholder}
                value={formData[step.field.key] || ''} onChange={e => updateField(step.field.key, e.target.value)} autoFocus />
              <div className="form-actions">
                <button className="btn btn-primary" onClick={goNext} disabled={!canProceed()}
                  style={{opacity:canProceed()?1:0.4,cursor:canProceed()?'pointer':'default'}}>
                  {step.optional && !(formData[step.field.key] || '').trim() ? 'Skip' : isLastQuestion ? 'Submit' : 'Continue'} {Icons.arrow}
                </button>
              </div>
            </>
          )}

          {step.type === 'single-select' && (
            <>
              <p className="form-step-number">Question {displayNumber}</p>
              <h2 className="form-question">{step.question}</h2>
              <p className="form-hint">{step.hint}</p>
              <div className="form-options">
                {step.field.options.map(option => (
                  <button key={option} className={`form-option ${formData[step.field.key] === option ? 'selected' : ''}`}
                    onClick={() => { updateField(step.field.key, option); setTimeout(() => goNext({ [step.field.key]: option }), 300); }}>
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}

          {step.type === 'multi-select' && (
            <>
              <p className="form-step-number">Question {displayNumber}</p>
              <h2 className="form-question">{step.question}</h2>
              <p className="form-hint">{step.hint}</p>
              <div className="form-pills">
                {step.field.options.map(option => (
                  <button key={option} className={`form-pill ${(formData[step.field.key] || []).includes(option) ? 'selected' : ''}`}
                    onClick={() => toggleMultiSelect(step.field.key, option, step.field.maxSelect)}>
                    {option}
                  </button>
                ))}
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" onClick={goNext} disabled={!canProceed()}
                  style={{opacity:canProceed()?1:0.4,cursor:canProceed()?'pointer':'default'}}>
                  {isLastQuestion ? 'Submit' : 'Continue'} {Icons.arrow}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [page, setPage] = useState('home');

  const navigate = useCallback((target) => {
    setPage(target);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="kindred-root">
      <style>{STYLES}</style>
      {page === 'home' && <PatientLandingPage onNavigate={navigate} />}
      {page === 'therapist-landing' && <TherapistLandingPage onNavigate={navigate} />}
      {page === 'therapist' && <FormFlow steps={THERAPIST_STEPS} onBack={() => navigate('therapist-landing')} formType="therapist" />}
      {page === 'patient' && <FormFlow steps={PATIENT_STEPS} onBack={() => navigate('home')} formType="patient" />}
    </div>
  );
}
