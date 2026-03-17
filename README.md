# 🚀 SoloLearn Clone
> A premium, dark-mode first e-learning platform with comprehensive course management, robust security, and automated certificate generation.

## 🌟 Overview
SoloLearn is a full-stack web application designed to deliver an exceptional learning experience. It features user authentication, a wide range of coding courses, interactive quizzes, and automated PDF certificate generation upon course completion. The application is built with a strong emphasis on security, incorporating advanced anti-inspection protocols.

## ✨ Key Features
- **Premium Dark Mode UI:** A sleek, fully responsive dark-mode interface built with Tailwind CSS and Framer Motion for smooth animations.
- **Secure Authentication:** JWT-based user authentication (Login/Signup) with secure cookie management and password hashing.
- **Interactive Learning:** Engaging course content with built-in tests and quizzes to validate knowledge.
- **Automated Certificates:** Upon course completion, a personalized PDF certificate is automatically generated and emailed to the user.
- **Advanced Security:** Strict anti-inspection system that globally blocks developer tools, right-clicks, and keyboard shortcuts to protect content.
- **Admin Dashboard:** Visualized analytics using Recharts for tracking user progress and platform metrics.
- **Theme Toggle:** Seamless Day/Night mode switching for personalized user experience.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS, Framer Motion for animations
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **PDF Generation:** jsPDF, HTML2Canvas
- **Markdown Rendering:** React Markdown with Rehype Highlight

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Security:** Helmet, Express Rate Limit, Express Mongo Sanitize
- **Email Services:** Nodemailer
- **PDF Generation:** PDFKit

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- SMTP Email Account (for sending certificates)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/solo_learn.git
   cd solo_learn
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` directory with the following variables:*
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=30d
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password
   ```
   *Start the backend server:*
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   ```
   *Start the development server:*
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
Solo_learn/
├── backend/                # Express API server
│   ├── src/
│   │   ├── routes/         # API endpoints (auth, quiz, review)
│   │   ├── controllers/    # Route logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── middleware/     # Custom middleware (auth, security)
│   │   ├── utils/          # Helpers (email, pdf generation)
│   │   └── server.js       # Entry point
│   └── package.json
└── client/                 # React frontend
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Full page views
    │   ├── context/        # React context providers
    │   ├── utils/          # Helper functions
    │   └── App.jsx         # Main application component
    └── package.json
```

## 🛡️ Security Features
This project implements robust security measures:
- **Rate Limiting:** Prevents brute-force attacks on API endpoints.
- **Data Sanitization:** Protects against NoSQL injection (express-mongo-sanitize) and XSS attacks.
- **HTTP Headers:** Secured using Helmet.js.
- **Content Protection:** Custom anti-inspection layer on the frontend blocks developer tools and unauthorized code inspection.

## 📝 License
This project is licensed under the ISC License.
