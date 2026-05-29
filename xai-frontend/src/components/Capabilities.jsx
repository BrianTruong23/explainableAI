import React from 'react';
import './Capabilities.css';

function Capabilities() {
  return (
    <section className="capabilities" id="capabilities">
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">What you can do</h2>
          <p className="section-subtitle text-muted">
            Neon AI provides clear diagnostic tools to help you inspect and understand model behavior.
          </p>
        </div>

        <div className="bento-grid">
          {/* Large featured card */}
          <div className="bento-item bento-large">
            <div className="bento-inner">
              <div className="bento-icon-wrap" style={{background: 'rgba(124,58,237,0.08)'}}>🎯</div>
              <h3>Prediction inspection</h3>
              <p className="text-muted">
                See the model's prediction alongside class probabilities. Know exactly how confident the model is.
              </p>
              <div className="bento-demo">
                <div className="bento-prob-row">
                  <span className="bento-prob-label">Positive</span>
                  <div className="bento-prob-track"><div className="bento-prob-fill green" style={{width: '87%'}}></div></div>
                  <span className="bento-prob-val">87%</span>
                </div>
                <div className="bento-prob-row">
                  <span className="bento-prob-label">Negative</span>
                  <div className="bento-prob-track"><div className="bento-prob-fill orange" style={{width: '13%'}}></div></div>
                  <span className="bento-prob-val">13%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Smaller card */}
          <div className="bento-item bento-small">
            <div className="bento-inner">
              <div className="bento-icon-wrap" style={{background: 'rgba(6,182,212,0.08)'}}>🖼️</div>
              <h3>Visual explanations</h3>
              <p className="text-muted">
                View Grad-CAM heatmaps or SHAP token highlights to see what the model focused on.
              </p>
            </div>
          </div>

          {/* Smaller card */}
          <div className="bento-item bento-small">
            <div className="bento-inner">
              <div className="bento-icon-wrap" style={{background: 'rgba(249,115,22,0.08)'}}>⚖️</div>
              <h3>Class comparison</h3>
              <p className="text-muted">
                Toggle classes to see how each feature supports or opposes different predictions.
              </p>
            </div>
          </div>

          {/* Wide card */}
          <div className="bento-item bento-wide">
            <div className="bento-inner bento-horizontal">
              <div>
                <div className="bento-icon-wrap" style={{background: 'rgba(16,185,129,0.08)'}}>📊</div>
                <h3>Explanation summary</h3>
                <p className="text-muted">
                  Get a quick overview of the top contributing factors that mattered most to the model.
                </p>
              </div>
              <div className="bento-mini-summary">
                <div className="bento-factor"><span className="bento-rank">1</span><span>outstanding</span><span className="bento-score">+0.4231</span></div>
                <div className="bento-factor"><span className="bento-rank">2</span><span>exceeded</span><span className="bento-score">+0.2817</span></div>
                <div className="bento-factor"><span className="bento-rank">3</span><span>quality</span><span className="bento-score">+0.1204</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Capabilities;
