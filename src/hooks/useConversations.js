import { useState, useEffect } from 'react';
import { conversationService } from '../services/supabase';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await conversationService.getAll();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const data = await conversationService.create();
      setCurrentConversationId(data.id);
      await loadConversations();
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  const updateConversationTitle = async (conversationId, firstMessage) => {
    const title = firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '');
    try {
      await conversationService.updateTitle(conversationId, title);
      await loadConversations();
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await conversationService.delete(conversationId);
      await loadConversations();
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    updateConversationTitle,
    deleteConversation,
    loadConversations
  };
};

