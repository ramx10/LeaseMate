import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Could be replaced with a spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user's role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect logic: if Owner tries to access Tenant page, go to /
    // If Tenant tries to access Owner page, go to /tenant-dashboard
    return <Navigate to={user.role === "Tenant" ? "/tenant-dashboard" : "/"} replace />;
  }

  return children;
}
