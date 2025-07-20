import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@repo/ui/components/card";
import { Loader, Lock, LogIn, Mail } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Link, useNavigate } from "react-router-dom";
import type { LoginData } from "@repo/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../hooks";
import { useLazyFetchUserQuery, useLoginMutation } from "../services/authApi";
import { setCredentials } from "../store/features/authSlice";
import { toast } from "sonner";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import TextInput from "../components/ui/TextInput";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginMutation();
  const { loginWithGoogle, isLoading: googleLoading } = useGoogleAuth();
  const [fetchUser] = useLazyFetchUserQuery();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const response = await loginUser(data).unwrap();
      const userResponse = await fetchUser().unwrap();

      dispatch(setCredentials(userResponse.data));
      toast.success(response.message || "Logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-neutral-900 border-white/10 text-zinc-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-zinc-300/70">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <GoogleLogin
                theme="outline"
                text="continue_with"
                width={"400px"}
                onSuccess={(res) => {
                  loginWithGoogle(res.credential!);
                }}
                onError={() => {
                  toast.error("Login with Google failed. Please try again.");
                }}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-400" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-neutral-900 px-2 text-zinc-300/70">Or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextInput
                type="email"
                id="email"
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                placeholder="Enter your email"
                error={errors.email?.message}
                inputProps={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              <TextInput
                type={showPassword ? "text" : "password"}
                id="password"
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                placeholder="Enter your password"
                error={errors.email?.message}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                inputProps={register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                  pattern: {
                    value:
                      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
                    message:
                      "Must include uppercase, lowercase, number and special character.",
                  },
                })}
              />

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-zinc-300/90 hover:text-lime-600 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant={"secondary"}
                className="w-full cursor-pointer py-5 rounded-[4px]"
                disabled={isLoading || googleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="flex flex-col gap-2">
              <div className="text-center text-sm">
                <span className="text-zinc-400">Don't have an account? </span>
                <Link
                  to="/signup"
                  className="hover:underline hover:text-lime-600 text-zinc-200 font-medium transition-colors duration-200"
                >
                  Sign up
                </Link>
              </div>
              <div className="text-center text-sm">
                <span className="text-zinc-400">
                  Need to verify your email?{" "}
                </span>
                <Link
                  to="/resend-verification"
                  className="hover:underline hover:text-lime-600 text-zinc-200 font-medium transition-colors duration-200"
                >
                  Resend verification
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
