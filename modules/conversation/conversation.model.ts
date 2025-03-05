import { Schema, model, Document } from "mongoose";

export interface IMessage {
  sender: "child" | "ai"; // Mesajı gönderen kim?
  text: string; // Mesaj içeriği
  timestamp: Date; // Mesajın zamanı
}

export interface IConversation extends Document {
  childId: string; // Çocuğun kullanıcı ID'si
  deviceId: string; // Oyuncak ID'si
  messages: IMessage[]; // Konuşma içeriği
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ["child", "ai"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema<IConversation>(
  {
    childId: { type: String, required: true },
    deviceId: { type: String, required: true },
    messages: [MessageSchema], // Mesaj dizisi
  },
  {
    timestamps: true, // Otomatik createdAt ve updatedAt alanları
  }
);

export const ConversationModel = model<IConversation>("Conversation", ConversationSchema);
