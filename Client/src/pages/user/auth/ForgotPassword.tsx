
import ForgotPasswordForm from "@/components/user/auth/forgotPassword";
import { AuthLayout } from "@/components/user/auth/common/authLayout";

function ForgotPassword() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

export default ForgotPassword;
