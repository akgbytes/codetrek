import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import AdminRoute from "./components/routes/AdminRoute";
import HomeLayout from "./components/layout/HomeLayout";
import ResendVerification from "./pages/ResendVerification";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "@repo/ui/components/sonner";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import { useAppDispatch } from "./hooks";
import { useEffect } from "react";
import { useLazyFetchUserQuery } from "./services/authApi";
import { setCredentials } from "./store/features/authSlice";

const App = () => {
  const dispatch = useAppDispatch();
  const [fetchUser] = useLazyFetchUserQuery();

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const response = await fetchUser().unwrap();
        dispatch(setCredentials(response.data));
      } catch (error) {
        console.log("Not logged in or session expired");
      }

      restoreUser();
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-1px)] flex flex-col bg-neutral-900 text-zinc-50">
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={null} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-right" richColors={true} theme="light" />
    </div>
  );
};

export default App;
