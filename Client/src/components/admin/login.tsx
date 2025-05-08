
import React, { useState } from "react";
import { login } from "@/api/admin.api";
import { useNavigate } from "react-router-dom";

function AdminLoginForm({className, ...props}:React.ComponentPropsWithoutRef<"div">) {
    const [formData, setFormData] = useState({ email:"", password:"" })

    const navigate = useNavigate()

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target
        setFormData({ ...formData,[name] : value })
    }

    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault()
        try {
            const response = await login(formData.email, formData.password);

            console.log("Admin Side Response >>>>>> : ",response)
            navigate("/dashboard")
        } catch (error) {
            console.log("not working bro sorrry >>>>>>>>>>>>> ")
        }
    
    }
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
            className="w-full bg-black hover:bg-blue-900 text-white font-semibold py-2 rounded-md">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginForm;
