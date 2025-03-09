import DeviceService from "../device/device.service";
import ConversationService from "../conversation/conversation.service";

class WebSocketService {
  async processDeviceData(data: any) {
    try {
      const { deviceId, status, battery, sender, text, childId } = data;

      if (!deviceId) {
        console.error("❌ Eksik veri: deviceId gereklidir.");
        return;
      }

      // Cihazın durumu güncelleniyor
      await DeviceService.updateDeviceStatus(deviceId, { status, battery });

      // Eğer mesaj içeriği varsa konuşma kaydet
      if (childId && sender && text) {
        await ConversationService.sendMessage(childId, deviceId, sender, text);
        console.log(`📡 Cihaz mesaj kaydedildi: ${deviceId}`);
      }
      
    } catch (error) {
      console.error("❌ WebSocket veri işleme hatası:", error);
    }
  }
}

export default new WebSocketService();
