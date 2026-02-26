import { mockQuizzes, mockAttempts } from "./mockData";

export async function getQuizzes() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockQuizzes];
}

export async function getQuizById(id) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockQuizzes.find(q => q.id === id);
}

export async function createQuiz(data) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const newQuiz = {
    ...data,
    id: Date.now().toString(),
  };

  mockQuizzes.push(newQuiz);
  return newQuiz;
}

export async function updateQuiz(id, data) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockQuizzes.findIndex(q => q.id === id);

  if (index !== -1) {
    mockQuizzes[index] = {
      ...mockQuizzes[index],
      ...data,
    };
  }

  return mockQuizzes[index];
}

export async function deleteQuiz(id) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockQuizzes.findIndex(q => q.id === id);

  if (index !== -1) {
    mockQuizzes.splice(index, 1);
  }

  return true;
}

export async function getQuestions(quizId) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const quiz = mockQuizzes.find(q => q.id === quizId);
  return quiz?.questions || [];
}

export async function addQuestion(quizId, question) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const quiz = mockQuizzes.find(q => q.id === quizId);
  if (!quiz) return null;

  const newQuestion = {
    ...question,
    id: Date.now().toString(),
  };

  quiz.questions.push(newQuestion);
  return newQuestion;
}

export async function updateQuestion(quizId, qId, data) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const quiz = mockQuizzes.find(q => q.id === quizId);
  if (!quiz) return null;

  const index = quiz.questions.findIndex(q => q.id === qId);

  if (index !== -1) {
    quiz.questions[index] = {
      ...quiz.questions[index],
      ...data,
    };
  }

  return quiz.questions[index];
}

export async function deleteQuestion(quizId, qId) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const quiz = mockQuizzes.find(q => q.id === quizId);
  if (!quiz) return false;

  const index = quiz.questions.findIndex(q => q.id === qId);

  if (index !== -1) {
    quiz.questions.splice(index, 1);
  }

  return true;
}

export async function getAvailableQuizzes() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockQuizzes];
}

export async function submitQuiz(quizId, answers) {
  await new Promise(resolve => setTimeout(resolve, 500));

  const quiz = mockQuizzes.find(q => q.id === quizId);
  if (!quiz) return null;

  const score = answers.length;

  const result = {
    id: Date.now().toString(),
    quizId,
    score,
    total: quiz.questions.length,
    accuracy: Math.round((score / quiz.questions.length) * 100),
    date: new Date().toISOString(),
  };

  mockAttempts.push(result);
  return result;
}

export async function getQuizResult(quizId) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAttempts.find(a => a.quizId === quizId);
}

export async function getQuizHistory() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockAttempts];
}

export async function downloadQuiz(quizId) {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    message: "Mock download complete",
    quizId,
  };
}

export const quizService = { getQuizzes, getQuizById,createQuiz,updateQuiz, deleteQuiz,getQuestions,addQuestion,updateQuestion,deleteQuestion,getAvailableQuizzes,submitQuiz,getQuizResult,getQuizHistory,downloadQuiz,};