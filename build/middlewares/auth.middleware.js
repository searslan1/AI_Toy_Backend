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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = __importDefault(require("../modules/auth/auth.service"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwtToken } = req.cookies;
    if (!jwtToken) {
        res.status(401).json({ message: "Yetkilendirme başarısız. Token eksik." });
        return;
    }
    if (!process.env.JWT_SECRET_KEY) {
        console.error("JWT_SECRET_KEY tanımlı değil.");
        res.status(500).json({ message: "Sunucu iç hatası" });
        return;
    }
    try {
        // Token doğrulama
        const decoded = jsonwebtoken_1.default.verify(jwtToken, process.env.JWT_SECRET_KEY);
        if (!decoded || !decoded.email) {
            res.status(401).json({ message: "Geçersiz token." });
            return;
        }
        // Kullanıcıyı email ile bul
        const result = yield auth_service_1.default.findUserByEmail(decoded.email);
        if (!result.success || !result.user) {
            res.status(403).json({ message: "Yetkilendirme başarısız. Kullanıcı bulunamadı." });
            return;
        }
        // Kullanıcıyı `req.user` içine ekleyelim
        req.user = { id: result.user._id, email: result.user.email };
        next();
    }
    catch (error) {
        console.error("Token doğrulama hatası:", error);
        res.status(401).json({ message: "Geçersiz veya süresi dolmuş token." });
    }
});
exports.authMiddleware = authMiddleware;
