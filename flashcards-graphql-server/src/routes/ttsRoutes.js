import express from 'express';
import { handleKoreanTts } from '../controllers/ttsController.js';

const ttsRouter = express.Router();

// /tts-korean
ttsRouter.route('/').post(handleKoreanTts);

export default ttsRouter;
