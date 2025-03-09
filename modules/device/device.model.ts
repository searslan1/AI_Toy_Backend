import { Schema, model } from "mongoose";

interface IDevice {
  userId: string;
  name: string;
  status: "online" | "offline";
  battery: number;
  wifiCreds: string; // Şifreli WiFi bilgisi
}

const DeviceSchema = new Schema<IDevice>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    battery: { type: Number, default: 100 },
    wifiCreds: { type: String, required: true },
  },
  { timestamps: true }
);

export const DeviceModel = model<IDevice>("Device", DeviceSchema);
