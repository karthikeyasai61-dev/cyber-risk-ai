# CyberLens AI

> AI-powered Cyber Risk Quantification & Investment Optimization Platform

CyberLens AI helps enterprises understand the **real financial cost of cyber risk** — not just dashboards, but actual dollar-value exposure, Monte Carlo simulations, ML risk predictions, and an AI Copilot powered by Google Gemini 2.5 Flash.

---

## 🚀 Features

### ✅ Working Now
- **AI Copilot** — Ask anything about your cyber risk; powered by Gemini 2.5 Flash
- **EAL Financial Risk Calculator** — Estimates Expected Annual Loss from uploaded vulnerability data
- **Monte Carlo Simulation** — Probabilistic risk modeling with percentile distributions (P90, P95)
- **ML Risk Prediction** — Machine learning-based risk scoring from ingested data
- **Drag & Drop Data Upload** — Upload CSV logs/assets; all pages update automatically
- **Firebase Real-Time Sync** — Cloud storage for scans, assets, and audit trail
- **Threat Intelligence Dashboard** — Live feed from CISA KEV, NIST NVD, AlienVault OTX

### 🔄 Coming Soon
- Backend API proxy (to fix CORS on live threat intelligence APIs)
- Multi-user login via Firebase Auth
- Cloud deployment (Vercel / Firebase Hosting)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Routing | React Router DOM v7 |
| Charts | Recharts |
| Cloud DB | Firebase Firestore |
| AI Engine | Google Gemini 2.5 Flash |
| Tunnel | Cloudflare (cloudflared) |
| Data Sources | CISA KEV, NIST NVD, AlienVault OTX, IP-API, crt.sh |

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cyberrisk-ai.git
cd cyberrisk-ai/cyberrisk-ai
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `react`, `react-dom`, `react-router-dom`
- `recharts`
- `firebase`
- `vite`, `@vitejs/plugin-react`

### 3. Configure API Keys

API keys are stored in `src/services/apiKeys.js`. Open that file and replace the placeholder values with your actual keys:

```js
// src/services/apiKeys.js
export const getApiKeys = () => ({
  gemini: 'YOUR_GEMINI_API_KEY',       // Google AI Studio
  nvd: 'YOUR_NVD_API_KEY',             // NIST NVD
  alienVault: 'YOUR_OTX_API_KEY',      // AlienVault OTX
  // ... other keys
});
```

> **Never commit real API keys to Git.** Add `src/services/apiKeys.js` to `.gitignore` if sharing publicly.

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project (or use existing `cyber-risk-ai`)
3. Enable **Firestore Database**
4. Copy your Firebase config into `src/services/firebase.js`

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "cyber-risk-ai",
  // ...
};
```

### 5. Start the Dev Server

```bash
npm run dev
```

App runs at: **http://localhost:5173**

---

## 🌐 Sharing via Cloudflare Tunnel (No Account Needed)

To get a public HTTPS URL instantly:

```bash
# Windows
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:5173
```

Copy the generated URL (e.g., `https://xyz.trycloudflare.com`) and share it.

> **Install cloudflared:** `winget install Cloudflare.cloudflared`

---

## 📁 Project Structure

```
cyberrisk-ai/
├── src/
│   ├── components/
│   │   └── layout/         # Sidebar, Topbar, AppShell
│   ├── hooks/
│   │   └── useDemoState.jsx  # Global state & data propagation
│   ├── pages/
│   │   ├── DataUpload.jsx    # Drag & drop upload (route: /upload)
│   │   ├── DataSources.jsx   # Threat intelligence feeds
│   │   ├── AICopilot.jsx     # Gemini AI Copilot
│   │   ├── Settings.jsx      # Platform controls
│   │   └── ...               # EAL, MonteCarlo, ML, Dashboard
│   ├── services/
│   │   ├── apiKeys.js        # API key store (never shown in UI)
│   │   ├── copilot.js        # Gemini API integration
│   │   ├── firebase.js       # Firestore read/write
│   │   └── dataIngestion.js  # CSV parsing & normalization
│   └── main.jsx
├── vite.config.js
├── package.json
└── README.md
```

---

## 📊 How Data Upload Works

1. Go to **Data Ingestion** (first item in sidebar)
2. Drag & drop a CSV file (vulnerabilities or assets)
3. The app auto-detects the file type from filename keywords
4. All pages — EAL, ML, Monte Carlo, Risk Drivers — **update automatically**

Data flows through `useDemoState` context using `useMemo`-derived metrics.

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy the `dist/` folder to any static host (Vercel, Netlify, Firebase Hosting).

---

## 👥 Target Users

- CISOs and Security Executives
- Enterprise Risk & Compliance Teams
- Security Operations Center (SOC) Analysts
- IT Risk Managers

---

## 📄 License

MIT
