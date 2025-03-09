export interface DeviceDataPacket {
    deviceId: string;
    status: "online" | "offline";
    battery: number;
  }
  