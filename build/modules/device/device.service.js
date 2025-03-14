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
    // ✅ listDevices metodunu ekleyin
    listDevices(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const devices = yield device_model_1.DeviceModel.find({ ownerId });
                return { success: true, devices };
            }
            catch (error) {
                console.error("❌ Cihazları listeleme hatası:", error);
                return { success: false, message: "Cihazlar listelenirken hata oluştu." };
            }
        });
    }
    // ✅ removeDevice metodunu ekleyin
    removeDevice(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield device_model_1.DeviceModel.findByIdAndDelete(deviceId);
                return { success: true, message: "Cihaz başarıyla silindi." };
            }
            catch (error) {
                console.error("❌ Cihaz silme hatası:", error);
                return { success: false, message: "Cihaz silinirken hata oluştu." };
            }
        });
    }
}
exports.default = new DeviceService();
