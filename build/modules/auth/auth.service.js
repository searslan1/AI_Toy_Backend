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
const auth_model_1 = require("../auth/auth.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    // Kullanıcıyı email'e göre bulma
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof email !== "string") {
                    return { success: false, message: "Geçersiz e-mail formatı", user: null };
                }
                const user = yield auth_model_1.UserModel.findOne({ email });
                if (!user) {
                    return { success: false, message: "Bu e-mail ile kayıtlı kullanıcı bulunamadı", user: null };
                }
                return { success: true, user };
            }
            catch (error) {
                console.error("Error finding user by email:", error);
                return { success: false, message: "Kullanıcı aranırken hata oluştu", error };
            }
        });
    }
    // Şifreyi hashleme (Kayıt sırasında kullanılacak)
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            return bcrypt_1.default.hash(password, saltRounds);
        });
    }
    // Şifre doğrulama
    verifyPassword(inputPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compareSync(inputPassword, hashedPassword);
        });
    }
    // JWT Access Token oluşturma
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET_KEY || "defaultSecretKey", { expiresIn: "2h" });
    }
    // JWT Refresh Token oluşturma
    generateRefreshToken(user) {
        return jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY || "defaultRefreshSecretKey", { expiresIn: "1d" });
    }
    // Çerezleri (cookies) ayarlayan fonksiyon
    setAuthCookies(res, accessToken, refreshToken) {
        res.cookie("jwtToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60 * 1000, // 2 saat
        });
        res.cookie("jwtRefreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 1 gün
        });
    }
}
exports.default = new AuthService();
