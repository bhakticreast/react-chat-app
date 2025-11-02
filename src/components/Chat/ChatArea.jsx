import React, { useState, forwardRef } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatArea = forwardRef(({ 
  messages, 
  loading, 
  onSendMessage
}, ref) => {
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
        ref={ref}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSend={handleSend}
        disabled={false}
        loading={loading}
      />
    </div>
  );
});

ChatArea.displayName = 'ChatArea';

export default ChatArea;

