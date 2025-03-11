"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModel = void 0;
const mongoose_1 = require("mongoose");
const AnalyticsSchema = new mongoose_1.Schema({
    deviceId: { type: String, required: true },
    usageDuration: { type: Number, default: 0 },
    messagesSent: { type: Number, default: 0 },
}, { timestamps: true });
exports.AnalyticsModel = (0, mongoose_1.model)("Analytics", AnalyticsSchema);
