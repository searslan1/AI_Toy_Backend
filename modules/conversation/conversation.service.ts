import { ConversationModel, IConversation, IMessage } from "./conversation.model";

class ConversationService {
  // Yeni mesaj ekleme
  public async sendMessage(childId: string, deviceId: string, message: IMessage) {
    try {
      let conversation = await ConversationModel.findOne({ childId, deviceId });

      if (!conversation) {
        conversation = new ConversationModel({ childId, deviceId, messages: [] });
      }

      conversation.messages.push(message);
      await conversation.save();

      return { success: true, conversation };
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, message: "Mesaj gönderme sırasında hata oluştu." };
    }
  }

  // Kullanıcının konuşma geçmişini listeleme (Pagination destekli)
  public async getConversationHistory(childId: string, deviceId: string, page: number = 1, limit: number = 10) {
    try {
      const conversation = await ConversationModel.findOne({ childId, deviceId })
        .slice("messages", [(page - 1) * limit, limit]) // Pagination için slice kullanımı
        .exec();

      if (!conversation) {
        return { success: false, message: "Konuşma geçmişi bulunamadı." };
      }

      return { success: true, messages: conversation.messages };
    } catch (error) {
      console.error("Error retrieving conversation history:", error);
      return { success: false, message: "Konuşma geçmişi alınırken hata oluştu." };
    }
  }

  // Konuşma geçmişini temizleme
  public async clearConversationHistory(childId: string, deviceId: string) {
    try {
      const conversation = await ConversationModel.findOne({ childId, deviceId });

      if (!conversation) {
        return { success: false, message: "Silinecek konuşma geçmişi bulunamadı." };
      }

      conversation.messages = []; // Mesajları temizle
      await conversation.save();

      return { success: true, message: "Konuşma geçmişi başarıyla temizlendi." };
    } catch (error) {
      console.error("Error clearing conversation history:", error);
      return { success: false, message: "Konuşma geçmişi temizlenirken hata oluştu." };
    }
  }
}

export default new ConversationService();
