import React, { useEffect, useState } from 'react';
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowRight, X, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SplineScene from '../components/SplineScene';
import LanguageSelector from '../components/LanguageSelector';
import {
  ProblemSection, SolutionSection, DemoSection, EvidenceSection, HowSection,
  SupportSection, RiskSection, PrinciplesSection, FaqSection
} from '../components/landing/LandingSections';
import '../landing.css';

const NAV_LINKS = [
  ['problem', 'Problem'],
  ['solution', 'Solution'],
  ['demo', 'Demo'],
  ['how', 'How it works'],
  ['faq', 'FAQ']
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/* ---------- Login / sign-up form (uses existing AuthContext → backend) ---------- */

function AuthForm({ initialMode = 'login' }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isSignup = mode === 'signup';

  useEffect(() => setMode(initialMode), [initialMode]);

  const switchMode = (next) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (isSignup) {
      if (!name.trim()) return setError('Please enter your full name.');
      if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email address.');
      if (password.length < 6) return setError('Password must be at least 6 characters.');
      if (password !== confirmPassword) return setError('Passwords do not match.');
    } else {
      if (!email.trim()) return setError('Please enter your email address.');
      if (!password) return setError('Please enter your password.');
    }
    setLoading(true);
    try {
      if (isSignup) await signup(name, email, password, confirmPassword);
      else await login(email, password);
      // Success: AuthContext sets the user and App switches to the upload page.
    } catch (err) {
      setError(err.message || (isSignup ? 'Sign up failed.' : 'Login failed.'));
      setLoading(false);
    }
  };

  return (
    <div className="nc-auth-card">
      <div className="nc-auth-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={!isSignup} className={!isSignup ? 'is-active' : ''} onClick={() => switchMode('login')}>Log in</button>
        <button type="button" role="tab" aria-selected={isSignup} className={isSignup ? 'is-active' : ''} onClick={() => switchMode('signup')}>Sign up</button>
      </div>
      <form onSubmit={handleSubmit} className="nc-auth-form" noValidate>
        {isSignup && (
          <label className="nc-field">
            <UserIcon size={16} aria-hidden="true" />
            <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
        )}
        <label className="nc-field">
          <Mail size={16} aria-hidden="true" />
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus />
        </label>
        <label className="nc-field">
          <Lock size={16} aria-hidden="true" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isSignup ? 'new-password' : 'current-password'} />
        </label>
        {isSignup && (
          <label className="nc-field">
            <Lock size={16} aria-hidden="true" />
            <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
          </label>
        )}
        {error && (
          <div className="nc-auth-error" role="alert">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}
        <button type="submit" className="nc-btn-primary nc-btn-block" disabled={loading}>
          {loading ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>
      <p className="nc-auth-switch">
        {isSignup ? 'Already have an account?' : 'New to NEXTCARE?'}{' '}
        <button type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}>
          {isSignup ? 'Log in' : 'Create one'}
        </button>
      </p>
    </div>
  );
}

