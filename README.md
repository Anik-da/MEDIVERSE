# MediVerse AI

> **The Future of AI-Powered Healthcare** — A premium full-stack intelligent healthcare platform with neural diagnostics, real-time telemetry, secure satellite SOS emergency dispatch, and cyber-black glassmorphism user experiences.

![License](https://img.shields.io/badge/license-MIT-blue)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI-FF6F00)
![Firebase](https://img.shields.io/badge/auth-Firebase%20OTP-FFCA28)
![Deployment](https://img.shields.io/badge/hosting-Firebase%20Hosting-4285F4)

---

## 🎨 Premium Design Theme: Cyber-Black Glassmorphism
The MediVerse frontend features a customized futuristic cyber-black design language engineered from the ground up:
*   **Backdrop Glassmorphism**: Tailored `backdrop-blur-md` panels with harmonious borders using standard CSS variables and semi-transparent alphas.
*   **Accent Meshes**: Glowing backdrop radial blurs in electric neon-blue (`#00D4FF`), neon-purple (`#8B5CF6`), and neon-red (`#EF4444`) to provide visual depth.
*   **Advanced Typography**: Custom combination of futuristic fonts paired with standard browser fonts to balance readability and high-tech branding.
*   **Micro-Animations**: Smooth hover-scaling, glowing focus borders, and concentric pulse animation rings.

---

## 🔒 Stable Phone OTP Authentication Flow
The security gateway has been refactored for production-ready reliability:
1.  **Direct Firebase Auth integration**: Bypasses intermediate state wrappers to call `signInWithPhoneNumber` directly, ensuring thread-safe reCAPTCHA verification.
2.  **Regional Policy Alignment**: Built-in logic supporting India (`+91`) and international mobile carrier routes.
3.  **Invisible reCAPTCHA verifiers**: Safely bound to clean DOM anchor structures in `index.html` to eliminate excessive user puzzles.
4.  **Clinical Bypass Sandbox**: Dedicated sandbox mode built into development routes to allow seamless validation testing without exhausting SMS carrier quotas.

---

## 🚨 SOS Critical Emergency Alert System
The SOS Emergency Portal is designed for lightning-fast critical dispatch:
*   **One-Tap Immediate Action**: Single click on the glowing, red mobile-friendly SOS button requests the user's high-accuracy GPS coordinates immediately.
*   **Parameter Capture**: Automatically compiles full name, mobile number, email, emergency contact phone, emergency contact email, latitude, and longitude.
*   **Webhook Cloud Sync**: Dispatches the structured JSON payload to the production API endpoint at `https://amitprakesh.app.n8n.cloud/webhook-test/emergency alert`.
*   **Status Indicators**: 
    *   *Loading Beacon Overlay*: A premium blurred lockscreen featuring a red spinning coordinate sync tracker.
    *   *Transmission Banner*: Displays a green success banner ("Emergency Alert Sent Successfully") once n8n webhook returns a valid response.
    *   *Error Resiliency*: Graceful fallbacks using standard coordinate arrays if the client rejects GPS permissions.

---

## 🚀 Live Deployments

*   **Production Host**: [https://mediverse-c2d59.web.app](https://mediverse-c2d59.web.app)
*   **Firebase Console**: [https://console.firebase.google.com/project/mediverse-c2d59/overview](https://console.firebase.google.com/project/mediverse-c2d59/overview)

---

## 🛠️ Tech Stack

### Frontend
*   **React 18** + **Vite** — High-speed compiler and optimization pipeline.
*   **TailwindCSS** — Premium utility styling classes.
*   **Framer Motion** — Dynamic state transitions.
*   **Firebase SDK** — Direct Phone Authentication & Auth State listeners.
*   **Lucide React** — Futuristic, sleek icon design sets.

### Backend
*   **FastAPI** — Asynchronous Python framework.
*   **MongoDB + Motor** — Document-oriented database for storing user clinical telemetry.
*   **JWT Security** — Local encrypted token generation.

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
Distributed under the MIT License. Built with ❤️ for the future of decentralized intelligent healthcare.
