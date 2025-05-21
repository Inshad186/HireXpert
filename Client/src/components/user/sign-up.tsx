import React, { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserSignUpType, UserSignupAction } from "@/types/user.type";
import { validateForm } from "@/utils/validation/formValidation";
import { formSchema } from "@/utils/validation/formSchema";
import { responses } from "@/constants/response.constants";

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState({ field: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialState: UserSignUpType = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const reducer = (state: UserSignUpType, action: UserSignupAction) => {
    switch (action.type) {
      case "SET_NAME":
        return { ...state, name: action.payload };
      case "SET_EMAIL":
        return { ...state, email: action.payload };
      case "SET_PASSWORD":
        return { ...state, password: action.payload };
      case "SET_CONFIRM_PASSWORD":
        return { ...state, confirmPassword: action.payload };
      default:
        return state;
    }
  };

  const [formData, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form DATA : ",{...formData})
    const signup = async (userData: UserSignUpType) => {
      try {
        const { data } = await axios.post("http://localhost:5000/api/auth/signup", {
          name: userData.name,
          email: userData.email,
          password: userData.password,
        });

        console.log("EMAIL DATA  >>>>>>> : ",data)
        return { success: true, data };
      } catch (error: any) {
        const message = error.response?.data?.error || responses.SOMETHING_WRONG;
        return { success: false, error: message };
      }
    };

    const validationError = validateForm(
      formSchema,
      formData as unknown as Record<string, string>
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError({ field: "confirmPassword", message: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      const response = await signup(formData);
      
      if (response.success) {
        localStorage.setItem("email", response.data.email);
        alert("Signup successful!");
        navigate("/otp");
      } else {
        alert(response.error || "User already exists, try another email");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <h1 className="text-center font-bold text-3xl text-black mb-6">HireXpert</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                dispatch({ type: "SET_NAME", payload: e.target.value })
              }
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-md "
            />
            {error.field === "name" && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                dispatch({ type: "SET_EMAIL", payload: e.target.value })
              }
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md "
            />
            {error.field === "email" && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                dispatch({ type: "SET_PASSWORD", payload: e.target.value })
              }
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md "
            />
            {error.field === "password" && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                dispatch({ type: "SET_CONFIRM_PASSWORD", payload: e.target.value })
              }
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border rounded-md"
            />
            {error.field === "confirmPassword" && (
              <p className="text-red-500 text-sm">{error.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded-md transition-colors"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <p className="text-center">You already have an accout ? <a className="underline cursor-pointer text-blue-800" onClick={() => navigate("/login")}>Login</a></p>
        </form>
        </>
  );
}