function AuthPanel({ open, mode, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="nc-auth-backdrop" onClick={onClose}>
      <div className="nc-auth-panel" role="dialog" aria-modal="true" aria-label="Log in or sign up" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="nc-icon-btn nc-auth-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="nc-auth-intro">
          <span className="nc-eyebrow">Get started</span>
          <h3>Check your cover in a few minutes.</h3>
          <p>Log in to upload your policy, or try a ready-made demo policy.</p>
        </div>
        <AuthForm initialMode={mode} />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function LandingPage() {
  const [auth, setAuth] = useState({ open: false, mode: 'login' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demoRequest, setDemoRequest] = useState(null);

  const openAuth = (mode = 'login') => {
    setMenuOpen(false);
    setAuth({ open: true, mode });
  };

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  const showRiskExample = () => {
    setDemoRequest({ tab: 'risks', t: Date.now() });
    scrollToId('demo');
  };

  return (
    <div className="nc-landing">
      {/* Nav */}
      <header className={`nc-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nc-nav-inner">
          <button type="button" className="nc-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/sehatsure-logo.png" alt="" className="nc-brand-logo" />
            <span>NEXTCARE</span>
          </button>
          <nav className={`nc-nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Sections">
            {NAV_LINKS.map(([id, label]) => (
              <button type="button" key={id} onClick={() => go(id)}>{label}</button>
            ))}
            <button type="button" className="nc-nav-mobile-cta" onClick={() => openAuth('signup')}>Get started</button>
          </nav>
          <div className="nc-nav-actions">
            <LanguageSelector compact />
            <button type="button" className="nc-btn-text" onClick={() => openAuth('login')}>Log in</button>
            <button type="button" className="nc-btn-primary nc-btn-sm" onClick={() => openAuth('signup')}>Get started</button>
            <button
              type="button"
              className="nc-icon-btn nc-menu-btn"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="nc-hero">
        <div className="nc-hero-glow" aria-hidden="true" />
        <div className="nc-wrap nc-hero-grid">
          <div className="nc-hero-copy">
            <span className="nc-eyebrow">Healthcare. Insurance. Clarity.</span>
            <h1>
              Healthcare is complicated. <em>Understanding your coverage</em> shouldn&apos;t be.
            </h1>
            <p className="nc-lede">
              Understand your policy, find suitable hospitals, estimate what you may have to pay,
              and know your next step, all in one guided experience.
            </p>
            <div className="nc-hero-ctas">
              <button type="button" className="nc-btn-primary" onClick={() => openAuth('signup')}>
                Explore NEXTCARE <ArrowRight size={16} />
              </button>
              <button type="button" className="nc-btn-glass" onClick={() => go('how')}>See how it works</button>
            </div>
            <p className="nc-hero-note">From policy confusion to clearer healthcare decisions.</p>
          </div>
          <div className="nc-hero-visual">
            <SplineScene />
          </div>
        </div>
      </section>

      <ProblemSection />
      <SolutionSection />
      <DemoSection tabRequest={demoRequest} />
      <EvidenceSection />
      <HowSection />
      <SupportSection onExplore={() => openAuth('signup')} />
      <RiskSection onSeeExample={showRiskExample} />
      <PrinciplesSection />
      <FaqSection />

      {/* Final CTA */}
      <section className="nc-final">
        <div className="nc-final-shield" aria-hidden="true">
          <div className="nc-orb-ring nc-orb-ring-1" />
          <div className="nc-orb-ring nc-orb-ring-2" />
        </div>
        <div className="nc-wrap nc-final-inner">
          <h2>Make your next healthcare decision with more clarity.</h2>
          <p>Understand your coverage, explore your options, and know what to check before you proceed.</p>
          <div className="nc-hero-ctas nc-center-row">
            <button type="button" className="nc-btn-primary" onClick={() => openAuth('signup')}>
              Explore NEXTCARE <ArrowRight size={16} />
            </button>
            <button type="button" className="nc-btn-glass" onClick={() => go('how')}>See how it works</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="nc-footer">
        <div className="nc-wrap nc-footer-grid">
          <div>
            <div className="nc-brand nc-brand-static">
              <img src="/sehatsure-logo.png" alt="" className="nc-brand-logo" />
              <span>NEXTCARE</span>
            </div>
            <p className="nc-muted">Team Epigenome · Army Institute of Technology</p>
          </div>
          <div className="nc-footer-links">
            <button type="button" onClick={() => go('demo')}>Product demo</button>
            <button type="button" onClick={() => go('how')}>How it works</button>
            <button type="button" onClick={() => go('claims')}>Claim risk checker</button>
            <button type="button" onClick={() => go('support')}>Government schemes</button>
            <button type="button" onClick={() => go('faq')}>FAQ</button>
          </div>
        </div>
        <div className="nc-wrap">
          <p className="nc-disclaimer">
            NEXTCARE is a decision-support prototype. Cost estimates, hospital rankings, risk checks and scheme
            matches are not guarantees of insurance coverage, claim approval or government-scheme eligibility.
            Always confirm with your insurer and hospital.
          </p>
        </div>
      </footer>

      <AuthPanel open={auth.open} mode={auth.mode} onClose={() => setAuth((a) => ({ ...a, open: false }))} />
    </div>
  );
}
