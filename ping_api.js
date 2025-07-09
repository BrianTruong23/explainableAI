// ping_api.js

// Use a dynamic import for node-fetch, which returns a Promise
// This allows you to use node-fetch (an ES Module) within a CommonJS script.
let fetch;
import('node-fetch').then(module => {
    fetch = module.default;
    // Once fetch is loaded, call the main function
    runPingScript();
}).catch(error => {
    console.error("Failed to load node-fetch:", error.message);
    process.exit(1); // Exit if we can't even load fetch
});


async function fetchTextExplanation(text, model = "bert-base-uncased", method = "SHAP") {
    const remoteURL = "https://thang22-xai-model-api.hf.space/predict-text";
    
    try {
        console.log(`Pinging API: ${remoteURL} with text: "${text}"`);
        // Ensure fetch is available before using it
        if (!fetch) {
            throw new Error("node-fetch not loaded yet.");
        }
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
        throw error; 
    }
}

// Wrap the main execution logic in a function to be called after fetch is loaded
async function runPingScript() {
    // Call the function with some dummy text to keep the API awake
    fetchTextExplanation("Hello world, keep alive!")
        .then(() => console.log("Ping script finished."))
        .catch(err => {
            console.error("Ping script failed:", err.message);
            process.exit(1); // Exit with an error code if the ping fails
        });
}

