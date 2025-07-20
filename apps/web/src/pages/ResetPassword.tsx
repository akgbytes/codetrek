import { useForm, type SubmitHandler } from "react-hook-form";
import { useResetPasswordMutation } from "../services/authApi";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Loader2, Lock, RefreshCw, XOctagon } from "lucide-react";

import type { ResetPasswordData } from "@repo/zod";
import TextInput from "../components/ui/TextInput";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordData>();

  const navigate = useNavigate();
  const { token } = useParams();

  const [countdown, setCountdown] = useState(3);

  const [resetPassword, { isLoading, isError, error, isSuccess }] =
    useResetPasswordMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const onSubmit: SubmitHandler<ResetPasswordData> = async (data) => {
    try {
      const response = await resetPassword({ ...data, token: token! }).unwrap();
      toast.success(response.message);

      let seconds = 3;
      setCountdown(seconds);

      const interval = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);
        if (seconds <= 0) clearInterval(interval);
      }, 1000);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.log("error is submit", error);
      toast.error(error.data?.message);
    }
  };

  if (isError && (error as any).data?.code == 410) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className=" bg-neutral-900 border-white/10 text-zinc-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="text-zinc-300/70">
                This password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto text-center space-y-6 rounded-lg">
                <div className="flex justify-center">
                  <XOctagon
                    className="h-16 w-16 text-red-500"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                    Invalid or Expired Link
                  </h2>
                  <p className="text-sm text-zinc-400">
                    This password reset link is invalid or has expired. Please
                    request a new password reset.
                  </p>
                </div>

                <Link to="/forgot-password" className="inline-block w-full">
                  <Button
                    variant={"secondary"}
                    className="w-full cursor-pointer py-5 rounded-[4px]"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request New Reset Link
                  </Button>
                </Link>
              </div>
              <div className="text-zinc-400 text-center text-sm mt-6">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="hover:underline hover:text-lime-600 text-zinc-200 font-medium transition-colors duration-200"
                >
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="bg-neutral-900 max-w-md border-white/10 text-zinc-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Password Reset Complete
              </CardTitle>
              <CardDescription className="text-zinc-300/70">
                Your password has been successfully updated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-200 mb-2">
                    Password Updated Successfully
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Your password has been updated. You can now log in with your
                    new password.
                  </p>
                  <p className="text-sm text-zinc-100 mt-2">
                    Redirecting to login in{" "}
                    <span className="font-medium">{countdown}</span> second
                    {countdown !== 1 && "s"}...
                  </p>
                </div>
                <Link to="/login">
                  <Button className="w-full cursor-pointer" variant={"outline"}>
                    Continue to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-neutral-900 max-w-md border-white/10 text-zinc-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Reset your password
            </CardTitle>
            <CardDescription className="text-zinc-300/70">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextInput
                type={showPassword ? "text" : "password"}
                id="new-password"
                label="New Password"
                icon={<Lock className="h-4 w-4" />}
                placeholder="Enter your new password"
                error={errors.password?.message}
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

              <TextInput
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                label="Confirm New Password"
                icon={<Lock className="h-4 w-4" />}
                placeholder="Confirm your new password"
                error={errors.confirmPassword?.message}
                showPasswordToggle
                showPassword={showConfirmPassword}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                inputProps={register("confirmPassword", {
                  required: "Confirm Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
                variant={"outline"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-zinc-400">Remember your password? </span>
              <Link
                to="/login"
                className="hover:underline hover:text-lime-600 text-zinc-200 font-medium  transition-colors duration-200"
              >
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
