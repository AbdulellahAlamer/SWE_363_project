import { useState } from "react";
import Button from "../components/Button.jsx";

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

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(null);

  const USERS = [
    { email: "admin@gmail.com", password: "12345678" },

    { email: "clubPresident@gmail.com", password: "12345678" },

    { email: "student@gmail.com", password: "12345678" },
  ];

  const routeByEmail = {
    "admin@gmail.com": "/admin",
    "clubPresident@gmail.com": "/president",
    "student@gmail.com": "/clubs",
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback(null);

    const normalizedEmail = email.trim().toLowerCase();
    const account = USERS.find(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail
    );

    if (account && account.password === password) {
      const destination = routeByEmail[account.email];
      if (destination) {
        window.location.assign(destination);
        return;
      }
    }

    setFeedback({
      type: "error",
      message: "Invalid email or password. Try again.",
    });
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <AuthField
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
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
          >
            Forgot password?
          </button>
        </div>

        <div className="">
          <Button type="submit" className="w-full justify-center text-lg">
            Login
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
    </div>
  );
}

export default LoginPage;
