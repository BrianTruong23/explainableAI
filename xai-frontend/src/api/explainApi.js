export async function fetchTextExplanation(text, model = "bert-base-uncased", method = "SHAP") {
    const remoteURL = "https://thang22-xai-model-api.hf.space/predict-text";
    
    const res = await fetch(remoteURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
  
    if (!res.ok) throw new Error("Failed to fetch explanation.");
  
    return await res.json();
  }
  

  export async function fetchImageExplanation(file, model = "google/vit-base-patch16-224", method = "GRAD-CAM") {
    const remoteURL = "https://thang22-xai-model-api.hf.space/predict-image";
  
    const formData = new FormData();
    formData.append("file", file);         // MUST be the actual File object
    formData.append("model", model);
    formData.append("method", method);
  
    const res = await fetch(remoteURL, {
      method: 'POST',
      body: formData,                      // No headers here! Let browser set the correct boundary
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch explanation.");
    }
  
    return await res.json();
  }
  