import express from "express";
import { PORT } from "./config/config";
import { connectDB } from "./db/database"; // connectDB fonksiyonunu import ediyoruz
import cookieParser from "cookie-parser";
import router from "./modules/index";


const app = express();


// Veritabanı bağlantısını başlatıyoruz
connectDB();
console.log("Veritabanı bağlantısı başlatıldı.");

// Middleware: JSON verisi işlemesi için
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// Route: Başvuru işlemleri

app.use("/api", router); 
// Sunucuyu başlatıyoruz
app.listen(PORT, () => {
  console.log(`Server ${PORT} üzerinde çalışıyor.`);
});