    import { UserModel } from "../auth/auth.model";
    import bcrypt from "bcrypt";
    import jwt from "jsonwebtoken";

    class AuthService {
    // Kullanıcıyı email'e göre bulma
    public async findUserByEmail(email: string) {
        try {
        if (typeof email !== "string") {
            return { success: false, message: "Geçersiz e-mail formatı", user: null };
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { success: false, message: "Bu e-mail ile kayıtlı kullanıcı bulunamadı", user: null };
        }
        return { success: true, user };
        } catch (error) {
        console.error("Error finding user by email:", error);
        return { success: false, message: "Kullanıcı aranırken hata oluştu", error };
        }
    }

    // Şifreyi hashleme (Kayıt sırasında kullanılacak)
    public async hashPassword(password: string) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    // Şifre doğrulama
    public async verifyPassword(inputPassword: string, hashedPassword: string) {
        return bcrypt.compareSync(inputPassword, hashedPassword);
    }

    // JWT Access Token oluşturma
    public generateAccessToken(user: any) {
        return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET_KEY || "defaultSecretKey",
        { expiresIn: "2h" }
        );
    }

    // JWT Refresh Token oluşturma
    public generateRefreshToken(user: any) {
        return jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET_KEY || "defaultRefreshSecretKey",
        { expiresIn: "1d" }
        );
    }

    // Çerezleri (cookies) ayarlayan fonksiyon
    public setAuthCookies(res: any, accessToken: string, refreshToken: string) {
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

    export default new AuthService();
