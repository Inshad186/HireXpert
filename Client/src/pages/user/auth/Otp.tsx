
import InputOTPDemo from "@/components/user/auth/otp";
import { AuthLayout } from "@/components/user/auth/common/authLayout";

function Otp() {
  return (
    <AuthLayout
      title="Enter Verification code"
      subtitle="Enter the verification code sent to your email."
    >
      <InputOTPDemo />
    </AuthLayout>
  );
}

export default Otp;
