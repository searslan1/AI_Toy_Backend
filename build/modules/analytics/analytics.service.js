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
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_model_1 = require("./analytics.model");
class AnalyticsService {
    // Cihazın toplam konuşma süresini kaydet
    logUsage(deviceId, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield analytics_model_1.AnalyticsModel.findOneAndUpdate({ deviceId }, { $inc: { usageDuration: duration } }, { new: true, upsert: true });
            }
            catch (error) {
                console.error("❌ Kullanım verisi kaydedilirken hata oluştu:", error);
            }
        });
    }
    // Cihazdan gelen mesajları sayar
    logMessage(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield analytics_model_1.AnalyticsModel.findOneAndUpdate({ deviceId }, { $inc: { messagesSent: 1 } }, { new: true, upsert: true });
            }
            catch (error) {
                console.error("❌ Mesaj sayısı kaydedilirken hata oluştu:", error);
            }
        });
    }
    // Belirli bir cihazın kullanım verilerini döndür
    getUsage(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield analytics_model_1.AnalyticsModel.findOne({ deviceId });
            }
            catch (error) {
                console.error("❌ Kullanım verisi alınırken hata oluştu:", error);
            }
        });
    }
}
exports.default = new AnalyticsService();
