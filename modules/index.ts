import { Router } from "express";
import authRoutes from "./auth/auth.routes";  
import conversationRoutes from "./conversation/conversation.routes";  

const router = Router();

// Modüllerin rotaları
router.use("/auth", authRoutes);
router.use("/chat", conversationRoutes); // Chat (Conversation) modülü eklendi

export default router;
