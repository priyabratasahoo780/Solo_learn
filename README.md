# 🚀 SoloLearn: The Elite AI-Powered Learning Arena

SoloLearn is a high-performance, full-stack learning platform designed for modern software engineers. It bridges the gap between passive learning and active competitive engineering through AI tutoring, real-time duels, and automated certification.

---

## 🛠️ Tactical Tech Stack

### Frontend & UI
- **Framework:** ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React 19 (Vite)**
- **Styling:** ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS 4.0**
- **Animations:** ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) 
- **Icons:** ![Lucide](https://img.shields.io/badge/Lucide_React-FF5722?style=for-the-badge&logo=lucide&logoColor=white)

### Backend & Database
- **Runtime:** ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
- **Framework:** ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
- **Database:** ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
- **Auth:** ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

### AI & Services
- **AI Core:** ![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white) **Gemini Flash 1.5**
- **Social Login:** ![Google Auth](https://img.shields.io/badge/Google_OAuth_2.0-4285F4?style=for-the-badge&logo=google&logoColor=white)
- **Communication:** ![Nodemailer](https://img.shields.io/badge/Nodemailer-339933?style=for-the-badge&logo=icloud&logoColor=white)

---

## 📡 Core System Features

### 🤖 Neural AI Tutor
Built-in **Gemini AI integration** that provides real-time tutoring, helps with interview preparation, and gives intelligent feedback on coding performance.

### ⚔️ Battleground (Real-time Duels)
Face off against other engineers in real-time coding challenges. Earn coins, climb the leaderboard, and maintain your streak.

### 🔐 Elite Identity Management
Seamless authentication via **Google OAuth 2.0** or local credentials. Secured with industry-standard JWT and cookie-based sessions.

### 📜 Automated Certification Engine
Complete courses and instantly receive a professional **PDF Certificate** generated via PDFKit and delivered directly to your inbox.

### ⚡ Technical Optimizations
- **Progressive Lazy Loading:** Optimized route-based code splitting for instant initial loads.
- **Blueprint UI:** A unique, scratch-inspired design system focused on high-density data and developer focus.
- **Auto-Streak Logic:** Intelligent engagement tracking to build consistent learning habits.

---

## 🚀 Getting Started

### 1. Requirements
- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Cloud Console Project (for OAuth)
- Gemini API Key

### 2. Environment Setup
Create a `.env` in the `backend` folder:
```env
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
GEMINI_API_KEY=your_key
```

### 3. Installation
```bash
# Install root dependencies
npm install

# Build and start serving
npm run dev
```

---

## 🛡️ Security & Performance
- **CORS Protection:** Restricted institutional access via whitelist logic.
- **Body Parsing:** High-capacity 50mb limits for complex data transfers.
- **Request Rate Limiting:** Built-in protection against automated scraping.

---
*Created with passion by [Priyabrata Sahoo](https://github.com/priyabratasahoo780)*
