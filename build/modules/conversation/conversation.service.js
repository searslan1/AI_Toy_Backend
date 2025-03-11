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
const conversation_model_1 = require("./conversation.model");
const analytics_service_1 = __importDefault(require("../analytics/analytics.service"));
class ConversationService {
    // Yeni mesaj ekleme
    sendMessage(childId, deviceId, sender, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let conversation = yield conversation_model_1.ConversationModel.findOne({ childId, deviceId });
                if (!conversation) {
                    conversation = new conversation_model_1.ConversationModel({ childId, deviceId, messages: [] });
                }
                const message = { sender, text, timestamp: new Date() };
                conversation.messages.push(message);
                yield conversation.save();
                // Kullanım analitiğini güncelle
                yield analytics_service_1.default.logMessage(deviceId);
                return { success: true, conversation };
            }
            catch (error) {
                console.error("❌ Mesaj kaydetme hatası:", error);
                return { success: false, message: "Mesaj kaydedilirken hata oluştu." };
            }
        });
    }
    // Kullanıcının konuşma geçmişini listeleme (Pagination destekli)
    getConversationHistory(childId_1, deviceId_1) {
        return __awaiter(this, arguments, void 0, function* (childId, deviceId, page = 1, limit = 10) {
            try {
                const conversation = yield conversation_model_1.ConversationModel.findOne({ childId, deviceId })
                    .slice("messages", [(page - 1) * limit, limit]) // Sayfalama için slice
                    .exec();
                if (!conversation) {
                    return { success: false, message: "Konuşma geçmişi bulunamadı." };
                }
                return { success: true, messages: conversation.messages };
            }
            catch (error) {
                console.error("❌ Konuşma geçmişi alınırken hata oluştu:", error);
                return { success: false, message: "Konuşma geçmişi alınırken hata oluştu." };
            }
        });
    }
    // Konuşma geçmişini temizleme
    clearConversationHistory(childId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = yield conversation_model_1.ConversationModel.findOne({ childId, deviceId });
                if (!conversation) {
                    return { success: false, message: "Silinecek konuşma geçmişi bulunamadı." };
                }
                conversation.messages = []; // Mesajları temizle
                yield conversation.save();
                return { success: true, message: "Konuşma geçmişi başarıyla temizlendi." };
            }
            catch (error) {
                console.error("❌ Konuşma geçmişi temizlenirken hata oluştu:", error);
                return { success: false, message: "Konuşma geçmişi temizlenirken hata oluştu." };
            }
        });
    }
}
exports.default = new ConversationService();
