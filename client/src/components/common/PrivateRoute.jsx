import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  console.log("User in PrivateRoute: ", user);
  return user ? <Outlet /> : <Navigate to="/auth" />;
}