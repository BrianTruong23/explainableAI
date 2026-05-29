import React from 'react';
import './UseCases.css';

function UseCases() {
  return (
    <section className="use-cases" id="use-cases">
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">Who it's for</h2>
        </div>

        <div className="personas">
          <div className="persona">
            <div className="persona-avatar">🎓</div>
            <div className="persona-info">
              <h4>Students</h4>
              <p className="text-muted">Learn how models make predictions by experimenting with real SHAP and Grad-CAM outputs.</p>
            </div>
          </div>

          <div className="persona-divider"></div>

          <div className="persona">
            <div className="persona-avatar">🔬</div>
            <div className="persona-info">
              <h4>Researchers</h4>
              <p className="text-muted">Debug model behavior, compare feature attributions, and generate visuals for papers.</p>
            </div>
          </div>

          <div className="persona-divider"></div>

          <div className="persona">
            <div className="persona-avatar">🛠️</div>
            <div className="persona-info">
              <h4>Builders</h4>
              <p className="text-muted">Quickly diagnose why a model predicts a certain way. Spot biases and misfocused attention.</p>
            </div>
          </div>

          <div className="persona-divider"></div>

          <div className="persona">
            <div className="persona-avatar">📚</div>
            <div className="persona-info">
              <h4>Educators</h4>
              <p className="text-muted">Use the tool in classroom demos to teach explainability concepts with hands-on examples.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UseCases;
