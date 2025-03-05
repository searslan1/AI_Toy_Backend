import { Router } from "express";
import AuthController from "../auth/auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Kullanıcı kayıt işlemi
router.post("/register", AuthController.register);

// Kullanıcı giriş işlemi
router.post("/login", AuthController.login);

// Refresh token işlemi
router.post("/refresh", AuthController.handleRefreshToken);

// Kullanıcı çıkış işlemi
router.post("/logout", AuthController.logout);

// Kullanıcı doğrulama işlemi (token doğrulama)
router.get("/verify", authMiddleware, AuthController.verifyUser);

export default router;
