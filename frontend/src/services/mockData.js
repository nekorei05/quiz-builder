export const mockQuizzes = [
  {
    id: "1",
    title: "JavaScript Basics",
    description: "Test your JS fundamentals",
    difficulty: "easy",
    questions: 10,
    timeLimit: 10,
  },
  {
    id: "2",
    title: "React Fundamentals",
    description: "React core concepts quiz",
    difficulty: "medium",
    questions: 15,
    timeLimit: 15,
  },
];

export const mockAttempts = [
  {
    id: "1",
    quizId: "1",
    score: 80,
    date: "2026-01-10",
  },
];

export const mockAnalyticsData = {
  totalQuizzes: 12,
  totalStudents: 45,
  averageScore: 76,
};

export const mockStudentPerformance = [
  { name: "Student A", score: 80 },
  { name: "Student B", score: 65 },
];