"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceModel = void 0;
const mongoose_1 = require("mongoose");
const DeviceSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    battery: { type: Number, default: 100 },
    wifiCreds: { type: String, required: true },
}, { timestamps: true });
exports.DeviceModel = (0, mongoose_1.model)("Device", DeviceSchema);
