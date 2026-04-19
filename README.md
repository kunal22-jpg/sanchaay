# 🌱 Sanchaay (Sustain-a-thon)

> **"Turn eco-guilt into eco-fun. Save the planet, one level at a time."**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-sanchaay.vercel.app-22c55e?style=for-the-badge)](https://sanchaay.vercel.app)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

---

## 📖 Table of Contents

- [About](#-about)
- [User Flow](#-user-flow)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Team Contributions](#-team-contributions)
- [Roadmap](#-roadmap)

---

## 🌍 About

Sanchaay is a **gamified sustainability platform** built for the Sustainathon hackathon. It tackles **Eco-Anxiety** — the paralysing feeling that individual actions are too small to matter — by turning daily eco-conscious choices into a rewarding, game-like experience powered by AI.

Instead of guilt and fear, Sanchaay gives you **XP, badges, streaks, and an AI coach** that celebrates every small win.

---

## 🗺️ User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

  1. LOGIN / SIGNUP
     └─► User creates an account or logs in
         └─► Auth context loads saved stats from localStorage

  2. HOME DASHBOARD
     └─► Sees current Level, XP bar, streak count, CO2 saved
         └─► Quick-action buttons to log common eco-actions

  3. LOG AN ACTION  (Tracker Page)
     ├─► Picks an action: "Meat-Free Meal" (+75 XP), "Recycled Glass" (+50 XP), etc.
     ├─► XP is instantly added → progress bar animates
     ├─► Level-up triggers if threshold crossed → badge may unlock
     └─► Action is saved to history log with timestamp

  4. ECOBOT AI CHAT  (AI Assistant Page)
     ├─► User opens chat with EcoBot
     ├─► System prompt is injected with live user stats (level, XP, badges, streak)
     ├─► EcoBot responds with personalized, context-aware advice
     └─► User can ask tips, get motivation, or learn about sustainability

  5. MISSIONS  (Missions Page)
     ├─► View daily / weekly eco-challenges
     ├─► Complete missions to earn bonus XP
     └─► Progress tracked per mission

  6. EDUCATION  (Education Page)
     ├─► Bite-sized learning cards on climate topics
     │   (Greenhouse Effect, Ocean Acidification, Grid Storage, etc.)
     └─► Interactive micro-modules with key takeaways

  7. QUIZ  (Quiz Page)
     ├─► Test knowledge with sustainability quizzes
     └─► Earn XP for correct answers

  8. COMMUNITY  (Community Page)
     ├─► Share eco-wins (posts via backend API)
     ├─► View other users' actions and milestones
     └─► Like and engage with the community feed

  9. IMPACT CHART
     └─► Recharts-powered visualization of CO2 saved over time
         └─► Updates reactively as new actions are logged
```

---

## ✨ Features

### 🎮 Gamification Engine
- **XP & Leveling** — Progress from *Seedling* → *Sapling* → *Forest Guardian* and beyond
- **Smart Badges** — Auto-unlock achievements like `10kg Club`, `Eco Master`, `Streak Champion`
- **Streak Multipliers** — Consecutive daily activity earns XP bonus
- **Instant Feedback** — Every action gives immediate visual response (<16ms)

### 🤖 EcoBot — AI Coach
- Powered by **Google Gemini 1.5 Flash** via OpenRouter
- Reads your live stats: level, XP, badges, recent actions
- Witty, optimistic tone — no boring lectures
- Context-aware advice to help you hit your next milestone

### 📊 Impact Visualization
- **Live CO2 Charts** using Recharts (SVG-based, fully responsive)
- **Action History Log** — granular record of every eco-action with icons
- Real-time metric updates — see CO2 saved tick up instantly

### 📚 Education & Quizzes
- Micro-learning modules on climate science topics
- Interactive quizzes with XP rewards

### 🌐 Community Feed
- Post eco-wins, browse others' milestones
- Backend powered by Node.js + Express + MongoDB

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **AI** | Google Gemini 1.5 Flash, OpenRouter API, OpenAI SDK |
| **Data Viz** | Recharts |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Auth & State** | React Context API, React Hooks, LocalStorage |
| **UI System** | Neo-Brutalist design (custom), Lucide Icons |
| **Tooling** | PostCSS, Autoprefixer, ESBuild, npm |
| **Deployment** | Vercel, GitHub |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Frontend Setup

```bash
# Clone the repo
git clone https://github.com/kunal22-jpg/sanchaay.git
cd sanchaay

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your OpenRouter API key:
# VITE_OPENROUTER_API_KEY=your_key_here

# Run dev server
npm run dev
# → http://localhost:5173
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
# MONGO_URI=your_mongodb_uri
# PORT=5000

# Start server
node server.js
```

---

## 📁 Project Structure

```
sanchaay/
├── pages/
│   ├── Home.tsx          # Dashboard — XP, level, stats overview
│   ├── Tracker.tsx       # Log eco-actions, earn XP
│   ├── AiAssistant.tsx   # EcoBot AI chat interface
│   ├── Missions.tsx      # Daily & weekly challenges
│   ├── Education.tsx     # Climate science micro-modules
│   ├── Quiz.tsx          # Knowledge quizzes
│   ├── Community.tsx     # Social feed
│   ├── Dashboard.tsx     # Detailed impact dashboard
│   └── Login.tsx         # Authentication
├── components/
│   ├── Navbar.tsx        # Desktop navigation
│   ├── MobileNavbar.tsx  # Mobile navigation
│   ├── ImpactChart.tsx   # CO2 savings visualization
│   ├── LiveMap.tsx       # Community map
│   └── ui/               # NeoCard, NeoButton, NeoModal, Loader
├── context/
│   └── AuthContext.tsx   # Global auth & user stats state
├── services/
│   ├── aiService.ts      # Gemini API integration
│   └── envService.ts     # Environment config
├── backend/
│   ├── server.js         # Express server
│   └── models/
│       ├── User.js       # User schema
│       └── Post.js       # Community post schema
├── constants.ts          # XP values, badge definitions, action list
└── types.ts              # TypeScript interfaces
```

---

## 👥 Team Contributions

| Contributor | Role |
|-------------|------|
| **Kunal** | Backend (Node.js, Express, MongoDB schemas), Frontend React components, AI integration (Gemini prompt engineering, dynamic context injection, EcoBot) |

---

## 🔮 Roadmap

- [ ] **Phase 1** — Supabase migration for multiplayer leaderboards & Guild competitions
- [ ] **Phase 2** — React Native mobile app (iOS & Android)
- [ ] **Phase 3** — Computer vision to auto-verify recycling via camera snap
- [ ] **Phase 4** — Brand partnerships to redeem XP for real-world sustainable product discounts
- [ ] **Phase 5** — IoT integration with smart home APIs for automatic energy savings logging

---

## 🌐 Try It Live

👉 **[https://sanchaay.vercel.app](https://sanchaay.vercel.app)**

---

<div align="center">

**Built with 💚 for the planet.**
*Don't just scroll. Start saving the world.*

</div>
