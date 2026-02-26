import {
  mockAnalyticsData,
  mockStudentPerformance,
  mockAttempts,
} from "./mockData";

export {
  mockAnalyticsData,
  mockStudentPerformance,
};

const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const analyticsService = {

  async getAdminStats() {

    await delay();

    const totalQuizzes = mockAnalyticsData.length;

    const totalStudents = mockStudentPerformance.length;

    let averageScore = 0;

    if (mockAttempts.length > 0) {
      const total = mockAttempts.reduce(
        (sum, attempt) => sum + (attempt.accuracy || 0),
        0
      );

      averageScore = Math.round(total / mockAttempts.length);
    }

    return {
      totalQuizzes,
      totalStudents,
      averageScore,
      performance: mockStudentPerformance,
    };

  },

  async getStudentStats() {

    await delay();

    return {
      attempts: mockAttempts,
      analytics: mockAnalyticsData,
    };

  },

  async getQuizStats(id) {

    await delay();

    const quiz = mockAnalyticsData.find(
      (_, index) => String(index) === String(id)
    );

    return quiz || null;

  },

};