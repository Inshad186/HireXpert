
import type { InputHTMLAttributes } from "react";

interface AuthInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthInput({ label, error, id, className = "", ...props }: AuthInputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        {...props}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-red-500 text-sm"
        >
          {error}
        </p>
      )}
    </div>
  );
}
