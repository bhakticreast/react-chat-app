import React, { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatArea = ({ 
  messages, 
  loading, 
  onSendMessage, 
  currentConversationId 
}) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <MessageList messages={messages} loading={loading} />
      <ChatInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSend={handleSend}
        disabled={!currentConversationId}
        loading={loading}
      />
    </div>
  );
};

export default ChatArea;

