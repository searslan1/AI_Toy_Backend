# **Node.js + TypeScript Backend – Modüler Mimari ve Yol Haritası**

# 

Aşağıda, **akıllı çocuk oyuncağı** projesi için **Node.js TypeScript tabanlı** bir backend iskeleti ve yol haritası sunulmaktadır. Bu yapı; **modüller, rotalar, servisler, modeller** ve **gerçek zamanlı iletişim** (ESP32 ile hızlı veri alışverişi) gibi temel gereksinimleri karşılayacak şekilde tasarlanmıştır.

---

## **1. Proje Klasör Yapısı (Önerilen İskelet)**

```
arduino
KopyalaDüzenle
project-backend/
 ┣ src/
 ┃ ┣ config/
 ┃ ┃ ┗ database.config.ts         // MongoDB bağlantı ayarları, env değişkenleri
 ┃ ┣ middlewares/
 ┃ ┃ ┣ auth.middleware.ts         // JWT kontrolü, kullanıcı doğrulama
 ┃ ┃ ┗ error.middleware.ts        // Global hata yakalama
 ┃ ┣ modules/
 ┃ ┃ ┣ auth/
 ┃ ┃ ┃ ┣ auth.controller.ts       // Auth ile ilgili HTTP istekleri (login, register)
 ┃ ┃ ┃ ┣ auth.service.ts          // İş mantığı (şifre hashing, token oluşturma vs.)
 ┃ ┃ ┃ ┗ auth.model.ts            // Auth’a özel şema veya arayüz (User modeli ile entegre)
 ┃ ┃ ┣ device/
 ┃ ┃ ┃ ┣ device.controller.ts     // Cihaz yönetimiyle ilgili istekler
 ┃ ┃ ┃ ┣ device.service.ts        // Cihaz iş mantığı (kaydetme, güncelleme, silme)
 ┃ ┃ ┃ ┗ device.model.ts          // Device şeması (MongoDB)
 ┃ ┃ ┣ conversation/
 ┃ ┃ ┃ ┣ conversation.controller.ts // Konuşma kayıtlarını yönetme
 ┃ ┃ ┃ ┣ conversation.service.ts  // Sohbet iş mantığı
 ┃ ┃ ┃ ┗ conversation.model.ts    // Sohbet şeması (mesajlar, zaman damgası)
 ┃ ┃ ┣ ai/
 ┃ ┃ ┃ ┣ ai.controller.ts         // AI ile ilgili istek (Chat, TTS, STT entegrasyonu)
 ┃ ┃ ┃ ┗ ai.service.ts            // AI iş mantığı (OpenAI, Google TTS çağrıları)
 ┃ ┃ ┣ analytics/
 ┃ ┃ ┃ ┣ analytics.controller.ts  // Analitik verileri döndüren endpointler
 ┃ ┃ ┃ ┣ analytics.service.ts     // Kullanım verisi analiz mantığı
 ┃ ┃ ┃ ┗ analytics.model.ts       // Analitik veya kullanım istatistiği şemaları
 ┃ ┃ ┣ websocket/
 ┃ ┃ ┃ ┣ websocket.gateway.ts     // WebSocket kurulum ve olaylar (ESP32 ile iletişim)
 ┃ ┃ ┃ ┣ websocket.service.ts     // WS üzerinden alınan verileri işleme
 ┃ ┃ ┃ ┗ websocket.types.ts       // WS mesaj tipleri, arayüzler
 ┃ ┣ routes/
 ┃ ┃ ┗ index.ts                   // Tüm modüllerin rotalarını birleştiren dosya
 ┃ ┣ utils/
 ┃ ┃ ┗ encryption.util.ts         // AES veya benzeri şifreleme işlemleri
 ┃ ┣ app.ts                       // Express veya NestJS app yapılandırması
 ┃ ┗ server.ts                    // Sunucuyu ayağa kaldıran giriş noktası
 ┣ .env                           // Ortam değişkenleri (DB_URL, API_KEYS vs.)
 ┣ package.json
 ┗ tsconfig.json

```

> Not: İhtiyaca göre ek klasörler (ör. helpers, constants, types) oluşturulabilir.
> 
> 
> Ayrıca bu yapı, **NestJS** kullanırken **module**, **controller**, **service** kavramlarını koruyacak şekilde de düzenlenebilir.
> 

