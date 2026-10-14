import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  
  const isAuthenticated = !!user._id && !!accessToken

  return isAuthenticated ? <Navigate to="/home" replace /> : <>{children}</>;
};
