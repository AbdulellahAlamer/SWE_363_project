import { useState } from "react";
import Button from "../components/Button.jsx";
import PopupForm from "../components/PopupForm.jsx";
import {
  login as loginRequest,
  persistSession,
  roleRoutes,
} from "../api/auth.js";

function AuthField({
  label,
  type = "text",
  placeholder,
  autoComplete,
  ...inputProps
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-900">
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

const forgotFields = [
  {
    name: "email",
    label: "KFUPM email",
    dataType: "email",
    placeholder: "you@student.kfupm.edu.sa",
  },
];

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await loginRequest({
        email: normalizedEmail,
        password,
      });

      const token = response?.data?.token;
      const user = response?.data?.user;

      persistSession({ token, user });

      const destination = roleRoutes[user?.role] || "/clubs";
      window.location.assign(destination);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message || "Unable to login. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-base text-slate-500">
          Sign in to manage your club activities.
        </p>
      </header>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <AuthField
          label="Email"
          type="email"
          placeholder="you@student.kfupm.edu.sa"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <AuthField
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="flex items-center justify-between text-sm text-slate-500">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/60 focus:ring-offset-0"
            />
            Remember me
          </label>
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-700"
            onClick={() => setShowForgotModal(true)}
          >
            Forgot password?
          </button>
        </div>

        <div className="">
          <Button
            type="submit"
            className="w-full justify-center text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </div>
      </form>

      {feedback && (
        <p className="text-sm text-red-600" role="status" aria-live="polite">
          {feedback.message}
        </p>
      )}

      <p className="text-center text-sm text-slate-500">
        Need an account?{" "}
        <button
          type="button"
          onClick={() => window.location.assign("/register")}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Create one now
        </button>
      </p>
      {showForgotModal && (
        <PopupForm
          method="POST"
          endpoint="/api/auth/forgot-password"
          fields={forgotFields}
          submitLabel="Reset password"
          onClose={() => setShowForgotModal(false)}
        />
      )}
    </div>
  );
}

export default LoginPage;
