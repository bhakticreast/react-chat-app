import { useState, useEffect, useRef } from 'react';
import { messageService } from '../services/supabase';
import { chatAPI } from '../services/api';

const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests (smart rate limiting)

export const useMessages = (
  currentConversationId, 
  setCurrentConversationId,
  updateConversationTitle, 
  createNewConversation
) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastRequestTimeRef = useRef(0);
  const isSendingRef = useRef(false);
  const previousConversationIdRef = useRef(currentConversationId);

  useEffect(() => {
    // Only load messages if we're not in the middle of sending a message
    // and the conversation ID actually changed
    if (currentConversationId && 
        currentConversationId !== previousConversationIdRef.current && 
        !isSendingRef.current) {
      loadMessages(currentConversationId);
      // Reset rate limit when switching conversations
      lastRequestTimeRef.current = 0;
    } else if (!currentConversationId) {
      setMessages([]);
    }
    previousConversationIdRef.current = currentConversationId;
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
    if (!input.trim() || loading) return;

    // Smart rate limiting - prevent rapid-fire requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimeRef.current;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000);
      console.warn(`Please wait ${waitTime} second(s) before sending another message.`);
      return;
    }

    // Update last request time immediately (before API call)
    lastRequestTimeRef.current = now;
    
    // Mark that we're sending a message to prevent race conditions
    isSendingRef.current = true;

    // Create conversation if it doesn't exist (lazy creation)
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = await createNewConversation();
      if (!conversationId) {
        console.error('Failed to create conversation');
        isSendingRef.current = false;
        return;
      }
      // Update the ref to prevent loading messages
      previousConversationIdRef.current = conversationId;
      // Note: createNewConversation already calls setCurrentConversationId internally
    }

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Save user message to database
    try {
      await messageService.create(conversationId, 'user', input);

      // Update conversation title with first message
      if (messages.length === 0) {
        await updateConversationTitle(conversationId, input);
      }
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    setLoading(true);

    try {
      const content = await chatAPI.sendMessage(updatedMessages);
      
      const botMessage = {
        role: 'assistant',
        content
      };

      setMessages(prev => [...prev, botMessage]);

      // Save assistant message to database
      await messageService.create(conversationId, 'assistant', content);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, something went wrong.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      isSendingRef.current = false;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    setMessages
  };
};

