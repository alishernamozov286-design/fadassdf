import axios from 'axios';
import { groqConfig } from '../config/groq.js';

export const translateText = async (text, targetLang, sourceLang) => {
  try {
    const prompt = `Quyidagi ${sourceLang} tilidagi matnni ${targetLang} tiliga tarjima qiling. Faqat tarjima qilingan matnni bering, boshqa hech qanday tushuntirish yoki qo'shimcha so'z qo'shmang. Faqat tarjima natijasi: ${text}`;

    const response = await axios.post(
      groqConfig.apiUrl,
      {
        model: groqConfig.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${groqConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Translation service error:', error.response?.data || error.message);
    throw new Error('Failed to translate text. Please try again.');
  }
};
