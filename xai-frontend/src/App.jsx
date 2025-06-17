import { useState } from 'react';
import './App.css';

// TokenAttribution component for visualizing token attributions
const TokenAttribution = ({ tokens, attributions }) => {
  const maxAttribution = Math.max(...attributions.map(val => Math.abs(val)), 1e-6);

  const getTokenStyle = (attribution) => {
    const norm = Math.abs(attribution) / maxAttribution;

    console.log(norm);

    // Determine color
    const backgroundColor = attribution < 0
      ? `rgba(255, 0, 0, ${norm})`  // red for negative
      : `rgba(0, 0, 255, ${norm})`; // blue for positive

    return {
      backgroundColor,
      color: '#000',
      padding: '2px 6px',
      borderRadius: '3px',
      fontSize: '14px',
      display: 'inline-block',
      margin: '2px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    };
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '4px',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      marginTop: '10px'
    }}>
      {tokens.map((token, index) => (
        <span
          key={index}
          style={getTokenStyle(attributions[index])}
          title={`Attribution: ${attributions[index].toFixed(4)}`}
        >
          {token}
        </span>
      ))}
    </div>
  );
};


function App() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [model, setModel] = useState('bert-base-uncased');
  const [method, setMethod] = useState('SHAP');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [attributions, setAttributions] = useState([]);

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
          // Update tokens and attributions for visualization
          setTokens(data.tokens || []);
          setAttributions(data.attributions || []);
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

  // Reset image and method when switching models
  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setModel(newModel);
    if (newModel === 'bert-base-uncased') {
      setImage(null);
      setMethod('SHAP'); // Force SHAP for BERT
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

      <div style={{ margin: '10px 0' }}>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          disabled={model === 'bert-base-uncased'}
          style={{
            opacity: model === 'bert-base-uncased' ? 0.5 : 1,
            cursor: model === 'bert-base-uncased' ? 'not-allowed' : 'pointer'
          }}
        />
        {model === 'bert-base-uncased' && (
          <span style={{ marginLeft: '10px', color: '#666', fontSize: '0.9em' }}>
            (Image upload disabled for BERT model)
          </span>
        )}
      </div>

      <select onChange={handleModelChange} value={model}>
        <option value="bert-base-uncased">bert-base-uncased</option>
        <option value="vit-tiny">vit-tiny</option>
      </select>

      <select 
        onChange={e => setMethod(e.target.value)} 
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

      <button onClick={handleSubmit}>Run Explainability</button>

      <div className={`loader-container ${!loading ? 'hidden' : ''}`}>
        <div className="loader"></div>
      </div>


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
          
          {/* Token Attribution Visualization */}
          {tokens.length > 0 && attributions.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Token Attributions:</h3>
              <TokenAttribution tokens={tokens} attributions={attributions} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
