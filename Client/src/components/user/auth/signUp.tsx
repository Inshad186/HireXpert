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
import { AuthLayout } from "./common/authLayout";
import { AuthInput } from "./common/authInput";
import { AuthButton } from "./common/authButton";
import { AuthDivider } from "./common/authDivider";
import { SocialLogin } from "./common/socialLogin";

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
      case "SET_NAME": return { ...state, name: action.payload };
      case "SET_EMAIL": return { ...state, email: action.payload };
      case "SET_PASSWORD": return { ...state, password: action.payload };
      case "SET_CONFIRM_PASSWORD": return { ...state, confirmPassword: action.payload };
      default: return state;
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
              // accessToken: accessToken,
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
    <div>
        <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput
          label="Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={(e) =>
            dispatch({ type: "SET_NAME", payload: e.target.value })
          }
          placeholder="Enter your name"
          error={error.field === "name" ? error.message : undefined}
        />

        <AuthInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            dispatch({ type: "SET_EMAIL", payload: e.target.value })
          }
          placeholder="Enter your email"
          error={error.field === "email" ? error.message : undefined}
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            dispatch({ type: "SET_PASSWORD", payload: e.target.value })
          }
          placeholder="Enter your password"
          error={error.field === "password" ? error.message : undefined}
        />

        <AuthInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            dispatch({
              type: "SET_CONFIRM_PASSWORD",
              payload: e.target.value,
            })
          }
          placeholder="Confirm your password"
          error={ error.field === "confirmPassword" ? error.message : undefined }
        />

        <AuthButton loading={loading} loadingText="Signing up...">
          Sign Up
        </AuthButton>
          <p className="text-center">You already have an accout?{" "}
            <a 
            className="underline font-medium cursor-pointer text-indigo-800" 
            onClick={() => navigate("/login")}
            >
              Login
            </a>
          </p>

          <AuthDivider/>

          <SocialLogin
            onGoogleLogin={() => googleSignin()}
            label="Sign up with Google"
          />
        </form>
      </div>
  );
}
