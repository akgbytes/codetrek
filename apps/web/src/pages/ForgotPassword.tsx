import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@repo/ui/components/card";
import { ArrowLeft, Loader, Mail, RefreshCw, Send } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@repo/ui/components/button";
import { Link } from "react-router-dom";
import type { EmailData } from "@repo/zod";
import { useForgotPasswordMutation } from "../services/authApi";
import { useState } from "react";
import { toast } from "sonner";
import TextInput from "../components/ui/TextInput";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<EmailData>();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [emailSent, setEmailSent] = useState(false);

  const onSubmit: SubmitHandler<EmailData> = async (data) => {
    try {
      const response = await forgotPassword(data).unwrap();
      if (response.data?.code === "OAUTH_USER") {
        toast.info(
          response.message ||
            "This account was registered using Google or another provider. Password reset is not available."
        );
        setEmailSent(false);
        return;
      } else {
        setEmailSent(true);
        toast.success(response.message || "Password reset link sent");
      }
    } catch (error: any) {
      setEmailSent(false);
      toast.error(
        error.data?.message ||
          "Failed to send reset link. Please try again later."
      );
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md bg-neutral-900 border-white/10 text-zinc-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Check your email
            </CardTitle>
            <CardDescription className="text-zinc-300/70">
              We've sent password reset instructions to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <Mail className="h-16 w-16 text-green-500" />
              </div>
              <div className="flex gap-4 flex-col">
                <p className="text-sm text-zinc-400">
                  We've sent a password reset link to{" "}
                  <strong className="text-zinc-200 font-medium">
                    {getValues("email")}
                  </strong>
                  . Please check your email and follow the instructions to reset
                  your password.
                </p>
                <p className="text-zinc-400 text-sm">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>

              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Send again
              </Button>
            </div>

            <div className="text-zinc-400 text-center text-sm">
              Remember your password?{" "}
              <Link
                to="/signin"
                className="hover:underline hover:text-lime-600 transition-colors duration-200 text-zinc-200 font-medium"
              >
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-neutral-900 border-white/10 text-zinc-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-zinc">
              Forgot your password?
            </CardTitle>
            <CardDescription className="text-zinc-300/70">
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextInput
                type="email"
                id="email"
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                placeholder="kk@example.com"
                error={errors.email?.message}
                inputProps={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />

              <p className="text-xs text-zinc-300/75 -mt-2">
                Enter the email address associated with your account and we'll
                send you a link to reset your password.
              </p>

              <Button
                type="submit"
                className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
                variant={"outline"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-1">
              <p className="text-zinc-300/60 text-sm">
                <Link
                  to="/signin"
                  className="inline-flex items-center hover:underline hover:text-lime-600 transition-colors duration-200 text-zinc-200 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </p>
              <p className="text-zinc-300/60 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="hover:underline hover:text-lime-600 transition-colors duration-200 text-zinc-200 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
