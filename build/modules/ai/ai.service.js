"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const speech_1 = require("@google-cloud/speech");
const text_to_speech_1 = require("@google-cloud/text-to-speech");
const openai_1 = __importDefault(require("openai"));
const ai_model_1 = require("./ai.model");
// 🔹 Google Cloud istemcileri
const speechClient = new speech_1.SpeechClient();
const ttsClient = new text_to_speech_1.TextToSpeechClient();
// 🔹 OpenAI API istemcisi
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
class AIService {
    // 📌 Dinamik Sample Rate ile STT (Speech-to-Text)
    speechToText(audioFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // 🎯 Ses dosyasının örnekleme hızını tespit et
                const sampleRateHertz = yield new Promise((resolve, reject) => {
                    fluent_ffmpeg_1.default.ffprobe(audioFilePath, (err, metadata) => {
                        var _a;
                        if (err) {
                            console.error("❌ FFmpeg hata:", err);
                            reject(err);
                        }
                        const sampleRate = (_a = metadata.streams[0]) === null || _a === void 0 ? void 0 : _a.sample_rate;
                        if (!sampleRate) {
                            console.warn("⚠ Varsayılan örnekleme hızı (16000 Hz) kullanılıyor.");
                            resolve(16000);
                        }
                        else {
                            resolve(sampleRate);
                        }
                    });
                });
                console.log(`🎙️ Ses örnekleme hızı tespit edildi: ${sampleRateHertz} Hz`);
                const audioBuffer = fs_1.default.readFileSync(audioFilePath);
                const audioBytes = audioBuffer.toString('base64');
                const request = {
                    audio: { content: audioBytes },
                    config: {
                        encoding: speech_1.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
                        sampleRateHertz, // ✅ HATA ÇÖZÜLDÜ! Sayı olarak kullanıldı.
                        languageCode: 'tr-TR',
                    },
                };
                const response = yield speechClient.recognize(request);
                const results = ((_a = response[0]) === null || _a === void 0 ? void 0 : _a.results) || [];
                if (results.length === 0) {
                    console.log("🎙️ Hiçbir metin tanımlanamadı.");
                    return "Ses anlaşılamadı.";
                }
                const transcription = results
                    .map(result => { var _a, _b; return ((_b = (_a = result.alternatives) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.transcript) || ''; })
                    .join(' ');
                console.log("🎙️ Ses metne dönüştürüldü:", transcription);
                return transcription || "Metin çıkarılamadı.";
            }
            catch (error) {
                console.error("❌ STT hatası:", error);
                throw new Error("Ses metne dönüştürülürken hata oluştu.");
            }
        });
    }
    // 📌 OpenAI'ye mesaj gönder ve yanıt al (Çocuğun profiline göre kişiselleştirilmiş)
    askAI(text, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userProfile = yield ai_model_1.AIProfileModel.findOne({ userId });
                let promptOptions = "Sen bir yardımcı AI'sin.";
                if (userProfile) {
                    const { childName, age, personality, interests } = userProfile;
                    const interestString = interests.length > 0 ? `İlgi alanları: ${interests.join(', ')}` : '';
                    promptOptions = `Sen bir ${personality} kişiliğe sahip AI'sin. ${childName} isimli çocuk seninle konuşuyor. ${age} yaşında ve ${interestString}. Ona uygun şekilde cevap ver.`;
                }
                // 📌 Rate Limiting: 1 saniye bekleyerek OpenAI API çağrısı yap
                yield new Promise(resolve => setTimeout(resolve, 1000));
                const response = yield openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: promptOptions },
                        { role: 'user', content: text }
                    ],
                });
                return ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || 'Yanıt alınamadı.';
            }
            catch (error) {
                console.error("❌ OpenAI Hatası:", error);
                if (error.code === 'insufficient_quota') {
                    return "⚠️ OpenAI API kullanım limitin dolmuş! Lütfen yeni bir API anahtarı ekleyin veya kullanım limitinizi artırın.";
                }
                if (error.code === 'rate_limit_exceeded') {
                    return "⚠️ Çok fazla istek gönderildi, lütfen birkaç saniye bekleyip tekrar deneyin.";
                }
                return "⚠️ AI şu anda yanıt veremiyor, lütfen daha sonra tekrar deneyin.";
            }
        });
    }
    // 📌 Google TTS ile yanıtı sese çevir (Çocuğun tercih ettiği ses tipine göre)
    textToSpeech(text, outputPath, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userProfile = yield ai_model_1.AIProfileModel.findOne({ userId });
                let voiceType = text_to_speech_1.protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL;
                let voiceName = "tr-TR-Wavenet-D"; // **Varsayılan: Kız çocuk sesi**
                if (userProfile) {
                    if (userProfile.voiceType === 'Erkek') {
                        voiceType = text_to_speech_1.protos.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE;
                        voiceName = "tr-TR-Wavenet-B"; // **Erkek çocuk sesi**
                    }
                    else if (userProfile.voiceType === 'Kadın') {
                        voiceType = text_to_speech_1.protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE;
                        voiceName = "tr-TR-Wavenet-D"; // **Kadın sesi**
                    }
                    else if (userProfile.voiceType === 'Çocuk') {
                        voiceType = text_to_speech_1.protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL;
                        voiceName = "tr-TR-Wavenet-D"; // **Kız çocuk sesi**
                    }
                }
                // 📌 **SSML Kullanımı ile Daha Hızlı ve Enerjik Çocuk Sesi**
                const ssmlText = `
        <speak>
          <prosody rate="fast" pitch="6st">
            ${text}
          </prosody>
        </speak>
      `;
                const request = {
                    input: { ssml: ssmlText }, // **SSML Kullanıldı!**
                    voice: {
                        languageCode: 'tr-TR',
                        ssmlGender: voiceType,
                        name: voiceName,
                    },
                    audioConfig: { audioEncoding: text_to_speech_1.protos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
                };
                const response = yield ttsClient.synthesizeSpeech(request);
                const audioContent = (_a = response[0]) === null || _a === void 0 ? void 0 : _a.audioContent;
                if (!audioContent) {
                    throw new Error("Ses üretilemedi.");
                }
                fs_1.default.writeFileSync(outputPath, audioContent);
                return outputPath;
            }
            catch (error) {
                console.error("❌ TTS hatası:", error);
                throw new Error("Metin sese dönüştürülürken hata oluştu.");
            }
        });
    }
}
exports.default = new AIService();
