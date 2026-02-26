import { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { generateQuestions } from "@/services/aiService";
import { useToast } from "@/hooks/useToast";

export default function QuizQuestions({ onAddQuestions }) {
  const { success, error } = useToast();

  const [material, setMaterial] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState([]);

  const handleMaterialChange = (e) => {
    setMaterial(e.target.value);
  };

  const handleNumQuestionsChange = (e) => {
    const value = Number(e.target.value);
    if (Number.isNaN(value)) return;
    setNumQuestions(Math.min(20, Math.max(1, value)));
  };

  const handleGenerate = async () => {
    if (!material.trim()) {
      error("Paste some material first");
      return;
    }

    setLoading(true);

    try {
      const result = await generateQuestions({
        topic: material,
        count: numQuestions,
      });

      const questions = result?.questions || [];
      setGenerated(questions);
      success(`${questions.length} questions generated`);
    } catch {
      error("Generation failed — please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToQuiz = () => {
    if (generated.length === 0) return;

    if (onAddQuestions) {
      onAddQuestions(generated);
    }

    success(`${generated.length} questions added to quiz`);
    setGenerated([]);
    setMaterial("");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          AI Question Generator
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate questions from source material
        </p>
      </div>

      <div
        className="bg-card rounded-2xl p-6 space-y-4 mb-6"
        style={{
          border: "1px solid hsl(var(--border))",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <textarea
          value={material}
          onChange={handleMaterialChange}
          rows={6}
          placeholder="Paste your learning material here..."
          className="w-full rounded-xl px-3 py-2.5 text-sm text-foreground bg-background placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
          style={{ border: "1px solid hsl(var(--border))" }}
        />

        <div className="flex items-center gap-3">
          <input
            type="number"
            value={numQuestions}
            min={1}
            max={20}
            onChange={handleNumQuestionsChange}
            className="w-24 h-10 rounded-xl px-3 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ border: "1px solid hsl(var(--border))" }}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {generated.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Generated Questions
          </h2>

          {generated.map((q, index) => (
            <div
              key={q.id || index}
              className="bg-card rounded-2xl p-5"
              style={{ border: "1px solid hsl(var(--border))" }}
            >
              <p className="font-medium text-foreground mb-3">
                {index + 1}. {q.text}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {q.options.map((option, optionIndex) => {
                  const isCorrect = optionIndex === q.correctAnswer;

                  return (
                    <div
                      key={optionIndex}
                      className={`text-xs px-3 py-2 rounded-lg ${
                        isCorrect
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={handleAddToQuiz}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition"
          >
            <Check className="w-4 h-4" />
            Add to Quiz
          </button>
        </div>
      )}
    </div>
  );
}