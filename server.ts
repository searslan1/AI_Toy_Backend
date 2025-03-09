// import express from "express";
// import { PORT } from "./config/config";
// import { connectDB } from "./db/database"; // connectDB fonksiyonunu import ediyoruz
// import cookieParser from "cookie-parser";
// import router from "./modules/index";


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


import express from "express";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/database";
import router from "./modules/index";
import WebSocketGateway from "./modules/websocket/websocket.gateway";

// 📌 .env Dosyasını Yükle
dotenv.config();

// 📌 Express Uygulamasını Başlat
const app = express();

// 📌 Middleware'ler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 📌 API rotalarını bağla
app.use("/api", router);

// 📌 HTTP Sunucusu Oluştur
const server = http.createServer(app);

// 📡 WebSocket Sunucusunu Başlat
WebSocketGateway.initialize(server);

// 📌 Veritabanına Bağlan
connectDB();
console.log("✅ Veritabanı bağlantısı başarılı.");

// 📌 Sunucuyu Dinle
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor.`);
});
