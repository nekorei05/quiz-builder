const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

export function computeAdaptiveDifficulty(allQuestions, answers) {
  if (!allQuestions?.length || !answers) {
    return {
      currentDifficulty: "easy",
      streakCorrect: 0,
      streakWrong: 0,
    };
  }

  const questionMap = Object.fromEntries(
    allQuestions.map(q => [q.id, q])
  );

  const answeredIds = Object.keys(answers);

  if (answeredIds.length === 0) {
    return {
      currentDifficulty: "easy",
      streakCorrect: 0,
      streakWrong: 0,
    };
  }

  let correctStreak = 0;
  let wrongStreak = 0;

  for (let i = answeredIds.length - 1; i >= 0; i--) {
    const id = answeredIds[i];
    const question = questionMap[id];

    if (!question) continue;

    if (answers[id] === question.correctAnswer) {
      if (wrongStreak > 0) break;
      correctStreak++;
    } else {
      if (correctStreak > 0) break;
      wrongStreak++;
    }
  }

  const totalCorrect = answeredIds.filter(id => {
    const q = questionMap[id];
    return q && answers[id] === q.correctAnswer;
  }).length;

  const accuracy = totalCorrect / answeredIds.length;

  let currentDifficulty = "medium";

  if (accuracy >= 0.8 || correctStreak >= 3)
    currentDifficulty = "hard";
  else if (accuracy <= 0.4 || wrongStreak >= 2)
    currentDifficulty = "easy";

  return {
    currentDifficulty,
    streakCorrect: correctStreak,
    streakWrong: wrongStreak,
  };
}

export function getNextQuestionIndex(
  allQuestions,
  answers,
  currentDifficulty
) {
  if (!allQuestions?.length) return null;

  const answered = new Set(Object.keys(answers));

  const unanswered = allQuestions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => !answered.has(q.id));

  if (!unanswered.length) return null;

  const match = unanswered.find(
    ({ q }) => q.difficulty === currentDifficulty
  );

  if (match) return match.i;

  const idx = DIFFICULTY_ORDER.indexOf(currentDifficulty);

  const adjacentDifficulty =
    idx > 0
      ? DIFFICULTY_ORDER[idx - 1]
      : DIFFICULTY_ORDER[idx + 1];

  const adjacent = unanswered.find(
    ({ q }) => q.difficulty === adjacentDifficulty
  );

  if (adjacent) return adjacent.i;

  return unanswered[0].i;
}