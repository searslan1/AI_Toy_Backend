import { Request, Response } from 'express';
import multer from 'multer';
import AIService from './ai.service';
import AIUtils from './ai.utils';
import path from 'path';

const upload = multer({ dest: 'uploads/' });

class AIController {
  async processAudio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file || !req.body.userId) {
        res.status(400).json({ message: 'Ses dosyası ve kullanıcı ID gereklidir' });
        return;
      }

      const userId = req.body.userId;
      const inputPath = req.file.path;
      const wavPath = path.join('uploads', AIUtils.generateFileName('.wav'));
      const outputAudioPath = path.join('uploads', AIUtils.generateFileName('.mp3'));

      await AIUtils.convertToWav(inputPath, wavPath);
      const text = await AIService.speechToText(wavPath);
      const aiResponse = await AIService.askAI(text, userId);
      await AIService.textToSpeech(aiResponse, outputAudioPath, userId);

      res.sendFile(outputAudioPath, { root: '.' });

      setTimeout(async () => {
        await AIUtils.deleteFile(inputPath);
        await AIUtils.deleteFile(wavPath);
        await AIUtils.deleteFile(outputAudioPath);
      }, 5000);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'İşlenirken hata oluştu' });
    }
  }
}

export default new AIController();
