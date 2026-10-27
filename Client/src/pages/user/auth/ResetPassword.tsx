
import ResetPasswordForm from "@/components/user/auth/resetPassword";
import { AuthLayout } from "@/components/user/auth/common/authLayout";

function ResetPassword() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}

export default ResetPassword;
