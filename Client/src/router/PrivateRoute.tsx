// src/routes/PrivateRoute.tsx
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  return user?.accessToken ? <>{children}</> : <Navigate to="/login" />;
};
