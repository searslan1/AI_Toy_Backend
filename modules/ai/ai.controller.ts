import { Request, Response } from 'express';
import multer from 'multer';
import AIService from './ai.service';
import AIUtils from './ai.utils';
import path from 'path';

const upload = multer({ dest: 'uploads/' });

class AIController {
  async processAudio(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ message: 'Ses dosyası gereklidir' });

      const inputPath = req.file.path;
      const wavPath = path.join('uploads', AIUtils.generateFileName('.wav'));
      const outputAudioPath = path.join('uploads', AIUtils.generateFileName('.mp3'));

      await AIUtils.convertToWav(inputPath, wavPath);
      const text = await AIService.speechToText(wavPath);
      const aiResponse = await AIService.askAI(text);
      await AIService.textToSpeech(aiResponse, outputAudioPath);

      res.sendFile(outputAudioPath, { root: '.' });
      
      await AIUtils.deleteFile(inputPath);
      await AIUtils.deleteFile(wavPath);
      await AIUtils.deleteFile(outputAudioPath);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'İşlenirken hata oluştu' });
    }
  }
}

export default new AIController();
