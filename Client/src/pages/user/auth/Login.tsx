
import { LoginForm } from "@/components/user/auth/login";
import { AuthLayout } from "@/components/user/auth/common/authLayout";

function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Please enter your details to log in."
      imagePosition="left"
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;
