import { useAppSelector } from "../../hooks/index";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (user) {
    return <Navigate to={"/"} replace />;
  }
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
