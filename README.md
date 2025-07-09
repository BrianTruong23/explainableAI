# 🧠 Explainability xAI App

A full-stack web application that allows users to input text (and images soon), receive a machine learning model prediction, and view explainability results that highlight which parts of the input influenced the prediction.

You can access the website at this link: [NeonAI](https://neonlightai.vercel.app/)).

## ✨ Features

- 🔤 Text classification using Hugging Face models (`bert-base-uncased`)
- 🔍 Token-level explanations using Captum (`IntegratedGradients`)
- 🖼️ Image upload support (coming soon!)
- ⚡ Fast, lightweight backend with FastAPI
- 🧪 Interactive frontend built with React + plain CSS

---

## 🧰 Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React, Vite, Vanilla CSS |
| Backend   | FastAPI, Transformers, Captum |
| ML Models | Hugging Face Transformers |
| Explainability | Captum (Integrated Gradients) |
| Deployment | Local / Docker (planned) |

---

## 🚀 Getting Started

### 🖥️ Frontend Setup

```bash
cd xai-frontend
npm install
npm run dev
