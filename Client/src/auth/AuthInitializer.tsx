import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAccessToken, logout } from "@/redux/slices/authSlice";
import Api from "@/services/axios";
import { endpointUrl } from "@/constants/endpointUrl";
import { removeUser } from "@/redux/slices/userSlice";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user._id);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (userId) {
          const response = await Api.post(
            endpointUrl.REFRESH_TOKEN,
            {},
            { withCredentials: true }
          );

          const newToken = response.data?.accessToken;

          if (newToken) {
            dispatch(setAccessToken(newToken));
          } else {
            throw new Error("No token");
          }
        }
      } catch (error) {
        dispatch(logout());
        dispatch(removeUser());
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch, userId]);

  if (loading) return null; // or loader

  return <>{children}</>;
};

export default AuthInitializer;