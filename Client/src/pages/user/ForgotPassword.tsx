import { forgetPassword } from '@/api/user.api';
import { emailRegex } from '@/utils/validation/regex.util';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ field: "", message: "" });

  const navigate = useNavigate()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value
    setEmail(email);

    if(email.trim() == "" || !emailRegex.test(email.trim())){
      setError({field : "email", message : "Enter a valid Email"})
    }else{
      setError({field : "", message : ""})
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!email) {
      setError({ field: "email", message: "Email is required" });
      return;
    }
    try {
      const response = await forgetPassword(email);
      console.log("Forget Password Response > ", response);

      if(response?.success){
        localStorage.setItem("email",email)
        localStorage.setItem("apiType","forgot-Password")
        navigate("/otp")
      }
    } catch (err : any) {
      console.error(err);
      setError({
        field: "email",
        message: err?.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-center font-bold text-3xl text-black mb-6">Forgot Password</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md"
            />
            {error.field === "email" && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition-colors">
            Send code
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
