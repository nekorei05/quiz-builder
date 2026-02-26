import { useMemo } from "react";
import {computeAdaptiveDifficulty,getNextQuestionIndex,} from "@/utils/adaptive";


export function useAdaptiveDifficulty(allQuestions = [], answers = {}) {
  const adaptiveState = useMemo(() => {
    return computeAdaptiveDifficulty(allQuestions, answers);
  }, [allQuestions, answers]);

  const nextQuestionIndex = useMemo(() => {
    return getNextQuestionIndex(
      allQuestions,
      answers,
      adaptiveState.currentDifficulty
    );
  }, [allQuestions, answers, adaptiveState.currentDifficulty]);

  return {
    currentDifficulty: adaptiveState.currentDifficulty,
    streakCorrect: adaptiveState.streakCorrect,
    streakWrong: adaptiveState.streakWrong,
    nextQuestionIndex,
  };
}