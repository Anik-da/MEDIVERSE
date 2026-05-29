# MediVerse AI

> **The Future of AI-Powered Healthcare** — A premium full-stack intelligent healthcare platform with neural diagnostics, real-time telemetry, secure satellite SOS emergency dispatch, dynamic location-based hospital locator, and a clean, high-performance user interface.

![License](https://img.shields.io/badge/license-MIT-blue)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI-FF6F00)
![Firebase](https://img.shields.io/badge/auth-Firebase%20OTP-FFCA28)
![Deployment](https://img.shields.io/badge/hosting-Firebase%20Hosting-4285F4)

---

## 🎨 Clean & Modern Cyber-Professional UI
The MediVerse frontend features a customized futuristic, high-contrast dashboard layout optimized for visual clarity:
*   **Geometric Card Layouts**: Structured `12px` border-radius panels with harmonious subtle shadows to eliminate visual clutter and ensure modern visual aesthetics.
*   **Vibrant Icon-Coded Sidebar**: A dynamic sidebar featuring a sleek gradient background (`from-slate-50 to-white`) with high-contrast, multi-colored service icons and a fluid active-state indicator pill.
*   **Generous Visual Spacing**: Enhanced grid layouts (`gap-8`), card paddings, and page headers for seamless visual navigation and breathing room.
*   **Time-Aware Dashboard Greeting**: An interactive welcome header that automatically synchronizes with the active time of day (Morning, Afternoon, Evening, Night) and pulls the active firebase user's name dynamically.

---

## 🔒 Stable Phone OTP Authentication Flow
The security gateway is designed for friction-free verification:
1.  **Simulated Sandbox Verification**: Clean local authentication fallback allowing seamless testing pathways without OTP cellular carrier delays.
2.  **Regional Policy Alignment**: Direct carrier compatibility supporting international and Indian (+91) routing systems.
3.  **No reCAPTCHA Frustration**: Stripped clean of intrusive reCAPTCHA prompts to ensure immediate patient access during high-stress check-ins.

---

## 🚨 SOS Critical Emergency Alert System
The SOS Emergency Portal is built for lightning-fast critical dispatch:
*   **One-Tap Immediate Action**: A large, easy-to-tap, mobile-friendly red SOS button that immediately captures the user's high-accuracy satellite GPS coordinates.
*   **Dynamic Parameter Sync**: Compiles and sends a structured JSON payload consisting of full name, mobile number, email, emergency contact phone, emergency contact email, latitude, and longitude.
*   **Automated Webhook Dispatch**: Transmits emergency telemetry payloads instantly to the cloud endpoint at `https://amitprakesh.app.n8n.cloud/webhook-test/emergency alert`.
*   **Resilient GPS Auto-Detection**: Continuously listens for active GPS parameters on page load, fallback to standard coordinates if permissions are restricted.

---

## 📍 Nearby Hospital Locator
A robust location-based search and routing map layout:
*   **Universally Compatible Map Embed**: Replaced restricted/broken Google Maps JS keys with a zero-friction, standard Google Maps iframe compiler (`output=embed`). Requires zero private billing configurations and works flawlessly across all devices.
*   **Automatic Live Coordinate Sync**: Listens for active GPS parameters on mount and prints active latitude and longitude in a status tracker.
*   **Dynamic Marker Focus**: Selecting any medical facility on the list dynamically re-centers the map view on that hospital's offset coordinates and automatically labels the map marker with the selected hospital's name.

---

## 🚀 Live Deployments

*   **Production Host**: [https://mediverse-c2d59.web.app](https://mediverse-c2d59.web.app)
*   **Firebase Project Overview**: [https://console.firebase.google.com/project/mediverse-c2d59/overview](https://console.firebase.google.com/project/mediverse-c2d59/overview)

---

## 🛠️ Tech Stack

### Frontend
*   **React 18** + **Vite** — Optimized rendering engine.
*   **TailwindCSS** — Utility CSS compiler.
*   **Framer Motion** — Dynamic transitions.
*   **Firebase SDK** — Phone authentication and profile listener modules.
*   **Lucide React** — Premium icon library.

### Backend
*   **FastAPI** — High-speed Python framework.
*   **MongoDB + Motor** — Document-oriented data persistence.

---

## ⚡ Quick Start

### Prerequisites
*   Node.js 18+
*   Python 3.10+
*   MongoDB Instance

### Frontend Local Launch
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Backend Local Launch
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env # Update credentials
python run.py
```
Open [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📄 License
Distributed under the MIT License. Built with ❤️ for decentralized intelligent healthcare.
