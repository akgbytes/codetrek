import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { toast } from "sonner";
import { CheckCircle, RefreshCw, XOctagon } from "lucide-react";
import {
  useLazyFetchUserQuery,
  useVerifyEmailQuery,
} from "../services/authApi";
import { useAppDispatch } from "../hooks";
import { setCredentials } from "../store/features/authSlice";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [countdown, setCountdown] = useState(3);

  const { data, isLoading, isSuccess, isError } = useVerifyEmailQuery(token!, {
    skip: !token,
  });

  let intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [fetchUser] = useLazyFetchUserQuery();

  const verifyAndFetchUser = async () => {
    if (!isLoading) {
      if (isSuccess && data?.success) {
        toast.success(data.message || "Email verified successfully");
        setVerificationStatus("success");
      }

      try {
        const user = await fetchUser().unwrap();
        let seconds = 3;
        setCountdown(seconds);
        intervalRef.current = setInterval(() => {
          seconds -= 1;
          setCountdown(seconds);

          if (seconds <= 0 && intervalRef.current) {
            clearInterval(intervalRef.current);
            dispatch(setCredentials({ user: user.data }));
            toast.success("Login successful");
            navigate("/dashboard");
          }
        }, 1000);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to fetch user");
        setVerificationStatus("error");
      }
    } else if (isError) {
      toast.error("Email verification failed");
      setVerificationStatus("error");
    }
  };

  useEffect(() => {
    verifyAndFetchUser();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading, isSuccess, isError, data, dispatch, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center text-zinc-50 space-y-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-zinc-200" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Verifying your email
              </h2>
              <p className="text-sm text-zinc-400">
                Please wait while we verify your email address
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-200 mb-2">
                Email Verified
              </h2>
              <p className="text-sm text-zinc-400">
                Your email has been successfully verified. You can now access
                all features of your account.
              </p>
              <p className="text-sm text-zinc-100 mt-2">
                Redirecting to your dashboard in{" "}
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
        );

      case "error":
        return (
          <div className="max-w-md mx-auto text-center space-y-6 p-6 bg-zinc-900 rounded-lg">
            <div className="flex justify-center">
              <XOctagon className="h-16 w-16 text-red-500" aria-hidden="true" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                Verification Failed
              </h2>
              <p className="text-sm text-zinc-400">
                We couldn’t verify your email. The link may be invalid or has
                expired.
              </p>
            </div>

            <Link to="/resend-verification" className="inline-block w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Resend Verification Email
              </Button>
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <Card className="w-full max-w-md bg-zinc-900 border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-zinc-50">
            Email Verification
          </CardTitle>
          <CardDescription className="text-sm text-zinc-300/70">
            Verify your email address to complete registration
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
