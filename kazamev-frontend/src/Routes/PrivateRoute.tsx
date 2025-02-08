import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  //Checking for tokens here
  const isAuthenticated: boolean = !!localStorage.getItem("authToken");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
