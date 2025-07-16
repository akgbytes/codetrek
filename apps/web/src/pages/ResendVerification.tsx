import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { ArrowLeft, Loader, Mail, RefreshCw, Send } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@repo/ui/components/button";
import { Link } from "react-router-dom";
import type { EmailData } from "@repo/zod";
import { useResendVerificationMutation } from "../services/authApi";
import { toast } from "sonner";
import { useState } from "react";

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
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.data?.message);
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
              <Link to="/login">
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Send again
                </Button>
              </Link>
            </div>

            <p className="text-zinc-400 text-center text-sm">
              Already verified?{" "}
              <Link
                to="/login"
                className="hover:underline hover:text-lime-600 text-zinc-200 font-medium"
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
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-50">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="kk@example.com"
                    className="w-full pl-10 pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                  />
                </div>

                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}

                <p className="text-xs text-zinc-300/75 mt-1">
                  Enter the email address you used to register your account.
                </p>
              </div>

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
                    Send Verification Email
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-1">
              <p className="text-zinc-400 text-sm">
                <Link
                  to="/signin"
                  className="hover:text-lime-600 inline-flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </p>
              <p className="text-zinc-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-zinc-100 hover:underline hover:text-lime-600"
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
