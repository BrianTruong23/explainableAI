import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import TokenAttribution from "./TokenAttribution";
import ImageSwitcher from "./ImageSwitcher";
import {
  fetchTextExplanation,
  fetchImageExplanation,
} from "../api/explainApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DiagnosticTool.css";

// ── Constants ──────────────────────────────────────────────────────
const BERT = "distilbert-base-uncased";
const VIT_TINY = "vit-tiny";
const SHAP = "SHAP";
const GRAD_CAM = "GradCAM";

const MODEL_DISPLAY = {
  [BERT]: "DistilBERT",
  [VIT_TINY]: "ViT (Tiny)",
};

const METHOD_DISPLAY = {
  [SHAP]: "SHAP",
  [GRAD_CAM]: "Grad-CAM",
};

// ── Component ──────────────────────────────────────────────────────
export default function DiagnosticTool() {
  // ── State ──
  const [mode, setMode] = useState("text"); // "text" | "image"
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageFileBase64, setImageFileBase64] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  // Text results
  const [textPrediction, setTextPrediction] = useState(null); // 0 | 1
  const [probabilities, setProbabilities] = useState(null);
  const [classAttributions, setClassAttributions] = useState(null);
  const [activeClass, setActiveClass] = useState(0);

  // Image results
  const [imagePrediction, setImagePrediction] = useState(null);
  const [imageConfidence, setImageConfidence] = useState(null);
  const [imageHeatmap, setImageHeatmap] = useState(null);

  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // ── Derived ──
  const model = mode === "text" ? BERT : VIT_TINY;
  const method = mode === "text" ? SHAP : GRAD_CAM;

  // ── Timer helpers ──
  const startTimer = useCallback(() => {
    setElapsedTime(0);
    timerRef.current = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => stopTimer, [stopTimer]);

  // ── Convert image to base64 for preview / ImageSwitcher ──
  useEffect(() => {
    if (!imageFile) {
      setImageFileBase64(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImageFileBase64(reader.result);
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  // ── Clear results on mode switch ──
  const switchMode = (m) => {
    if (m === mode) return;
    setMode(m);
    clearResults();
  };

  const clearResults = () => {
    setHasRun(false);
    setError(null);
    setTextPrediction(null);
    setProbabilities(null);
    setClassAttributions(null);
    setActiveClass(0);
    setImagePrediction(null);
    setImageConfidence(null);
    setImageHeatmap(null);
  };

  // ── Drop zone handlers ──
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      toast.error("Please drop a valid image file.");
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (mode === "text" && !text.trim()) {
      toast.error("Please enter some text to analyze.");
      return;
    }
    if (mode === "image" && !imageFile) {
      toast.error("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setHasRun(true);
    clearResults();
    setHasRun(true); // keep true through clearResults
    startTimer();

    try {
      if (mode === "text") {
        const data = await fetchTextExplanation(text, model, method);
        setTextPrediction(Number(data.prediction));
        setProbabilities(data.probabilities);
        setClassAttributions(data.class_attributions || {});
        setActiveClass(Number(data.prediction));
      } else {
        const data = await fetchImageExplanation(imageFile, model, method);
        setImagePrediction(data.prediction);
        setImageConfidence(data.confidence);
        setImageHeatmap(data.heatmap);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      toast.error(err.message || "Request failed.");
    } finally {
      setLoading(false);
      stopTimer();
    }
  };

  // ── Top-3 contributing tokens ──
  const topTokens = useMemo(() => {
    if (!classAttributions || !classAttributions[activeClass]) return [];
    const { tokens, attributions } = classAttributions[activeClass];
    if (!tokens || !attributions) return [];
    const paired = tokens.map((t, i) => ({ token: t, score: attributions[i] }));
    paired.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
    return paired.slice(0, 3);
  }, [classAttributions, activeClass]);

  // ── Determine prediction label ──
  const predictionLabel = useMemo(() => {
    if (textPrediction === null) return null;
    if (classAttributions && classAttributions[textPrediction]?.class_label) {
      return classAttributions[textPrediction].class_label;
    }
    return textPrediction === 1 ? "Positive" : "Negative";
  }, [textPrediction, classAttributions]);

  const isPositive = textPrediction === 1;
  const hasTextResults = textPrediction !== null && probabilities;
  const hasImageResults = imagePrediction !== null;

  // ── Render ──
  return (
    <div className="dt-workspace">
      {/* ── Title Bar ── */}
      <div className="dt-titlebar">
        <div className="dt-titlebar-dots">
          <span className="dt-titlebar-dot dt-titlebar-dot--red" />
          <span className="dt-titlebar-dot dt-titlebar-dot--yellow" />
          <span className="dt-titlebar-dot dt-titlebar-dot--green" />
        </div>
        <span className="dt-titlebar-label">Neon AI Diagnostic Workspace</span>
        <div style={{ width: 48 }} /> {/* balance spacer */}
      </div>

      {/* ── Body ── */}
      <div className="dt-body">
        {/* ── Left Panel ── */}
        <div className="dt-panel-left">
          {/* Mode Tabs */}
          <div className="dt-mode-tabs">
            <button
              className={`dt-mode-tab ${mode === "text" ? "dt-mode-tab--active" : ""}`}
              onClick={() => switchMode("text")}
            >
              📝 Text Analysis
            </button>
            <button
              className={`dt-mode-tab ${mode === "image" ? "dt-mode-tab--active" : ""}`}
              onClick={() => switchMode("image")}
            >
              🖼️ Image Analysis
            </button>
          </div>

          {/* Input Area */}
          {mode === "text" ? (
            <div>
              <span className="dt-label">Input Text</span>
              <textarea
                className="dt-textarea"
                placeholder="Enter text for sentiment analysis…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <span className="dt-label">Upload Image</span>
              {!imageFile ? (
                <div
                  className={`dt-dropzone ${dragOver ? "dt-dropzone--dragover" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="dt-dropzone-icon">📁</div>
                  <p className="dt-dropzone-text">
                    Drag &amp; drop an image here, or <strong>browse</strong>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="dt-dropzone-file-input"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="dt-file-preview">
                  <span>🖼️</span>
                  <span className="dt-file-preview-name">{imageFile.name}</span>
                  <button
                    className="dt-file-preview-remove"
                    onClick={() => setImageFile(null)}
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Model Selector */}
          <div>
            <span className="dt-label">Model</span>
            <div className="dt-select-wrapper">
              <select className="dt-select" value={model} disabled>
                <option value={BERT}>DistilBERT (distilbert-base-uncased)</option>
                <option value={VIT_TINY}>ViT Tiny (vit-tiny)</option>
              </select>
              <span className="dt-select-arrow">▼</span>
            </div>
          </div>

          {/* Method Display */}
          <div>
            <span className="dt-label">Explanation Method</span>
            <div className="dt-method-badge">
              <span className="dt-method-badge-dot" />
              {METHOD_DISPLAY[method]} — auto-selected
            </div>
          </div>

          {/* Run Button */}
          <button
            className="dt-run-btn"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <span className="dt-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Analyzing…
              </>
            ) : (
              <>▶ Run Diagnosis</>
            )}
          </button>
        </div>

        {/* ── Right Panel ── */}
        <div className="dt-panel-right">
          {/* Empty state */}
          {!hasRun && !loading && (
            <div className="dt-empty">
              <div className="dt-empty-icon">🔬</div>
              <p className="dt-empty-text">Run a diagnosis to see results</p>
              <p className="dt-empty-sub">
                Choose a mode, provide input, then hit <strong>Run Diagnosis</strong>.
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="dt-loading">
              <div className="dt-spinner" />
              <p className="dt-loading-text">Running {METHOD_DISPLAY[method]} analysis…</p>
              {elapsedTime > 0 && (
                <p className="dt-loading-elapsed">
                  Elapsed: {elapsedTime}s
                </p>
              )}
              {elapsedTime > 10 && (
                <div className="dt-coldstart-notice">
                  <span>💡</span>
                  <p>The model server may be waking up from sleep. First requests typically take 30–90 seconds on the free tier. Subsequent requests will be much faster.</p>
                </div>
              )}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="dt-error-card">
              <strong>Error</strong>
              {error}
            </div>
          )}

          {/* ── Text Results ── */}
          {!loading && !error && hasTextResults && (
            <>
              {/* Prediction Card */}
              <div className="dt-prediction-card">
                <div className="dt-prediction-header">
                  <span className="dt-prediction-title">Prediction</span>
                  <span
                    className={`dt-prediction-badge ${
                      isPositive
                        ? "dt-prediction-badge--positive"
                        : "dt-prediction-badge--negative"
                    }`}
                  >
                    {predictionLabel}
                  </span>
                </div>

                {/* Probability Bars */}
                <div className="dt-prob-bars">
                  {probabilities.map((prob, idx) => (
                    <div className="dt-prob-row" key={idx}>
                      <span className="dt-prob-label">
                        Class {idx}
                      </span>
                      <div className="dt-prob-track">
                        <div
                          className={`dt-prob-fill dt-prob-fill--${idx}`}
                          style={{ width: `${(prob * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <span className="dt-prob-value">
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <div className="dt-section-title">Token Attribution</div>

                {/* Class toggle */}
                <div className="dt-class-toggle-wrapper" style={{ marginBottom: 12 }}>
                  <span className="dt-class-toggle-label">Viewing class:</span>
                  <div className="dt-class-toggle">
                    <div
                      className="dt-class-toggle-slider"
                      style={{
                        transform:
                          activeClass === 0
                            ? "translateX(0)"
                            : "translateX(100%)",
                      }}
                    />
                    <div
                      className={`dt-class-toggle-option ${
                        activeClass === 0 ? "dt-class-toggle-option--active" : ""
                      }`}
                      onClick={() => setActiveClass(0)}
                    >
                      Class 0
                    </div>
                    <div
                      className={`dt-class-toggle-option ${
                        activeClass === 1 ? "dt-class-toggle-option--active" : ""
                      }`}
                      onClick={() => setActiveClass(1)}
                    >
                      Class 1
                    </div>
                  </div>
                </div>

                {classAttributions[activeClass]?.tokens?.length > 0 && (
                  <TokenAttribution
                    tokens={classAttributions[activeClass].tokens}
                    attributions={classAttributions[activeClass].attributions}
                    classIndex={activeClass}
                  />
                )}
              </div>

              {/* Explanation Summary */}
              <div className="dt-summary-card">
                <div className="dt-summary-card-title">Top Contributing Factors</div>
                {topTokens.length > 0 ? (
                  <ul className="dt-summary-list">
                    {topTokens.map((item, i) => (
                      <li className="dt-summary-item" key={i}>
                        <span className="dt-summary-rank">{i + 1}</span>
                        <span className="dt-summary-token">{item.token}</span>
                        <span className="dt-summary-score">
                          {item.score > 0 ? "+" : ""}
                          {item.score.toFixed(4)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="dt-summary-note">No token data available.</p>
                )}
              </div>
            </>
          )}

          {/* ── Image Results ── */}
          {!loading && !error && hasImageResults && (
            <>
              {/* Prediction Card */}
              <div className="dt-prediction-card">
                <div className="dt-prediction-header">
                  <span className="dt-prediction-title">Prediction</span>
                  <span className="dt-prediction-badge dt-prediction-badge--image">
                    {imagePrediction}
                  </span>
                </div>
                <div className="dt-confidence-row">
                  <span className="dt-confidence-label">Confidence:</span>
                  <span className="dt-confidence-value">
                    {typeof imageConfidence === "number"
                      ? `${(imageConfidence * 100).toFixed(1)}%`
                      : imageConfidence}
                  </span>
                </div>
              </div>

              {/* Grad-CAM Viewer */}
              <div>
                <div className="dt-section-title">Grad-CAM Visualization</div>
                <ImageSwitcher
                  imageGradCam={imageHeatmap}
                  originalImageSrc={imageFileBase64}
                />
              </div>

              {/* Summary */}
              <div className="dt-summary-card">
                <div className="dt-summary-card-title">Explanation</div>
                <p className="dt-summary-note">
                  Highlighted regions in the heatmap show model focus areas —
                  warmer colors indicate regions with stronger influence on the
                  prediction.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="dt-bottombar">
        <div className="dt-bottombar-item">
          Model: <strong>{MODEL_DISPLAY[model]}</strong>
        </div>
        <div className="dt-bottombar-item">
          Method: <strong>{METHOD_DISPLAY[method]}</strong>
        </div>
        {hasRun && !loading && (
          <div className="dt-bottombar-item">
            Time: <strong>{elapsedTime}s</strong>
          </div>
        )}
        <div className="dt-bottombar-spacer" />
        <button className="dt-export-btn" disabled title="Coming soon">
          Export Summary
        </button>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
