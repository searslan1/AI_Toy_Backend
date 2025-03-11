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
const device_service_1 = __importDefault(require("./device.service"));
class DeviceController {
    registerDevice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ownerId, name, wifiCreds } = req.body;
            const result = yield device_service_1.default.registerDevice(ownerId, name, wifiCreds);
            res.status(result.success ? 201 : 500).json(result);
        });
    }
    listDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerId = req.params.ownerId;
            const devices = yield device_service_1.default.listDevices(ownerId);
            res.json(devices);
        });
    }
    removeDevice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deviceId } = req.params;
            yield device_service_1.default.removeDevice(deviceId);
            res.json({ message: "Cihaz başarıyla silindi." });
        });
    }
}
exports.default = new DeviceController();
