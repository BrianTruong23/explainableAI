import React, { useState } from 'react';
import Hero from './components/Hero';
import DiagnosticTool from './components/DiagnosticTool';
import HowItWorks from './components/HowItWorks';
import Capabilities from './components/Capabilities';
import UseCases from './components/UseCases';
import TrustSection from './components/TrustSection';
import CTA from './components/CTA';
import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar-wrapper">
        <nav className="navbar container" role="navigation" aria-label="Main navigation">
          <a href="#hero" className="logo">
            <img src="/logo.svg" alt="Neon AI Logo" className="logo-img" />
            <span className="logo-text">Neon AI</span>
          </a>
          <div className="nav-links">
            <a href="#diagnostic-tool">Tools</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#use-cases">Use Cases</a>
          </div>
          <div className="nav-actions">
            <a href="#diagnostic-tool" className="btn btn-primary btn-sm">
              Try Tools
            </a>
          </div>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </nav>
      </header>

      <main>
        <Hero />

        {/* Diagnostic Tool — the centerpiece */}
        <section className="diagnostic-section" id="diagnostic-tool">
          <div className="container">
            <div className="text-center" style={{marginBottom: '48px'}}>
              <div className="badge badge-purple">
                <span>⚙️</span> Live Tool
              </div>
              <h2 className="section-title">Advanced Diagnostic Tool</h2>
              <p className="section-subtitle text-muted" style={{marginBottom: 0}}>
                Inspect model predictions with real SHAP and Grad-CAM analysis. Enter text or upload an image to get started.
              </p>
            </div>
            <DiagnosticTool />
          </div>
        </section>

        <HowItWorks />
        <Capabilities />
        <UseCases />
        <TrustSection />
        <CTA />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>&copy; {new Date().getFullYear()} Neon AI — Built by Thang Truong</p>
          <div className="footer-links">
            <a href="https://github.com/BrianTruong23" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/truongthoithang/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:truongthoithang@utexas.edu">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
