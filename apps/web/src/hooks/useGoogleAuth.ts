import {
  useGoogleLoginMutation,
  useLazyFetchUserQuery,
} from "../services/authApi";
import { useAppDispatch } from "./index";
import { setCredentials } from "../store/features/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useGoogleAuth = () => {
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const [fetchUser] = useLazyFetchUserQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loginWithGoogle = async (token: string) => {
    try {
      const response = await googleLogin({ token }).unwrap();
      const userResponse = await fetchUser().unwrap();
      dispatch(setCredentials(userResponse.data));
      toast.success(response.message || "Logged in via Google successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Login with Google failed. Please try again."
      );
    }
  };

  return { loginWithGoogle, isLoading };
};
