import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { emailRegex } from "@/utils/validation/regex.util";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { ErrorState } from "@/types/user.type";


export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError({});
    setLoading(true);

      if (formData.email.trim() === "" || !emailRegex.test(formData.email.trim())) {
        setError({ field: "email", message: "Enter a valid email" });
      } else {
        setError({});
      }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);

      if (response.status === 200) {
        dispatch(setUser({
          token : response.data.accessToken,
        }));

        setTimeout(() => {
          navigate("/");
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
        setError({ field: "form", message: response.data.error });
      }
    } catch (error) {
      console.log(error);
      setError({ field: "form", message: "Invalid email" });
      setLoading(false);
    }
  };

  return (
    <>
        <h1 className="text-center font-bold text-3xl text-black mb-6">HireXpert</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md"
            />
            {error.field === "email" && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div >
          <p className="text-blue-800 cursor-pointer" onClick={() => navigate("/forgotPassword")}>forgot Password?</p>
          {error.field === "form" && <p className="text-red-500 text-sm">{error.message}</p>}

          <button
            type="submit"
            className="w-full bg-black hover:bg-blue-900 text-white font-semibold py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center">Don't you have an account ? <a className="underline font-medium cursor-pointer text-blue-800" onClick={() => navigate("/signup")}>Signup</a></p>
        </form>
    </>
  );
}

