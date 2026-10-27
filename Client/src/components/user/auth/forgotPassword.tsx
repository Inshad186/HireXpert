
import { forgetPassword } from "@/api/user.api";
import { emailRegex } from "@/utils/validation/regex.util";
import { AuthInput } from "@/components/user/auth/common/authInput";
import { AuthButton } from "@/components/user/auth/common/authButton";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    field: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError({
        field: "email",
        message: "Email is required",
      });
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError({
        field: "email",
        message: "Enter a valid email",
      });
      return;
    }

    setError({ field: "", message: "" });

    try {
      setLoading(true);

      const response = await forgetPassword(trimmedEmail);

      if (!response.success) {
        toast.error("Unable to send reset link");
        return;
      }

      toast.success("Reset link sent! Please check your email.");

      localStorage.setItem("email", trimmedEmail);
      localStorage.setItem("apiType", "forgot-Password");

      navigate("/otp");
    } catch (err: any) {
      console.error(err);

      setError({
        field: "email",
        message:
          err?.response?.data?.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AuthInput
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        error={
          error.field === "email" ? error.message : undefined
        }
      />

      {error.field === "form" && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}

      <AuthButton
        loading={loading}
        loadingText="Sending..."
        className="bg-black hover:bg-gray-800"
      >
        Send Code
      </AuthButton>
    </form>
  );
}

export default ForgotPasswordForm;
