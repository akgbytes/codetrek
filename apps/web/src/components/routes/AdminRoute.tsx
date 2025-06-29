import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const isAuthenticated = "";
  const user = {
    role: "",
  };

  return isAuthenticated && user?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default AdminRoute;
