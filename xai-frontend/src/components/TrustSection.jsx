import React from 'react';
import './TrustSection.css';

function TrustSection() {
  return (
    <section className="trust-section" id="trust">
      <div className="container">
        <div className="trust-inner">
          <div className="trust-content">
            <h2 className="section-title">Built for clearer AI understanding</h2>
            <p className="text-muted trust-desc">
              Neon AI is an open tool for inspecting model predictions. It does not make exaggerated claims about accuracy or speed.
              It simply lets you see what a model did and why — using established explainability methods.
            </p>

            <ul className="trust-list">
              <li>
                <span className="trust-check">✓</span>
                <span>Uses real SHAP and Grad-CAM analysis — no black-box wrappers</span>
              </li>
              <li>
                <span className="trust-check">✓</span>
                <span>Shows actual model outputs, not curated examples</span>
              </li>
              <li>
                <span className="trust-check">✓</span>
                <span>Open-source and transparent about limitations</span>
              </li>
              <li>
                <span className="trust-check">✓</span>
                <span>No tracking, no data storage — your inputs are processed and discarded</span>
              </li>
            </ul>
          </div>

          <div className="trust-visual">
            <div className="trust-card card">
              <div className="trust-card-header">
                <span className="badge badge-purple">Honest</span>
              </div>
              <p>We show you what the model actually does — even when the results are messy or unexpected.</p>
            </div>
            <div className="trust-card card">
              <div className="trust-card-header">
                <span className="badge badge-cyan">Transparent</span>
              </div>
              <p>Every explanation method has limits. We document ours clearly so you know what you are looking at.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
