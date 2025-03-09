import { ConversationModel, IMessage } from "./conversation.model";
import AnalyticsService from "../analytics/analytics.service";

class ConversationService {
  // Yeni mesaj ekleme
  async sendMessage(childId: string, deviceId: string, sender: "child" | "ai", text: string) {
    try {
      let conversation = await ConversationModel.findOne({ childId, deviceId });

      if (!conversation) {
        conversation = new ConversationModel({ childId, deviceId, messages: [] });
      }

      const message: IMessage = { sender, text, timestamp: new Date() };
      conversation.messages.push(message);
      await conversation.save();

      // Kullanım analitiğini güncelle
      await AnalyticsService.logMessage(deviceId);

      return { success: true, conversation };
    } catch (error) {
      console.error("❌ Mesaj kaydetme hatası:", error);
      return { success: false, message: "Mesaj kaydedilirken hata oluştu." };
    }
  }

  // Kullanıcının konuşma geçmişini listeleme (Pagination destekli)
  async getConversationHistory(childId: string, deviceId: string, page: number = 1, limit: number = 10) {
    try {
      const conversation = await ConversationModel.findOne({ childId, deviceId })
        .slice("messages", [(page - 1) * limit, limit]) // Sayfalama için slice
        .exec();

      if (!conversation) {
        return { success: false, message: "Konuşma geçmişi bulunamadı." };
      }

      return { success: true, messages: conversation.messages };
    } catch (error) {
      console.error("❌ Konuşma geçmişi alınırken hata oluştu:", error);
      return { success: false, message: "Konuşma geçmişi alınırken hata oluştu." };
    }
  }

  // Konuşma geçmişini temizleme
  async clearConversationHistory(childId: string, deviceId: string) {
    try {
      const conversation = await ConversationModel.findOne({ childId, deviceId });

      if (!conversation) {
        return { success: false, message: "Silinecek konuşma geçmişi bulunamadı." };
      }

      conversation.messages = []; // Mesajları temizle
      await conversation.save();

      return { success: true, message: "Konuşma geçmişi başarıyla temizlendi." };
    } catch (error) {
      console.error("❌ Konuşma geçmişi temizlenirken hata oluştu:", error);
      return { success: false, message: "Konuşma geçmişi temizlenirken hata oluştu." };
    }
  }
}

export default new ConversationService();
