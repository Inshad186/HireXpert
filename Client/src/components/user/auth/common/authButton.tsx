
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface AuthButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function AuthButton({
  loading = false,
  loadingText = "Please wait...",
  children,
  disabled,
  className = "",
  type = "submit",
  ...props
}: AuthButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      className={`w-full bg-indigo-600 hover:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition-colors ${className}`}
    >
      {loading ? loadingText : children}
    </button>
  );
}
