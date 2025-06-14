import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { emailRegex } from "@/utils/validation/regex.util";
import { useGoogleLogin } from "@react-oauth/google";
import { decodeToken } from "@/utils/googleAuthToken.util";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { ErrorState } from "@/types/user.type";
import { login, googleAuth } from "@/api/user.api";
import { userRoutes } from "@/constants/routeUrl";
import toast from "react-hot-toast";

export function LoginForm({className, ...prop }: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if(name === "email"){
      if(value.trim() === "" || !emailRegex.test(value.trim())){
        setError({field :"email", message :"Enter a valid email"})
      }else{
        setError({})
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError({});
    setLoading(true);

    try {
      const response = await login(formData);
      const userRole = response.data?.user?.role
      if (response.success) {
        toast.success("Login successfully")
        dispatch(
          setUser({
            _id: response.data.user._id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
            accessToken: response.data.accessToken,
            createdAt: response.data.user.createdAt,
            updatedAt: response.data.user.updatedAt,
            profilePicture: response.data.user.profilePicture,
          })
        );

        console.log("RESPONSE >>>>>>>> : ", response.data);
        setTimeout(() => {
          switch (userRole) {
            case "none":
            case "client":
              navigate(userRoutes.HOME);
              break;            
            case "freelancer":
              navigate(userRoutes.FREELANCER_DASH);
              break;
            default:
              navigate(userRoutes.LOGIN);
          }
        }, 1500);
      } else {
        setLoading(false);
        toast.error("Something went wrong")
        setError({ field: "form", message: response.data.error });
      }
    } catch (error) {
      console.log(error);
      setError({ field: "form", message: "Invalid email" });
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
          dispatch(
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
              navigate(userRoutes.HOME)
              break;
              case "freelacer" : 
              navigate(userRoutes.FREELANCER_DASH)
              break;
              default : navigate(userRoutes.SIGNUP)
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
      <h1 className="text-center font-bold text-3xl text-black mb-6">
        HireXpert
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md"
          />
          {error.field === "email" && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <p
          className="text-blue-800 cursor-pointer"
          onClick={() => navigate(userRoutes.FORGOT_PASSWORD)}
        >
          forgot Password?
        </p>
        {error.field === "form" && (
          <p className="text-red-500 text-sm">{error.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-black hover:bg-blue-900 text-white font-semibold py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center">
          Don't you have an account ?{" "}
          <a
            className="underline font-medium cursor-pointer text-blue-800"
            onClick={() => navigate(userRoutes.SIGNUP)}
          >
            Signup
          </a>
        </p>
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
