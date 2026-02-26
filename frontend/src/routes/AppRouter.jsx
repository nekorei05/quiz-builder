import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

import AdminLayout from "@/components/layout/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import QuizList from "@/pages/admin/QuizList";
import CreateQuiz from "@/pages/admin/CreateQuiz";
import EditQuiz from "@/pages/admin/EditQuiz";
import AIGenerate from "@/pages/admin/AIGenerate";
import Analytics from "@/pages/admin/Analytics";

import StudentLayout from "@/components/layout/StudentLayout";
import StudentDashboard from "@/pages/student/Dashboard";
import AvailableQuizzes from "@/pages/student/AvailableQuizzes";
import AttemptQuiz from "@/pages/student/AttemptQuiz";
import QuizResult from "@/pages/student/QuizResult";
import History from "@/pages/student/History";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreateQuiz />} />
          <Route path="quizzes" element={<QuizList />} />
          <Route path="quizzes/create" element={<CreateQuiz />} />
          <Route path="quizzes/edit/:quizId" element={<EditQuiz />} />
          <Route path="ai" element={<AIGenerate />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="quizzes" element={<AvailableQuizzes />} />
          <Route path="quizzes/:quizId" element={<AttemptQuiz />} />
          <Route path="results" element={<QuizResult />} />
          <Route path="results/:attemptId" element={<QuizResult />} />
          <Route path="analytics" element={<History />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
