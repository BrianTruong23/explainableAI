import { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [model, setModel] = useState('bert-base-uncased');
  const [method, setMethod] = useState('SHAP');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
  
    if (text.trim()) {
      // Submit text to /predict-text
      const localTest = "http://127.0.0.1:8000/predict-text"
      const remoteTest = "https://thang22-xai-model-api.hf.space/predict-text"
      fetch(remoteTest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Full response from backend:", data);  
          const formattedProbabilities = data.probabilities
            .map((prob, idx) => `Class ${idx}: ${(prob * 100).toFixed(2)}%`)
            .join('\n');
          setPrediction(
            `Model: ${model}\n` +
            `Explanation Method: ${method}\n` +
            `Prediction: ${data.prediction}\n\n` +
            `Probabilities:\n${formattedProbabilities}\n\n` +
            `Explanation: ${data.explanation}`
          );
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error during fetch:', err);
          setPrediction('Failed to get prediction.');
          setLoading(false);
        });
    } else {
      setPrediction('Please enter text to get prediction.');
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h1>Explainability App (xAI)</h1>

      <textarea
        placeholder="Enter text..."
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files[0])}
      />

      <select onChange={e => setModel(e.target.value)} value={model}>
        <option value="bert-base-uncased">bert-base-uncased</option>
        <option value="vit-tiny">vit-tiny</option>
      </select>

      <select onChange={e => setMethod(e.target.value)} value={method}>
        <option value="SHAP">SHAP</option>
        <option value="GradCAM">GradCAM</option>
      </select>

      <button onClick={handleSubmit}>Run Explainability</button>

      {loading && <p>Loading...</p>}

      {prediction && (
        <div style={{ background: '#e2e2e2', padding: '1rem', marginTop: '1rem' }}>
          <h3>Prediction:</h3>
          <pre
              style={{
                background: '#e2e2e2',
                padding: '1rem',
                marginTop: '1rem',
                whiteSpace: 'pre-wrap', // wraps long lines
              }}
            >
              {prediction}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
