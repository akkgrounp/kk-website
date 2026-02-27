import { Navigate } from "react-router-dom";

// Redirect users away from protected pages when token is missing.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
