import fs from 'fs';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Configuration, OpenAIApi } from 'openai';
import AIUtils from './ai.utils';

// Google Cloud istemcileri
const speechClient = new SpeechClient();
const ttsClient = new TextToSpeechClient();

// OpenAI API istemcisi
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

class AIService {
  
  async speechToText(audioFilePath: string): Promise<string> {
    const audioBuffer = fs.readFileSync(audioFilePath);
    const audioBytes = audioBuffer.toString('base64');

    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: 'LINEAR16', 
        sampleRateHertz: 16000,
        languageCode: 'tr-TR', // Türkçe desteği
      },
    };

    const [response] = await speechClient.recognize(request);
    return response.results?.map(result => result.alternatives?.[0]?.transcript).join(' ') || '';
  }

  async askAI(text: string): Promise<string> {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: text }],
    });

    return response.data.choices[0]?.message?.content || 'Yanıt alınamadı.';
  }

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
