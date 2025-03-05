import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthService from "../modules/auth/auth.service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY) as jwt.JwtPayload;

    if (!decoded || !decoded.email) {
      res.status(401).json({ message: "Geçersiz token." });
      return;
    }

    // Kullanıcıyı email ile bul
    const result = await AuthService.findUserByEmail(decoded.email);
    if (!result.success || !result.user) {
      res.status(403).json({ message: "Yetkilendirme başarısız. Kullanıcı bulunamadı." });
      return;
    }

    // Kullanıcıyı `req.user` içine ekleyelim
    (req as any).user = { id: result.user._id, email: result.user.email };
    next();
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    res.status(401).json({ message: "Geçersiz veya süresi dolmuş token." });
  }
};
