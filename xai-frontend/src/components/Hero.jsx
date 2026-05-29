import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="badge badge-purple">
              <span>🔬</span> Explainable AI Toolkit
            </div>
            <h1 className="hero-title">
              Understand why your AI<br />
              <span className="gradient-text">made that decision.</span>
            </h1>
            <p className="hero-subtitle text-muted">
              Neon AI lets you inspect model predictions, visualize explanations,
              and understand what drives AI decisions — using real SHAP and Grad-CAM analysis.
            </p>
            <div className="hero-actions">
              <a href="#diagnostic-tool" className="btn btn-primary">
                Try the Diagnostic Tool
              </a>
              <a href="#how-it-works" className="btn btn-secondary">
                See How It Works
              </a>
            </div>
          </div>

          <div className="hero-mockup">
            <div className="mockup-frame">
              <div className="mockup-chrome">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
                <span className="mockup-title-bar">Neon AI — Diagnostic Workspace</span>
              </div>
              <div className="mockup-body">
                <div className="mockup-left">
                  <div className="mockup-field">
                    <span className="mockup-label">Input</span>
                    <div className="mockup-input">The product quality is outstanding and exceeded my expectations.</div>
                  </div>
                  <div className="mockup-field">
                    <span className="mockup-label">Model</span>
                    <div className="mockup-select">DistilBERT · SHAP</div>
                  </div>
                  <div className="mockup-run-btn">Run Diagnosis</div>
                </div>
                <div className="mockup-right">
                  <div className="mockup-result-badge positive">Positive — 94.7%</div>
                  <div className="mockup-tokens">
                    <span className="tok tok-strong">outstanding</span>
                    <span className="tok tok-medium">exceeded</span>
                    <span className="tok tok-light">quality</span>
                    <span className="tok tok-neutral">product</span>
                    <span className="tok tok-neutral">is</span>
                  </div>
                  <p className="mockup-caption text-muted">Token-level attributions via SHAP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
