import { Schema, model, Document } from "mongoose";

export interface IAIProfile extends Document {
  userId: string; // Ebeveyn ID'si üzerinden çocuk bilgilerini eşleştiriyoruz
  childName: string; // Çocuğun adı
  age: number; // Çocuğun yaşı
  personality: "Meraklı" | "Eğlenceli" | "Sabırlı" | "Hızlı Öğrenen"; // AI kişilik ayarı
  voiceType: "Erkek" | "Kadın" | "Çocuk"; // TTS (Metin okuma) için ses tipi
  interests: string[]; // Çocuğun ilgi alanları (Bilim, Hayvanlar, Hikayeler vb.)
}

const AIProfileSchema = new Schema<IAIProfile>(
  {
    userId: { type: String, required: true, unique: true }, // Ebeveyn ID’si üzerinden eşleştirme
    childName: { type: String, required: true },
    age: { type: Number, required: true },
    personality: { type: String, enum: ["Meraklı", "Eğlenceli", "Sabırlı", "Hızlı Öğrenen"], required: true },
    voiceType: { type: String, enum: ["Erkek", "Kadın", "Çocuk"], required: true, default: "Çocuk" },
    interests: { type: [String], default: [] }, // Boş bırakılabilir
  },
  { timestamps: true }
);

export const AIProfileModel = model<IAIProfile>("AIProfile", AIProfileSchema);