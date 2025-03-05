import dotenv from "dotenv";

// dotenv.config() fonksiyonu, .env dosyasındaki çevresel değişkenleri yüklüyor.
dotenv.config();

export const PORT = process.env.PORT || 8080;


export const MONGO_URL = process.env.MONGO_DB_URL;