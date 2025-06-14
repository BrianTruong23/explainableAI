# ✅ TODO: Future Development Plan for Explainability xAI Web App

## PHASE 1: 🔮 Real Model Inference

- [ ] Replace dummy prediction with real Hugging Face model (`distilbert-base-uncased`)
- [ ] Load tokenizer and model using transformers
- [ ] Enable dynamic model loading based on dropdown value
- [ ] Return prediction and probability in JSON response

## PHASE 2: 🎨 Explanation Visuals (xAI)

- [ ] Use Captum (Integrated Gradients) for token attribution
- [ ] Return token-weight pairs from backend
- [ ] Highlight token weights visually in React using background color
- [ ] Optional: Implement GradCAM for image explainability
- [ ] Display heatmap image for visual explanations

## PHASE 3: 🚀 Deployment and Scalability

- [ ] Store configs in .env files (ports, models, URLs)
- [ ] Dockerize backend with Uvicorn
- [ ] Deploy frontend to Vercel or Netlify
- [ ] Deploy backend to Render, Railway, or EC2
- [ ] Add CORS + HTTPS support
- [ ] (Optional) Add backend GPU support (e.g. Paperspace, EC2-GPU)

## Optional Advanced Features

- [ ] Add explanation comparison (SHAP vs IntegratedGradients)
- [ ] Add export-to-PDF feature for reports
- [ ] Add multilingual tokenizer/model support
- [ ] Add SQLite or Firebase for user upload history
- [ ] Create frontend interface to train new models

## Project Milestone Tracker

| Task | Status |
|------|--------|
| Replace dummy predictions with real model | 🚧 In Progress |
| Add Captum for token attribution | ⏳ Next up |
| Visualize token weights in frontend | ⏳ Next up |
| Add GradCAM support for images | ❌ Not started |
| Deploy frontend to Vercel | ❌ Not started |
| Dockerize backend | ❌ Not started |
| Deploy backend to Render or EC2 | ❌ Not started |
