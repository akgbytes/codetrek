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

  const { data, isSuccess, isError } = useVerifyEmailQuery(token!);

  let intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [fetchUser] = useLazyFetchUserQuery();

  const handleVerification = async () => {
    if (isSuccess && data?.success) {
      toast.success(data.message || "Email verified successfully");
      setVerificationStatus("success");

      try {
        const response = await fetchUser().unwrap();
        setCountdown(3);

        intervalRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current!);
              dispatch(setCredentials(response.data));
              toast.success("Login successful");
              navigate("/dashboard");
            }
            return prev - 1;
          });
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
    handleVerification();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSuccess, isError, data, fetchUser, dispatch, navigate]);

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
            <Link to="/signin">
              <Button className="w-full cursor-pointer" variant={"outline"}>
                Continue to Login
              </Button>
            </Link>
          </div>
        );

      case "error":
        return (
          <div className="max-w-md mx-auto text-center space-y-6 rounded-lg pb-1">
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
                variant={"secondary"}
                className="w-full cursor-pointer py-5 rounded-[4px]"
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-neutral-900 border-white/10 text-zinc-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Email Verification
            </CardTitle>
            <CardDescription className="text-sm text-zinc-300/70">
              Verify your email address to complete registration
            </CardDescription>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
