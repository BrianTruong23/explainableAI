import React from 'react';
import './HowItWorks.css';

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="text-center">
          <div className="badge badge-cyan">
            <span>⚡</span> Simple Workflow
          </div>
          <h2 className="section-title">Three steps to understand any prediction</h2>
        </div>

        <div className="pipeline">
          {/* Step 1 */}
          <div className="pipeline-step">
            <div className="pipeline-connector">
              <div className="pipeline-dot purple"></div>
              <div className="pipeline-line"></div>
            </div>
            <div className="pipeline-content">
              <div className="pipeline-number">01</div>
              <h3>Choose your input</h3>
              <p className="text-muted">Type a sentence for sentiment analysis, or drop an image for classification.</p>
              <div className="pipeline-preview">
                <div className="mini-input">
                  <span className="mini-label">Input</span>
                  <div className="mini-textbox">This product quality is outstanding...</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="pipeline-step">
            <div className="pipeline-connector">
              <div className="pipeline-dot cyan"></div>
              <div className="pipeline-line"></div>
            </div>
            <div className="pipeline-content">
              <div className="pipeline-number">02</div>
              <h3>Run the diagnosis</h3>
              <p className="text-muted">Neon AI runs SHAP or Grad-CAM to extract feature attributions automatically.</p>
              <div className="pipeline-preview">
                <div className="mini-processing">
                  <div className="mini-bar-track">
                    <div className="mini-bar-fill"></div>
                  </div>
                  <span className="mini-status">Analyzing with SHAP...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="pipeline-step">
            <div className="pipeline-connector">
              <div className="pipeline-dot orange"></div>
            </div>
            <div className="pipeline-content">
              <div className="pipeline-number">03</div>
              <h3>Inspect the explanation</h3>
              <p className="text-muted">See which tokens or image regions drove the prediction. Toggle between classes, compare factors.</p>
              <div className="pipeline-preview">
                <div className="mini-tokens">
                  <span className="mini-tok strong">outstanding</span>
                  <span className="mini-tok medium">exceeded</span>
                  <span className="mini-tok light">quality</span>
                  <span className="mini-tok neutral">product</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
