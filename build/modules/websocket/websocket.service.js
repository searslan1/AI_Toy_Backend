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
const device_service_1 = __importDefault(require("../device/device.service"));
const conversation_service_1 = __importDefault(require("../conversation/conversation.service"));
class WebSocketService {
    processDeviceData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { deviceId, status, battery, sender, text, childId } = data;
                if (!deviceId) {
                    console.error("❌ Eksik veri: deviceId gereklidir.");
                    return;
                }
                // Cihazın durumu güncelleniyor
                yield device_service_1.default.updateDeviceStatus(deviceId, { status, battery });
                // Eğer mesaj içeriği varsa konuşma kaydet
                if (childId && sender && text) {
                    yield conversation_service_1.default.sendMessage(childId, deviceId, sender, text);
                    console.log(`📡 Cihaz mesaj kaydedildi: ${deviceId}`);
                }
            }
            catch (error) {
                console.error("❌ WebSocket veri işleme hatası:", error);
            }
        });
    }
}
exports.default = new WebSocketService();
