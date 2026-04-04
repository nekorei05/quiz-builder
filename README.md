# QuizBuilder 

A full-stack AI-powered quiz platform where admins create and manage quizzes and students attempt them with real-time feedback and AI-generated explanations.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square&logo=react)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20Gemma-4285F4?style=flat-square&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

###  Admin
- Create, edit and delete quizzes with full question management
- Draft / Publish toggle — control what students see
- **AI Quiz Generation** — upload a PDF, DOCX or CSV and Gemini generates quiz questions automatically
- Analytics dashboard with score trends, per-quiz breakdown and top students

###  Student
- Browse and attempt published quizzes with a timed, anti-cheat interface
- Instant results with question-by-question breakdown
- **AI Explanations** — click any question after a quiz to get a Gemini-powered explanation of the correct answer (cached in DB so the same question never hits the API twice)
- Personal analytics with progress over time and best scores per quiz
- Full attempt history with one-click result review

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (Role-based: admin / student) |
| AI | Google Gemini 2.5 Flash (quiz gen) · Gemma 3 1B (explanations) |
| File Parsing | Multer, pdf-parse, mammoth |


---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key → [Get one free at AI Studio](https://aistudio.google.com)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/quiz-builder.git
cd quiz-builder
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
DEMO_MODE=false
MAX_QUESTIONS=10
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## 📁 Project Structure

```
quiz-builder/
├── backend/
│   ├── controllers/        # Quiz, auth, analytics logic
│   ├── middleware/         # Auth, upload, AI rate limiter
│   ├── models/             # Quiz, Question, Result, User
│   ├── routes/             # API routes
│   ├── services/           # Gemini AI service
│   └── utils/              # File parser (PDF/DOCX/CSV)
└── frontend/
    ├── src/
    │   ├── components/     # Shared UI components
    │   ├── context/        # Auth, Quiz, Toast context
    │   ├── pages/
    │   │   ├── admin/      # Dashboard, QuizList, CreateQuiz, EditQuiz, AIGenerate, Analytics
    │   │   └── student/    # Dashboard, AvailableQuizzes, AttemptQuiz, QuizResult, MyResults, Analytics
    │   ├── routes/         # AppRouter with role-based protection
    │   └── services/       # API service functions
```

---

## 🔌 API Reference

```
POST   /api/auth/register
POST   /api/auth/login

POST   /api/quizzes                  Admin: create quiz
GET    /api/quizzes/admin            Admin: get my quizzes
PUT    /api/quizzes/:id              Admin: update quiz
DELETE /api/quizzes/:id              Admin: delete quiz
POST   /api/quizzes/ai-generate      Admin: AI generate from file

GET    /api/quizzes                  Student: published quizzes
GET    /api/quizzes/:id              Shared: quiz detail
POST   /api/quizzes/:id/submit       Student: submit answers
GET    /api/quizzes/history          Student: attempt history

GET    /api/results/:id              Shared: result detail
GET    /api/analytics/admin          Admin: analytics
GET    /api/analytics/student        Student: personal analytics

POST   /api/ai/explain               Shared: AI explanation (cached)
```

---

## 🤖 AI Rate Limiting

To stay within the free tier, the backend enforces its own limits before hitting the API:

| Feature | Model | API Limit | App Limit |
|---|---|---|---|
| Quiz Generation | Gemini 2.5 Flash | 20 RPD · 5 RPM | 15 RPD · 4 RPM |
| AI Explanations | Gemma 3 1B | 14,400 RPD · 30 RPM | 12,000 RPD · 28 RPM |

Explanations are **cached per question in MongoDB** — the same question never triggers a second API call regardless of how many students view it.

---

## 🔒 Auth & Roles

- JWT stored in `localStorage`, sent as `Bearer` token
- Two roles: `admin` and `student`
- Route-level protection on both frontend (React Router) and backend (Express middleware)
- Students can only see published quizzes and their own results

---

## 🧠 AI Features

### Quiz Generation
Upload a PDF, DOCX, or paste text → Gemini reads it and generates structured MCQ questions with difficulty ratings, which are pre-filled into the quiz editor for review before saving.

### AI Explanations
After submitting a quiz, students can click **"Show AI Explanation"** on any question. Gemma 3 1B generates a 2–3 sentence tutor-style explanation. The result is saved to the question document so every subsequent student gets it instantly from the database.

---

## 📄 License

MIT — free to use, modify and distribute.

---

<p align="center">Built with too much caffeine and way too many console.log()s</p>
