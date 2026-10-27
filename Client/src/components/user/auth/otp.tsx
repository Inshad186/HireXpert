
import { useState, useEffect } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { resendOtp, verifyOtp } from "@/api/user.api";

export function InputOTPDemo() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const email = localStorage.getItem("email");
    const apiType = localStorage.getItem("apiType");

    if (!email || !apiType) {
      navigate("/signup");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await verifyOtp(email, otp, apiType);

      if (response?.success) {
        navigate(
          apiType === "signup" ? "/login" : "/resetPassword"
        );
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      setError("Session expired. Please try again.");
      navigate("/signup");
      return;
    }

    try {
      setResending(true);
      setError("");

      const response = await resendOtp(email);

      if (!response.success) {
        setError(response.error || "Failed to resend OTP.");
        return;
      }

      setOtp("");
      setTimeLeft(60);
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => {
            if (/^\d*$/.test(value)) {
              setOtp(value);
            }
          }}
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }, (_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <p className="text-center text-red-500 text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="text-center">
        <div className="text-3xl font-bold">
          {formatTime(timeLeft)}
        </div>
        <p className="text-sm text-gray-500">
          seconds remaining
        </p>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600"
          disabled={otp.length !== 6 || loading || resending}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-indigo-800 text-white hover:bg-indigo-900 hover:text-white"
          onClick={handleResendOTP}
          disabled={timeLeft > 0 || resending || loading}
        >
          {resending ? "Resending..." : "Resend OTP"}
        </Button>
      </div>
    </form>
  );
}
export default InputOTPDemo;