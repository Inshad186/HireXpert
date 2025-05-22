// src/routes/PublicRoute.tsx
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  return user?.accessToken ? <Navigate to="/" /> : <>{children}</>;
};
