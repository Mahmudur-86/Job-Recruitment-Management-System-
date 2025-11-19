import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const userToken = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  // allow if ANY token exists
  if (!userToken && !adminToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}
