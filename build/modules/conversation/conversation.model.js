"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModel = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    sender: { type: String, enum: ["child", "ai"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
const ConversationSchema = new mongoose_1.Schema({
    childId: { type: String, required: true },
    deviceId: { type: String, required: true },
    messages: [MessageSchema], // Mesaj dizisi
}, {
    timestamps: true, // Otomatik createdAt ve updatedAt alanları
});
exports.ConversationModel = (0, mongoose_1.model)("Conversation", ConversationSchema);
