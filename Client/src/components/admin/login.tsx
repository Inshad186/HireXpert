import React, { useState } from "react";
import { login } from "@/api/admin.api";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "@/types/user.type";
import { emailRegex } from "@/utils/validation/regex.util";
import toast from 'react-hot-toast';

function AdminLoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<ErrorState>({});

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if(name === "email"){
      if(value.trim() === "" || !emailRegex.test(value.trim())){
        setError({field: "email", message: "Enter a valid email"})
      }else{
        setError({})
      }
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await login(formData.email, formData.password);
    console.log("Admin Side Response >>>>>> : ", response);

    if (response.success) {
      const userRole = response.data?.admin?.role;

      if (userRole === "admin") {
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Access denied. Not an admin");
        setError({ field: "form", message: "Access denied. Not an admin." });
      }
    } else {
      toast.error(response.error || "Login failed"); 
      setError({ field: "form", message: response.error || "Login failed" });
    }
  } catch (error) {
    console.log(error);
    toast.error("Server error occurred."); 
    setError({ field: "form", message: "Invalid email" });
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="border rounded-xl p-8 w-full max-w-md shadow-xl bg-white">
        <h1 className="text-center font-bold text-3xl mb-6">Admin Login</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border"
            />
            {error.field === "email" && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-blue-900 text-white font-semibold py-2 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginForm;
