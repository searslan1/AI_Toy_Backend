import { Schema, model } from "mongoose";

interface IAnalytics {
  deviceId: string;
  usageDuration: number;
  messagesSent: number;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    deviceId: { type: String, required: true },
    usageDuration: { type: Number, default: 0 },
    messagesSent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const AnalyticsModel = model<IAnalytics>("Analytics", AnalyticsSchema);
