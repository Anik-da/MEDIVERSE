# MediVerse AI

> **The Future of AI-Powered Healthcare** — A full-stack intelligent healthcare platform with neural diagnostics, real-time monitoring, and smart emergency response.

![License](https://img.shields.io/badge/license-MIT-blue)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI-FF6F00)

---

## 🚀 Features

| Module | Description |
|--------|-------------|
| **AI Symptom Checker** | Neural network-powered disease prediction from symptoms |
| **Emergency SOS** | One-tap emergency alert with live location sharing |
| **Hospital Finder** | GPS-based nearby hospital discovery with ETA routing |
| **Medicine Scanner** | OCR-based medicine identification and safety info |
| **Mental Health AI** | Emotional support companion with mood tracking |
| **Health Dashboard** | Analytics, vitals, medicine reminders, and AI insights |
| **Voice Diagnosis** | Cough pattern analysis and voice biomarker detection |
| **OCR Report Scanner** | Medical report extraction with AI-generated summaries |
| **User Profile** | Health score, medical info, and account management |
| **JWT Authentication** | Secure registration, login, and protected API routes |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — Lightning-fast build tooling
- **TailwindCSS** — Utility-first CSS framework
- **Framer Motion** — Smooth animations and transitions
- **React Router DOM** — Client-side routing
- **Lucide React** — Beautiful icon library

### Backend
- **FastAPI** — High-performance Python API framework
- **MongoDB** + **Motor** — Async NoSQL database
- **JWT** (python-jose) — Secure authentication
- **Passlib + bcrypt** — Password hashing
- **Google Generative AI** — AI integration ready
- **Tesseract OCR** — Medical report text extraction

---

## 📁 Project Structure

```
MediVerse-AI/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Route pages (10 modules)
│   │   ├── main.jsx        # App entry point
│   │   ├── App.jsx         # Router configuration
│   │   └── index.css       # Design system
│   ├── index.html
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── auth/           # JWT + user routes
│   │   ├── routes/         # API endpoints
│   │   ├── config.py       # Environment settings
│   │   ├── database.py     # MongoDB connection
│   │   └── main.py         # FastAPI application
│   ├── run.py
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env    # Edit with your keys
python run.py
```

API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Server health check |
| `POST` | `/auth/register` | ❌ | Register new user |
| `POST` | `/auth/login` | ❌ | Login + get JWT |
| `POST` | `/predict-disease` | ✅ | AI symptom analysis |
| `POST` | `/emergency-alert` | ✅ | Send emergency SOS |
| `GET` | `/nearest-hospitals` | ❌ | Find nearby hospitals |
| `POST` | `/medicine-scan` | ✅ | Scan medicine package |
| `POST` | `/mental-health-chat` | ✅ | Mental health AI chat |
| `POST` | `/voice-diagnosis` | ✅ | Voice health analysis |
| `POST` | `/ocr-report-summary` | ✅ | Medical report scan |

---

## 🎨 Design Theme

**Cyberpunk Healthcare** — A futuristic dark UI with:
- Neon blue (`#00F0FF`) and electric purple (`#A855F7`) accents
- Glassmorphism panels with backdrop blur
- Animated transitions and micro-interactions
- Custom Orbitron + Inter typography
- Responsive layout for all devices

---

## 📄 License

MIT License — built with ❤️ for the future of healthcare.
