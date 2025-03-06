import fs from 'fs';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import OpenAI from 'openai';
import AIUtils from './ai.utils';

// 🔹 Google Cloud istemcileri
const speechClient = new SpeechClient();
const ttsClient = new TextToSpeechClient();

// 🔹 OpenAI API istemcisi (Güncellendi)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  
  // 🔹 Google Speech-to-Text kullanarak sesi metne çevir
  async speechToText(audioFilePath: string): Promise<string> {
    try {
      const audioBuffer = fs.readFileSync(audioFilePath);
      const audioBytes = audioBuffer.toString('base64');

      const request = {
        audio: { content: audioBytes },
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'tr-TR',
        },
      };

      const [response] = await speechClient.recognize(request);

      if (!response.results || response.results.length === 0) {
        console.log("🎙️ Hiçbir metin tanımlanamadı.");
        return "Ses anlaşılamadı.";
      }

      const transcription = response.results
        .map(result => result.alternatives && result.alternatives.length > 0 ? result.alternatives[0].transcript : '')
        .join(' ');

      console.log("🎙️ Ses metne dönüştürüldü:", transcription);
      return transcription || "Metin çıkarılamadı.";

    } catch (error) {
      console.error("❌ STT hatası:", error);
      throw new Error("Ses metne dönüştürülürken hata oluştu.");
    }
  }

  // 🔹 OpenAI API ile konuşma oluştur
  async askAI(text: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: text }],
    });

    return response.choices[0]?.message?.content || 'Yanıt alınamadı.';
  }

  // 🔹 Google TTS ile metni sese çevir
  async textToSpeech(text: string, outputPath: string): Promise<string> {
    const request = {
      input: { text },
      voice: { languageCode: 'tr-TR', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    fs.writeFileSync(outputPath, response.audioContent as Buffer);
    return outputPath;
  }
}

export default new AIService();
