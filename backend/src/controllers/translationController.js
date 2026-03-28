import { translateText } from '../services/translationService.js';

export const translate = async (req, res) => {
  try {
    const { text, targetLang, sourceLang } = req.body;

    // Input validation
    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Text is required and cannot be empty'
      });
    }

    if (!targetLang || targetLang.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Target language is required'
      });
    }

    if (!sourceLang || sourceLang.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Source language is required'
      });
    }

    // Call translation service
    const translatedText = await translateText(text, targetLang, sourceLang);

    // Send response
    res.json({
      success: true,
      data: {
        originalText: text,
        translatedText,
        sourceLang,
        targetLang
      }
    });
  } catch (error) {
    console.error('Translation controller error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};
