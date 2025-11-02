import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { createClient } from '@supabase/supabase-js';
import './App.css';
// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const RATE_LIMIT_COOLDOWN = 20000;

  // Load all conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ title: 'New Chat' })
        .select()
        .single();

      if (error) throw error;
      setCurrentConversationId(data.id);
      setMessages([]);
      loadConversations();
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const saveMessage = async (conversationId, role, content) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role,
          content
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const updateConversationTitle = async (conversationId, firstMessage) => {
    // Auto-generate title from first message
    const title = firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '');
    try {
      await supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId);
      loadConversations();
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Create new conversation if none exists
    if (!currentConversationId) {
      await createNewConversation();
      return; // Wait for useEffect to load new conversation
    }

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

    // Save user message to Supabase
    await saveMessage(currentConversationId, 'user', input);

    // Update conversation title if it's the first message
    if (messages.length === 0) {
      await updateConversationTitle(currentConversationId, input);
    }

    setInput('');
    setLoading(true);
    setLastRequestTime(now);

    try {
      // Send full conversation history for context
      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful, friendly AI assistant. Respond naturally to greetings and casual conversation. When users ask specific questions, provide informative answers based on current information.'
            },
            ...updatedMessages
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botMessage = {
        role: 'assistant',
        content: response.data.choices[0].message.content
      };

      setMessages(prev => [...prev, botMessage]);

      // Save assistant message to Supabase
      await saveMessage(currentConversationId, 'assistant', botMessage.content);

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

  const deleteConversation = async (conversationId) => {
    try {
      await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      loadConversations();
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with conversation history */}
      <div className="w-72 bg-white border-r shadow-sm flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-bold text-blue-600 text-lg">My Chats</div>
          <button onClick={createNewConversation} className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600">
            +
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div key={conv.id} className={`flex items-center px-4 py-2 cursor-pointer ${currentConversationId === conv.id ? "bg-blue-50" : "hover:bg-gray-100"}`}>
              <span onClick={() => setCurrentConversationId(conv.id)} className="flex-1 flex items-center">
                <span>
                  <div className="font-medium">{conv.title || 'New Chat'}</div>
                  <div className="text-xs text-gray-400">{new Date(conv.created_at).toLocaleDateString()}</div>
                </span>
              </span>
              <button className="ml-2 text-red-400 hover:text-red-600" onClick={e => { e.stopPropagation(); deleteConversation(conv.id); }}>
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>


      {/* Main chat area */}
      <div className="flex-1 flex flex-col">

        <div className="flex flex-col flex-1 overflow-y-auto p-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`chat-bubble ${msg.role === 'user' ? 'chat-user' : 'chat-assistant'}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && <div className="text-center text-gray-500 mt-2">AI is typing…</div>}
        </div>

        <div className="p-4 bg-white border-t flex items-center gap-3 shadow">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 border rounded-full shadow-sm focus:outline-blue-400"
            placeholder="Type your message…"
            disabled={!currentConversationId}
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full shadow"
            disabled={loading || !currentConversationId}
            title="Send"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(-45)matrix(-1, 0, 0, -1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.4376 15.3703L12.3042 19.5292C11.9326 20.2537 10.8971 20.254 10.525 19.5297L4.24059 7.2971C3.81571 6.47007 4.65077 5.56156 5.51061 5.91537L18.5216 11.2692C19.2984 11.5889 19.3588 12.6658 18.6227 13.0704L14.4376 15.3703ZM14.4376 15.3703L5.09594 6.90886" stroke="#000000" stroke-width="2" stroke-linecap="round"></path> </g></svg>
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;