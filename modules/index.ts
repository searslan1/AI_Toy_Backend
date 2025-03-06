import { Router } from "express";
import authRoutes from "./auth/auth.routes";  
import conversationRoutes from "./conversation/conversation.routes";  
import aiRoutes from "./ai/ai.routes";

const router = Router();

// Modüllerin rotaları
router.use("/auth", authRoutes);
router.use("/chat", conversationRoutes); // Chat (Conversation) modülü eklendi
router.use("/ai", aiRoutes); // AI modülü eklendi

export default router;
