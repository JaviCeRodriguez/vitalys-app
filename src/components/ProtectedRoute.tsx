import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";
import { hasAnyRole } from "../store/authApi";

export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: Role[];
}) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (roles && !hasAnyRole(session, roles)) {
    return <Navigate to="/app" replace />;
  }
  return children;
}
