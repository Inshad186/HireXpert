import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface RoleBasedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

export const RoleBasedRoute = ({ allowedRoles, children }: RoleBasedRouteProps) => {
  const user = useSelector((state: RootState) => state.user);

  if (!sessionStorage.getItem("accessToken")) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role as string)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
