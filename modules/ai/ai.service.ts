import fs from 'fs';
import { SpeechClient, protos as speechProtos } from '@google-cloud/speech';
import { TextToSpeechClient, protos as ttsProtos } from '@google-cloud/text-to-speech';
import OpenAI from 'openai';
import { AIProfileModel } from './ai.model';

// 🔹 Google Cloud istemcileri
const speechClient = new SpeechClient();
const ttsClient = new TextToSpeechClient();

// 🔹 OpenAI API istemcisi
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  
  // 📌 Ses verisini metne çevir (Google STT)
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

  // 📌 OpenAI'ye mesaj gönder ve yanıt al (Çocuğun profiline göre kişiselleştirilmiş)
  async askAI(text: string, userId: string): Promise<string> {
    try {
      // Kullanıcının AI profili varsa çekelim
      const userProfile = await AIProfileModel.findOne({ userId });

      // Varsayılan prompt seçenekleri
      let promptOptions = "Sen bir yardımcı AI'sin.";

      if (userProfile) {
        const { childName, age, personality, interests } = userProfile;

        const interestString = interests.length > 0 ? `İlgi alanları: ${interests.join(', ')}` : '';

        // Kullanıcıya özel prompt belirleme
        promptOptions = `Sen bir ${personality} kişiliğe sahip AI'sin. ${childName} isimli çocuk seninle konuşuyor. ${age} yaşında ve ${interestString}. Ona uygun şekilde cevap ver.`;

        console.log(`🎯 AI Profili Kullanılıyor: ${promptOptions}`);
      } else {
        console.log(`⚠️ AI Profili bulunamadı, varsayılan yanıt oluşturuluyor.`);
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: promptOptions },
          { role: 'user', content: text }
        ],
      });

      return response.choices[0]?.message?.content || 'Yanıt alınamadı.';

    } catch (error) {
      console.error("❌ OpenAI Hatası:", error);
      throw new Error("AI yanıt oluşturulurken hata oluştu.");
    }
  }

  // 📌 Google TTS ile yanıtı sese çevir (Çocuğun tercih ettiği ses tipine göre)
  async textToSpeech(text: string, outputPath: string, userId: string): Promise<string> {
    try {
      // Kullanıcının AI profili varsa çekelim
      const userProfile = await AIProfileModel.findOne({ userId });

      let voiceType: ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender =
        ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL;

      if (userProfile) {
        if (userProfile.voiceType === 'Erkek') {
          voiceType = ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE;
        } else if (userProfile.voiceType === 'Kadın') {
          voiceType = ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE;
        } else if (userProfile.voiceType === 'Çocuk') {
          voiceType = ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL;
        }
      }

      const request: ttsProtos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text },
        voice: {
          languageCode: 'tr-TR',
          ssmlGender: voiceType,
        },
        audioConfig: { audioEncoding: ttsProtos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
      };

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
