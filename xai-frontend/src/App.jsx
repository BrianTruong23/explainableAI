import { useState, useEffect, useCallback } from 'react';
import './App.css';
import TokenAttribution from './components/TokenAttribution';
import ImageSwitcher from './components/ImageSwitcher';
import { fetchImageExplanation, fetchTextExplanation } from './api/explainApi';
import { FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  const SHAP = "SHAP";
  const VIT_TINY = "vit-tiny";
  const BERT = "distilbert-base-uncased";
  const GRAD_CAM = "GradCAM";
  
  const [text, setText] = useState('');
  const [model, setModel] = useState(BERT);
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
  const [imageFileBase64, setImageFileBase64] = useState(null);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const VALID_COMBINATIONS = new Set([
    `${BERT}|${SHAP}`,
    `${VIT_TINY}|${GRAD_CAM}`
  ]);


  const toggleInfo = () => {
    setShowInfo((prev) => !prev);

  };

  const startTimer = useCallback(() => {
    setElapsedTime(0); // Reset time
    const id = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000); // Update every second
    setIntervalId(id);
  }, []);

  // Function to stop the timer
  const stopTimer = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

   // Effect to clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);


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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();

      // Define what happens when the reader finishes loading the file
      reader.onloadend = () => {
        // reader.result will contain the Base64 string (data:image/jpeg;base64,...)
        setImageFileBase64(reader.result);
      };

      // Read the file as a Data URL (Base64 string)
      reader.readAsDataURL(imageFile);
    } else {
      // If imageFile is null (no file selected or cleared), also clear the base64 state
      setImageFileBase64(null);
    }

  }, [imageFile]); 

    
  const handleSubmit = async () => {

    if (!sanityCheckForModelAndMethod(model, method)){
      toast.error(`${method} is not available for this model: ${model}.`);
      return;
    }


    if (model == BERT && !text.trim()) {
      setPrediction('Please enter text to get prediction.');
      return;
    }


    setLoading(true);
    setError(null);
    startTimer(); // Start the timer when loading begins

    try {

      if (model == BERT && method == SHAP){
          const data = await fetchTextExplanation(text, model, method);

          const formatted = data.probabilities
            .map((prob, i) => `Class ${i}: ${(prob * 100).toFixed(2)}%`)
            .join('\n');

          if (model == BERT){
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
      stopTimer(); // Stop the timer when loading ends
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
      Currently, it supports two models and two explainability methods:
      <div class ="explain-model">
        <br />
        • <strong>BERT (distilled-bert-base-uncased)</strong> — a text-based model that performs sentiment analysis. Using <strong>SHAP (SHapley Additive exPlanations)</strong>, the app highlights which words in a sentence contributed most to the predicted sentiment.
        <br />
        • <strong>ViT (google/vit-base-patch16-224)</strong> — an image classification model. <strong>Grad-CAM (Gradient-weighted Class Activation Mapping)</strong> is used to overlay heatmaps showing the regions of the image most influential to the prediction.
      </div>
   
    </p>


    {showInfo && (
      <div className="modal-overlay" onClick={toggleInfo}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={toggleInfo}>×</button>
          <h3>📘 About This Project</h3>
          <p>
            This project aims to demystify the decisions made by AI models by using interactive, interpretable visualizations powered by explainable AI techniques.
          </p>
          <p>
            <strong>Text Model:</strong> <code>distilled-bert-base-uncased</code><br />
            This model performs sentiment analysis on input text. To explain its predictions, the app uses <strong>SHAP</strong>, a game-theoretic approach that assigns importance scores to each word, indicating how much each word contributes to the overall prediction.
          </p>
          <p>
            <strong>Image Model:</strong> <code>google/vit-base-patch16-224</code><br />
            This model classifies input images into predefined categories. <strong>Grad-CAM</strong> is used to generate heatmaps that highlight the regions of the image that were most influential in the model's classification decision.
          </p>
          <p>
            Future versions will support more model types (e.g., multimodal or multilingual) and additional explanation techniques to deepen interpretability across various AI tasks.
          </p>
          <p>
            Created by&nbsp;
            
            <a href="https://truongthoithang.com" target="_blank" rel="noopener noreferrer">
              Thang Truong (Brian).
            </a>
          </p>
        </div>
      </div>
    )}





      <textarea
        placeholder="Enter text..."
        value={text}
        onChange={e => setText(e.target.value)}
        disabled = {model == VIT_TINY}
        style={{
          opacity: model === VIT_TINY ? 0.5 : 1,
          cursor: model === VIT_TINY ? "not-allowed" : "pointer"
        }}
      />


      <label>
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={model === "BERT"}
            style={{
              opacity: model === BERT ? 0.5 : 1,
              cursor: model === BERT ? "not-allowed" : "pointer"
            }}
          />

      </label>
    
      {/* Model and method dropdowns */}
      <label>
        Model:
        <select onChange={(e) => setModel(e.target.value)} value={model}>
          <option value={BERT}>distilled-bert-base-uncased</option>
          <option value={VIT_TINY}>vit-tiny</option>
        </select>
      </label>

      <label>

      Explainable Method:
      
      <select
        onChange={handleChange}
        value={method}
        style={{
          opacity: model === BERT && method === GRAD_CAM ? 0.5 : 1,
          cursor: model === BERT && method === GRAD_CAM ? "not-allowed" : "pointer",
        }}
      >
        <option
          value="SHAP"
          style={{
            color: model === VIT_TINY ? "#999" : "inherit",
          }}
        >
          SHAP
        </option>
        <option
          value="GradCAM"
          style={{
            color: model === BERT ? "#999" : "inherit",
          }}
        >
          GradCAM
        </option>
      </select>


      </label>
     

      <button onClick={handleSubmit}>Run Explainability</button>

       {loading && (
          <div className="flex flex-col items-center space-y-4">
            <div className="loader"></div>
            <p className="text-gray-700 text-lg font-medium">
              Processing...
            </p>
            {elapsedTime > 0 && ( // Only show time after 1 second
              <p className="text-gray-600 text-sm">
                Elapsed time: {elapsedTime} seconds
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg w-full max-w-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

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
        <ImageSwitcher
          imageGradCam={imageGradCam}
          originalImageSrc={imageFileBase64}
        />
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

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 Thang T. Truong. All rights reserved.</p>
        <div class="footer-icons">
          <a href="https://www.linkedin.com/in/truongthoithang/" target="_blank" aria-label="LinkedIn">
            <i class="fab fa-linkedin"></i>
          </a>
          <a href="https://github.com/BrianTruong23" target="_blank" aria-label="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="mailto:truongthoithang@utexas.edu" aria-label="Email">
            <i class="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </footer>

    </div>
  );
}

export default App;
