import { Router } from "express";
import {
  register,
  login,
  logout,
  googleLogin,
  verifyEmail,
  resetPassword,
  resendVerificationEmail,
  refreshAccessToken,
  forgotPassword,
  getProfile,
} from "../controllers/auth.controller";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google", googleLogin);
router.get("/email/verify/:token", verifyEmail);
router.post("/email/resend", resendVerificationEmail);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);
router.post("/refresh", refreshAccessToken);
router.get("/me", getProfile);

export default router;
