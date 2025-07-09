// ping_api.js
const fetch = require('node-fetch'); // Required for fetch in Node.js

async function fetchTextExplanation(text, model = "bert-base-uncased", method = "SHAP") {
    const remoteURL = "https://thang22-xai-model-api.hf.space/predict-text";
    
    try {
        console.log(`Pinging API: ${remoteURL} with text: "${text}"`);
        const res = await fetch(remoteURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch explanation. Status: ${res.status}, Message: ${errorText}`);
        }
        
        const data = await res.json();
        console.log("API ping successful! Response (truncated):", JSON.stringify(data).substring(0, 200) + "...");
        return data;
    } catch (error) {
        console.error("Error during API ping:", error.message);
        // You might want to re-throw the error or handle it based on your needs
        // For a simple ping, logging the error might be sufficient.
        throw error; 
    }
}

// Call the function with some dummy text to keep the API awake
// The actual content of the text doesn't matter for just keeping it alive.
fetchTextExplanation("Hello world, keep alive!")
    .then(() => console.log("Ping script finished."))
    .catch(err => console.error("Ping script failed:", err.message));

