import fs from 'fs';
import { SpeechClient, protos as speechProtos } from '@google-cloud/speech';
import { TextToSpeechClient, protos as ttsProtos } from '@google-cloud/text-to-speech';
import OpenAI from 'openai';

// 🔹 Google Cloud istemcileri
const speechClient = new SpeechClient();
const ttsClient = new TextToSpeechClient();

// 🔹 OpenAI API istemcisi
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  
  // 🔹 Google Speech-to-Text kullanarak sesi metne çevir
  async speechToText(audioFilePath: string): Promise<string> {
    try {
      const audioBuffer = fs.readFileSync(audioFilePath);
      const audioBytes = audioBuffer.toString('base64');

      const request: speechProtos.google.cloud.speech.v1.IRecognizeRequest = {
        audio: { content: audioBytes },
        config: {
          encoding: speechProtos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
          sampleRateHertz: 16000,
          languageCode: 'tr-TR',
        },
      };

      // 🔹 Google Cloud STT API dönüşünü TypeScript'e uygun hale getirdik
      const response = await speechClient.recognize(request);
      const results = response[0]?.results || [];

      if (results.length === 0) {
        console.log("🎙️ Hiçbir metin tanımlanamadı.");
        return "Ses anlaşılamadı.";
      }

      const transcription = results
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
    try {
      const request: ttsProtos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text },
        voice: {
          languageCode: 'tr-TR',
          ssmlGender: ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE, // 🔹 Hata düzeltildi
        },
        audioConfig: { audioEncoding: ttsProtos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
      };

      // 🔹 Google Cloud TTS API dönüşünü TypeScript'e uygun hale getirdik
      const response = await ttsClient.synthesizeSpeech(request);
      const audioContent = response[0]?.audioContent;

      if (!audioContent) {
        throw new Error("Ses üretilemedi.");
      }

      fs.writeFileSync(outputPath, audioContent);
      return outputPath;
      
    } catch (error) {
      console.error("❌ TTS hatası:", error);
      throw new Error("Metin sese dönüştürülürken hata oluştu.");
    }
  }
}

export default new AIService();
