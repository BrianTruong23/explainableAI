import { useState } from 'react';
import './App.css';
import TokenAttribution from './components/TokenAttribution';
import { fetchImageExplanation, fetchTextExplanation } from './api/explainApi';
import { FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [text, setText] = useState('');
  const [model, setModel] = useState('bert-base-uncased');
  const [method, setMethod] = useState('SHAP');
  const [prediction, setPrediction] = useState(null);
  const [imageGradCam, setImageGradCam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ 0: { tokens: [], attributions: [] }, 1: { tokens: [], attributions: [] } });
  const [activeClass, setActiveClass] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [predictionType, setPredictionType] = useState("text"); // or "image"
  const [predictionTextDisplay, setPredictionTextDisplay] = useState('Positive')
  const [showInfo, setShowInfo] = useState(false);
  const SHAP = "SHAP";
  const VIT_TINY = "vit-tiny";
  const BERT = "bert-base-uncased";
  const GRAD_CAM = "GradCAM";
  const VALID_COMBINATIONS = new Set([
    `${BERT}|${SHAP}`,
    `${VIT_TINY}|${GRAD_CAM}`
  ]);


  const toggleInfo = () => {
    setShowInfo((prev) => !prev);

  };

  const handleChange = (e) => {
    const selectedValue = e.target.value;
  
    if (
      (model === BERT && selectedValue === GRAD_CAM) ||
      (model === VIT_TINY && selectedValue === SHAP)
    ) {
      toast.error(`${selectedValue} is not available for this model:${model}.`);
      return;
    }
  
    setMethod(selectedValue);
  };

  const sanityCheckForModelAndMethod = (model, method) => {
    return VALID_COMBINATIONS.has(`${model}|${method}`);
  };
  
  

  const handleSubmit = async () => {

    if (!sanityCheckForModelAndMethod(model, method)){
      toast.error(`${method} is not available for this model: ${model}.`);
      return;
    }


    if (model == BERT && !text.trim()) {
      setPrediction('Please enter text to get prediction.');
      return;
    }

    console.log("running outside 1");

    setLoading(true);

    try {

      if (model == BERT && method == SHAP){
          const data = await fetchTextExplanation(text, model, method);

          console.log("Response from backend:", data);
          const formatted = data.probabilities
            .map((prob, i) => `Class ${i}: ${(prob * 100).toFixed(2)}%`)
            .join('\n');

          if (model == "bert-base-uncased"){
              setPredictionTextDisplay(data.class_attributions[Number(data.prediction)]["class_label"])
          }

          setPrediction(
            `Model: ${model}\nExplanation Method: ${method}\nPrediction: ${data.prediction} (${predictionTextDisplay})\n\nProbabilities:\n${formatted}`
          );
          setResult(data.class_attributions || {});
          setActiveClass(Number(data.prediction));
          console.log("Predicted and active class:", data.prediction, activeClass);

      }else{
          const data = await fetchImageExplanation(imageFile, model, method);

          setPrediction(
            `Model: ${model}\nExplanation Method: ${method}\nPrediction: ${data.prediction}\nConfidence:${data.confidence}`
          );
          setImageGradCam(data.heatmap);
      }

      console.log("running outside");

      // If image is uploaded and model is vit-tiny, then it's image prediction
      if (model === VIT_TINY) {
        setPredictionType("image");
      } else {
        setPredictionType("text");
      }



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
    <div 
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      maxWidth: '700px',
      margin: '0 auto'
    }}
    >

  <div className="explanation-header">
  <h1 className="neon-title">Neon AI</h1>
  <FaInfoCircle
    class="info-icon"
    onClick={toggleInfo}
  />

</div>
  <p className="explanation-subtext">
    Shine a light into AI’s black box. Neon AI helps you understand how models make decisions through clear, interactive, and human-friendly explanations.
    Currently it serves two models and two explainable methods. 
  </p>

      {showInfo && (
        <div className="modal-overlay" onClick={toggleInfo}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={toggleInfo}>×</button>
            <h3>📘 About This Project</h3>
            <p>
              This project aims to demystify the decisions made by AI models. Currently, it serves two models.
            </p>
            <p>
              One is a text model <strong>bert/bert-uncased</strong>, which predicts sentiment analysis.
              An explainable method (<strong>SHAP</strong>) provides more insight into predictions.
            </p>
            <p>
              The second model is <strong>google/vit-base-patch16-224</strong>, which predicts the class label of an image.
              <strong>Grad-CAM</strong> is used to visualize which parts of the image influenced the prediction.
            </p>
          </div>
        </div>
      )}




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


      <label>
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
        onChange={handleChange}
        value={method}
        style={{
          opacity: model === "bert-base-uncased" && method === "GradCAM" ? 0.5 : 1,
          cursor: model === "bert-base-uncased" && method === "GradCAM" ? "not-allowed" : "pointer",
        }}
      >
        <option
          value="SHAP"
          style={{
            color: model === "vit-tiny" ? "#999" : "inherit",
          }}
        >
          SHAP
        </option>
        <option
          value="GradCAM"
          style={{
            color: model === "bert-base-uncased" ? "#999" : "inherit",
          }}
        >
          GradCAM
        </option>
      </select>


      </label>
     

      <button onClick={handleSubmit}>Run Explainability</button>

      {loading && <div className="loader"></div>}

      <ToastContainer />

      {prediction && (
  <div style={{ background: '#e2e2e2', padding: '1rem', marginTop: '1rem' }}>
    <h3>Prediction:</h3>
    
    {/* Text prediction */}
    {predictionType === "text" && <pre>{prediction}</pre>}

    {/* Image prediction */}
    {predictionType === "image" && (
      <div>
        <pre>{prediction}</pre>
        <img src={imageGradCam} alt="Grad-CAM Heatmap" style={{ maxWidth: '100%' }} />
      </div>
    )}

    {predictionType === "text" && (
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

    {/* Only show token attribution for text prediction */}
    {predictionType === "text" && result[activeClass]?.tokens?.length > 0 && (
      <div style={{ marginTop: '20px' }}>
        <h3>Token Attributions (Class {activeClass}):</h3>
        <p style={{ marginTop: '4px', marginBottom: '20px', fontSize: '14px', color: '#333' }}>
          Hover over the tokens to get the attribution.
        </p>

        <TokenAttribution
          tokens={result[activeClass].tokens}
          attributions={result[activeClass].attributions}
          classIndex={activeClass}
        />
      </div>
    )}
  </div>
)}

    </div>
  );
}

export default App;
