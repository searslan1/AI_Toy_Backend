"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../auth/auth.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Kullanıcı kayıt işlemi
router.post("/register", auth_controller_1.default.register);
// Kullanıcı giriş işlemi
router.post("/login", auth_controller_1.default.login);
// Refresh token işlemi
router.post("/refresh", auth_controller_1.default.handleRefreshToken);
// Kullanıcı çıkış işlemi
router.post("/logout", auth_controller_1.default.logout);
// Kullanıcı doğrulama işlemi (token doğrulama)
router.get("/verify", auth_middleware_1.authMiddleware, auth_controller_1.default.verifyUser);
exports.default = router;
