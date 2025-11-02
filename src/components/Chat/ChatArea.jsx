import React, { useState, forwardRef } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatArea = forwardRef(({ 
  messages, 
  loading, 
  onSendMessage,
  onToggleSidebar,
  onNewConversation
}, ref) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Mobile header with hamburger menu */}
      <div className="lg:hidden bg-[#343541] border-b border-gray-700 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-3 text-white font-semibold">ChatGPT Clone</h1>
        </div>
        <button
          onClick={onNewConversation}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="New chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

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

