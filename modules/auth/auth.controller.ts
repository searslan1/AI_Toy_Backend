import { Request, Response } from "express";
import AuthService from "./auth.service";
import jwt from "jsonwebtoken";
import { UserModel } from "./auth.model";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class AuthController {
  // Kullanıcı kayıt olma
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: "Tüm alanlar zorunludur." });
        return;
      }

      // Kullanıcının var olup olmadığını kontrol et
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser.success) {
        res.status(400).json({ message: "Bu e-mail zaten kayıtlı." });
        return;
      }

      // Şifreyi hashle
      const hashedPassword = await AuthService.hashPassword(password);

      // Yeni kullanıcıyı oluştur
      const newUser = await UserModel.create({ name, email, password: hashedPassword });

      res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi." });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Kullanıcı giriş yapma
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "E-mail ve şifre gereklidir." });
        return;
      }

      // Kullanıcıyı bul
      const result = await AuthService.findUserByEmail(email);
      if (!result.success || !result.user) {
        res.status(401).json({ message: "Geçersiz kimlik bilgileri." });
        return;
      }

      const user = result.user;

      // Şifreyi doğrula
      const isPasswordValid = await AuthService.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Geçersiz kimlik bilgileri." });
        return;
      }

      // Token oluştur
      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      // Çerezleri ayarla
      AuthService.setAuthCookies(res, accessToken, refreshToken);

      res.status(200).json({ message: "Giriş başarılı" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Refresh Token işlemi
  public async handleRefreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.jwtRefreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token sağlanmadı." });
        return;
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY || "defaultRefreshSecretKey",
        async (err: jwt.VerifyErrors | null, decoded: any) => {
          if (err) {
            res.status(401).json({ message: "Geçersiz veya süresi dolmuş refresh token." });
            return;
          }

          // Kullanıcıyı tekrar bul
          const result = await AuthService.findUserByEmail(decoded.email);
          if (!result.success || !result.user) {
            res.status(403).json({ message: "Yetkisiz erişim." });
            return;
          }

          const user = result.user;

          // Yeni Access Token oluştur
          const newAccessToken = AuthService.generateAccessToken(user);
          AuthService.setAuthCookies(res, newAccessToken, refreshToken);

          res.status(200).json({ message: "Token yenilendi" });
        }
      );
    } catch (error) {
      console.error("Refresh Token error:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Kullanıcı çıkış yapma
  public async logout(req: Request, res: Response): Promise<void> {
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
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Kullanıcı doğrulama
  public async verifyUser(req: CustomRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Yetkisiz erişim." });
        return;
      }
      res.status(200).json({ user: req.user });
    } catch (error) {
      console.error("Verify user error:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }
}

export default new AuthController();
