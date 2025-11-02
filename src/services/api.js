import axios from 'axios';
import { API_MODEL, MAX_TOKENS, TEMPERATURE, SYSTEM_PROMPT } from '../constants/config';

export const chatAPI = {
  async sendMessage(messages) {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: API_MODEL,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...messages
        ],
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        disable_search: true
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  }
};
