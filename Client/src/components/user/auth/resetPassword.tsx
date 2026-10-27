
import { resetPassword } from "@/api/user.api";
import { AuthInput } from "@/components/user/auth/common/authInput";
import { AuthButton } from "@/components/user/auth/common/authButton";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const email = localStorage.getItem("email");

    if (!email) {
      setError("Session expired. Please try again.");
      navigate("/forget-password");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword(email, password);

      if (response.success) {
        localStorage.removeItem("email");
        localStorage.removeItem("apiType");
        navigate("/login", { replace: true });
      } else {
        setError("Failed to reset password.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthInput
        label="New Password"
        name="password"
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />

      <AuthInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
      />

      {error && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}

      <AuthButton
        loading={loading}
        loadingText="Resetting..."
        className="bg-black hover:bg-gray-700"
      >
        Reset Password
      </AuthButton>
    </form>
  );
}

export default ResetPasswordForm;
