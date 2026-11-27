import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
