import { Router } from "express";
import ConversationController from "./conversation.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Yeni mesaj gönderme
router.post("/send-message", authMiddleware, ConversationController.sendMessage);

// Kullanıcının konuşma geçmişini listeleme
router.get("/history/:childId/:deviceId", authMiddleware, ConversationController.getConversationHistory);

// Konuşma geçmişini temizleme
router.delete("/clear-history/:childId/:deviceId", authMiddleware, ConversationController.clearConversationHistory);

export default router;
