
import { SignupForm } from "@/components/user/auth/signUp";
import { AuthLayout } from "@/components/user/auth/common/authLayout";

function SignUp() {
  return (
    <AuthLayout
      title="Create an account"
      imagePosition="right"
    >
      <SignupForm />
    </AuthLayout>
  );
}

export default SignUp;
