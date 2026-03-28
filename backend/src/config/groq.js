import dotenv from 'dotenv';

dotenv.config();

export const groqConfig = {
  apiKey: process.env.GROQ_API_KEY,
  apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'llama-3.3-70b-versatile'
};
