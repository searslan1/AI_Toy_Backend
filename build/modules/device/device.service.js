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
const device_model_1 = require("./device.model");
class DeviceService {
    registerDevice(ownerId, name, wifiCreds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDevice = yield device_model_1.DeviceModel.create({ ownerId, name, wifiCreds });
                return { success: true, device: newDevice };
            }
            catch (error) {
                console.error("❌ Cihaz kaydı hatası:", error);
                return { success: false, message: "Cihaz kaydedilirken hata oluştu." };
            }
        });
    }
    updateDeviceStatus(deviceId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield device_model_1.DeviceModel.findByIdAndUpdate(deviceId, data, { new: true });
        });
    }
}
exports.default = new DeviceService();
