import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { ArrowLeft, Loader, Mail, Send } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@repo/ui/components/button";
import { Link } from "react-router-dom";
import type { EmailData } from "@repo/zod";

const ResendVerification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailData>();

  const isLoading = false;

  const onSubmit: SubmitHandler<EmailData> = async (data) => {};

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
              <p className="text-zinc-300/60 text-sm">
                <Link
                  to="/login"
                  className="hover:text-lime-600 inline-flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </p>
              <p className="text-zinc-300/60 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
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
