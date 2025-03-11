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
const ai_service_1 = __importDefault(require("./ai.service"));
const ai_utils_1 = __importDefault(require("./ai.utils"));
const path_1 = __importDefault(require("path"));
class AIController {
    processAudio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    res.status(400).json({ message: 'Ses dosyası gereklidir' });
                    return;
                }
                const inputPath = req.file.path;
                const wavPath = path_1.default.join('uploads', ai_utils_1.default.generateFileName('.wav'));
                const outputAudioPath = path_1.default.join('uploads', ai_utils_1.default.generateFileName('.mp3'));
                yield ai_utils_1.default.convertToWav(inputPath, wavPath);
                const text = yield ai_service_1.default.speechToText(wavPath);
                const aiResponse = yield ai_service_1.default.askAI(text, req.body.userId);
                yield ai_service_1.default.textToSpeech(aiResponse, outputAudioPath, req.body.userId);
                console.log(`✅ Yanıt başarıyla oluşturuldu: ${outputAudioPath}`);
                // **Dosya Silme Kaldırıldı (Test için)**
                res.sendFile(outputAudioPath, { root: '.' });
            }
            catch (error) {
                console.error("❌ Hata:", error);
                res.status(500).json({ message: 'İşlenirken hata oluştu' });
            }
        });
    }
}
exports.default = new AIController();
