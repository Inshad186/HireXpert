import React, {useState} from 'react'

function ForgotPassword() {
  const [error, setError] = useState({ field: "", message: "" });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-center font-bold text-3xl text-black mb-6">Forgot Password</h1>

        <form className="space-y-4" >
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md"
            />
            {error.field === "name" && <p className="text-red-500 text-sm">{error.message}</p>}
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

export default ForgotPassword
