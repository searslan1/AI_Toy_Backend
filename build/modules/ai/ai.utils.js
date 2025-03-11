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
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
class AIUtils {
    /**
     * 📌 **Dosya Silme:** İşlem tamamlandıktan sonra geçici dosyaları temizler.
     * @param filePath Silinecek dosyanın yolu
     */
    static deleteFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.default.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`❌ Dosya silme hatası: ${filePath}`, err);
                        reject(err);
                    }
                    else {
                        console.log(`🗑️ Dosya silindi: ${filePath}`);
                        resolve();
                    }
                });
            });
        });
    }
    /**
     * 📌 **Ses Formatını WAV'e Dönüştürme:** AI için uygun ses formatına çevirir.
     * @param inputPath Kaynak ses dosyası
     * @param outputPath Dönüştürülen dosya yolu
     * @returns Dönüştürülen dosyanın yolu
     */
    static convertToWav(inputPath, outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, fluent_ffmpeg_1.default)(inputPath)
                    .toFormat('wav')
                    .on('end', () => {
                    console.log(`✅ Ses dönüştürüldü: ${outputPath}`);
                    resolve(outputPath);
                })
                    .on('error', (err) => {
                    console.error(`❌ Ses dönüştürme hatası: ${err}`);
                    reject(err);
                })
                    .save(outputPath);
            });
        });
    }
    /**
     * 📌 **Dosya Adı Oluşturucu:** Yüklenen her ses dosyası için benzersiz bir isim oluşturur.
     * @param extension Dosya uzantısı (örn. `.wav`, `.mp3`)
     * @returns Rastgele üretilmiş dosya adı
     */
    static generateFileName(extension) {
        return `${Date.now()}-${Math.floor(Math.random() * 1000)}${extension}`;
    }
    /**
     * 📌 **Geçici Klasör Yönetimi:** `uploads/` klasörünün olup olmadığını kontrol eder, yoksa oluşturur.
     * @param folderPath Kontrol edilecek klasör yolu
     */
    static ensureFolderExists(folderPath) {
        if (!fs_1.default.existsSync(folderPath)) {
            fs_1.default.mkdirSync(folderPath, { recursive: true });
            console.log(`📁 Klasör oluşturuldu: ${folderPath}`);
        }
    }
}
exports.default = AIUtils;
