import { Request, Response } from "express";
import DeviceService from "./device.service";

class DeviceController {
  async registerDevice(req: Request, res: Response) {
    const { ownerId, name, wifiCreds } = req.body;
    const result = await DeviceService.registerDevice(ownerId, name, wifiCreds);
    res.status(result.success ? 201 : 500).json(result);
  }

  async listDevices(req: Request, res: Response) {
    const ownerId = req.params.ownerId;
    const devices = await DeviceService.listDevices(ownerId);
    res.json(devices);
  }

  async removeDevice(req: Request, res: Response) {
    const { deviceId } = req.params;
    await DeviceService.removeDevice(deviceId);
    res.json({ message: "Cihaz başarıyla silindi." });
  }
}

export default new DeviceController();
