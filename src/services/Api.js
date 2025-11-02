// src/services/Api.js
import axios from 'axios';

// For production (Vercel), use relative URL
// For local development with proxy, use empty string
// For local development without proxy, use http://localhost:3001
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Chat API route
export async function sendChatMessage({ model, messages, max_tokens, temperature, apiKey, disable_search }) {
  const response = await axios.post(
    `${API_BASE_URL}/api/chat`,
    {
      model,
      messages,
      max_tokens,
      temperature,
      apiKey,
      disable_search,
    }
  );
  return response.data.content;
}

