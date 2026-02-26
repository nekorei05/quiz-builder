import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { QuizProvider } from "@/context/QuizContext";
import AppRouter from "@/routes/AppRouter";
import Toast from "@/components/ui/Toast";

function App() {
  return (
    <ToastProvider>

      <AuthProvider>

        <QuizProvider>

          <AppRouter />

          <Toast /> 

        </QuizProvider>

      </AuthProvider>

    </ToastProvider>
  );
}

export default App;