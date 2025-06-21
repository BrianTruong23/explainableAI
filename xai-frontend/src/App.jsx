import { useState } from 'react';
import './App.css';
import TokenAttribution from './components/TokenAttribution';
import { fetchTextExplanation } from './api/explainApi';

function App() {
  const [text, setText] = useState('');
  const [model, setModel] = useState('bert-base-uncased');
  const [method, setMethod] = useState('SHAP');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ 0: { tokens: [], attributions: [] }, 1: { tokens: [], attributions: [] } });
  const [activeClass, setActiveClass] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setPrediction('Please enter text to get prediction.');
      return;
    }

    setLoading(true);
    
    try {
      const data = await fetchTextExplanation(text, model, method);
      console.log("Response from backend:", data);
      const formatted = data.probabilities
        .map((prob, i) => `Class ${i}: ${(prob * 100).toFixed(2)}%`)
        .join('\n');

      setPrediction(
        `Model: ${model}\nExplanation Method: ${method}\nPrediction: ${data.prediction}\n\nProbabilities:\n${formatted}`
      );
      setResult(data.class_attributions || {});
      setActiveClass(Number(data.prediction));
      console.log("Predicted and active class:", data.prediction, activeClass);


    } catch (err) {
      console.error(err);
      setPrediction('Failed to get prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  return (
    <div>
      <h1>Explainability App (xAI)</h1>

      <textarea
        placeholder="Enter text..."
        value={text}
        onChange={e => setText(e.target.value)}
        disabled = {model == "vit-tiny"}
        style={{
          opacity: model === "vit-tiny" ? 0.5 : 1,
          cursor: model === "vit-tiny" ? "not-allowed" : "pointer"
        }}
      />


      <label htmlFor="
      ">
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={model === "bert-base-uncased"}
            style={{
              opacity: model === "bert-base-uncased" ? 0.5 : 1,
              cursor: model === "bert-base-uncased" ? "not-allowed" : "pointer"
            }}
          />

      </label>
    
      {/* Model and method dropdowns */}
      <label>
        Model:
        <select onChange={(e) => setModel(e.target.value)} value={model}>
          <option value="bert-base-uncased">bert-base-uncased</option>
          <option value="vit-tiny">vit-tiny</option>
        </select>
      </label>

      <label>

      Explainable Method:

      <select 
        onChange={(e) => setMethod(e.target.value)} 
        value={method}
        disabled={model === 'bert-base-uncased' && method === 'GradCAM'}
        style={{
          opacity: model === 'bert-base-uncased' && method === 'GradCAM' ? 0.5 : 1,
          cursor: model === 'bert-base-uncased' && method === 'GradCAM' ? 'not-allowed' : 'pointer'
        }}
      >
        <option value="SHAP">SHAP</option>
        <option 
          value="GradCAM" 
          disabled={model === 'bert-base-uncased'}
          style={{
            color: model === 'bert-base-uncased' ? '#999' : 'inherit'
          }}
        >
          GradCAM
        </option>
      </select>

      </label>
     

      <button onClick={handleSubmit}>Run Explainability</button>

      {loading && <div className="loader"></div>}

      {prediction && (
            <div style={{ background: '#e2e2e2', padding: '1rem', marginTop: '1rem' }}>
              <h3>Prediction:</h3>
              <pre>{prediction}</pre>

              {prediction && (
            <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "16px",
            }}
          >
            <span>View Attribution for Class:</span>
          
            <div
              style={{
                position: "relative",
                display: "flex",
                borderRadius: "100px",
                backgroundColor: "#0036FF80",
                width: "140px",
                height: "32px",
                cursor: "pointer",
              }}
            >
              {/* Sliding background */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  backgroundColor: "#0036FF",
                  borderRadius: "100px",
                  transition: "transform 0.3s ease",
                  transform: activeClass === 0 ? "translateX(0)" : "translateX(100%)",
                }}
              />
          
              {/* Class 0 */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                  color: activeClass === 0 ? "#fff" : "#ffffffb3",
                  fontWeight: 500,
                  transition: "color 0.3s ease",
                }}
                onClick={() => setActiveClass(0)}
              >
                Class 0
              </div>
          
              {/* Class 1 */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                  color: activeClass === 1 ? "#fff" : "#ffffffb3",
                  fontWeight: 500,
                  transition: "color 0.3s ease",
                }}
                onClick={() => setActiveClass(1)}
              >
                Class 1
              </div>
            </div>
          </div>
       
        )}


          {result[activeClass]?.tokens?.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div>
                <h3>Token Attributions (Class {activeClass}):</h3>
                <p style={{ marginTop: '4px', marginBottom: '20px', fontSize: '14px', color: '#333' }}>
                  Hover over the tokens to get the attribution.
                </p>

              </div>
              <TokenAttribution
                tokens={result[activeClass].tokens}
                attributions={result[activeClass].attributions}
                classIndex={activeClass}
              />
            </div>
          )}

          {/* {[0, 1].map((cls) =>
            result[cls]?.tokens?.length > 0 ? (
              <div key={cls}>
                <h3>Token Attributions (Class {cls}):</h3>
                <TokenAttribution
                  tokens={result[cls].tokens}
                  attributions={result[cls].attributions}
                />
              </div>
            ) : null
          )} */}
        </div>
      )}
    </div>
  );
}

export default App;
