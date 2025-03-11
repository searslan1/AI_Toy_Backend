"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const conversation_routes_1 = __importDefault(require("./conversation/conversation.routes"));
const ai_routes_1 = __importDefault(require("./ai/ai.routes"));
const router = (0, express_1.Router)();
// Modüllerin rotaları
router.use("/auth", auth_routes_1.default);
router.use("/chat", conversation_routes_1.default); // Chat (Conversation) modülü eklendi
router.use("/ai", ai_routes_1.default); // AI modülü eklendi
exports.default = router;
