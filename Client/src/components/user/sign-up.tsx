import React, { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/api/user.api";
import { UserSignUpType, UserSignupAction } from "@/types/user.type";
import { validateForm } from "@/utils/validation/formValidation";
import { formSchema } from "@/utils/validation/formSchema";
import { useGoogleLogin } from "@react-oauth/google";
import { decodeToken } from "@/utils/googleAuthToken.util";
import { googleAuth } from "@/api/user.api";
import { setUser } from "@/redux/slices/userSlice";
import { responses } from "@/constants/response.constants";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState({ field: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const reduxDispatch = useDispatch()

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
      const response = await signup({...formData});
      
      if (response.success) {
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("apiType","signup")
        toast.success("Signup successful!");
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

    const googleSignin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const decoded = await decodeToken(tokenResponse.access_token);
        console.log("DECODED >> ? >>>>> : ",decoded)

        const response = await googleAuth({
          email: decoded.email,
          name: decoded.given_name,
          profilePicture: decoded.picture
        });
        console.log("Response ?? : ",response);

        if (response.success) {
          const {accessToken , user} = response.data
          reduxDispatch(
            setUser({
              _id: user._id,
              name: user.name,
              email: response.data.user.email,
              role: user.role,
              accessToken: accessToken,
            })
          );
          setTimeout(() => {
            switch(user.role){
              case "none" : 
              case "client" : 
              navigate("/home")
              break;
              case "freelacer" : 
              navigate("/freelancer-dashboard")
              break;
              default : navigate("/signup")
            }
          },2000)
        } else {
          setError({
            field: "form",
            message: "Google Login Failed. Try again.",
          });
        }
      } catch (err) {
        console.error(err);
        setError({
          field: "form",
          message: "An error occurred while signing in with Google",
        });
      }
    },
  });

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
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                googleSignin();
              }}
              className="w-full border border-gray-300 text-gray-700 bg-white transition duration-300 ease-in-out hover:shadow-lg hover:bg-gray-100 rounded-md px-4 py-2 flex items-center justify-center gap-3 font-medium"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              <span>Login with Google</span>
          </button>
        </form>
        </>
  );
}
