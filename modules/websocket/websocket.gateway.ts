import WebSocket, { WebSocketServer } from "ws";
import dotenv from "dotenv";
import WebSocketService from "./websocket.service";

dotenv.config();

class WebSocketGateway {
  private wss: WebSocketServer | null = null;

  initialize(server: any) {
    // 📌 WebSocket Sunucusunu Başlat
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws) => {
      console.log("✅ Yeni cihaz bağlandı!");

      // 📌 Mesajları Dinle
      ws.on("message", async (message: string) => {
        try {
          const data = JSON.parse(message);
          console.log("📡 Mesaj alındı:", data);

          // **WebSocketService ile veriyi işle**
          await WebSocketService.processDeviceData(data);
          
          // Cevap olarak bağlantının başarılı olduğunu gönder
          ws.send(JSON.stringify({ event: "server-response", message: "WebSocket Bağlantısı Başarılı!" }));

        } catch (error) {
          console.error("❌ JSON Parse Hatası:", error);
        }
      });

      // 📌 Bağlantı kesilince log yaz
      ws.on("close", () => {
        console.log("❌ Cihaz bağlantısı kesildi.");
      });
    });
  }
}

export default new WebSocketGateway();