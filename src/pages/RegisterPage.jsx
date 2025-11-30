import { useState } from "react";
import Button from "../components/Button.jsx";
import { register as registerRequest } from "../api/auth.js";

function AuthField({
  label,
  type = "text",
  placeholder,
  autoComplete,
  className = "",
  ...inputProps
}) {
  return (
    <label
      className={`grid gap-2 text-sm font-medium text-slate-900 ${className}`}
    >
      <span>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        {...inputProps}
      />
    </label>
  );
}

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      await registerRequest({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setFeedback({
        type: "success",
        message: "Account created. Redirecting to login...",
      });

      setTimeout(() => {
        window.location.assign("/login");
      }, 700);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message || "Unable to register. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">
          Join the community
        </h2>
        <p className="text-base text-slate-500">
          Join KFUPM Clubs Hub to discover events and connect with peers.
        </p>
      </header>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <AuthField
            label="Full name"
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <AuthField
            label="KFUPM email"
            type="email"
            placeholder="you@student.kfupm.edu.sa"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <AuthField
            label="Password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="flex items-start gap-2 text-xs text-slate-500">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/60 focus:ring-offset-0"
          />
          <span>I agree to the platform terms and privacy policy.</span>
        </div>

        <Button
          type="submit"
          className="w-full justify-center text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      {feedback && (
        <p
          className={`text-sm ${
            feedback.type === "error" ? "text-red-600" : "text-green-600"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback.message}
        </p>
      )}

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => window.location.assign("/login")}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Login instead
        </button>
      </p>
    </div>
  );
}

export default RegisterPage;
