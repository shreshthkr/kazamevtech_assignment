import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Tasks from "../Pages/Tasks";
import Login from "../Pages/Login";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Tasks />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
