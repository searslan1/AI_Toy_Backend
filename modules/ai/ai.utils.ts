import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

class AIUtils {
  /**
   * 📌 **Dosya Silme:** İşlem tamamlandıktan sonra geçici dosyaları temizler.
   * @param filePath Silinecek dosyanın yolu
   */
  static async deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`❌ Dosya silme hatası: ${filePath}`, err);
          reject(err);
        } else {
          console.log(`🗑️ Dosya silindi: ${filePath}`);
          resolve();
        }
      });
    });
  }

  /**
   * 📌 **Ses Formatını WAV'e Dönüştürme:** AI için uygun ses formatına çevirir.
   * @param inputPath Kaynak ses dosyası
   * @param outputPath Dönüştürülen dosya yolu
   * @returns Dönüştürülen dosyanın yolu
   */
  static async convertToWav(inputPath: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
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
  }

  /**
   * 📌 **Dosya Adı Oluşturucu:** Yüklenen her ses dosyası için benzersiz bir isim oluşturur.
   * @param extension Dosya uzantısı (örn. `.wav`, `.mp3`)
   * @returns Rastgele üretilmiş dosya adı
   */
  static generateFileName(extension: string): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}${extension}`;
  }

  /**
   * 📌 **Geçici Klasör Yönetimi:** `uploads/` klasörünün olup olmadığını kontrol eder, yoksa oluşturur.
   * @param folderPath Kontrol edilecek klasör yolu
   */
  static ensureFolderExists(folderPath: string): void {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`📁 Klasör oluşturuldu: ${folderPath}`);
    }
  }
}

export default AIUtils;
