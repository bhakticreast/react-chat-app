// src/services/api.js
import axios from 'axios';

// Perplexity chat API
export async function sendChatMessage({ model, messages, max_tokens, temperature, apiKey }) {
  const response = await axios.post(
    'https://api.perplexity.ai/chat/completions',
    {
      model,
      messages,
      max_tokens,
      temperature,
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content;
}

// Gemini Nano Banana image editor
export async function geminiEditImage({ prompt, imageBase64, apiKey }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
  const requestBody = {
    contents: [{
      role: "user",
      parts: [
        { text: prompt },
        ...(imageBase64 ? [{ inline_data: { mime_type: "image/png", data: imageBase64 } }] : [])
      ],
    }]
  };
  const response = await fetch(url, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) throw new Error('Gemini image edit failed');
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.fileData;
}
