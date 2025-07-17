import { useAppSelector } from "../../hooks/index";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useAppSelector((state) => state.auth.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
