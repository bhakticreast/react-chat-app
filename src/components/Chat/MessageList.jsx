import React from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, loading }) => {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-4">
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} />
      ))}
      {loading && (
        <div className="text-center text-gray-500 mt-2">AI is typing…</div>
      )}
    </div>
  );
};

export default MessageList;