---

## **2. Modüllerin Detaylı Açıklaması**

### **🔹 2.1 Auth Modülü**

- **Amaç:** Kullanıcı kayıt, giriş, çıkış ve ebeveyn kontrolleri.
- **auth.controller.ts**
    - **POST /auth/register:** Yeni ebeveyn/ kullanıcı kaydı.
    - **POST /auth/login:** Token üretimi (JWT).
    - **POST /auth/logout:** Oturum sonlandırma.
- **auth.service.ts**
    - Şifre hashing (BCrypt veya Argon2).
    - JWT oluşturma, yenileme.
    - Ebeveyn & çocuk ayırt edici ek alanlar.
- **auth.model.ts**
    - `User` şemasına ek alanlar: email, password, children vb.

### **🔹 2.2 Device Modülü**

- **Amaç:** Oyuncakların yönetimi, bağlantı durumu, WiFi bilgileri gibi ayarları tutmak.
- **device.controller.ts**
    - **POST /device/register:** Yeni cihaz kaydı (eşleştirme).
    - **GET /device/list:** Kullanıcının tüm cihazlarını listeleme.
    - **PATCH /device/update/:id:** Cihaz adını, durumunu güncelleme.
    - **DELETE /device/remove/:id:** Cihazı silme.
- **device.service.ts**
    - Cihazın MongoDB’ye kaydı, güncellemeler.
    - WiFi bilgilerini şifreli tutma (ör. AES).
    - BLE & WebSocket bağlantısı yönetimi (temel mantık).
- **device.model.ts**
    - `Device` şeması: owner_id, name, status, wifiCreds (encrypted), battery, vb.

### **🔹 2.3 Conversation Modülü**

- **Amaç:** Çocuk ve AI arasındaki konuşmaların yönetimi.
- **conversation.controller.ts**
    - **POST /chat/send-message:** Yeni mesaj oluşturma.
    - **GET /chat/history:** Kullanıcının geçmiş konuşmalarını listeleme.
    - **DELETE /chat/clear-history:** Geçmişi silme.
- **conversation.service.ts**
    - Konuşmaları veritabanına kaydetme.
    - Ebeveyn tarafından istenirse filtreleme (tarih, konu).
    - Büyük veri yönetimi için sayfalama (pagination).
- **conversation.model.ts**
    - `Conversation` şeması: child_id, device_id, messages[], timestamps.

### **🔹 2.4 AI Modülü**

- **Amaç:** OpenAI veya Google TTS/STT API ile entegrasyon.
- **ai.controller.ts**
    - **POST /ai/text-to-speech:** Metni sese çevirip dönen veriyi yönetmek.
    - **POST /ai/speech-to-text:** Sesi metne çevirip konuşma servisine iletmek.
- **ai.service.ts**
    - OpenAI GPT-3.5 / GPT-4 veya Google Cloud TTS/STT çağrıları.
    - Ebeveynin belirlediği kişilik ayarlarına göre prompt yönetimi.
    - Filtreleme ve yaş kısıtlaması gibi ön kontroller.

### **🔹 2.5 Analytics Modülü**

- **Amaç:** Çocuğun kullanım verilerini (konuşma süresi, öğrenme ilerlemesi vb.) toplamak ve raporlamak.
- **analytics.controller.ts**
    - **GET /analytics/usage:** Günlük/haftalık kullanım süreleri.
    - **GET /analytics/learning-progress:** AI ile hangi konularda konuştuğuna dair rapor.
- **analytics.service.ts**
    - Kullanım verilerinin analizini yapan fonksiyonlar (ör. basit istatistikler).
    - Gerekirse ML tabanlı trend analizi.
- **analytics.model.ts**
    - Kullanım istatistikleri veya özet tablolar.

### **🔹 2.6 WebSocket Modülü**

- **Amaç:** ESP32 ile **hızlı veri (özellikle ses) iletişimi** sağlamak, gerçek zamanlı mesajları yönetmek.
- **websocket.gateway.ts**
    - WebSocket server kurulumunu gerçekleştirir.
    - Olay dinleyicileri (connect, disconnect, dataReceive vb.).
- **websocket.service.ts**
    - Ses paketlerinin alınması ve AI servisine yönlendirilmesi.
    - Anlık cihaz durum bildirimi (online/offline) yönetimi.
