import { AnalyticsModel } from "./analytics.model";

class AnalyticsService {
  // Cihazın toplam konuşma süresini kaydet
  async logUsage(deviceId: string, duration: number) {
    try {
      return await AnalyticsModel.findOneAndUpdate(
        { deviceId },
        { $inc: { usageDuration: duration } },
        { new: true, upsert: true }
      );
    } catch (error) {
      console.error("❌ Kullanım verisi kaydedilirken hata oluştu:", error);
    }
  }

  // Cihazdan gelen mesajları sayar
  async logMessage(deviceId: string) {
    try {
      return await AnalyticsModel.findOneAndUpdate(
        { deviceId },
        { $inc: { messagesSent: 1 } },
        { new: true, upsert: true }
      );
    } catch (error) {
      console.error("❌ Mesaj sayısı kaydedilirken hata oluştu:", error);
    }
  }

  // Belirli bir cihazın kullanım verilerini döndür
  async getUsage(deviceId: string) {
    try {
      return await AnalyticsModel.findOne({ deviceId });
    } catch (error) {
      console.error("❌ Kullanım verisi alınırken hata oluştu:", error);
    }
  }
}

export default new AnalyticsService();
