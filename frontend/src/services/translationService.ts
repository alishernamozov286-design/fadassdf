import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface TranslationRequest {
  text: string;
  targetLang: string;
  sourceLang: string;
}

export interface TranslationResponse {
  success: boolean;
  data?: {
    originalText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
  };
  error?: string;
}

export const translateText = async (
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<TranslationResponse> => {
  try {
    const response = await axios.post<TranslationResponse>(
      `${API_URL}/translate`,
      { text, targetLang, sourceLang }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to translate. Please try again.'
    };
  }
};
