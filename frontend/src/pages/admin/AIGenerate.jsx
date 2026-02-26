import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {Sparkles,Upload,Plus,FolderOpen, X,CheckCircle,Pencil,Save,} from "lucide-react";
import { generateQuestions } from "@/services/aiService";
import { useQuiz } from "@/context/QuizContext";
import { useToast } from "@/hooks/useToast";
import QuestionEditor from "@/components/quiz/QuestionEditor";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function PreviewModal({ questions, quizTitle, timeLimit, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-card rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        style={{
          border: "1px solid hsl(var(--border))",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid hsl(var(--border))" }}
        >
          <div>
            <h2 className="text-lg font-bold text-foreground">Quiz Preview</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {quizTitle} · {questions.length} questions · {timeLimit} min
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {questions.map((q, i) => {
            const difficulty = q.difficulty || "medium";

            const diffStyle =
              difficulty === "easy"
                ? "bg-primary/10 text-primary"
                : difficulty === "hard"
                ? "bg-destructive/10 text-destructive"
                : difficulty === "medium"
                ? "bg-warning/10 text-warning"
                : "bg-muted text-muted-foreground";

            return (
              <div
                key={i}
                className="rounded-xl p-4 space-y-3"
                style={{ border: "1px solid hsl(var(--border))" }}
              >
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-muted-foreground mr-2">
                      Q{i + 1}.
                    </span>
                    {q.text || "No question text"}
                  </p>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${diffStyle}`}
                  >
                    {difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(q.options || []).map((opt, index) => {
                    const correct = q.correctAnswer === index;

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                          correct
                            ? "bg-success/10 text-success font-medium"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {correct ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <span className="w-3 h-3 border border-current rounded-full" />
                        )}
                        {opt || `Option ${index + 1}`}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="flex justify-between px-6 py-4 gap-3"
          style={{ borderTop: "1px solid hsl(var(--border))" }}
        >
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium hover:bg-muted transition"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <Pencil className="w-4 h-4" />
            Edit Further
          </button>

          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition"
          >
            <Save className="w-4 h-4" />
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AIGenerate() {
  const navigate = useNavigate();
  const { createQuiz } = useQuiz();
  const toast = useToast();

  const fileRef = useRef(null);

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const [count, setCount] = useState(5);
  const [time, setTime] = useState(15);
  const [title, setTitle] = useState("AI Generated Quiz");

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [preview, setPreview] = useState(false);
  const [drag, setDrag] = useState(false);

  function readFile(f) {
    if (!f) return;

    if (f.size > MAX_FILE_SIZE) {
      toast.error("File too large");
      return;
    }

    if (!/\.(txt|pdf|doc|docx)$/i.test(f.name)) {
      toast.error("Unsupported file type");
      return;
    }

    setFile(f);

    if (f.type === "application/pdf") {
      setText(`[PDF loaded: ${f.name}]`);
      toast.success("File loaded");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setText(reader.result || "");
      toast.success("File loaded");
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
    };

    reader.readAsText(f);
  }

  function handleGenerate() {
    if (!text.trim()) {
      toast.error("Enter source material");
      return;
    }

    setLoading(true);

    generateQuestions({
      topic: text.slice(0, 200),
      count,
    })
      .then((res) => {
        if (!res?.success) return;
        setQuestions(res.questions);
        toast.success("Questions generated");
      })
      .catch(() => {
        toast.error("Failed to generate");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function updateQuestion(index, field, value) {
    const list = [...questions];
    list[index] = { ...list[index], [field]: value };
    setQuestions(list);
  }

  function updateOption(qIndex, oIndex, value) {
    const list = [...questions];
    const options = [...list[qIndex].options];
    options[oIndex] = value;
    list[qIndex].options = options;
    setQuestions(list);
  }

  function removeQuestion(index) {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  function addQuestion() {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        difficulty: "medium",
      },
    ]);
  }

  function saveQuiz() {
    if (!questions.length) return;

    createQuiz({
      title,
      description: "Generated quiz",
      subject: "General",
      difficulty: "medium",
      timeLimit: time,
      status: "published",
      questions,
    });

    toast.success("Quiz created");
    navigate("/admin/quizzes");
  }

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    readFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          AI Question Generator
        </h1>

        <p className="text-muted-foreground mt-1">
          Paste material or upload text
        </p>
      </div>

      <div
        className="bg-card rounded-2xl p-6 space-y-4"
        style={{
          border: "1px solid hsl(var(--border))",
          boxShadow: "var(--shadow-sm)",
        }}
      >

        <div className="flex justify-between items-center">

          <div className="flex gap-2 items-center text-sm font-medium">
            <Upload className="w-4 h-4" />
            Source Material
          </div>

          <button
            onClick={() => fileRef.current.click()}
            className="flex gap-2 items-center px-3 py-1.5 border rounded-lg text-xs hover:bg-muted"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Browse
          </button>

          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => readFile(e.target.files?.[0])}
          />

        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          rows={7}
          placeholder="Paste material or drop file"
          className="w-full rounded-xl px-3 py-2.5 bg-background text-sm resize-none focus:ring-2 focus:ring-ring"
          style={{
            border: `1px solid ${
              drag ? "hsl(var(--primary))" : "hsl(var(--border))"
            }`,
          }}
        />

        <div className="grid grid-cols-3 gap-3">

          <input
            type="number"
            value={count}
            min={1}
            max={20}
            onChange={(e) =>
              setCount(Math.min(20, Math.max(1, Number(e.target.value))))
            }
            className="h-10 px-3 rounded-xl bg-background"
            style={{ border: "1px solid hsl(var(--border))" }}
          />

          <input
            type="number"
            value={time}
            min={1}
            max={120}
            onChange={(e) =>
              setTime(Math.min(120, Math.max(1, Number(e.target.value))))
            }
            className="h-10 px-3 rounded-xl bg-background"
            style={{ border: "1px solid hsl(var(--border))" }}
          />

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 px-3 rounded-xl bg-background"
            style={{ border: "1px solid hsl(var(--border))" }}
          />

        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? "Generating..." : "Generate Questions"}
        </button>

      </div>

      {questions.length > 0 && (
        <div className="mt-8 space-y-4">

          {questions.map((q, i) => (
            <QuestionEditor
              key={i}
              index={i}
              question={q}
              onUpdate={(f, v) => updateQuestion(i, f, v)}
              onUpdateOption={(o, v) => updateOption(i, o, v)}
              onRemove={() => removeQuestion(i)}
              canRemove={questions.length > 1}
            />
          ))}

          <div className="flex justify-between">

            <button
              onClick={addQuestion}
              className="flex gap-2 px-4 py-2.5 border rounded-xl hover:bg-muted"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>

            <button
              onClick={saveQuiz}
              className="flex gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90"
            >
              <Save className="w-4 h-4" />
              Create Quiz
            </button>

          </div>

        </div>
      )}

      {preview && (
        <PreviewModal
          questions={questions}
          quizTitle={title}
          timeLimit={time}
          onClose={() => setPreview(false)}
          onConfirm={saveQuiz}
        />
      )}

    </div>
  );
}