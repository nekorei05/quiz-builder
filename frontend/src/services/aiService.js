export async function generateQuestions(data) {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    questions: [
      {
        id: Date.now().toString(),
        text: `Sample AI question for ${data?.topic || "topic"}`,
        options: [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        correctAnswer: 0,
      },
    ],
  };
}


export async function explainAnswer(data) {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    explanation:
      `This is a mock explanation for question "${data?.question}".`,
  };
}