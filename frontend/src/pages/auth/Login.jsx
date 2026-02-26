import { GraduationCap } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 items-center justify-center px-12 bg-[#141821]">
        <div className="max-w-sm text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            QuizBuilder
          </h1>

          <p className="text-base text-gray-400">
            Create, manage, and attempt quizzes with AI-powered question
            generation, adaptive difficulty, and real-time analytics.
          </p>
        </div>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center px-6 bg-background">
        <LoginForm />
      </div>
    </div>
  );
}