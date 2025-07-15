import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Eye, EyeOff, Loader, Lock, LogIn, Mail } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Link, useNavigate } from "react-router-dom";
import type { LoginData } from "@repo/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../hooks";
import {
  useGoogleLoginMutation,
  useLazyGetProfileQuery,
  useLoginMutation,
} from "../services/authApi";
import { setCredentials } from "../store/features/authSlice";
import { toast } from "sonner";

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
  const [googleLogin, { isLoading: googleLoading }] = useGoogleLoginMutation();
  const [getProfile] = useLazyGetProfileQuery();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const response = await loginUser(data).unwrap();
      console.log("login response : ", response);

      const profileResponse = await getProfile().unwrap();
      dispatch(
        setCredentials({
          user: profileResponse.data,
        })
      );

      toast.success(response.message || "Logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.log("register error : ", error);
      toast.error(error.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-neutral-900 border-white/10 text-zinc-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-zinc">
              Welcome Back
            </CardTitle>
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
                onSuccess={async (credentialResponse) => {
                  try {
                    const response = await googleLogin({
                      token: credentialResponse.credential!,
                    }).unwrap();

                    console.log("google login response : ", response);

                    const profileResponse = await getProfile().unwrap();
                    dispatch(
                      setCredentials({
                        user: profileResponse.data,
                      })
                    );

                    toast.success(
                      response.message || "Logged in via Google successfully"
                    );
                    navigate("/dashboard");
                  } catch (error: any) {
                    console.log("google login error : ", error);
                    toast.error(
                      error.data?.message ||
                        "Login with Google failed. Please try again."
                    );
                  }
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
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-50">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-300/70" />
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                  />
                </div>

                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-50">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-300/70" />
                  <Input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 characters" },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-zinc-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-zinc-300/90 hover:text-lime-600"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
                variant={"outline"}
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
                <span className="text-zinc-300/60">
                  Don't have an account?{" "}
                </span>
                <Link
                  to="/signup"
                  className="hover:underline hover:text-lime-600 text-zinc-200 font-medium"
                >
                  Sign up
                </Link>
              </div>
              <div className="text-center text-sm">
                <span className="text-zinc-300/60">
                  Need to verify your email?{" "}
                </span>
                <Link
                  to="/resend-verification"
                  className="hover:underline hover:text-lime-600 text-zinc-200 font-medium"
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
