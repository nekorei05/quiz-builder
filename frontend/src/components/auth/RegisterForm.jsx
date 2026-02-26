import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RoleSelector from "./RoleSelector";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRoleChange(value) {
    setForm((prev) => ({
      ...prev,
      role: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await register(form);
      const redirectPath = user.role === "admin" ? "/admin" : "/student";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-3xl font-bold text-foreground mb-1">
        Create account
      </h2>

      <p className="text-muted-foreground mb-8">
        Get started with QuizBuilder
      </p>

      {error && (
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            autoComplete="name"
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-foreground bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            autoComplete="email"
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-foreground bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="new-password"
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-foreground bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <RoleSelector
          role={form.role}
          setRole={handleRoleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}