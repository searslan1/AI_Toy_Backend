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

  // ✅ listDevices metodunu ekleyin
  async listDevices(ownerId: string) {
    try {
      const devices = await DeviceModel.find({ ownerId });
      return { success: true, devices };
    } catch (error) {
      console.error("❌ Cihazları listeleme hatası:", error);
      return { success: false, message: "Cihazlar listelenirken hata oluştu." };
    }
  }

  // ✅ removeDevice metodunu ekleyin
  async removeDevice(deviceId: string) {
    try {
      await DeviceModel.findByIdAndDelete(deviceId);
      return { success: true, message: "Cihaz başarıyla silindi." };
    } catch (error) {
      console.error("❌ Cihaz silme hatası:", error);
      return { success: false, message: "Cihaz silinirken hata oluştu." };
    }
  }
}

export default new DeviceService();
