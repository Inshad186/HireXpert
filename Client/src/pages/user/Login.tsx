import { LoginForm } from "@/components/user/login";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
