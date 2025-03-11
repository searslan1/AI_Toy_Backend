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
const ws_1 = require("ws");
const dotenv_1 = __importDefault(require("dotenv"));
const websocket_service_1 = __importDefault(require("./websocket.service"));
dotenv_1.default.config();
class WebSocketGateway {
    constructor() {
        this.wss = null;
    }
    initialize(server) {
        // 📌 WebSocket Sunucusunu Başlat
        this.wss = new ws_1.WebSocketServer({ server });
        this.wss.on("connection", (ws) => {
            console.log("✅ Yeni cihaz bağlandı!");
            // 📌 Mesajları Dinle
            ws.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = JSON.parse(message);
                    console.log("📡 Mesaj alındı:", data);
                    // **WebSocketService ile veriyi işle**
                    yield websocket_service_1.default.processDeviceData(data);
                    // Cevap olarak bağlantının başarılı olduğunu gönder
                    ws.send(JSON.stringify({ event: "server-response", message: "WebSocket Bağlantısı Başarılı!" }));
                }
                catch (error) {
                    console.error("❌ JSON Parse Hatası:", error);
                }
            }));
            // 📌 Bağlantı kesilince log yaz
            ws.on("close", () => {
                console.log("❌ Cihaz bağlantısı kesildi.");
            });
        });
    }
}
exports.default = new WebSocketGateway();
