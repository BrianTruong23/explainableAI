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
  