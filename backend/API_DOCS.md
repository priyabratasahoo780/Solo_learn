# SoloLearn API Documentation

This document provides a comprehensive guide to the SoloLearn backend API. Use this information to test the routes in Postman or integrate with the frontend.

## 🚀 Base URL
- Local: `http://localhost:5000/api` (assuming default port 5000)
- Production: `YOUR_PRODUCTION_URL/api`

---

## 🔐 Authentication (`/auth`)

### 1. Register User
- **URL:** `/auth/signup`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "referralCode": "OPTIONAL_CODE"
  }
  ```
- **Response:** `201 Created` with JWT token.

### 2. Login User
- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** `200 OK` with JWT token.

### 3. Get Current User (Me)
- **URL:** `/auth/me`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` with user data.

---

## 🧠 Quizzes (`/quizzes`)

### 1. Get All Quizzes
- **URL:** `/quizzes`
- **Method:** `GET`
- **Query Params:** `category`, `difficulty`, `search`, `page`, `limit`.
- **Response:** `200 OK` list of quizzes.

### 2. Start Quiz Attempt
- **URL:** `/quizzes/:id/start`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` with `attemptId`.

### 3. Submit Quiz
- **URL:** `/quizzes/:id/submit`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "answers": [0, 1, 2, 0] 
  }
  ```
- **Response:** `200 OK` with results and points earned.

---

## 🏆 Leaderboard (`/leaderboard`)

### 1. Get Top Performers
- **URL:** `/leaderboard`
- **Method:** `GET`
- **Query Params:** `timeframe` (weekly, monthly, all).
- **Response:** `200 OK` ranked users.

---

## 📜 Social Feed (`/posts`)

### 1. Get Feed
- **URL:** `/posts`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` with post list.

### 2. Create Post
- **URL:** `/posts`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "content": "Just finished my first quiz!",
    "type": "standard_text"
  }
  ```

---

## 🤖 AI & Career (`/ai`, `/career`)

### 1. Ask AI Tutor
- **URL:** `/ai/ask`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "prompt": "What is Closures in JS?" }`

### 2. Generate Roadmap
- **URL:** `/career/generate`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "role": "Fullstack Developer", "currentSkills": ["HTML", "CSS"] }`

---

## ⚔️ Challenges (`/challenges`)

### 1. Create Duel
- **URL:** `/challenges/create`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "bid": 100, "category": "JavaScript" }`

---

## 🛠 Testing in Postman
1. **Import Collection**: Link coming soon.
2. **Setup Environment**: Add `baseUrl` and `token`.
3. **Login First**: Use `/auth/login` to get a token, then add it to the `Authorization` header as `Bearer <token>` for protected routes.