- **websocket.types.ts**
    - Gelen/giden mesajların arayüzleri (ör. `AudioDataPacket`, `DeviceStatusMessage`).

---

## **3. ESP32 ile Hızlı Veri İletişimi İçin Alınacak Önlemler**

1. **TLS/SSL Şifreleme (WSS)**
    - WebSocket trafiğini **WSS (WebSocket Secure)** üzerinden çalıştırarak veri gizliliğini ve bütünlüğünü sağlamak.
2. **Veri Paketleme & Segmentasyon**
    - Ses verisi büyük boyutlu olabilir, dolayısıyla **paketlere bölme** ve **sıralı işleme** mekanizması kurmak.
3. **Oturum & Kimlik Doğrulama**
    - ESP32, ilk bağlantıda **token** veya **cihaz kimliği** kullanarak kimlik doğrulaması yapmalı.
4. **Zaman Aşımı & Yeniden Bağlanma Mekanizması**
    - Bağlantı kopması durumunda otomatik yeniden bağlanma ya da **fallback (MQTT gibi)** protokollere yönelme.
5. **Aşırı Yük Yönetimi (Rate Limiting)**
    - Beklenmeyen trafik artışlarında sunucunun çökmesini önlemek için **rate limit** veya **buffer** yönetimi.

---

## **4. Güvenlik ve Orta Katmanlar**

- **auth.middleware.ts**
    - Gelen isteklerin JWT doğrulaması, ebeveyn-çocuk rol kontrolü.
- **error.middleware.ts**
    - Global hata yakalama, kullanıcı dostu hata mesajları üretme.
- **encryption.util.ts**
    - WiFi şifrelerinin veya hassas verilerin AES ile şifrelenip açılması.

---

## **5. Yol Haritası**

### **Aşama 1: Temel Kurulum & Altyapı**

1. **Node.js + TypeScript Projesi** başlatmak.
2. **Temel Express/NestJS yapılandırması** ve **MongoDB** bağlantısı.
3. **Auth modülü** – Kayıt, giriş, JWT doğrulama.

### **Aşama 2: Cihaz ve Konuşma Modülleri**

1. **Device modülü** – Oyuncak kaydı, yönetimi.
2. **Conversation modülü** – Sohbet geçmişi veritabanı entegrasyonu.
3. **WebSocket modülü** temelleri – ESP32’den gelen veriyi kabul etme.

### **Aşama 3: AI & TTS/STT Entegrasyonu**

1. **AI modülü** – OpenAI/Google API entegrasyonları.
2. **Konuşma akışı** – STT → AI → TTS döngüsünün uçtan uca testi.
3. **Veri şifreleme** – WiFi bilgileri ve hassas verilerin korunması.

### **Aşama 4: Analytics ve Optimizasyon**

1. **Analytics modülü** – Kullanım istatistikleri, raporlar.
2. **Ölçeklenebilirlik ve performans testleri** (Load testing, stress testing).
3. **Güvenlik önlemleri** – Rate limiting, veri maskeleme, log yönetimi.

### **Aşama 5: Üretim Hazırlığı**

1. **Docker** veya benzeri konteynerleşme yapısı.
2. **CI/CD** süreçlerinin tanımlanması (GitHub Actions, GitLab CI).
3. **Monitoring & Loglama** (Winston, Graylog, Elasticsearch vb.).

---

## **Sonuç**

Bu iskelet, **Node.js + TypeScript** temelinde **modüler, güvenli ve ölçeklenebilir bir backend** oluşturmak için başlangıç noktası sağlar. Her modülün **kendi controller, service ve model** dosyalarına sahip olması, geliştirici ekiplerin bağımsız çalışabilmesine imkân verir.

**ESP32 ile hızlı veri iletimi** için **WSS, paket yönetimi** ve **kimlik doğrulama** süreçleri kritik önem taşır. Ayrıca **AI servisleri** ile entegre olup **STT ve TTS** işlemlerini yöneterek projeye gerçek sesli etkileşim yeteneği kazandırılacaktır.

> Bu yol haritası ve yapı kapsamlı bir ticari ürünün temel gereksinimlerini karşılayacak şekilde tasarlanmış olup, ilerleyen aşamalarda operasyonel gerekliliklere (test, deployment, ölçeklendirme) göre genişletilebilir.
>