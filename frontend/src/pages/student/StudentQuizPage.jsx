import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AttemptQuiz from "./AttemptQuiz";

export default function StudentQuizPage() {
  const { quizId } = useParams();
  const [fullQuiz, setFullQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/quizzes/${quizId}`,
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      const data = await res.json();
      setFullQuiz(data);
    };

    fetchQuiz();
  }, [quizId]);

  if (!fullQuiz) return <p>Loading quiz...</p>;

  return <AttemptQuiz fullQuiz={fullQuiz} />;
}