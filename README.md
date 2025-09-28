# 🌿 Carbon Cruncher AI

Carbon Cruncher AI is a sustainability-focused image analysis tool that uses a hybrid of Machine Learning and Generative AI to identify common household waste items, estimate their carbon footprint, and suggest environmentally friendly alternatives.

![Demo Screenshot](./Frontend/public/logo192.png)
Youtube video: https://youtu.be/4_E2qDs5Qcc
---

## 🧠 Introduction

Carbon Cruncher AI empowers users to make more sustainable decisions by:

- Recognizing waste materials from uploaded images using a custom-trained MobileNet model.
- Estimating the carbon footprint based on the object's type and weight.
- Recommending eco-friendly alternatives using Google Gemini (Generative AI).
- Supporting intuitive drag-and-drop UI with real-time results.

---

## 📚 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Tech Stack](#-tech-stack)
- [Configuration](#-configuration)
- [Examples](#-examples)
- [Troubleshooting](#-troubleshooting)
- [Contributors](#-contributors)
- [License](#-license)

---

## ✨ Features

- 🔍 **ML-based Material Detection** – Uses MobileNet with 93%+ accuracy.
- 🌐 **Gemini AI Integration** – Leverages Google’s Gemini to return enriched sustainability data.
- ⚡ **Real-Time Analysis** – Instantly predicts material type, weight, and environmental cost.
- 🔁 **Eco-Friendly Alternatives** – Offers product/material swaps to reduce impact.
- 📤 **Drag & Drop Upload** – Seamless UX for image uploads.
- 📲 **Shareable Results** – Copy or share insights directly from the app.

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vemula20262/Hackathon_MLH.git
cd Hackathon_MLH
```

### 2. Set Up Python Backend (Flask)

```bash
cd Backend
pip install -r requirements.txt
```

### 3. Set Up Frontend (React)

```bash
cd Frontend
npm install
```

---

## ▶️ Usage

### 🧪 Start the Backend

```bash
cd Backend
python app.py
```

> Make sure you have the `material_detection.h5` model in the same directory.

### 💻 Start the Frontend

```bash
cd Frontend
npm start
```

Visit: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint           | Description                      |
|--------|--------------------|----------------------------------|
| POST   | `/analyze-image`   | Upload an image and analyze it. |

**Payload**: `multipart/form-data` with key `image`

**Response**:
```json
{
  "object_name": "plastic_water_bottles",
  "material": "Plastic",
  "estimated_weight_g": 23,
  "carbonFootprint": 102,
  "altName": "Glass Reusable Bottle"
}
```

---

## 🧰 Tech Stack

### 📦 Frontend
- React.js
- FontAwesome (UI Icons)
- CSS3 (Drag & Drop, Animations)

### 🔬 Backend
- Python Flask
- TensorFlow / Keras (MobileNet)
- Google Gemini API
- Serper.dev (Google search via API)
- Custom Web Scraping (Clause + BFS Crawler)

---

## ⚙️ Configuration

- **Gemini API Key**: Set in `app.py`
  ```python
  genai.configure(api_key="YOUR_API_KEY")
  ```
- **ML Model**: `material_detection.h5` (Pre-trained MobileNet)
- **Environment Requirements**:
  - Python 3.9+
  - TensorFlow 2.x
  - Flask
  - Node.js 18+ (for frontend)

---

## 🧪 Examples

Upload an image of:

- 🥤 A plastic water bottle → Suggests reusable glass bottle
- 🥫 An aluminum can → Recommends recycling or aluminum alternatives
- 👟 Old shoes → Suggests textile-based, eco-friendly footwear

---

## 🛠 Troubleshooting

| Issue                        | Fix                                                   |
|-----------------------------|--------------------------------------------------------|
| `ModuleNotFoundError`       | Ensure all Python packages are installed via `pip`    |
| ML model not found          | Confirm `material_detection.h5` is in the root dir    |
| Gemini API errors           | Validate your API key or rate limits                  |
| Frontend not connecting     | Make sure Flask server is running on correct port     |


Special thanks to MLH for the hackathon opportunity.

---

## 📄 License

MIT License. See [LICENSE](./LICENSE) for details.
