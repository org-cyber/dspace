# DSpace - SuiPod Chat

A decentralized collaboration and Hybrid chat platform built on the **Sui Blockchain** and **Firebase**, featuring real-time messaging, pod-based group management, and seamless crypto payments.

![Sui](https://img.shields.io/badge/Blockchain-Sui-blue?style=for-the-badge&logo=sui)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite)
![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase)

---

## 🚀 Features

### 🔐 Decentralized Identity
- **Connect Wallet**: Sign in seamlessly using any standard Sui wallet (Suiet, Ethos, etc.) via `@mysten/dapp-kit`.
- **On-Chain Access**: Pod membership is verified transparently on the blockchain.

### 👥 Pods & Groups
- **Create Pods**: Launch your own collaborative spaces (Pods) with a single transaction.
- **Manage Members**: Add contributors by their wallet address.
- **Glassmorphic UI**: Experience a premium, modern interface fully styled with advanced Vanilla CSS (no Tailwind dependency).

### 💬 Real-Time Chat
- **Live Messaging**: Powered by Firebase Realtime Database for instant communication.
- **Secure Context**: Only active pods and members can interact.
- **History Management**: Clear chat history or delete entire pods with admin controls.

### 💸 Crypto Payments 
- **Direct Transfers**: Send SUI tokens directly to pod members without leaving the chat interface.
- **Integrated Controls**: Manage funds and payments from the Pod Dashboard.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Blockchain SDK**: `@mysten/dapp-kit`, `@mysten/sui`
- **Realtime / Storage**: Firebase Realtime Database
- **Styling**: Vanilla CSS (Semantic Classes, Variables, Glassmorphism)
- **Icons**: Lucide React

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18+)
- **npm** or **yarn**
- **Sui Wallet Extension** (e.g., Sui Wallet, Suiet)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dspace2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
Create a `src/lib/firebase.ts` file with your configuration:
```typescript
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Chat/          # ChatRoom, MessageList, MessageInput
│   ├── Pod/           # CreatePod, PodList, PodCard, PodControls
│   └── Providers.tsx  # Sui, Query, and Context providers
├── lib/
│   ├── firebase.ts    # Firebase initialization
│   ├── sui.ts         # Sui Network & Package constants
│   └── utils.ts       # Helper functions
├── pages/
│   └── Home.tsx       # Main dashboard layout
├── App.tsx            # Root component
├── main.tsx           # Entry point
└── index.css          # Global Semantic CSS & Variables
```

## 🎨 Styling System
The project uses a custom **Vanilla CSS** system defined in `index.css`. Key classes include:
- `.glass-card`: Premium glassmorphism effect for panels.
- `.dashboard-grid`: Responsive 12-column grid layout.
- `.btn-primary` / `.btn-secondary`: Standardized buttons with gradients and hover effects.
- `.input-field`: Polished form inputs.

---

## 📝 License
This project is open-source and available under the MIT License.



SITE LINK: https://dpsace1.netlify.app
