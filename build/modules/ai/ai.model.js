"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIProfileModel = void 0;
const mongoose_1 = require("mongoose");
const AIProfileSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true }, // Ebeveyn ID’si üzerinden eşleştirme
    childName: { type: String, required: true },
    age: { type: Number, required: true },
    personality: { type: String, enum: ["Meraklı", "Eğlenceli", "Sabırlı", "Hızlı Öğrenen"], required: true },
    voiceType: { type: String, enum: ["Erkek", "Kadın", "Çocuk"], required: true, default: "Çocuk" },
    interests: { type: [String], default: [] }, // Boş bırakılabilir
}, { timestamps: true });
exports.AIProfileModel = (0, mongoose_1.model)("AIProfile", AIProfileSchema);
