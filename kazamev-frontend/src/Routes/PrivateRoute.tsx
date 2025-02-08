import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute= () => {
  const isAuthenticated: boolean = !!localStorage.getItem("authToken");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
