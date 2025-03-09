import { DeviceModel } from "./device.model";

class DeviceService {
  async registerDevice(ownerId: string, name: string, wifiCreds: string) {
    try {
      const newDevice = await DeviceModel.create({ ownerId, name, wifiCreds });
      return { success: true, device: newDevice };
    } catch (error) {
      console.error("❌ Cihaz kaydı hatası:", error);
      return { success: false, message: "Cihaz kaydedilirken hata oluştu." };
    }
  }

  async updateDeviceStatus(deviceId: string, data: Partial<{ status: string; battery: number }>) {
    return await DeviceModel.findByIdAndUpdate(deviceId, data, { new: true });
  }
}

export default new DeviceService();
