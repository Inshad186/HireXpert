
interface SocialLoginProps {
  onGoogleLogin: () => void;
  label?: string;
  disabled?: boolean;
}

export function SocialLogin({
  onGoogleLogin,
  label = "Continue with Google",
  disabled = false,
}: SocialLoginProps) {
  return (
    <button
      type="button"
      onClick={onGoogleLogin}
      disabled={disabled}
      className="w-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:shadow-md disabled:opacity-60 rounded-md px-4 py-2 flex items-center justify-center gap-3 font-medium transition"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt=""
        className="w-5 h-5"
      />

      <span>{label}</span>
    </button>
  );
}
