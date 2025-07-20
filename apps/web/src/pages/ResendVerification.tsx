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
import { useResendVerificationMutation } from "../services/authApi";
import { toast } from "sonner";
import { useState } from "react";
import TextInput from "../components/ui/TextInput";

const ResendVerification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<EmailData>();

  const [resendVerification, { isLoading }] = useResendVerificationMutation();

  const [emailSent, setEmailSent] = useState(false);

  const onSubmit: SubmitHandler<EmailData> = async (data) => {
    try {
      const response = await resendVerification(data).unwrap();
      setEmailSent(true);
      toast.success(response.message || "Verification email sent");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to send verification email. Please try again later."
      );
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md bg-neutral-900 border-white/10 text-zinc-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Verification email sent
            </CardTitle>
            <CardDescription className="text-zinc-300/70">
              Check your email for the new verification link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <Mail className="h-16 w-16 text-green-500" />
              </div>
              <div className="flex gap-4 flex-col">
                <p className="text-sm text-zinc-400">
                  We've sent a verification link to{" "}
                  <strong className="text-zinc-200 font-medium">
                    {getValues("email")}
                  </strong>
                  . Please check your email and click the link to verify your
                  account.
                </p>
                <p className="text-zinc-400 text-sm">
                  Still didn't receive it? Check your spam folder or try again
                  in a few minutes.
                </p>
              </div>

              <Button
                onClick={() => setEmailSent(false)}
                variant={"secondary"}
                className="w-full cursor-pointer py-5 rounded-[4px]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Send again
              </Button>
            </div>

            <p className="text-zinc-400 text-center text-sm">
              Already verified?{" "}
              <Link
                to="/login"
                className="hover:underline hover:text-lime-600 transition-colors duration-200 text-zinc-200 font-medium"
              >
                Go to login
              </Link>
            </p>
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
              Resend verification email
            </CardTitle>
            <CardDescription className="text-zinc-300/70">
              Enter your email to receive a new verification link
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

              <Button
                type="submit"
                variant={"secondary"}
                className="w-full cursor-pointer py-5 rounded-[4px]"
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
                    Send Verification Email
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-1">
              <p className="text-zinc-400 text-sm">
                <Link
                  to="/signin"
                  className="inline-flex items-center hover:underline hover:text-lime-600 transition-colors duration-200 text-zinc-200 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </p>
              <p className="text-zinc-400 text-sm">
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

export default ResendVerification;
