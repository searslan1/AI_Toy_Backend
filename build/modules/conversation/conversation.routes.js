"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversation_controller_1 = __importDefault(require("./conversation.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Yeni mesaj gönderme
router.post("/send-message", auth_middleware_1.authMiddleware, conversation_controller_1.default.sendMessage);
// Kullanıcının konuşma geçmişini listeleme
router.get("/history/:childId/:deviceId", auth_middleware_1.authMiddleware, conversation_controller_1.default.getConversationHistory);
// Konuşma geçmişini temizleme
router.delete("/clear-history/:childId/:deviceId", auth_middleware_1.authMiddleware, conversation_controller_1.default.clearConversationHistory);
exports.default = router;
