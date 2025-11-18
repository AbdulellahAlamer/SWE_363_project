import { useState } from "react";
import Button from "../components/Button.jsx";

function Field({
  label,
  type = "text",
  placeholder,
  autoComplete,
  value,
  onChange,
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-900">
      <span>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-normal text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
      />
    </label>
  );
}

function ResetPassword() {
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get("user_id") || 12345;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (!userId) {
      setFeedback({
        type: "error",
        message: "Missing user id. Please use the reset link from your email.",
      });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({
        type: "error",
        message: "Password must be at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,

          newPassword,
        }),
      });
      console.log(response);

      //   if (!response.ok) {
      //     throw new Error("Request failed");
      //   }

      setFeedback({
        type: "success",
        message: "Password updated successfully. You can now log in.",
      });
    } catch (e) {
      setFeedback({
        type: "error",
        message: "Failed to reset password. Please try again." + e?.message,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md w-full mx-auto px-4 py-24 sm:px-6 sm:py-20">
      <header className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Reset password
        </h2>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          set a new password to regain access.
          {userId
            ? ""
            : " (User id missing from link. Please use the link from your email.)"}
        </p>
      </header>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Field
          label="New password"
          type="password"
          placeholder="Create a new password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <Field
          label="Confirm password"
          type="password"
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <Button type="submit" className="w-full justify-center text-base">
          Reset password
        </Button>
      </form>

      {feedback && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback.message}
        </div>
      )}

      <p className="text-center text-sm text-slate-500">
        Remembered your password?{" "}
        <button
          type="button"
          onClick={() => window.location.assign("/login")}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Back to login
        </button>
      </p>
    </div>
  );
}

export default ResetPassword;
