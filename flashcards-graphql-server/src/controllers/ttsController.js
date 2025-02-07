import { handleError } from '../middleware/errorHandler.js';

const TTS_API_ENDPOINT = process.env.GOOGLE_TTS_API_ENDPOINT;

const API_KEY = process.env.GOOGLE_TTS_API_KEY;

const url = `${TTS_API_ENDPOINT}?key=${API_KEY}`;

export const handleKoreanTts = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'text field is required' });
    }

    const sanitizedText = text.trim();

    const payload = {
        audioConfig: {
            audioEncoding: 'MP3',
        },
        input: {
            text: sanitizedText,
        },
        voice: {
            languageCode: 'ko-KR',
            name: 'ko-KR-Standard-B',
        },
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        handleError(req, res, error);
    }
};
