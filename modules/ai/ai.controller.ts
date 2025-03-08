import { Request, Response } from 'express';
import AIService from './ai.service';
import AIUtils from './ai.utils';
import path from 'path';

class AIController {
  async processAudio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'Ses dosyası gereklidir' });
        return;
      }

      const inputPath = req.file.path;
      const wavPath = path.join('uploads', AIUtils.generateFileName('.wav'));
      const outputAudioPath = path.join('uploads', AIUtils.generateFileName('.mp3'));

      await AIUtils.convertToWav(inputPath, wavPath);
      const text = await AIService.speechToText(wavPath);
      const aiResponse = await AIService.askAI(text, req.body.userId);
      await AIService.textToSpeech(aiResponse, outputAudioPath, req.body.userId);

      console.log(`✅ Yanıt başarıyla oluşturuldu: ${outputAudioPath}`);

      // **Dosya Silme Kaldırıldı (Test için)**
      res.sendFile(outputAudioPath, { root: '.' });

    } catch (error) {
      console.error("❌ Hata:", error);
      res.status(500).json({ message: 'İşlenirken hata oluştu' });
    }
  }
}

export default new AIController();
