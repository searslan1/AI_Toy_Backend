import { Request, Response } from "express";
import ConversationService from "./conversation.service";

export class ConversationController {
  // Yeni mesaj ekleme
  public async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { childId, deviceId, sender, text } = req.body;

      if (!childId || !deviceId || !sender || !text) {
        res.status(400).json({ message: "Tüm alanlar zorunludur." });
        return;
      }

      const message = { sender, text, timestamp: new Date() };
      const result = await ConversationService.sendMessage(childId, deviceId, message);

      if (!result.success) {
        res.status(500).json({ message: result.message });
        return;
      }

      res.status(201).json({ message: "Mesaj başarıyla eklendi.", conversation: result.conversation });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Kullanıcının konuşma geçmişini listeleme
  public async getConversationHistory(req: Request, res: Response): Promise<void> {
    try {
      const { childId, deviceId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      if (!childId || !deviceId) {
        res.status(400).json({ message: "Child ID ve Device ID zorunludur." });
        return;
      }

      const result = await ConversationService.getConversationHistory(childId, deviceId, Number(page), Number(limit));

      if (!result.success) {
        res.status(404).json({ message: result.message });
        return;
      }

      res.status(200).json({ messages: result.messages });
    } catch (error) {
      console.error("Error retrieving conversation history:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Konuşma geçmişini temizleme
  public async clearConversationHistory(req: Request, res: Response): Promise<void> {
    try {
      const { childId, deviceId } = req.params;

      if (!childId || !deviceId) {
        res.status(400).json({ message: "Child ID ve Device ID zorunludur." });
        return;
      }

      const result = await ConversationService.clearConversationHistory(childId, deviceId);

      if (!result.success) {
        res.status(404).json({ message: result.message });
        return;
      }

      res.status(200).json({ message: "Konuşma geçmişi başarıyla temizlendi." });
    } catch (error) {
      console.error("Error clearing conversation history:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }
}

export default new ConversationController();
