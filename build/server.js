"use strict";
// import express from "express";
// import { PORT } from "./config/config";
// import { connectDB } from "./db/database"; // connectDB fonksiyonunu import ediyoruz
// import cookieParser from "cookie-parser";
// import router from "./modules/index";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// // Veritabanı bağlantısını başlatıyoruz
// connectDB();
// console.log("Veritabanı bağlantısı başlatıldı.");
// // Middleware: JSON verisi işlemesi için
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// // Route: Başvuru işlemleri
// app.use("/api", router); 
// // Sunucuyu başlatıyoruz
// app.listen(PORT, () => {
//   console.log(`Server ${PORT} üzerinde çalışıyor.`);
// });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_1 = require("./db/database");
const index_1 = __importDefault(require("./modules/index"));
const websocket_gateway_1 = __importDefault(require("./modules/websocket/websocket.gateway"));
// 📌 .env Dosyasını Yükle
dotenv_1.default.config();
// 📌 Express Uygulamasını Başlat
const app = (0, express_1.default)();
// 📌 Middleware'ler
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// 📌 API rotalarını bağla
app.use("/api", index_1.default);
// 📌 HTTP Sunucusu Oluştur
const server = http_1.default.createServer(app);
// 📡 WebSocket Sunucusunu Başlat
websocket_gateway_1.default.initialize(server);
// 📌 Veritabanına Bağlan
(0, database_1.connectDB)();
console.log("✅ Veritabanı bağlantısı başarılı.");
// 📌 Sunucuyu Dinle
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor.`);
});
