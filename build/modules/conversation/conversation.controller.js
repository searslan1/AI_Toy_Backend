"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationController = void 0;
const conversation_service_1 = __importDefault(require("./conversation.service"));
class ConversationController {
    // Yeni mesaj ekleme
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { childId, deviceId, sender, text } = req.body;
                if (!childId || !deviceId || !sender || !text) {
                    res.status(400).json({ message: "Tüm alanlar zorunludur." });
                    return;
                }
                // 🔹 `sender` değerini tip güvenli hale getir
                if (sender !== "child" && sender !== "ai") {
                    res.status(400).json({ message: "Geçersiz sender değeri. 'child' veya 'ai' olmalıdır." });
                    return;
                }
                const result = yield conversation_service_1.default.sendMessage(childId, deviceId, sender, text);
                if (!result.success) {
                    res.status(500).json({ message: result.message });
                    return;
                }
                res.status(201).json({ message: "Mesaj başarıyla eklendi.", conversation: result.conversation });
            }
            catch (error) {
                console.error("❌ Error sending message:", error);
                res.status(500).json({ message: "Sunucu hatası." });
            }
        });
    }
    // Kullanıcının konuşma geçmişini listeleme
    getConversationHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { childId, deviceId } = req.params;
                const { page = 1, limit = 10 } = req.query;
                if (!childId || !deviceId) {
                    res.status(400).json({ message: "Child ID ve Device ID zorunludur." });
                    return;
                }
                const result = yield conversation_service_1.default.getConversationHistory(childId, deviceId, Number(page), Number(limit));
                if (!result.success) {
                    res.status(404).json({ message: result.message });
                    return;
                }
                res.status(200).json({ messages: result.messages });
            }
            catch (error) {
                console.error("❌ Error retrieving conversation history:", error);
                res.status(500).json({ message: "Sunucu hatası." });
            }
        });
    }
    // Konuşma geçmişini temizleme
    clearConversationHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { childId, deviceId } = req.params;
                if (!childId || !deviceId) {
                    res.status(400).json({ message: "Child ID ve Device ID zorunludur." });
                    return;
                }
                const result = yield conversation_service_1.default.clearConversationHistory(childId, deviceId);
                if (!result.success) {
                    res.status(404).json({ message: result.message });
                    return;
                }
                res.status(200).json({ message: "Konuşma geçmişi başarıyla temizlendi." });
            }
            catch (error) {
                console.error("❌ Error clearing conversation history:", error);
                res.status(500).json({ message: "Sunucu hatası." });
            }
        });
    }
}
exports.ConversationController = ConversationController;
exports.default = new ConversationController();
