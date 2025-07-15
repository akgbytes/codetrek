import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { Eye, EyeOff, Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Link } from "react-router-dom";
import type { RegisterData } from "@repo/zod";
import { GoogleLogin } from "@react-oauth/google";
import {
  useGoogleLoginMutation,
  useRegisterMutation,
} from "../services/authApi";
import { toast } from "react-toastify";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const [showPassword, setShowPassword] = useState(false);

  const [registerUser, { isLoading }] = useRegisterMutation();
  const [googleLogin, { isLoading: googleLoading }] = useGoogleLoginMutation();

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      console.log("register response : ", response);
      toast.success(response.message || "Registration successful");
    } catch (error: any) {
      console.log("register error : ", error);
      toast.error(
        error.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-neutral-900 border-white/10 text-zinc-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-zinc">
              Create Account
            </CardTitle>
            <CardDescription className="text-zinc-300/70">
              Start your coding journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-50">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-300/70" />
                  <Input
                    {...register("fullname", {
                      required: "Full name is required",
                      minLength: { value: 6, message: "Min 6 characters" },
                    })}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 border rounded-md border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                  />
                </div>

                {errors.fullname && (
                  <p className="text-red-500 text-sm">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

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

              <Button
                type="submit"
                className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
                variant={"outline"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-400" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-neutral-900 px-2 text-zinc-300/70">Or</span>
              </div>
            </div>

            <div className="flex items-center justify-center w-full">
              <GoogleLogin
                theme="outline"
                text="continue_with"
                width={"400px"}
                onSuccess={async (credentialToken) => {
                  try {
                    // const response = await googleLogin(credentialToken)
                  } catch (error: any) {}
                }}
                onError={() => {}}
              />
            </div>

            <div className="text-center text-sm">
              <span className="text-zinc-300/60">
                Already have an account?{" "}
              </span>
              <Link
                to="/signin"
                className="hover:underline hover:text-lime-600 text-zinc-200 font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
