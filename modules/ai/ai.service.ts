import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
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
  
  // 📌 Dinamik Sample Rate ile STT (Speech-to-Text)
  async speechToText(audioFilePath: string): Promise<string> {
    try {
      // 🎯 Ses dosyasının örnekleme hızını tespit et
      const sampleRateHertz: number = await new Promise<number>((resolve, reject) => {
        ffmpeg.ffprobe(audioFilePath, (err, metadata) => {
          if (err) {
            console.error("❌ FFmpeg hata:", err);
            reject(err);
          }
          const sampleRate = metadata.streams[0]?.sample_rate;
          if (!sampleRate) {
            console.warn("⚠ Varsayılan örnekleme hızı (16000 Hz) kullanılıyor.");
            resolve(16000);
          } else {
            resolve(sampleRate);
          }
        });
      });
  
      console.log(`🎙️ Ses örnekleme hızı tespit edildi: ${sampleRateHertz} Hz`);
  
      const audioBuffer = fs.readFileSync(audioFilePath);
      const audioBytes = audioBuffer.toString('base64');
  
      const request: speechProtos.google.cloud.speech.v1.IRecognizeRequest = {
        audio: { content: audioBytes },
        config: {
          encoding: speechProtos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
          sampleRateHertz, // ✅ HATA ÇÖZÜLDÜ! Sayı olarak kullanıldı.
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
        .map(result => result.alternatives?.[0]?.transcript || '')
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
      const userProfile = await AIProfileModel.findOne({ userId });
  
      let promptOptions = "Sen bir yardımcı AI'sin.";
      if (userProfile) {
        const { childName, age, personality, interests } = userProfile;
        const interestString = interests.length > 0 ? `İlgi alanları: ${interests.join(', ')}` : '';
        promptOptions = `Sen bir ${personality} kişiliğe sahip AI'sin. ${childName} isimli çocuk seninle konuşuyor. ${age} yaşında ve ${interestString}. Ona uygun şekilde cevap ver.`;
      }
  
      // 📌 Rate Limiting: 1 saniye bekleyerek OpenAI API çağrısı yap
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: promptOptions },
          { role: 'user', content: text }
        ],
      });
  
      return response.choices[0]?.message?.content || 'Yanıt alınamadı.';
  
    } catch (error: any) {
      console.error("❌ OpenAI Hatası:", error);
  
      if (error.code === 'insufficient_quota') {
        return "⚠️ OpenAI API kullanım limitin dolmuş! Lütfen yeni bir API anahtarı ekleyin veya kullanım limitinizi artırın.";
      }
  
      if (error.code === 'rate_limit_exceeded') {
        return "⚠️ Çok fazla istek gönderildi, lütfen birkaç saniye bekleyip tekrar deneyin.";
      }
  
      return "⚠️ AI şu anda yanıt veremiyor, lütfen daha sonra tekrar deneyin.";
    }
  }
  
  

  // 📌 Google TTS ile yanıtı sese çevir (Çocuğun tercih ettiği ses tipine göre)
  async textToSpeech(text: string, outputPath: string, userId: string): Promise<string> {
    try {
      const userProfile = await AIProfileModel.findOne({ userId });
  
      let voiceType: ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender =
        ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL;
  
      let voiceName = "tr-TR-Wavenet-D"; // **Varsayılan: Kız çocuk sesi**
  
      if (userProfile) {
        if (userProfile.voiceType === 'Erkek') {
          voiceType = ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE;
          voiceName = "tr-TR-Wavenet-B"; // **Erkek çocuk sesi**
        } else if (userProfile.voiceType === 'Kadın') {
          voiceType = ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE;
          voiceName = "tr-TR-Wavenet-D"; // **Kadın sesi**
        } else if (userProfile.voiceType === 'Çocuk') {
          voiceType = ttsProtos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL;
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
  
      const request: ttsProtos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { ssml: ssmlText }, // **SSML Kullanıldı!**
        voice: {
          languageCode: 'tr-TR',
          ssmlGender: voiceType,
          name: voiceName,
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
