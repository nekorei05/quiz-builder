const QuizNav = ({
  questions = [],
  answers = {},
  current = 0,
  onNavigate,
}) => {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {questions.map((question, index) => {
        const currentQuestion = index === current;
        const answered = answers[question.id] !== undefined;

        let buttonClass =
          "w-8 h-8 rounded-lg text-xs font-medium transition-colors";

        if (currentQuestion) {
          buttonClass += " bg-primary text-primary-foreground";
        } else if (answered) {
          buttonClass +=
            " bg-primary/20 text-primary border border-primary/40";
        } else {
          buttonClass +=
            " bg-muted text-muted-foreground hover:bg-muted/80";
        }

        const handleClick = () => {
          if (onNavigate) {
            onNavigate(index);
          }
        };

        return (
          <button
            key={question.id || index}
            type="button"
            onClick={handleClick}
            className={buttonClass}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
};

export default QuizNav;