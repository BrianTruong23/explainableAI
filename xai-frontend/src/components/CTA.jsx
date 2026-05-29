import React from 'react';
import './CTA.css';

function CTA() {
  return (
    <section className="final-cta" id="cta">
      <div className="container">
        <div className="cta-card text-center">
          <h2>See what your model is thinking.</h2>
          <p className="text-muted cta-desc">
            Run a diagnosis right now — enter text or upload an image, and get instant visual explanations.
          </p>
          <div className="cta-actions">
            <a href="#diagnostic-tool" className="btn btn-primary">
              Try the Diagnostic Tool
            </a>
            <a href="https://github.com/BrianTruong23" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
