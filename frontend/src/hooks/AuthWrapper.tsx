import type { JSX } from "react";
import { useAuth } from "./useAuth";
import { LoadingModelPage } from "../pages/LoadingModelPage";
import { Navigate } from "react-router-dom";

type AuthWrapperProps = {
  children: JSX.Element;
  requireAuth: boolean;
  redirectTo?: string;
};

export const AuthWrapper = ({ children, requireAuth, redirectTo = "/" }: AuthWrapperProps) => {
  const { isAuthenticated, loading } = useAuth();

  // 🔹 Chargement unique
  if (loading) return <LoadingModelPage />;

  // 🔹 Redirection selon auth
  if (requireAuth && !isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (!requireAuth && isAuthenticated) return <Navigate to="/profile" replace />;

  return children;
};