"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("./auth.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_model_1 = require("./auth.model");
class AuthController {
    // Kullanıcı kayıt olma
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                if (!name || !email || !password) {
                    res.status(400).json({ message: "Tüm alanlar zorunludur." });
                    return;
                }
                // Kullanıcının var olup olmadığını kontrol et
                const existingUser = yield auth_service_1.default.findUserByEmail(email);
                if (existingUser.success) {
                    res.status(400).json({ message: "Bu e-mail zaten kayıtlı." });
                    return;
                }
                // Şifreyi hashle
                const hashedPassword = yield auth_service_1.default.hashPassword(password);
                // Yeni kullanıcıyı oluştur
                const newUser = yield auth_model_1.UserModel.create({ name, email, password: hashedPassword });
                res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi." });
            }
            catch (error) {
                console.error("Register error:", error);
                res.status(500).json({ message: "Sunucu hatası." });
            }
        });
    }
    // Kullanıcı giriş yapma
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ message: "E-mail ve şifre gereklidir." });
                    return;
                }
                // Kullanıcıyı bul
                const result = yield auth_service_1.default.findUserByEmail(email);
                if (!result.success || !result.user) {
                    res.status(401).json({ message: "Geçersiz kimlik bilgileri." });
                    return;
                }
                const user = result.user;
                // Şifreyi doğrula
                const isPasswordValid = yield auth_service_1.default.verifyPassword(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({ message: "Geçersiz kimlik bilgileri." });
                    return;
                }
                // Token oluştur
                const accessToken = auth_service_1.default.generateAccessToken(user);
                const refreshToken = auth_service_1.default.generateRefreshToken(user);
                // Çerezleri ayarla
                auth_service_1.default.setAuthCookies(res, accessToken, refreshToken);
                res.status(200).json({ message: "Giriş başarılı" });
            }
            catch (error) {
                console.error("Login error:", error);
                res.status(500).json({ message: "Sunucu hatası." });
            }
        });
    }
    // Refresh Token işlemi
    handleRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.jwtRefreshToken;
                if (!refreshToken) {
                    res.status(401).json({ message: "Refresh token sağlanmadı." });
                    return;
                }
                jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY || "defaultRefreshSecretKey", (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(401).json({ message: "Geçersiz veya süresi dolmuş refresh token." });
                        return;
                    }
                    // Kullanıcıyı tekrar bul
                    const result = yield auth_service_1.default.findUserByEmail(decoded.email);
                    if (!result.success || !result.user) {
                        res.status(403).json({ message: "Yetkisiz erişim." });
                        return;
                    }
                    const user = result.user;
                    // Yeni Access Token oluştur
                    const newAccessToken = auth_service_1.default.generateAccessToken(user);
                    auth_service_1.default.setAuthCookies(res, newAccessToken, refreshToken);
                    res.status(200).json({ message: "Token yenilendi" });
                }));
            }
            catch (error) {
                console.error("Refresh Token error:", error);
                res.status(500).json({ message: "Sunucu hatası." });
            }
        });
    }
    // Kullanıcı çıkış yapma
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("jwtToken", {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: process.env.NODE_ENV === "production",
                });
                res.clearCookie("jwtRefreshToken", {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: process.env.NODE_ENV === "production",
                });
                res.status(200).json({ message: "Çıkış başarılı" });
            }
            catch (error) {
                console.error("Logout error:", error);
                res.status(500).json({ message: "Sunucu hatası." });
            }
        });
    }
    // Kullanıcı doğrulama
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: "Yetkisiz erişim." });
                    return;
                }
                res.status(200).json({ user: req.user });
            }
            catch (error) {
                console.error("Verify user error:", error);
                res.status(500).json({ message: "Sunucu hatası." });
            }
        });
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
