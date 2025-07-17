import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@repo/ui/components/card";
import { Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Link, useNavigate } from "react-router-dom";
import type { RegisterData } from "@repo/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useRegisterMutation } from "../services/authApi";
import { toast } from "sonner";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import TextInput from "../components/ui/TextInput";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();
  const { loginWithGoogle, isLoading: googleLoading } = useGoogleAuth();

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      toast.success(
        response.message || "Registration successful. Please verify your email."
      );
      navigate("/signin");
    } catch (error: any) {
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
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-zinc-300/70">
              Start your coding journey
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
                id="fullname"
                label="Full Name"
                icon={<User className="h-4 w-4" />}
                placeholder="Enter your name"
                error={errors.fullname?.message}
                inputProps={register("fullname", {
                  required: "Full name is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />
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

              <Button
                type="submit"
                variant={"outline"}
                className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
                disabled={isLoading || googleLoading}
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

            <div className="text-center text-sm">
              <span className="text-zinc-400">Already have an account? </span>
              <Link
                to="/signin"
                className="hover:underline hover:text-lime-600 transition-colors duration-200 text-zinc-200 font-medium"
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
