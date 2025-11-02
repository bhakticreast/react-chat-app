import { useState, useEffect } from 'react';
import { messageService } from '../services/supabase';
import { chatAPI } from '../services/api';
import { RATE_LIMIT_COOLDOWN } from '../constants/config';

export const useMessages = (currentConversationId, updateConversationTitle) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  const loadMessages = async (conversationId) => {
    try {
      const data = await messageService.getByConversationId(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (input) => {
    if (!input.trim() || !currentConversationId) return;

    // Rate limit check
    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_COOLDOWN) {
      const remainingTime = Math.ceil((RATE_LIMIT_COOLDOWN - (now - lastRequestTime)) / 1000);
      const errorMsg = `Rate limit exceeded. Please wait ${remainingTime} seconds.`;
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      return;
    }

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Save user message to database
    try {
      await messageService.create(currentConversationId, 'user', input);

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        await updateConversationTitle(currentConversationId, input);
      }
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    setLoading(true);
    setLastRequestTime(now);

    try {
      const content = await chatAPI.sendMessage(updatedMessages);
      
      const botMessage = {
        role: 'assistant',
        content
      };

      setMessages(prev => [...prev, botMessage]);

      // Save assistant message to database
      await messageService.create(currentConversationId, 'assistant', content);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, something went wrong.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    setMessages
  };
};

