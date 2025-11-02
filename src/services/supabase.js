import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Conversation operations
export const conversationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create() {
    const { data, error } = await supabase
      .from('conversations')
      .insert({ title: 'New Chat' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTitle(conversationId, title) {
    const { error } = await supabase
      .from('conversations')
      .update({ title })
      .eq('id', conversationId);

    if (error) throw error;
  },

  async delete(conversationId) {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) throw error;
  }
};

// Message operations
export const messageService = {
  async getByConversationId(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(conversationId, role, content) {
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role,
        content
      });

    if (error) throw error;
  }
};

